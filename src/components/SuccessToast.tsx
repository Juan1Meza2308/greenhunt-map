import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Check } from "lucide-react";

interface SuccessToastProps {
  show: boolean;
  co2Saved: number;
}

const SuccessToast = ({ show, co2Saved }: SuccessToastProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute top-16 left-4 right-4 z-[60] bg-primary text-primary-foreground rounded-2xl p-4 flex items-center gap-3"
          initial={{ opacity: 0, y: -30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", damping: 20 }}
          style={{ boxShadow: "0 10px 40px hsl(var(--gh-green) / 0.4)" }}
        >
          <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <Check size={20} />
          </div>
          <div>
            <p className="font-display font-bold text-sm">¡Publicado!</p>
            <p className="text-xs opacity-90 font-body flex items-center gap-1">
              <Leaf size={12} />
              ¡Has salvado {co2Saved}kg de CO₂!
            </p>
          </div>
          <div className="ml-auto text-3xl">🌱</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessToast;
