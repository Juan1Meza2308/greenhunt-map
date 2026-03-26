import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { MockPin, getPinAge } from "@/data/mockData";

interface MapViewProps {
  pins: MockPin[];
  onPinTap: (pin: MockPin) => void;
  onLocationFound?: (lat: number, lng: number) => void;
  centerTrigger?: number; // increment to re-center on user
}

// Custom DivIcon markers — tactical glowing rings style
const createPinIcon = (age: "fresh" | "aging") => {
  const color = age === "fresh" ? "var(--gh-pin-fresh)" : "var(--gh-pin-aging)";
  const shadowColor = age === "fresh" ? "rgba(20, 220, 100, 0.4)" : "rgba(234, 179, 8, 0.4)";
  
  return L.divIcon({
    html: `<div style="position:relative;width:40px;height:40px;display:flex;items-center;justify-center;">
      <!-- Outer glow ring -->
      <div style="
        position:absolute;width:100%;height:100%;
        border-radius:50%;border:1px solid ${color};
        opacity:0.3;animation:marker-glow 3s ease-in-out infinite;
      "></div>
      <!-- Middle ring -->
      <div style="
        position:absolute;width:60%;height:60%;
        border-radius:50%;border:2px solid ${color};
        box-shadow:0 0 10px ${shadowColor};
        top:20%;left:20%;
      "></div>
      <!-- Center dot -->
      <div style="
        position:absolute;width:25%;height:25%;
        border-radius:50%;background:${color};
        top:37.5%;left:37.5%;
        box-shadow:0 0 8px ${color};
      "></div>
    </div>`,
    className: "",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

const userLocationIcon = L.divIcon({
  html: `<div style="position:relative;width:24px;height:24px;">
    <!-- Detection ping -->
    <div style="
      position:absolute;inset:0;border-radius:50%;
      border:2px solid #fff;opacity:0.5;
      animation:leaflet-ping 2s ease-out infinite;
    "></div>
    <!-- User dot -->
    <div style="
      position:absolute;inset:6px;border-radius:50%;
      background:#fff;border:2px solid var(--gh-pin-fresh);
      box-shadow:0 0 10px rgba(255,255,255,0.8);
    "></div>
  </div>`,
  className: "",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Handles initial location + re-centering when centerTrigger changes
const LocationTracker = ({
  onLocationFound,
  centerTrigger,
}: {
  onLocationFound?: (lat: number, lng: number) => void;
  centerTrigger?: number;
}) => {
  const map = useMap();
  const called = useRef(false);
  const lastTrigger = useRef(centerTrigger);

  useEffect(() => {
    const handleFound = (lat: number, lng: number) => {
      if (called.current) return;
      called.current = true;
      map.setView([lat, lng], 16);
      onLocationFound?.(lat, lng);
    };

    if (!navigator.geolocation) {
      handleFound(40.4168, -3.7038);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => handleFound(pos.coords.latitude, pos.coords.longitude),
      () => handleFound(40.4168, -3.7038),
      { timeout: 8000 }
    );
  }, [map, onLocationFound]);

  // Re-center when centerTrigger increments
  useEffect(() => {
    if (centerTrigger === undefined || centerTrigger === lastTrigger.current) return;
    lastTrigger.current = centerTrigger;
    navigator.geolocation?.getCurrentPosition(
      (pos) => map.setView([pos.coords.latitude, pos.coords.longitude], 16),
      () => {},
      { timeout: 5000 }
    );
  }, [centerTrigger, map]);

  return null;
};

const PinsLayer = ({
  pins,
  onPinTap,
}: {
  pins: MockPin[];
  onPinTap: (pin: MockPin) => void;
}) => (
  <>
    {pins.map((pin) => {
      const age = getPinAge(pin.createdAt);
      return (
        <Marker
          key={pin.id}
          position={[pin.lat, pin.lng]}
          icon={createPinIcon(age)}
          eventHandlers={{ click: () => onPinTap(pin) }}
        />
      );
    })}
  </>
);

const MapView = ({ pins, onPinTap, onLocationFound, centerTrigger }: MapViewProps) => {
  return (
    <>
      <style>{`
        @keyframes leaflet-ping {
          75%, 100% { transform: scale(2.5); opacity: 0; }
        }
        .leaflet-container { background: #0d1117; }
        .leaflet-control-attribution { display: none; }
        .leaflet-control-zoom { display: none; }
      `}</style>

      <MapContainer
        center={[40.4168, -3.7038]}
        zoom={15}
        className="w-full h-full"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution=""
        />
        <LocationTracker onLocationFound={onLocationFound} centerTrigger={centerTrigger} />
        <PinsLayer pins={pins} onPinTap={onPinTap} />
      </MapContainer>
    </>
  );
};

export default MapView;
