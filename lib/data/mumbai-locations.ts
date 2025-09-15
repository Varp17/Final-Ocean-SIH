// Real Mumbai coordinates for ocean hazard monitoring
export interface MumbaiLocation {
  id: string
  name: string
  lat: number
  lng: number
  type: "beach" | "port" | "residential" | "commercial" | "industrial"
  description: string
}

export interface HazardPoint {
  id: string
  lat: number
  lng: number
  type: "flood" | "high_waves" | "oil_spill" | "debris" | "pollution"
  severity: "low" | "medium" | "high"
  verified: boolean
  timestamp: Date
  description: string
  location: string
}

// Real Mumbai coastal and key locations
export const mumbaiLocations: MumbaiLocation[] = [
  {
    id: "1",
    name: "Marine Drive",
    lat: 18.9434,
    lng: 72.8234,
    type: "commercial",
    description: "Famous seafront promenade",
  },
  {
    id: "2",
    name: "Juhu Beach",
    lat: 19.0896,
    lng: 72.8656,
    type: "beach",
    description: "Popular beach destination",
  },
  {
    id: "3",
    name: "Versova Beach",
    lat: 19.1317,
    lng: 72.8142,
    type: "beach",
    description: "Fishing village and beach",
  },
  {
    id: "4",
    name: "Bandra-Worli Sea Link",
    lat: 19.033,
    lng: 72.8258,
    type: "commercial",
    description: "Cable-stayed bridge over Mahim Bay",
  },
  {
    id: "5",
    name: "Mumbai Port Trust",
    lat: 18.9647,
    lng: 72.8258,
    type: "port",
    description: "Major port facility",
  },
  {
    id: "6",
    name: "Nariman Point",
    lat: 18.9256,
    lng: 72.8243,
    type: "commercial",
    description: "Business district at southern tip",
  },
  {
    id: "7",
    name: "Colaba",
    lat: 18.9067,
    lng: 72.8147,
    type: "commercial",
    description: "Historic area near Gateway of India",
  },
  {
    id: "8",
    name: "Mahim Bay",
    lat: 19.0412,
    lng: 72.8397,
    type: "residential",
    description: "Bay area between Mumbai and Bandra",
  },
  {
    id: "9",
    name: "Worli",
    lat: 19.0176,
    lng: 72.817,
    type: "residential",
    description: "Upscale neighborhood with sea view",
  },
  {
    id: "10",
    name: "Chowpatty Beach",
    lat: 18.9547,
    lng: 72.8081,
    type: "beach",
    description: "Beach famous for street food",
  },
]

// Mock hazard data with real Mumbai coordinates
export const mumbaiHazards: HazardPoint[] = [
  {
    id: "h1",
    lat: 18.9434,
    lng: 72.8234,
    type: "flood",
    severity: "high",
    verified: true,
    timestamp: new Date("2024-01-15T10:30:00"),
    description: "Severe flooding reported during high tide",
    location: "Marine Drive",
  },
  {
    id: "h2",
    lat: 19.0896,
    lng: 72.8656,
    type: "high_waves",
    severity: "medium",
    verified: true,
    timestamp: new Date("2024-01-15T11:15:00"),
    description: "Unusual wave patterns affecting beach activities",
    location: "Juhu Beach",
  },
  {
    id: "h3",
    lat: 18.9647,
    lng: 72.8258,
    type: "oil_spill",
    severity: "high",
    verified: true,
    timestamp: new Date("2024-01-15T09:45:00"),
    description: "Oil spill detected near port operations",
    location: "Mumbai Port Trust",
  },
  {
    id: "h4",
    lat: 19.1317,
    lng: 72.8142,
    type: "debris",
    severity: "medium",
    verified: false,
    timestamp: new Date("2024-01-15T12:00:00"),
    description: "Large debris washing ashore",
    location: "Versova Beach",
  },
  {
    id: "h5",
    lat: 18.9547,
    lng: 72.8081,
    type: "pollution",
    severity: "low",
    verified: true,
    timestamp: new Date("2024-01-15T08:30:00"),
    description: "Water quality concerns reported",
    location: "Chowpatty Beach",
  },
  {
    id: "h6",
    lat: 19.033,
    lng: 72.8258,
    type: "high_waves",
    severity: "high",
    verified: true,
    timestamp: new Date("2024-01-15T13:20:00"),
    description: "Strong waves affecting bridge structure monitoring",
    location: "Bandra-Worli Sea Link",
  },
  {
    id: "h7",
    lat: 19.0412,
    lng: 72.8397,
    type: "flood",
    severity: "medium",
    verified: false,
    timestamp: new Date("2024-01-15T14:10:00"),
    description: "Rising water levels in bay area",
    location: "Mahim Bay",
  },
  {
    id: "h8",
    lat: 18.9256,
    lng: 72.8243,
    type: "debris",
    severity: "low",
    verified: true,
    timestamp: new Date("2024-01-15T07:45:00"),
    description: "Minor debris accumulation near business district",
    location: "Nariman Point",
  },
]

// Safe zones and emergency shelters with real coordinates
export const mumbaiSafeZones = [
  {
    id: "s1",
    name: "Oval Maidan Emergency Center",
    lat: 18.9294,
    lng: 72.8319,
    capacity: 1000,
    currentOccupancy: 0,
    facilities: ["Medical", "Food", "Communication"],
  },
  {
    id: "s2",
    name: "Shivaji Park Community Center",
    lat: 19.0297,
    lng: 72.8397,
    capacity: 800,
    currentOccupancy: 45,
    facilities: ["Shelter", "Medical", "Food"],
  },
  {
    id: "s3",
    name: "Bandra Kurla Complex Emergency Hub",
    lat: 19.0728,
    lng: 72.8826,
    capacity: 1500,
    currentOccupancy: 120,
    facilities: ["Medical", "Food", "Communication", "Transport"],
  },
]

// Mumbai bounds for map centering
export const mumbaiBounds = {
  north: 19.2,
  south: 18.9,
  east: 72.9,
  west: 72.8,
  center: { lat: 19.076, lng: 72.8777 },
}
