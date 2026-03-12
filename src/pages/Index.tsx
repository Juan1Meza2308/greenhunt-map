import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import MapView from "@/components/MapView";
import FloatingNav from "@/components/FloatingNav";
import PinDetailSheet from "@/components/PinDetailSheet";
import CameraView from "@/components/CameraView";
import ProfileView from "@/components/ProfileView";
import LeaderboardView from "@/components/LeaderboardView";
import FeedView from "@/components/FeedView";
import SuccessToast from "@/components/SuccessToast";
import { mockPins, MockPin } from "@/data/mockData";

type ViewState = "map" | "camera" | "profile" | "leaderboard" | "feed";

const Index = () => {
  const [view, setView] = useState<ViewState>("map");
  const [selectedPin, setSelectedPin] = useState<MockPin | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePinTap = (pin: MockPin) => {
    setSelectedPin(pin);
  };

  const handlePublish = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gh-asphalt-deep">
      {/* Map base layer */}
      <MapView pins={mockPins} onPinTap={handlePinTap} />

      {/* Floating navigation */}
      <FloatingNav
        onCameraPress={() => setView("camera")}
        onProfilePress={() => setView(view === "profile" ? "map" : "profile")}
        onLeaderboardPress={() => setView(view === "leaderboard" ? "map" : "leaderboard")}
        onFeedPress={() => setView(view === "feed" ? "map" : "feed")}
        activeView={view}
      />

      {/* Pin detail bottom sheet */}
      <AnimatePresence>
        {selectedPin && (
          <PinDetailSheet pin={selectedPin} onClose={() => setSelectedPin(null)} />
        )}
      </AnimatePresence>

      {/* Overlay views */}
      <AnimatePresence>
        {view === "camera" && (
          <CameraView onClose={() => setView("map")} onPublish={handlePublish} />
        )}
        {view === "profile" && (
          <ProfileView onClose={() => setView("map")} />
        )}
        {view === "leaderboard" && (
          <LeaderboardView onClose={() => setView("map")} />
        )}
        {view === "feed" && (
          <FeedView pins={mockPins} onClose={() => setView("map")} onPinTap={(pin) => { setView("map"); handlePinTap(pin); }} />
        )}
      </AnimatePresence>

      {/* Success toast */}
      <SuccessToast show={showSuccess} co2Saved={20} />
    </div>
  );
};

export default Index;
