import { motion } from "framer-motion";
import { User, Trophy, List, Map, MessageCircle, Bell, Search, Compass, Layers, Crosshair, Plus, Skull, MapPin, Menu } from "lucide-react";
import { toast } from "sonner";

interface FloatingNavProps {
  onCameraPress: () => void;
  onProfilePress: () => void;
  onLeaderboardPress: () => void;
  onFeedPress: () => void;
  onCenterMap: () => void;
  activeView: string;
}

const FloatingNav = ({
  onCameraPress,
  onProfilePress,
  onLeaderboardPress,
  onFeedPress,
  onCenterMap,
  activeView,
}: FloatingNavProps) => {
  return (
    <>
      {/* ── Top header ── */}
      <div className="absolute top-0 left-0 right-0 z-[1100] px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-4">
          {/* Logo */}
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2 shadow-neon-glow">
            <div className="w-6 h-6 rounded-full bg-gh-neon flex items-center justify-center shadow-[0_0_10px_rgba(20,220,100,0.6)]">
              <span className="text-black text-[10px] font-bold">G</span>
            </div>
            <span className="text-sm font-display font-bold text-gh-neon glow-text tracking-wider uppercase">GreenHunt</span>
          </div>

          {/* Hamburger Menu (Yellow Lines) */}
          <button
            onClick={() => toast.info("Menú táctico próximamente")}
            className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-xl border border-gh-gold/30 flex items-center justify-center shadow-gold-glow text-gh-gold hover:scale-110 transition-transform"
          >
            <Menu size={20} strokeWidth={3} />
          </button>
        </div>

        {/* Readout widgets (Weather/Stats) */}
        <div className="flex gap-2">
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-lg border border-white/5 rounded-full px-3 py-1.5 shadow-tactical">
            <Compass size={12} className="text-gh-neon animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-white/90 tracking-tighter">760 MMHG</span>
          </div>
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-lg border border-white/5 rounded-full px-3 py-1.5 shadow-tactical">
            <span className="text-[10px] font-mono font-bold text-white/90 tracking-tighter">NW 15KM/H</span>
          </div>
          <div className="flex items-center bg-black/40 backdrop-blur-lg border border-white/5 rounded-full px-3 py-1.5 shadow-tactical">
            <span className="text-[10px] font-mono font-bold text-gh-neon tracking-tighter">18°C</span>
          </div>
        </div>
      </div>

      {/* ── Right side map controls ── */}
      <div className="absolute right-4 z-[1100] flex flex-col gap-3" style={{ bottom: "calc(8rem + env(safe-area-inset-bottom))" }}>
        <button
          onClick={onCenterMap}
          className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-xl border border-gh-neon/40 flex items-center justify-center shadow-neon-glow text-gh-neon hover:bg-gh-neon/10 transition-colors"
        >
          <Compass size={22} />
        </button>
        <button
          onClick={() => toast.info("Interferencia detectada...")}
          className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-tactical text-white/70 hover:text-gh-neon transition-colors"
        >
          <Layers size={20} strokeWidth={1.5} />
        </button>
      </div>

      {/* ── Bottom tab bar ── */}
      <div className="absolute bottom-0 left-0 right-0 z-[1100]">
        <div className="bg-black/80 backdrop-blur-2xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] px-4 pt-3 pb-safe-area-inset-bottom" style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}>
          <div className="flex items-center justify-around max-w-md mx-auto relative">
            
            {/* Hunt (Feed/Scanning) */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onFeedPress}
              className={`flex flex-col items-center gap-1 transition-all ${
                activeView === "feed" ? "text-gh-neon scale-110" : "text-white/40 hover:text-white/60"
              }`}
            >
              <div className={activeView === "feed" ? "drop-shadow-[0_0_8px_rgba(20,220,100,0.5)]" : ""}>
                <Crosshair size={24} strokeWidth={activeView === "feed" ? 2.5 : 1.5} />
              </div>
              <span className="text-[10px] font-display font-bold uppercase tracking-widest">Hunt</span>
            </motion.button>

            {/* Explore (Map) */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {}}
              className={`flex flex-col items-center gap-1 transition-all ${
                activeView === "map" ? "text-gh-neon scale-110" : "text-white/40 hover:text-white/60"
              }`}
            >
              <div className={activeView === "map" ? "drop-shadow-[0_0_8px_rgba(20,220,100,0.5)]" : ""}>
                <MapPin size={24} strokeWidth={activeView === "map" ? 2.5 : 1.5} />
              </div>
              <span className="text-[10px] font-display font-bold uppercase tracking-widest text-[#f0f0f0] opacity-90">Explore</span>
            </motion.button>

            {/* Camera / Add Pin FAB */}
            <div className="relative -top-3">
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                onClick={onCameraPress}
                className="w-16 h-16 rounded-full bg-gh-neon text-black flex items-center justify-center shadow-[0_0_25px_rgba(20,220,100,0.6)] border-4 border-black group"
              >
                <Plus size={32} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
              </motion.button>
            </div>

            {/* Ranking (Leaderboard) */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onLeaderboardPress}
              className={`flex flex-col items-center gap-1 transition-all ${
                activeView === "leaderboard" ? "text-gh-neon scale-110" : "text-white/40 hover:text-white/60"
              }`}
            >
              <div className={activeView === "leaderboard" ? "drop-shadow-[0_0_8px_rgba(20,220,100,0.5)]" : ""}>
                <Trophy size={24} strokeWidth={activeView === "leaderboard" ? 2.5 : 1.5} />
              </div>
              <span className="text-[10px] font-display font-bold uppercase tracking-widest">Rank</span>
            </motion.button>

            {/* Profile (Skull) */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onProfilePress}
              className={`flex flex-col items-center gap-1 transition-all ${
                activeView === "profile" ? "text-gh-neon scale-110" : "text-white/40 hover:text-white/60"
              }`}
            >
              <div className={activeView === "profile" ? "drop-shadow-[0_0_8px_rgba(20,220,100,0.5)]" : ""}>
                <Skull size={24} strokeWidth={activeView === "profile" ? 2.5 : 1.5} />
              </div>
              <span className="text-[10px] font-display font-bold uppercase tracking-widest">Profile</span>
            </motion.button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FloatingNav;

export default FloatingNav;
