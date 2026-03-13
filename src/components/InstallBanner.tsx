import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Share } from "lucide-react";
import { useInstallPWA } from "@/hooks/useInstallPWA";

const InstallBanner = () => {
  const { state, install } = useInstallPWA();
  const [dismissed, setDismissed] = useState(false);

  const visible = !dismissed && (state === "android-ready" || state === "ios-manual");

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute bottom-24 left-4 right-4 z-[2000] gh-glass rounded-2xl px-4 py-3 flex items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
            {state === "ios-manual" ? (
              <Share size={18} className="text-primary" />
            ) : (
              <Download size={18} className="text-primary" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-display font-semibold text-secondary-foreground">
              Instalar GreenHunt
            </p>
            <p className="text-[10px] text-muted-foreground font-body">
              {state === "ios-manual"
                ? 'Toca Compartir → "Añadir a inicio"'
                : "Agrega la app a tu pantalla de inicio"}
            </p>
          </div>
          {state === "android-ready" && (
            <button
              onClick={install}
              className="text-xs font-display font-bold text-primary px-3 py-1.5 rounded-lg bg-primary/10 shrink-0"
            >
              Instalar
            </button>
          )}
          <button onClick={() => setDismissed(true)} className="text-muted-foreground shrink-0">
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstallBanner;
