import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import MapView from "@/components/MapView";
import FloatingNav from "@/components/FloatingNav";
import PinDetailSheet from "@/components/PinDetailSheet";
import CameraView from "@/components/CameraView";
import ProfileView from "@/components/ProfileView";
import LeaderboardView from "@/components/LeaderboardView";
import FeedView from "@/components/FeedView";
import SuccessToast from "@/components/SuccessToast";
import { MockPin, getMockPinsNearLocation } from "@/data/mockData";

type ViewState = "map" | "camera" | "profile" | "leaderboard" | "feed";

const Index = () => {
  const [view, setView] = useState<ViewState>("map");
  const [pins, setPins] = useState<MockPin[]>([]);
  const [selectedPin, setSelectedPin] = useState<MockPin | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastCo2, setLastCo2] = useState(20);
  const [centerTrigger, setCenterTrigger] = useState(0);

  // Called once by MapView when it gets the user's real GPS location
  const handleLocationFound = useCallback((lat: number, lng: number) => {
    setPins((prev) => {
      // Only populate with mock pins once (when prev is empty)
      if (prev.length === 0) return getMockPinsNearLocation(lat, lng);
      return prev;
    });
  }, []);

  const handlePinTap = (pin: MockPin) => {
    if (view !== "map") setView("map");
    setSelectedPin(pin);
  };

  const handlePublish = useCallback((newPinData: Omit<MockPin, "id">) => {
    const newPin: MockPin = { ...newPinData, id: `pin-${Date.now()}` };
    setPins((prev) => [newPin, ...prev]);
    setLastCo2(newPinData.ecoImpact.co2Saved);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3500);
  }, []);

  const handleRescue = useCallback((pinId: string) => {
    setPins((prev) =>
      prev.map((p) => (p.id === pinId ? { ...p, status: "rescued" as const } : p))
    );
    setSelectedPin(null);
  }, []);

  const handleGone = useCallback((pinId: string) => {
    setPins((prev) => prev.filter((p) => p.id !== pinId));
    setSelectedPin(null);
  }, []);

  // Only show available (not rescued) pins on map
  const visiblePins = pins.filter((p) => p.status === "available");

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#2d3520]">
      {/* Map base layer */}
      <MapView
        pins={visiblePins}
        onPinTap={handlePinTap}
        onLocationFound={handleLocationFound}
        centerTrigger={centerTrigger}
      />

      {/* Floating navigation */}
      <FloatingNav
        onCameraPress={() => setView("camera")}
        onProfilePress={() => setView(view === "profile" ? "map" : "profile")}
        onLeaderboardPress={() => setView(view === "leaderboard" ? "map" : "leaderboard")}
        onFeedPress={() => setView(view === "feed" ? "map" : "feed")}
        onCenterMap={() => setCenterTrigger((n) => n + 1)}
        activeView={view}
      />

      {/* Pin detail bottom sheet */}
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

      {/* Overlay views */}
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

      {/* Success toast */}
      <SuccessToast show={showSuccess} co2Saved={lastCo2} />
    </div>
  );
};

export default Index;
