import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export type InstallState =
  | "android-ready"   // beforeinstallprompt captured, can prompt
  | "ios-manual"      // iOS Safari — must use Share > Add to Home Screen
  | "installed"       // already running as standalone PWA
  | "unsupported";    // desktop or already dismissed by browser

export function useInstallPWA() {
  const [state, setState] = useState<InstallState>("unsupported");
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Already installed as PWA
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setState("installed");
      return;
    }

    // iOS Safari detection
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isSafari = /safari/i.test(navigator.userAgent) && !/chrome/i.test(navigator.userAgent);
    if (isIOS && isSafari) {
      setState("ios-manual");
      return;
    }

    // Android Chrome: wait for beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
      setState("android-ready");
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") setState("installed");
  };

  return { state, install };
}
