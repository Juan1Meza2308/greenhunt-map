import { motion } from "framer-motion";
import { X, Leaf, Droplets, TreePine, Recycle, Edit2 } from "lucide-react";
import { currentUser } from "@/data/mockData";

interface ProfileViewProps {
  onClose: () => void;
}

const ProfileView = ({ onClose }: ProfileViewProps) => {
  const user = currentUser;
  const role = user.postsCreated > user.itemsRescued ? "Explorer 🔍" : "Hunter 🎯";

  return (
    <motion.div
      className="absolute inset-0 z-50 bg-background overflow-y-auto"
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 250 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h2 className="text-lg font-display font-bold text-foreground">Mi Perfil</h2>
        <button onClick={onClose} className="text-muted-foreground">
          <X size={22} />
        </button>
      </div>

      <div className="px-4 pb-8">
        {/* Avatar & Info */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="w-20 h-20 rounded-full object-cover border-2 border-primary"
            />
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <Edit2 size={12} />
            </button>
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-foreground">{user.displayName}</h3>
            <p className="text-sm text-muted-foreground font-body">{user.bio}</p>
            <span className="inline-block mt-1 text-xs font-display font-semibold bg-primary/15 text-primary rounded-full px-3 py-0.5">
              {role}
            </span>
          </div>
        </div>

        {/* Activity stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-card rounded-2xl p-4 border border-border/30">
            <p className="text-2xl font-display font-bold text-foreground">{user.postsCreated}</p>
            <p className="text-xs text-muted-foreground font-body">Objetos reportados</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border/30">
            <p className="text-2xl font-display font-bold text-foreground">{user.itemsRescued}</p>
            <p className="text-xs text-muted-foreground font-body">Objetos rescatados</p>
          </div>
        </div>

        {/* Eco Impact Dashboard */}
        <h4 className="font-display font-semibold text-foreground mb-3">Impacto Ecológico</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-primary/10 rounded-2xl p-4">
            <Leaf className="text-primary mb-2" size={24} />
            <p className="text-2xl font-display font-bold text-foreground">{user.stats.co2Saved}</p>
            <p className="text-xs text-muted-foreground font-body">kg CO₂ salvados</p>
          </div>
          <div className="bg-primary/10 rounded-2xl p-4">
            <Droplets className="text-primary mb-2" size={24} />
            <p className="text-2xl font-display font-bold text-foreground">{user.stats.waterSaved}</p>
            <p className="text-xs text-muted-foreground font-body">litros de agua</p>
          </div>
          <div className="bg-primary/10 rounded-2xl p-4">
            <TreePine className="text-primary mb-2" size={24} />
            <p className="text-2xl font-display font-bold text-foreground">{user.stats.treesSaved}</p>
            <p className="text-xs text-muted-foreground font-body">árboles salvados</p>
          </div>
          <div className="bg-primary/10 rounded-2xl p-4">
            <Recycle className="text-primary mb-2" size={24} />
            <p className="text-2xl font-display font-bold text-foreground">{user.stats.wasteDiverted}</p>
            <p className="text-xs text-muted-foreground font-body">kg residuos evitados</p>
          </div>
        </div>

        {/* Points */}
        <div className="mt-6 bg-secondary rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-body">Puntos totales</p>
              <p className="text-3xl font-display font-bold text-secondary-foreground">
                {user.postsCreated * 10 + user.itemsRescued * 20}
              </p>
            </div>
            <div className="text-4xl">🌱</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileView;
