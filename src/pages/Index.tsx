import { useState, useCallback, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import MapView from "@/components/MapView";
import FloatingNav from "@/components/FloatingNav";
import PinDetailSheet from "@/components/PinDetailSheet";
import CameraView from "@/components/CameraView";
import ProfileView from "@/components/ProfileView";
import LeaderboardView from "@/components/LeaderboardView";
import FeedView from "@/components/FeedView";
import SuccessToast from "@/components/SuccessToast";
import InstallBanner from "@/components/InstallBanner";
import { MockPin, getMockPinsNearLocation } from "@/data/mockData";
import { isFirebaseConfigured } from "@/services/firebase";
import { subscribeToPins, addPin, markPinRescued, markPinGone } from "@/services/pinsService";

type ViewState = "map" | "camera" | "profile" | "leaderboard" | "feed";

const Index = () => {
  const [view, setView] = useState<ViewState>("map");
  const [pins, setPins] = useState<MockPin[]>([]);
  const [selectedPin, setSelectedPin] = useState<MockPin | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastCo2, setLastCo2] = useState(20);
  const [centerTrigger, setCenterTrigger] = useState(0);

  const firebaseOn = isFirebaseConfigured();

  // ── Firebase real-time subscription ──────────────────────────────────────
  useEffect(() => {
    if (!firebaseOn) return;
    const unsubscribe = subscribeToPins((fbPins) => setPins(fbPins));
    return unsubscribe;
  }, [firebaseOn]);

  // ── Mock fallback: populate pins once we know the user's GPS location ─────
  const handleLocationFound = useCallback(
    (lat: number, lng: number) => {
      if (firebaseOn) return; // Firebase handles pins
      setPins((prev) => {
        if (prev.length === 0) return getMockPinsNearLocation(lat, lng);
        return prev;
      });
    },
    [firebaseOn]
  );

  const handlePinTap = (pin: MockPin) => {
    if (view !== "map") setView("map");
    setSelectedPin(pin);
  };

  const handlePublish = useCallback(
    async (newPinData: Omit<MockPin, "id">) => {
      if (firebaseOn) {
        // Upload photo + save to Firestore; onSnapshot will update the map
        await addPin(newPinData);
      } else {
        const newPin: MockPin = { ...newPinData, id: `pin-${Date.now()}` };
        setPins((prev) => [newPin, ...prev]);
      }
      setLastCo2(newPinData.ecoImpact.co2Saved);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3500);
    },
    [firebaseOn]
  );

  const handleRescue = useCallback(
    async (pinId: string) => {
      if (firebaseOn) {
        await markPinRescued(pinId);
        // onSnapshot will remove it from the list (query filters status === 'available')
      } else {
        setPins((prev) =>
          prev.map((p) => (p.id === pinId ? { ...p, status: "rescued" as const } : p))
        );
      }
      setSelectedPin(null);
    },
    [firebaseOn]
  );

  const handleGone = useCallback(
    async (pinId: string) => {
      if (firebaseOn) {
        await markPinGone(pinId);
        // onSnapshot will remove it from the list (document deleted)
      } else {
        setPins((prev) => prev.filter((p) => p.id !== pinId));
      }
      setSelectedPin(null);
    },
    [firebaseOn]
  );

  // Firebase query already filters status === 'available'; mock needs the filter
  const visiblePins = firebaseOn ? pins : pins.filter((p) => p.status === "available");

  return (
    <div className="relative w-full overflow-hidden bg-background" style={{ height: "100dvh" }}>
      <MapView
        pins={visiblePins}
        onPinTap={handlePinTap}
        onLocationFound={handleLocationFound}
        centerTrigger={centerTrigger}
      />

      <FloatingNav
        onCameraPress={() => setView("camera")}
        onProfilePress={() => setView(view === "profile" ? "map" : "profile")}
        onLeaderboardPress={() => setView(view === "leaderboard" ? "map" : "leaderboard")}
        onFeedPress={() => setView(view === "feed" ? "map" : "feed")}
        onCenterMap={() => setCenterTrigger((n) => n + 1)}
        activeView={view}
      />

      <AnimatePresence>
        {selectedPin && (
          <PinDetailSheet
            pin={selectedPin}
            onClose={() => setSelectedPin(null)}
            onRescue={handleRescue}
            onGone={handleGone}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {view === "camera" && (
          <CameraView onClose={() => setView("map")} onPublish={handlePublish} />
        )}
        {view === "profile" && <ProfileView onClose={() => setView("map")} />}
        {view === "leaderboard" && <LeaderboardView onClose={() => setView("map")} />}
        {view === "feed" && (
          <FeedView
            pins={visiblePins}
            onClose={() => setView("map")}
            onPinTap={(pin) => {
              setView("map");
              handlePinTap(pin);
            }}
          />
        )}
      </AnimatePresence>

      <SuccessToast show={showSuccess} co2Saved={lastCo2} />
      <InstallBanner />
    </div>
  );
};

export default Index;
