import { motion } from "framer-motion";
import { Camera, User, Trophy, List } from "lucide-react";

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
      {/* Top floating icons */}
      <div className="absolute top-4 left-4 z-30">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onProfilePress}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            activeView === "profile" ? "bg-primary text-primary-foreground" : "gh-glass text-secondary-foreground"
          }`}
        >
          <User size={18} />
        </motion.button>
      </div>

      <div className="absolute top-4 right-4 z-30 flex gap-2">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onFeedPress}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            activeView === "feed" ? "bg-primary text-primary-foreground" : "gh-glass text-secondary-foreground"
          }`}
        >
          <List size={18} />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onLeaderboardPress}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            activeView === "leaderboard" ? "bg-primary text-primary-foreground" : "gh-glass text-secondary-foreground"
          }`}
        >
          <Trophy size={18} />
        </motion.button>
      </div>

      {/* FAB Camera button */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={onCameraPress}
          className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl gh-glow"
        >
          <Camera size={28} />
        </motion.button>
        <p className="text-center text-[10px] text-muted-foreground mt-1 font-body">Capturar</p>
      </div>
    </>
  );
};

export default FloatingNav;
