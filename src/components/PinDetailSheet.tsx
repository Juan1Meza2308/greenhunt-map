import { motion, AnimatePresence } from "framer-motion";
import { X, Navigation, MapPin, Clock, Leaf, Droplets, TreePine, Recycle } from "lucide-react";
import { MockPin, getTimeSince, getPinAge } from "@/data/mockData";
import { Button } from "@/components/ui/button";

interface PinDetailSheetProps {
  pin: MockPin | null;
  onClose: () => void;
}

const PinDetailSheet = ({ pin, onClose }: PinDetailSheetProps) => {
  if (!pin) return null;
  const age = getPinAge(pin.createdAt);

  return (
    <AnimatePresence>
      {pin && (
        <>
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 z-40 bg-gh-charcoal/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 z-50 bg-secondary rounded-t-3xl max-h-[75vh] overflow-y-auto"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Close button */}
            <button onClick={onClose} className="absolute top-3 right-4 text-muted-foreground">
              <X size={20} />
            </button>

            <div className="px-4 pb-6">
              {/* Photo */}
              <div className="relative rounded-2xl overflow-hidden mb-4">
                <img
                  src={pin.photoURL}
                  alt={pin.title}
                  className="w-full h-48 object-cover"
                />
                {/* Time badge */}
                <div className={`absolute top-3 left-3 rounded-full px-2.5 py-1 text-[11px] font-display font-semibold ${
                  age === "fresh"
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent text-accent-foreground"
                }`}>
                  <Clock size={10} className="inline mr-1" />
                  {getTimeSince(pin.createdAt)}
                </div>
                {/* Category badge */}
                <div className="absolute top-3 right-3 bg-secondary/90 backdrop-blur rounded-full px-2.5 py-1 text-[11px] font-display text-secondary-foreground">
                  {pin.category}
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-display font-bold text-secondary-foreground mb-1">{pin.title}</h3>
              <p className="text-sm text-muted-foreground font-body mb-3">{pin.description}</p>

              {/* Meta chips */}
              <div className="flex gap-2 mb-4 flex-wrap">
                <span className="text-[11px] bg-muted/30 text-muted-foreground rounded-full px-2.5 py-1 font-body">
                  {pin.material}
                </span>
                <span className="text-[11px] bg-muted/30 text-muted-foreground rounded-full px-2.5 py-1 font-body">
                  {pin.condition}
                </span>
                <span className="text-[11px] bg-muted/30 text-muted-foreground rounded-full px-2.5 py-1 font-body flex items-center gap-1">
                  <MapPin size={10} /> 350m
                </span>
              </div>

              {/* External source warning */}
              {pin.isExternal && (
                <div className="bg-accent/10 border border-accent/20 rounded-xl p-3 mb-4">
                  <p className="text-[11px] text-accent font-body">
                    📍 Este reporte proviene de Instagram. La ubicación es aproximada.
                  </p>
                </div>
              )}

              {/* Eco Impact */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {pin.ecoImpact.co2Saved > 0 && (
                  <div className="bg-primary/10 rounded-xl p-2 text-center">
                    <Leaf size={16} className="text-primary mx-auto mb-1" />
                    <p className="text-sm font-display font-bold text-secondary-foreground">{pin.ecoImpact.co2Saved}</p>
                    <p className="text-[9px] text-muted-foreground">kg CO₂</p>
                  </div>
                )}
                {pin.ecoImpact.waterSaved > 0 && (
                  <div className="bg-primary/10 rounded-xl p-2 text-center">
                    <Droplets size={16} className="text-primary mx-auto mb-1" />
                    <p className="text-sm font-display font-bold text-secondary-foreground">{pin.ecoImpact.waterSaved}</p>
                    <p className="text-[9px] text-muted-foreground">L agua</p>
                  </div>
                )}
                {pin.ecoImpact.treesSaved > 0 && (
                  <div className="bg-primary/10 rounded-xl p-2 text-center">
                    <TreePine size={16} className="text-primary mx-auto mb-1" />
                    <p className="text-sm font-display font-bold text-secondary-foreground">{pin.ecoImpact.treesSaved}</p>
                    <p className="text-[9px] text-muted-foreground">árboles</p>
                  </div>
                )}
                {pin.ecoImpact.wasteDiverted > 0 && (
                  <div className="bg-primary/10 rounded-xl p-2 text-center">
                    <Recycle size={16} className="text-primary mx-auto mb-1" />
                    <p className="text-sm font-display font-bold text-secondary-foreground">{pin.ecoImpact.wasteDiverted}</p>
                    <p className="text-[9px] text-muted-foreground">kg resid.</p>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <Button className="flex-1 bg-primary text-primary-foreground font-display rounded-xl h-12">
                  <Navigation size={16} className="mr-2" />
                  Llévame ahí
                </Button>
                <Button className="flex-1 bg-primary/20 text-primary font-display rounded-xl h-12 hover:bg-primary/30">
                  🎯 ¡Lo rescaté!
                </Button>
              </div>

              {/* Community buttons */}
              <div className="flex gap-2 mt-2">
                <button className="flex-1 text-center py-2 text-[11px] text-muted-foreground font-body rounded-xl border border-border/30 hover:bg-muted/20 transition-colors">
                  ✅ Sigue aquí
                </button>
                <button className="flex-1 text-center py-2 text-[11px] text-muted-foreground font-body rounded-xl border border-border/30 hover:bg-muted/20 transition-colors">
                  ❌ Ya no está
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PinDetailSheet;
