import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Navigation, MapPin, Clock, Leaf, Droplets, TreePine, Recycle } from "lucide-react";
import { MockPin, getTimeSince, getPinAge, getExpiresIn } from "@/data/mockData";
import { Button } from "@/components/ui/button";

interface PinDetailSheetProps {
  pin: MockPin | null;
  onClose: () => void;
  onRescue?: (pinId: string) => void;
  onGone?: (pinId: string) => void;
}

const PinDetailSheet = ({ pin, onClose, onRescue, onGone }: PinDetailSheetProps) => {
  const [stillHereVotes, setStillHereVotes] = useState(0);
  const [goneVotes, setGoneVotes] = useState(0);
  const [voted, setVoted] = useState<"here" | "gone" | null>(null);

  if (!pin) return null;
  const age = getPinAge(pin.createdAt);

  const handleGoThere = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${pin.lat},${pin.lng}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleRescue = () => {
    onRescue?.(pin.id);
    onClose();
  };

  const handleStillHere = () => {
    if (voted) return;
    setStillHereVotes((v) => v + 1);
    setVoted("here");
  };

  const handleGone = () => {
    if (voted) return;
    setGoneVotes((v) => v + 1);
    setVoted("gone");
    // Remove pin from map after a short delay so user sees feedback
    setTimeout(() => {
      onGone?.(pin.id);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      {pin && (
        <>
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 z-[1100] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 z-[1200] gh-glass rounded-t-[2.5rem] max-h-[85vh] overflow-y-auto shadow-[0_-20px_50px_rgba(0,0,0,0.5)] border-t border-white/20"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-4 pb-2">
              <div className="w-12 h-1.5 rounded-full bg-white/10" />
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-6 w-8 h-8 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            <div className="px-6 pb-8">
              {/* Photo */}
              <div className="relative rounded-3xl overflow-hidden mb-6 shadow-2xl border border-white/5">
                <img
                  src={pin.photoURL}
                  alt={pin.title}
                  className="w-full h-56 object-cover"
                />
                {/* Time badge */}
                <div
                  className={`absolute top-4 left-4 rounded-full px-3 py-1.5 text-[10px] font-display font-bold uppercase tracking-wider ${
                    age === "fresh"
                      ? "bg-gh-neon text-black shadow-neon-glow"
                      : "bg-gh-gold text-black shadow-gold-glow"
                  }`}
                >
                  <Clock size={12} className="inline mr-1.5 mb-0.5" />
                  {getTimeSince(pin.createdAt)}
                </div>
                {/* Category badge */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 text-[10px] font-display font-bold uppercase tracking-wider text-white">
                  {pin.category}
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-2xl font-display font-black text-gh-gold mb-2 tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                {pin.title}
              </h3>
              <p className="text-sm text-white/70 font-body leading-relaxed mb-6">{pin.description}</p>

              {/* Meta chips */}
              <div className="flex gap-2 mb-6 flex-wrap">
                <div className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-full px-3 py-1.5">
                  <span className="text-[10px] text-white/50 uppercase font-black tracking-widest">{pin.material}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-full px-3 py-1.5">
                  <span className="text-[10px] text-white/50 uppercase font-black tracking-widest">{pin.condition}</span>
                </div>
                <div className="flex items-center gap-2 bg-gh-neon/10 border border-gh-neon/20 rounded-full px-3 py-1.5">
                  <MapPin size={12} className="text-gh-neon" />
                  <span className="text-[10px] text-gh-neon/90 font-mono font-bold tracking-tighter">
                    {pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}
                  </span>
                </div>
              </div>

              {/* Primary action buttons */}
              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleGoThere}
                  className="w-full bg-gh-neon hover:bg-gh-neon/90 text-black font-display font-black uppercase tracking-widest rounded-full h-14 shadow-neon-glow group transition-all"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/30 mr-3 group-hover:scale-110 transition-transform">
                    <Navigation size={18} fill="currentColor" />
                  </div>
                  Llévame ahí
                </Button>

                <div className="flex gap-3">
                  <Button
                    onClick={handleRescue}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-gh-neon border border-gh-neon/20 font-display font-bold uppercase tracking-widest rounded-2xl h-14 transition-all"
                  >
                    🎯 Rescatado
                  </Button>

                  <div className="flex gap-2">
                    <button
                      onClick={handleStillHere}
                      disabled={voted !== null}
                      className={`w-14 h-14 flex items-center justify-center rounded-2xl border transition-all ${
                        voted === "here"
                          ? "border-gh-neon bg-gh-neon/20 text-gh-neon"
                          : "border-white/10 bg-white/5 text-white/40 hover:text-gh-neon hover:border-gh-neon/30"
                      }`}
                    >
                      <Clock size={24} />
                    </button>
                    <button
                      onClick={handleGone}
                      disabled={voted !== null}
                      className={`w-14 h-14 flex items-center justify-center rounded-2xl border transition-all ${
                        voted === "gone"
                          ? "border-destructive bg-destructive/20 text-destructive"
                          : "border-white/10 bg-white/5 text-white/40 hover:text-destructive hover:border-destructive/30"
                      }`}
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats / Impact */}
              {pin.ecoImpact.co2Saved > 0 && (
                <div className="mt-8 pt-6 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gh-neon/10 flex items-center justify-center text-gh-neon">
                        <Leaf size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-display font-bold text-white/40 uppercase tracking-widest leading-none mb-1">Impacto Ambiental</p>
                        <p className="text-sm font-display font-black text-gh-neon uppercase tracking-tight">{pin.ecoImpact.co2Saved}kg de CO₂ evitados</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PinDetailSheet;
