import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// Capture the event at module level — fires before React mounts
let _cachedPrompt: BeforeInstallPromptEvent | null = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  _cachedPrompt = e as BeforeInstallPromptEvent;
});

export type InstallState =
  | "android-ready"  // prompt available, can install
  | "ios-manual"     // iOS Safari — Share > Add to Home Screen
  | "installed"      // running as standalone PWA
  | "unsupported";   // desktop or criteria not met

export function useInstallPWA() {
  const getInitialState = (): InstallState => {
    if (window.matchMedia("(display-mode: standalone)").matches) return "installed";
    if (_cachedPrompt) return "android-ready";
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isSafari = /safari/i.test(navigator.userAgent) && !/chrome/i.test(navigator.userAgent);
    if (isIOS && isSafari) return "ios-manual";
    return "unsupported";
  };

  const [state, setState] = useState<InstallState>(getInitialState);
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(_cachedPrompt);

  useEffect(() => {
    // In case the event fires after mount (slow connection)
    const handler = (e: Event) => {
      e.preventDefault();
      _cachedPrompt = e as BeforeInstallPromptEvent;
      setPrompt(_cachedPrompt);
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
