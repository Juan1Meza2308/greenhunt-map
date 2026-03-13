import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { MockPin, getPinAge, getTimeSince } from "@/data/mockData";

interface MapViewProps {
  pins: MockPin[];
  onPinTap: (pin: MockPin) => void;
  onLocationFound?: (lat: number, lng: number) => void;
}

// Custom DivIcon markers — teardrop location pin style
const createPinIcon = (age: "fresh" | "aging") => {
  const color = age === "fresh" ? "#13b870" : "#f59e0b";
  const border = age === "fresh" ? "#0d9458" : "#d97706";
  return L.divIcon({
    html: `<div style="position:relative;width:32px;height:40px;">
      <!-- Pin body -->
      <div style="
        width:32px;height:32px;border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        background:${color};
        border:2px solid ${border};
        box-shadow:0 2px 8px rgba(0,0,0,0.4);
        position:absolute;top:0;left:0;
      "></div>
      <!-- Inner circle -->
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

// Component that gets user location, centers map, and calls onLocationFound once
const LocationTracker = ({
  onLocationFound,
}: {
  onLocationFound?: (lat: number, lng: number) => void;
}) => {
  const map = useMap();
  const called = useRef(false);

  useEffect(() => {
    const handleFound = (lat: number, lng: number) => {
      if (called.current) return;
      called.current = true;
      map.setView([lat, lng], 16);
      onLocationFound?.(lat, lng);
    };

    if (!navigator.geolocation) {
      handleFound(40.4168, -3.7038); // default Madrid
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => handleFound(pos.coords.latitude, pos.coords.longitude),
      () => handleFound(40.4168, -3.7038),
      { timeout: 8000 }
    );
  }, [map, onLocationFound]);

  return null;
};

// Pins layer - separate component to avoid re-rendering MapContainer
const PinsLayer = ({
  pins,
  onPinTap,
}: {
  pins: MockPin[];
  onPinTap: (pin: MockPin) => void;
}) => {
  return (
    <>
      {pins.map((pin) => {
        const age = getPinAge(pin.createdAt);
        const icon = createPinIcon(age);
        return (
          <Marker
            key={pin.id}
            position={[pin.lat, pin.lng]}
            icon={icon}
            eventHandlers={{ click: () => onPinTap(pin) }}
          />
        );
      })}
    </>
  );
};

const MapView = ({ pins, onPinTap, onLocationFound }: MapViewProps) => {
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
        {/* Dark CartoDB tiles */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution=""
        />

        <LocationTracker onLocationFound={onLocationFound} />

        {/* User location dot — rendered last so it's on top */}
        <PinsLayer pins={pins} onPinTap={onPinTap} />
      </MapContainer>
    </>
  );
};

export default MapView;
