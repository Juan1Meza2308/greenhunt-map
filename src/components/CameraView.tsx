import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ChevronDown } from "lucide-react";
import ScanAnimation from "./ScanAnimation";
import { Button } from "@/components/ui/button";

interface CameraViewProps {
  onClose: () => void;
  onPublish: () => void;
}

type CameraStep = "capture" | "scanning" | "confirm";

const mockAIResult = {
  title: "Sillón de cuero vintage",
  description: "Sillón individual de cuero marrón con estructura de madera. Desgaste menor en reposabrazos.",
  category: "Silla",
  material: "Tela",
  condition: "Bueno",
  ecoImpact: { co2Saved: 20, waterSaved: 100, treesSaved: 2, wasteDiverted: 0 },
};

const CameraView = ({ onClose, onPublish }: CameraViewProps) => {
  const [step, setStep] = useState<CameraStep>("capture");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleCapture = () => {
    // Simulate camera capture with a stock photo
    setCapturedImage("https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&h=800&fit=crop");
    setStep("scanning");
    // Simulate AI processing
    setTimeout(() => setStep("confirm"), 2500);
  };

  const handlePublish = () => {
    onPublish();
    onClose();
  };

  return (
    <motion.div
      className="absolute inset-0 z-50 bg-gh-charcoal flex flex-col"
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
          <div className="w-full h-full bg-gh-surface-dark flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full border-2 border-primary/30 flex items-center justify-center mx-auto mb-4">
                <div className="w-16 h-16 rounded-full border-2 border-primary/60 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-primary/40" />
                </div>
              </div>
              <p className="text-muted-foreground text-sm font-body">Apunta al objeto abandonado</p>
            </div>
          </div>
        )}

        {(step === "scanning" || step === "confirm") && capturedImage && (
          <div className="relative w-full h-full">
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-full object-cover"
            />
            {step === "scanning" && <ScanAnimation />}

            {/* AR-style labels on confirm */}
            <AnimatePresence>
              {step === "confirm" && (
                <>
                  <motion.div
                    className="absolute top-4 left-4 gh-glass rounded-lg px-3 py-1.5"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <p className="text-[10px] text-muted-foreground font-body">CATEGORÍA</p>
                    <p className="text-sm font-display text-primary font-semibold">{mockAIResult.category}</p>
                  </motion.div>
                  <motion.div
                    className="absolute top-4 right-4 gh-glass rounded-lg px-3 py-1.5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="text-[10px] text-muted-foreground font-body">MATERIAL</p>
                    <p className="text-sm font-display text-primary font-semibold">{mockAIResult.material}</p>
                  </motion.div>
                  <motion.div
                    className="absolute bottom-4 left-4 gh-glass rounded-lg px-3 py-1.5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="text-[10px] text-muted-foreground font-body">ESTADO</p>
                    <p className="text-sm font-display text-primary font-semibold">{mockAIResult.condition}</p>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Bottom section */}
      <div className="px-4 pb-6">
        {step === "capture" && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleCapture}
            className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-lg flex items-center justify-center gh-glow"
          >
            Capturar
          </motion.button>
        )}

        {step === "scanning" && (
          <div className="text-center py-3">
            <p className="text-muted-foreground text-sm font-body animate-pulse-glow">Identificando objeto...</p>
          </div>
        )}

        {step === "confirm" && (
          <div className="space-y-3">
            {/* AI Result card */}
            <div className="bg-gh-surface-dark rounded-2xl p-4">
              <h3 className="font-display font-bold text-secondary-foreground mb-1">{mockAIResult.title}</h3>
              <p className="text-xs text-muted-foreground font-body mb-3">{mockAIResult.description}</p>
              
              {/* Editable category dropdown hint */}
              <button className="flex items-center gap-1 text-xs text-primary font-body">
                <ChevronDown size={12} />
                Editar categoría
              </button>
            </div>

            {/* Eco impact preview */}
            <div className="flex gap-3 justify-center">
              <div className="text-center">
                <p className="text-lg font-display font-bold text-primary">{mockAIResult.ecoImpact.co2Saved}</p>
                <p className="text-[9px] text-muted-foreground">kg CO₂</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-display font-bold text-primary">{mockAIResult.ecoImpact.waterSaved}</p>
                <p className="text-[9px] text-muted-foreground">L agua</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-display font-bold text-primary">{mockAIResult.ecoImpact.treesSaved}</p>
                <p className="text-[9px] text-muted-foreground">árboles</p>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handlePublish}
              className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-lg flex items-center justify-center gap-2 gh-glow"
            >
              <Check size={20} />
              Publicar
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CameraView;
