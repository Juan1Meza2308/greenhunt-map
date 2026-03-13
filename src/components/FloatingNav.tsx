import { motion } from "framer-motion";
import { User, Trophy, List, Map, MessageCircle, Bell, Search, Compass, Layers, Crosshair, Plus } from "lucide-react";

interface FloatingNavProps {
  onCameraPress: () => void;
  onProfilePress: () => void;
  onLeaderboardPress: () => void;
  onFeedPress: () => void;
  activeView: string;
}

const FloatingNav = ({ onCameraPress, onProfilePress, onLeaderboardPress, onFeedPress, activeView }: FloatingNavProps) => {
  return (
    <>
      {/* ── Top header ── */}
      <div className="absolute top-0 left-0 right-0 z-[1100] px-4 pt-3 pb-2">
        <div className="flex items-center justify-between mb-2">
          {/* Logo glass dark */}
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 shadow-lg">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">G</span>
            </div>
            <span className="text-xs font-semibold text-white">GreenHunt</span>
          </div>

          {/* Right icons glass dark */}
          <div className="flex gap-2">
            {[MessageCircle, Bell, Search].map((Icon, i) => (
              <button
                key={i}
                className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg text-white/80 hover:text-primary transition-colors"
              >
                <Icon size={16} />
              </button>
            ))}
          </div>
        </div>

        {/* Weather widgets glass dark */}
        <div className="flex gap-2">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 shadow-lg">
              <span className="text-[11px]">🌡️</span>
              <span className="text-[11px] font-semibold text-white">760 mmHg</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 shadow-lg">
              <span className="text-[11px]">🧭</span>
              <span className="text-[11px] font-semibold text-white">N 15 km/h</span>
            </div>
          </div>
          <div className="flex items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 shadow-lg self-start">
            <span className="text-[11px]">🌤️</span>
            <span className="text-[11px] font-semibold text-white ml-1">18°C</span>
          </div>
        </div>
      </div>

      {/* ── Right side map controls glass dark ── */}
      <div className="absolute right-3 bottom-28 z-[1100] flex flex-col gap-2">
        {[
          { Icon: Compass, label: "compass" },
          { Icon: Layers, label: "layers" },
          { Icon: Crosshair, label: "location" },
        ].map(({ Icon, label }) => (
          <button
            key={label}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg text-white/80 hover:text-primary transition-colors"
          >
            <Icon size={18} />
          </button>
        ))}
      </div>

      {/* ── Bottom tab bar glassmorphism dark ── */}
      <div className="absolute bottom-0 left-0 right-0 z-[1100]">
        <div className="bg-black/50 backdrop-blur-xl border-t border-white/10 shadow-2xl px-2 pt-2 pb-4">
          <div className="flex items-center justify-around">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                activeView === "map" ? "text-primary" : "text-white/50"
              }`}
            >
              <Map size={20} />
              <span className="text-[10px] font-medium">Mapa</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onFeedPress}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                activeView === "feed" ? "text-primary" : "text-white/50"
              }`}
            >
              <List size={20} />
              <span className="text-[10px] font-medium">Feed</span>
            </motion.button>

            {/* Camera FAB center */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={onCameraPress}
              className="w-14 h-14 -mt-6 rounded-full bg-primary text-white flex items-center justify-center shadow-lg gh-glow"
            >
              <Plus size={26} />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onLeaderboardPress}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                activeView === "leaderboard" ? "text-primary" : "text-white/50"
              }`}
            >
              <Trophy size={20} />
              <span className="text-[10px] font-medium">Ranking</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onProfilePress}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                activeView === "profile" ? "text-primary" : "text-white/50"
              }`}
            >
              <User size={20} />
              <span className="text-[10px] font-medium">Perfil</span>
            </motion.button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FloatingNav;
