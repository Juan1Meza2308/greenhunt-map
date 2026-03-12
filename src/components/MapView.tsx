import { MockPin, getPinAge, getTimeSince } from "@/data/mockData";
import { motion, AnimatePresence } from "framer-motion";

interface MapViewProps {
  pins: MockPin[];
  onPinTap: (pin: MockPin) => void;
}

const MapView = ({ pins, onPinTap }: MapViewProps) => {
  return (
    <div className="relative w-full h-full bg-gh-asphalt-deep overflow-hidden">
      {/* Dark map background with grid */}
      <div className="absolute inset-0">
        <svg className="w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="hsl(var(--gh-green) / 0.3)" strokeWidth="0.5" />
            </pattern>
            <pattern id="roads" width="200" height="200" patternUnits="userSpaceOnUse">
              <line x1="100" y1="0" x2="100" y2="200" stroke="hsl(var(--gh-green) / 0.15)" strokeWidth="3" />
              <line x1="0" y1="80" x2="200" y2="80" stroke="hsl(var(--gh-green) / 0.15)" strokeWidth="2" />
              <line x1="0" y1="150" x2="200" y2="150" stroke="hsl(var(--gh-green) / 0.1)" strokeWidth="1.5" />
              <line x1="50" y1="0" x2="50" y2="200" stroke="hsl(var(--gh-green) / 0.08)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <rect width="100%" height="100%" fill="url(#roads)" />
        </svg>
      </div>

      {/* Street labels */}
      <div className="absolute top-[20%] left-[15%] text-gh-green/20 text-[10px] font-body tracking-widest uppercase rotate-[-15deg]">
        Bedford Ave
      </div>
      <div className="absolute top-[55%] left-[5%] text-gh-green/20 text-[10px] font-body tracking-widest uppercase rotate-[0deg]">
        Metropolitan Ave
      </div>
      <div className="absolute top-[35%] right-[10%] text-gh-green/20 text-[10px] font-body tracking-widest uppercase rotate-[75deg]">
        Driggs Ave
      </div>

      {/* Mock pins */}
      <AnimatePresence>
        {pins.map((pin, index) => {
          const age = getPinAge(pin.createdAt);
          // Spread pins across the viewport
          const positions = [
            { top: "25%", left: "30%" },
            { top: "40%", left: "55%" },
            { top: "60%", left: "20%" },
            { top: "18%", left: "70%" },
            { top: "72%", left: "65%" },
          ];
          const pos = positions[index % positions.length];

          return (
            <motion.button
              key={pin.id}
              className="absolute z-10 group"
              style={{ top: pos.top, left: pos.left }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
              onClick={() => onPinTap(pin)}
            >
              {/* Pin dot */}
              <div className={`relative w-4 h-4 rounded-full ${
                age === "fresh" ? "bg-primary" : "bg-accent"
              } shadow-lg`}>
                {/* Pulse ring */}
                <div className={`absolute inset-0 rounded-full animate-ping ${
                  age === "fresh" ? "bg-primary/40" : "bg-accent/40"
                }`} style={{ animationDuration: "3s" }} />
              </div>
              {/* Tooltip on hover */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="gh-glass rounded-lg px-2 py-1 whitespace-nowrap">
                  <p className="text-[11px] font-display text-secondary-foreground">{pin.title}</p>
                  <p className="text-[9px] text-muted-foreground">{getTimeSince(pin.createdAt)}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </AnimatePresence>

      {/* User location indicator */}
      <div className="absolute top-[45%] left-[45%] z-20">
        <div className="w-3 h-3 rounded-full bg-primary border-2 border-primary-foreground shadow-lg gh-glow" />
        <div className="absolute inset-0 w-3 h-3 rounded-full bg-primary/30 animate-ping" />
      </div>

      {/* Map attribution */}
      <div className="absolute bottom-2 right-2 text-[8px] text-muted-foreground/40 font-body">
        Mapbox · Demo Mode
      </div>
    </div>
  );
};

export default MapView;
