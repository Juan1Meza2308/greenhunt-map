import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISSED_KEY = "gh_install_dismissed";

const InstallBanner = () => {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't show if already installed or previously dismissed
    const dismissed = sessionStorage.getItem(DISMISSED_KEY);
    if (dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!promptEvent) return;
    await promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === "accepted") setVisible(false);
  };

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISSED_KEY, "1");
    setVisible(false);
  };

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
            <Download size={18} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-display font-semibold text-secondary-foreground">
              Instalar GreenHunt
            </p>
            <p className="text-[10px] text-muted-foreground font-body">
              Agrega la app a tu pantalla de inicio
            </p>
          </div>
          <button
            onClick={handleInstall}
            className="text-xs font-display font-bold text-primary px-3 py-1.5 rounded-lg bg-primary/10 shrink-0"
          >
            Instalar
          </button>
          <button onClick={handleDismiss} className="text-muted-foreground shrink-0">
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstallBanner;
