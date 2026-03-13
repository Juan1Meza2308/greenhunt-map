import { motion } from "framer-motion";
import { X, Clock, MapPin } from "lucide-react";
import { MockPin, getTimeSince, getPinAge } from "@/data/mockData";

interface FeedViewProps {
  pins: MockPin[];
  onClose: () => void;
  onPinTap: (pin: MockPin) => void;
}

const FeedView = ({ pins, onClose, onPinTap }: FeedViewProps) => {
  return (
    <motion.div
      className="absolute inset-0 z-[1500] bg-background overflow-y-auto"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 250 }}
    >
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h2 className="text-lg font-display font-bold text-foreground">Objetos cercanos</h2>
        <button onClick={onClose} className="text-muted-foreground">
          <X size={22} />
        </button>
      </div>

      <div className="px-4 pb-8">
        <div className="grid grid-cols-2 gap-3">
          {pins.map((pin, index) => {
            const age = getPinAge(pin.createdAt);
            return (
              <motion.button
                key={pin.id}
                className="text-left bg-card rounded-2xl overflow-hidden border border-border/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                onClick={() => onPinTap(pin)}
              >
                <div className="relative">
                  <img
                    src={pin.photoURL}
                    alt={pin.title}
                    className="w-full h-32 object-cover"
                  />
                  {/* Time badge */}
                  <div className={`absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-display font-semibold ${
                    age === "fresh"
                      ? "bg-primary text-primary-foreground"
                      : "bg-accent text-accent-foreground"
                  }`}>
                    <Clock size={8} className="inline mr-0.5" />
                    {getTimeSince(pin.createdAt)}
                  </div>
                  {/* Category */}
                  <div className="absolute bottom-2 right-2 bg-secondary/80 backdrop-blur rounded-full px-2 py-0.5 text-[10px] text-secondary-foreground font-body">
                    {pin.category}
                  </div>
                </div>
                <div className="p-2.5">
                  <p className="text-xs font-display font-semibold text-foreground line-clamp-1">{pin.title}</p>
                  <p className="text-[10px] text-muted-foreground font-body flex items-center gap-0.5 mt-0.5">
                    <MapPin size={8} /> 350m · {pin.condition}
                  </p>
                  {pin.isExternal && (
                    <p className="text-[9px] text-accent mt-1 font-body">📷 Instagram</p>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default FeedView;
