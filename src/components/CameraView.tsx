import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Camera, Upload } from "lucide-react";
import ScanAnimation from "./ScanAnimation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { analyzeImage, AIAnalysisResult, CATEGORIES, MATERIALS, CONDITIONS, getEcoScore } from "@/services/aiService";
import { applyPrivacyBlur } from "@/services/privacyBlur";
import { MockPin } from "@/data/mockData";
import { currentUser } from "@/data/mockData";

interface CameraViewProps {
  onClose: () => void;
  onPublish: (pin: Omit<MockPin, "id">) => void;
}

type CameraStep = "capture" | "scanning" | "confirm";

const CameraView = ({ onClose, onPublish }: CameraViewProps) => {
  const [step, setStep] = useState<CameraStep>("capture");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedBase64, setCapturedBase64] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [edited, setEdited] = useState<AIAnalysisResult | null>(null);
  const [captureLocation, setCaptureLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [cameraError, setCameraError] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Start camera on mount
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch {
          setCameraError(true);
        }
      }
    };

    if (step === "capture") startCamera();

    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [step]);

  const processImageAndAnalyze = useCallback(async (dataUrl: string, base64: string) => {
    setCapturedImage(dataUrl);
    setCapturedBase64(base64);
    setStep("scanning");

    // Kick off geolocation in parallel with AI
    const locationPromise = new Promise<{ lat: number; lng: number }>((resolve) => {
      if (!navigator.geolocation) return resolve({ lat: 40.4168, lng: -3.7038 });
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve({ lat: 40.4168, lng: -3.7038 }),
        { timeout: 6000 }
      );
    });

    const [result, location] = await Promise.all([analyzeImage(base64), locationPromise]);

    setAiResult(result);
    setEdited(result);
    setCaptureLocation(location);
    setStep("confirm");
  }, []);

  const handleCapture = useCallback(async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    await applyPrivacyBlur(canvas);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    const base64 = dataUrl.split(",")[1];
    streamRef.current?.getTracks().forEach((t) => t.stop());
    await processImageAndAnalyze(dataUrl, base64);
  }, [processImageAndAnalyze]);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      // Draw into canvas so we can apply privacy blur before processing
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        await applyPrivacyBlur(canvas);
        const blurredDataUrl = canvas.toDataURL("image/jpeg", 0.8);
        await processImageAndAnalyze(blurredDataUrl, blurredDataUrl.split(",")[1]);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }, [processImageAndAnalyze]);

  const handlePublish = useCallback(() => {
    if (!edited || !capturedImage) return;
    const newPin: Omit<MockPin, "id"> = {
      title: edited.title,
      description: edited.description,
      category: edited.category,
      material: edited.material,
      condition: edited.condition,
      lat: captureLocation?.lat ?? 40.4168,
      lng: captureLocation?.lng ?? -3.7038,
      photoURL: capturedImage,
      createdAt: new Date(),
      userId: currentUser.id,
      userName: currentUser.displayName,
      userPhoto: currentUser.photoURL,
      status: "available",
      isExternal: false,
      externalSourceUrl: null,
      source: "user",
      ecoImpact: edited.ecoImpact,
    };
    onPublish(newPin);
    onClose();
  }, [edited, capturedImage, captureLocation, onPublish, onClose]);

  const updateCategory = (category: string) => {
    if (!edited) return;
    setEdited({ ...edited, category, ecoImpact: getEcoScore(category) });
  };

  return (
    <motion.div
      className="absolute inset-0 z-[1500] bg-gh-charcoal flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 z-30">
        <button onClick={onClose} className="text-secondary-foreground">
          <X size={24} />
        </button>
        <h2 className="text-sm font-display font-semibold text-secondary-foreground tracking-wider">
          MAGIC CAMERA
        </h2>
        <div className="w-6" />
      </div>

      {/* Camera / Photo area */}
      <div className="flex-1 relative mx-4 mb-4 rounded-2xl overflow-hidden">
        {step === "capture" && (
          <div className="w-full h-full bg-gh-surface-dark relative">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            {!cameraError ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <Camera size={48} className="text-primary/40 mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm font-body mb-4">
                    Cámara no disponible
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-primary text-sm underline font-body flex items-center gap-2 mx-auto"
                  >
                    <Upload size={14} />
                    Subir foto
                  </button>
                </div>
              </div>
            )}
            {/* Viewfinder corners */}
            {!cameraError && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-primary/60 rounded-tl-sm" />
                <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-primary/60 rounded-tr-sm" />
                <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-primary/60 rounded-bl-sm" />
                <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-primary/60 rounded-br-sm" />
                <p className="absolute bottom-12 left-0 right-0 text-center text-xs text-primary/60 font-body">
                  Apunta al objeto abandonado
                </p>
              </div>
            )}
          </div>
        )}

        {(step === "scanning" || step === "confirm") && capturedImage && (
          <div className="relative w-full h-full">
            <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
            {step === "scanning" && <ScanAnimation />}

            {/* AR labels on confirm */}
            <AnimatePresence>
              {step === "confirm" && edited && (
                <>
                  <motion.div
                    className="absolute top-4 left-4 gh-glass rounded-lg px-3 py-1.5"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <p className="text-[10px] text-muted-foreground font-body">CATEGORÍA</p>
                    <p className="text-sm font-display text-primary font-semibold">{edited.category}</p>
                  </motion.div>
                  <motion.div
                    className="absolute top-4 right-4 gh-glass rounded-lg px-3 py-1.5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="text-[10px] text-muted-foreground font-body">MATERIAL</p>
                    <p className="text-sm font-display text-primary font-semibold">{edited.material}</p>
                  </motion.div>
                  <motion.div
                    className="absolute bottom-4 left-4 gh-glass rounded-lg px-3 py-1.5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="text-[10px] text-muted-foreground font-body">ESTADO</p>
                    <p className="text-sm font-display text-primary font-semibold">{edited.condition}</p>
                  </motion.div>
                  {captureLocation && (
                    <motion.div
                      className="absolute bottom-4 right-4 gh-glass rounded-lg px-3 py-1.5"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <p className="text-[10px] text-muted-foreground font-body">GPS</p>
                      <p className="text-[10px] font-display text-primary font-semibold">
                        {captureLocation.lat.toFixed(4)}, {captureLocation.lng.toFixed(4)}
                      </p>
                    </motion.div>
                  )}
                </>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Bottom section */}
      <div className="px-4 pb-6">
        {step === "capture" && !cameraError && (
          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleCapture}
              className="flex-1 h-14 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-lg flex items-center justify-center gap-2 gh-glow"
            >
              <Camera size={20} />
              Capturar
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => fileInputRef.current?.click()}
              className="h-14 px-5 rounded-2xl bg-gh-surface-dark border border-primary/30 text-primary flex items-center justify-center"
            >
              <Upload size={20} />
            </motion.button>
          </div>
        )}

        {step === "scanning" && (
          <div className="text-center py-3">
            <p className="text-muted-foreground text-sm font-body animate-pulse-glow">
              IA analizando objeto...
            </p>
          </div>
        )}

        {step === "confirm" && edited && (
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Editable AI result card */}
            <div className="bg-gh-surface-dark rounded-2xl p-4 space-y-3">
              <Input
                value={edited.title}
                onChange={(e) => setEdited({ ...edited, title: e.target.value })}
                className="font-display font-bold text-secondary-foreground bg-transparent border-gh-green/20 h-8 px-2"
              />
              <textarea
                value={edited.description}
                onChange={(e) => setEdited({ ...edited, description: e.target.value })}
                rows={2}
                className="w-full text-xs text-muted-foreground bg-transparent border border-gh-green/20 rounded-md px-2 py-1.5 resize-none focus:outline-none focus:border-primary/40 font-body"
              />
              <div className="flex gap-2">
                <Select value={edited.category} onValueChange={updateCategory}>
                  <SelectTrigger className="flex-1 h-8 text-xs bg-transparent border-gh-green/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={edited.material} onValueChange={(v) => setEdited({ ...edited, material: v })}>
                  <SelectTrigger className="flex-1 h-8 text-xs bg-transparent border-gh-green/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MATERIALS.map((m) => (
                      <SelectItem key={m} value={m} className="text-xs">{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={edited.condition} onValueChange={(v) => setEdited({ ...edited, condition: v })}>
                  <SelectTrigger className="flex-1 h-8 text-xs bg-transparent border-gh-green/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CONDITIONS.map((c) => (
                      <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Eco impact preview */}
            <div className="flex gap-4 justify-center">
              {edited.ecoImpact.co2Saved > 0 && (
                <div className="text-center">
                  <p className="text-lg font-display font-bold text-primary">{edited.ecoImpact.co2Saved}</p>
                  <p className="text-[9px] text-muted-foreground">kg CO₂</p>
                </div>
              )}
              {edited.ecoImpact.waterSaved > 0 && (
                <div className="text-center">
                  <p className="text-lg font-display font-bold text-primary">{edited.ecoImpact.waterSaved}</p>
                  <p className="text-[9px] text-muted-foreground">L agua</p>
                </div>
              )}
              {edited.ecoImpact.treesSaved > 0 && (
                <div className="text-center">
                  <p className="text-lg font-display font-bold text-primary">{edited.ecoImpact.treesSaved}</p>
                  <p className="text-[9px] text-muted-foreground">árboles</p>
                </div>
              )}
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handlePublish}
              className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-lg flex items-center justify-center gap-2 gh-glow"
            >
              <Check size={20} />
              Publicar
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CameraView;
