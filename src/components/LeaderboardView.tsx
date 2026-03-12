import { motion } from "framer-motion";
import { X, Leaf, Trophy } from "lucide-react";
import { leaderboardUsers, currentUser } from "@/data/mockData";

interface LeaderboardViewProps {
  onClose: () => void;
}

const LeaderboardView = ({ onClose }: LeaderboardViewProps) => {
  const sorted = [...leaderboardUsers].sort((a, b) => b.stats.co2Saved - a.stats.co2Saved);
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <motion.div
      className="absolute inset-0 z-50 bg-background overflow-y-auto"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 250 }}
    >
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h2 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
          <Trophy size={20} className="text-accent" />
          Clasificación
        </h2>
        <button onClick={onClose} className="text-muted-foreground">
          <X size={22} />
        </button>
      </div>

      <div className="px-4 pb-2">
        <p className="text-xs text-muted-foreground font-body">Williamsburg, Brooklyn · Ranking por CO₂ salvado</p>
      </div>

      <div className="px-4 pb-8 space-y-2">
        {sorted.map((user, index) => {
          const isCurrentUser = user.id === currentUser.id;
          return (
            <motion.div
              key={user.id}
              className={`flex items-center gap-3 rounded-2xl p-3 ${
                isCurrentUser ? "bg-primary/15 border border-primary/30" : "bg-card border border-border/20"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              {/* Rank */}
              <div className="w-8 text-center">
                {index < 3 ? (
                  <span className="text-xl">{medals[index]}</span>
                ) : (
                  <span className="text-sm font-display font-bold text-muted-foreground">#{index + 1}</span>
                )}
              </div>

              {/* Avatar */}
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-10 h-10 rounded-full object-cover"
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-display font-semibold truncate ${
                  isCurrentUser ? "text-primary" : "text-foreground"
                }`}>
                  {user.displayName} {isCurrentUser && "(tú)"}
                </p>
                <p className="text-[11px] text-muted-foreground font-body">
                  {user.postsCreated > user.itemsRescued ? "Explorer 🔍" : "Hunter 🎯"}
                </p>
              </div>

              {/* Score */}
              <div className="text-right">
                <div className="flex items-center gap-1 text-primary">
                  <Leaf size={14} />
                  <span className="text-sm font-display font-bold">{user.stats.co2Saved}</span>
                </div>
                <p className="text-[9px] text-muted-foreground">kg CO₂</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default LeaderboardView;
