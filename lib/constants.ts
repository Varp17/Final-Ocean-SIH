export const HAZARD_TYPES = {
  tsunami: {
    label: "Tsunami",
    icon: "🌊",
    color: "text-red-600",
    bgColor: "bg-red-50",
    description: "Large ocean waves threatening coastal areas",
  },
  high_waves: {
    label: "High Waves",
    icon: "🌊",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    description: "Unusually high ocean waves",
  },
  coastal_flooding: {
    label: "Coastal Flooding",
    icon: "🏖️",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    description: "Water flooding coastal areas",
  },
  abnormal_tides: {
    label: "Abnormal Tides",
    icon: "🌀",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    description: "Unusual tidal patterns",
  },
  suspicious_activity: {
    label: "Suspicious Activity",
    icon: "⚠️",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    description: "Unusual or concerning ocean activity",
  },
  other: {
    label: "Other",
    icon: "❓",
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    description: "Other ocean-related hazards",
  },
} as const

export const URGENCY_LEVELS = {
  low: {
    label: "Low",
    color: "text-green-600",
    bgColor: "bg-green-50",
    priority: 1,
  },
  medium: {
    label: "Medium",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    priority: 2,
  },
  high: {
    label: "High",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    priority: 3,
  },
  critical: {
    label: "Critical",
    color: "text-red-600",
    bgColor: "bg-red-50",
    priority: 4,
  },
} as const

export const ZONE_TYPES = {
  safe: {
    label: "Safe Zone",
    color: "text-green-600",
    fillColor: "rgba(16, 185, 129, 0.2)",
    borderColor: "#10b981",
  },
  danger: {
    label: "Danger Zone",
    color: "text-red-600",
    fillColor: "rgba(239, 68, 68, 0.2)",
    borderColor: "#ef4444",
  },
  warning: {
    label: "Warning Zone",
    color: "text-yellow-600",
    fillColor: "rgba(245, 158, 11, 0.2)",
    borderColor: "#f59e0b",
  },
  evacuation: {
    label: "Evacuation Zone",
    color: "text-purple-600",
    fillColor: "rgba(147, 51, 234, 0.2)",
    borderColor: "#9333ea",
  },
} as const

export const USER_ROLES = {
  citizen: {
    label: "Citizen",
    permissions: ["report_hazard", "view_map", "receive_alerts"],
  },
  analyst: {
    label: "Analyst",
    permissions: [
      "report_hazard",
      "view_map",
      "receive_alerts",
      "verify_reports",
      "view_analytics",
      "manage_social_media",
    ],
  },
  admin: {
    label: "Administrator",
    permissions: ["*"], // All permissions
  },
} as const

export const SOCIAL_MEDIA_PLATFORMS = {
  twitter: {
    label: "Twitter/X",
    icon: "𝕏",
    color: "text-black",
    hashtags: ["#OceanRanger", "#SeaGuardian", "#BlueWatch"],
  },
  youtube: {
    label: "YouTube",
    icon: "📺",
    color: "text-red-600",
    hashtags: [],
  },
  facebook: {
    label: "Facebook",
    icon: "📘",
    color: "text-blue-600",
    hashtags: [],
  },
  instagram: {
    label: "Instagram",
    icon: "📷",
    color: "text-pink-600",
    hashtags: [],
  },
} as const

export const API_ENDPOINTS = {
  // Reports
  REPORTS: "/api/reports",
  REPORT_BY_ID: (id: string) => `/api/reports/${id}`,

  // Users
  USERS: "/api/users",
  USER_PROFILE: "/api/users/profile",

  // Live locations
  LIVE_LOCATIONS: "/api/live-locations",
  LIVE_LOCATIONS_WS: "/api/live-locations/ws",

  // Safe zones
  SAFE_ZONES: "/api/safe-zones",

  // Alerts
  ALERTS: "/api/alerts",
  BROADCAST_ALERT: "/api/alerts/broadcast",

  // Social media
  SOCIAL_MEDIA: "/api/social-media",
  SOCIAL_ANALYTICS: "/api/social-media/analytics",

  // Hotspots
  HOTSPOTS: "/api/hotspots",

  // Media
  MEDIA_UPLOAD: "/api/media/upload",
  MEDIA_PRESIGN: "/api/media/presign",
} as const

export const MAP_CONFIG = {
  DEFAULT_CENTER: { lat: 20.5937, lng: 78.9629 }, // India center
  DEFAULT_ZOOM: 6,
  MIN_ZOOM: 3,
  MAX_ZOOM: 18,
  CLUSTER_RADIUS: 50,
  HEATMAP_RADIUS: 20,
  LIVE_LOCATION_RETENTION_HOURS: 24,
} as const

export const ML_CONFIG = {
  THREAT_CONFIDENCE_WEIGHTS: {
    good_info_probability: 0.25,
    urgency_score: 0.25,
    location_verified: 0.25,
    reporter_reputation: 0.25,
  },
  HOTSPOT_DETECTION: {
    eps_distance: 1000, // meters
    eps_time: 3600, // seconds (1 hour)
    min_samples: 3,
  },
  AUTO_VERIFY_THRESHOLD: 0.8,
} as const
