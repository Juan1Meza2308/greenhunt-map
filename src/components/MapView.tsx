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

// Custom DivIcon markers — teardrop location pin style
const createPinIcon = (age: "fresh" | "aging") => {
  const color = age === "fresh" ? "#13b870" : "#f59e0b";
  const border = age === "fresh" ? "#0d9458" : "#d97706";
  return L.divIcon({
    html: `<div style="position:relative;width:32px;height:40px;">
      <div style="
        width:32px;height:32px;border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        background:${color};
        border:2px solid ${border};
        box-shadow:0 2px 8px rgba(0,0,0,0.4);
        position:absolute;top:0;left:0;
      "></div>
      <div style="
        width:14px;height:14px;border-radius:50%;
        background:rgba(255,255,255,0.9);
        position:absolute;top:9px;left:9px;
      "></div>
    </div>`,
    className: "",
    iconSize: [32, 40],
    iconAnchor: [16, 40],
  });
};

const userLocationIcon = L.divIcon({
  html: `<div style="position:relative;width:20px;height:20px;">
    <div style="
      width:20px;height:20px;border-radius:50%;
      background:#ffffff;border:3px solid #13b870;
      box-shadow:0 0 0 4px rgba(19,184,112,0.3);
    "></div>
  </div>`,
  className: "",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
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
