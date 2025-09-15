export interface User {
  id: string
  email: string
  role: "citizen" | "analyst" | "admin"
  name: string
  phone?: string
  created_at: string
  updated_at: string
}

export interface HazardReport {
  id: string
  user_id: string
  hazard_type: "tsunami" | "high_waves" | "coastal_flooding" | "abnormal_tides" | "suspicious_activity" | "other"
  location: {
    lat: number
    lng: number
    address?: string
  }
  description?: string
  media_urls?: string[]
  threat_confidence: number // 0-10 scale
  urgency_level: "low" | "medium" | "high" | "critical"
  status: "pending" | "verified" | "rejected" | "resolved"
  created_at: string
  updated_at: string
  verified_by?: string
  verification_notes?: string
}

export interface LiveLocation {
  id: string
  user_id: string
  location: {
    lat: number
    lng: number
  }
  timestamp: string
  is_active: boolean
}

export interface SafeZone {
  id: string
  name: string
  geometry: {
    type: "Polygon"
    coordinates: number[][][]
  }
  zone_type: "safe" | "danger" | "warning" | "evacuation"
  description?: string
  capacity?: number
  facilities?: string[]
  created_at: string
  updated_at: string
}

export interface Alert {
  id: string
  title: string
  message: string
  alert_type: "info" | "warning" | "danger" | "critical"
  affected_areas: string[]
  created_by: string
  created_at: string
  expires_at?: string
  is_active: boolean
}

export interface SocialMediaPost {
  id: string
  platform: "twitter" | "youtube" | "facebook" | "instagram"
  post_id: string
  user_handle: string
  text: string
  location?: {
    lat: number
    lng: number
  }
  hashtags: string[]
  created_at: string
  processed_at?: string
  hazard_type?: string
  threat_confidence?: number
  good_info_probability?: number
  status: "raw" | "processed" | "verified" | "rejected"
}

export interface Hotspot {
  id: string
  center_location: {
    lat: number
    lng: number
  }
  radius_meters: number
  report_count: number
  avg_threat_confidence: number
  dominant_hazard_type: string
  created_at: string
  updated_at: string
  is_active: boolean
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface MapBounds {
  north: number
  south: number
  east: number
  west: number
}

export interface ReportFilters {
  hazard_types?: string[]
  urgency_levels?: string[]
  status?: string[]
  date_from?: string
  date_to?: string
  bbox?: MapBounds
}
