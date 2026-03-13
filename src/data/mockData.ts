export interface MockPin {
  id: string;
  title: string;
  description: string;
  category: string;
  material: string;
  condition: string;
  lat: number;
  lng: number;
  photoURL: string;
  createdAt: Date;
  userId: string;
  userName: string;
  userPhoto: string;
  status: "available" | "rescued";
  isExternal: boolean;
  externalSourceUrl: string | null;
  source: "user" | "external";
  ecoImpact: {
    co2Saved: number;
    waterSaved: number;
    treesSaved: number;
    wasteDiverted: number;
  };
}

export interface MockUser {
  id: string;
  displayName: string;
  photoURL: string;
  bio: string;
  postsCreated: number;
  itemsRescued: number;
  stats: {
    co2Saved: number;
    waterSaved: number;
    treesSaved: number;
    wasteDiverted: number;
  };
}

// Mock pins spread across Williamsburg, Brooklyn
export const mockPins: MockPin[] = [
  {
    id: "pin-1",
    title: "Sillón gris en buen estado",
    description: "Sofá de dos plazas gris, estructura firme, tapizado con desgaste mínimo. Ideal para reusar.",
    category: "Sofá",
    material: "Tela",
    condition: "Bueno",
    lat: 40.7138,
    lng: -73.9614,
    photoURL: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
    userId: "ext-1",
    userName: "IG: @streetfinds_bk",
    userPhoto: "",
    status: "available",
    isExternal: true,
    externalSourceUrl: "https://instagram.com/p/example1",
    source: "external",
    ecoImpact: { co2Saved: 35, waterSaved: 150, treesSaved: 0, wasteDiverted: 0 },
  },
  {
    id: "pin-2",
    title: "Mesa de madera maciza",
    description: "Mesa de comedor de madera de roble, 120x80cm. Algunas marcas superficiales pero estructura perfecta.",
    category: "Mesa",
    material: "Madera",
    condition: "Bueno",
    lat: 40.7155,
    lng: -73.9580,
    photoURL: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=400&h=300&fit=crop",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6h ago
    userId: "ext-2",
    userName: "IG: @bk_curbside",
    userPhoto: "",
    status: "available",
    isExternal: true,
    externalSourceUrl: "https://instagram.com/p/example2",
    source: "external",
    ecoImpact: { co2Saved: 20, waterSaved: 100, treesSaved: 2, wasteDiverted: 0 },
  },
  {
    id: "pin-3",
    title: "Estante metálico industrial",
    description: "Estantería de metal con 4 niveles, estilo industrial. Perfecta para garage o taller.",
    category: "Estante",
    material: "Metal",
    condition: "Desgastado",
    lat: 40.7120,
    lng: -73.9555,
    photoURL: "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400&h=300&fit=crop",
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18h ago
    userId: "ext-3",
    userName: "IG: @rescueitnyc",
    userPhoto: "",
    status: "available",
    isExternal: false,
    externalSourceUrl: null,
    source: "user",
    ecoImpact: { co2Saved: 20, waterSaved: 100, treesSaved: 2, wasteDiverted: 0 },
  },
  {
    id: "pin-4",
    title: "Silla de oficina ergonómica",
    description: "Silla de oficina con ruedas, respaldo de malla. Funciona el ajuste de altura.",
    category: "Silla",
    material: "Plástico",
    condition: "Bueno",
    lat: 40.7168,
    lng: -73.9540,
    photoURL: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400&h=300&fit=crop",
    createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000), // 30h ago (aging/orange)
    userId: "ext-4",
    userName: "IG: @nyc_freefinds",
    userPhoto: "",
    status: "available",
    isExternal: true,
    externalSourceUrl: "https://instagram.com/p/example4",
    source: "external",
    ecoImpact: { co2Saved: 20, waterSaved: 100, treesSaved: 2, wasteDiverted: 0 },
  },
  {
    id: "pin-5",
    title: "Microondas funcional Samsung",
    description: "Microondas Samsung blanco, funciona correctamente. Cable en buen estado.",
    category: "Electrodoméstico",
    material: "Metal",
    condition: "Excelente",
    lat: 40.7145,
    lng: -73.9635,
    photoURL: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=300&fit=crop",
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000), // 36h ago (aging/orange)
    userId: "ext-5",
    userName: "IG: @williamsburg_stuff",
    userPhoto: "",
    status: "available",
    isExternal: true,
    externalSourceUrl: "https://instagram.com/p/example5",
    source: "external",
    ecoImpact: { co2Saved: 15, waterSaved: 0, treesSaved: 0, wasteDiverted: 10 },
  },
];

export const currentUser: MockUser = {
  id: "user-1",
  displayName: "María García",
  photoURL: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  bio: "♻️ Salvando muebles del vertedero, uno a la vez",
  postsCreated: 12,
  itemsRescued: 8,
  stats: {
    co2Saved: 245,
    waterSaved: 1200,
    treesSaved: 14,
    wasteDiverted: 35,
  },
};

export const leaderboardUsers: MockUser[] = [
  {
    id: "lb-1",
    displayName: "Carlos Ruiz",
    photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    bio: "",
    postsCreated: 34,
    itemsRescued: 28,
    stats: { co2Saved: 580, waterSaved: 2800, treesSaved: 32, wasteDiverted: 85 },
  },
  {
    id: "lb-2",
    displayName: "Ana Torres",
    photoURL: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    bio: "",
    postsCreated: 22,
    itemsRescued: 31,
    stats: { co2Saved: 410, waterSaved: 2100, treesSaved: 24, wasteDiverted: 62 },
  },
  currentUser,
  {
    id: "lb-3",
    displayName: "Diego Morales",
    photoURL: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    bio: "",
    postsCreated: 18,
    itemsRescued: 5,
    stats: { co2Saved: 190, waterSaved: 900, treesSaved: 10, wasteDiverted: 22 },
  },
  {
    id: "lb-4",
    displayName: "Lucía Fernández",
    photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    bio: "",
    postsCreated: 9,
    itemsRescued: 15,
    stats: { co2Saved: 155, waterSaved: 750, treesSaved: 8, wasteDiverted: 18 },
  },
];

export function getTimeSince(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}

export function getPinAge(date: Date): "fresh" | "aging" {
  const hours = (Date.now() - date.getTime()) / (1000 * 60 * 60);
  return hours < 24 ? "fresh" : "aging";
}

export function getExpiresIn(date: Date): string {
  const expiresAt = date.getTime() + 48 * 60 * 60 * 1000;
  const remaining = expiresAt - Date.now();
  if (remaining <= 0) return "expirado";
  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `expira en ${hours}h ${minutes}m`;
  return `expira en ${minutes}m`;
}

const PIN_OFFSETS = [
  { dlat: 0.0018, dlng: 0.0025 },
  { dlat: -0.0012, dlng: 0.0042 },
  { dlat: 0.0035, dlng: -0.0018 },
  { dlat: -0.0028, dlng: -0.0035 },
  { dlat: 0.0008, dlng: -0.0050 },
];

export function getMockPinsNearLocation(lat: number, lng: number): MockPin[] {
  return mockPins.map((pin, i) => ({
    ...pin,
    lat: lat + PIN_OFFSETS[i % PIN_OFFSETS.length].dlat,
    lng: lng + PIN_OFFSETS[i % PIN_OFFSETS.length].dlng,
  }));
}
