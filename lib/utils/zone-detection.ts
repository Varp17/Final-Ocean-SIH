export interface Coordinates {
  lat: number
  lng: number
}

export interface Zone {
  id: string
  lat: number
  lng: number
  radius: number
  type: "danger" | "safe"
  name?: string
  severity?: "low" | "medium" | "high" | "critical"
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in meters
 */
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371000 // Earth's radius in meters
  const φ1 = (coord1.lat * Math.PI) / 180
  const φ2 = (coord2.lat * Math.PI) / 180
  const Δφ = ((coord2.lat - coord1.lat) * Math.PI) / 180
  const Δλ = ((coord2.lng - coord1.lng) * Math.PI) / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

/**
 * Check if a coordinate is inside a circular zone
 */
export function isInsideZone(userLocation: Coordinates, zone: Zone): boolean {
  const distance = calculateDistance(userLocation, { lat: zone.lat, lng: zone.lng })
  return distance <= zone.radius
}

/**
 * Find all zones that contain the given coordinates
 */
export function getZonesContainingLocation(userLocation: Coordinates, zones: Zone[]): Zone[] {
  return zones.filter((zone) => isInsideZone(userLocation, zone))
}

/**
 * Find the nearest safe zone to a given location
 */
export function findNearestSafeZone(
  userLocation: Coordinates,
  safeZones: Zone[],
): { zone: Zone; distance: number } | null {
  if (safeZones.length === 0) return null

  let nearestZone = safeZones[0]
  let minDistance = calculateDistance(userLocation, { lat: nearestZone.lat, lng: nearestZone.lng })

  for (let i = 1; i < safeZones.length; i++) {
    const distance = calculateDistance(userLocation, { lat: safeZones[i].lat, lng: safeZones[i].lng })
    if (distance < minDistance) {
      minDistance = distance
      nearestZone = safeZones[i]
    }
  }

  return { zone: nearestZone, distance: minDistance }
}

/**
 * Generate alert message based on zone detection
 */
export function generateZoneAlert(
  userLocation: Coordinates,
  dangerZones: Zone[],
  safeZones: Zone[],
): {
  type: "danger" | "safe" | "warning" | "clear"
  message: string
  nearestSafeZone?: { zone: Zone; distance: number }
} {
  const dangerZonesContaining = getZonesContainingLocation(userLocation, dangerZones)
  const safeZonesContaining = getZonesContainingLocation(userLocation, safeZones)
  const nearestSafeZone = findNearestSafeZone(userLocation, safeZones)

  // User is in a danger zone
  if (dangerZonesContaining.length > 0) {
    const highestSeverityZone = dangerZonesContaining.reduce((prev, current) => {
      const severityOrder = { low: 1, medium: 2, high: 3, critical: 4 }
      const prevSeverity = severityOrder[prev.severity || "low"]
      const currentSeverity = severityOrder[current.severity || "low"]
      return currentSeverity > prevSeverity ? current : prev
    })

    return {
      type: "danger",
      message: `⚠️ DANGER: You are in a ${highestSeverityZone.severity} risk zone (${highestSeverityZone.name || "Hazard Area"}). ${nearestSafeZone ? `Nearest safe zone: ${nearestSafeZone.zone.name} (${Math.round(nearestSafeZone.distance)}m away)` : "Seek immediate shelter."}`,
      nearestSafeZone,
    }
  }

  // User is in a safe zone
  if (safeZonesContaining.length > 0) {
    return {
      type: "safe",
      message: `✅ SAFE: You are in a safe zone (${safeZonesContaining[0].name}). Stay here until authorities give the all-clear.`,
      nearestSafeZone,
    }
  }

  // User is near a danger zone (within 500m)
  const nearbyDangerZones = dangerZones.filter((zone) => {
    const distance = calculateDistance(userLocation, { lat: zone.lat, lng: zone.lng })
    return distance <= zone.radius + 500 && distance > zone.radius
  })

  if (nearbyDangerZones.length > 0) {
    return {
      type: "warning",
      message: `⚠️ WARNING: You are near a danger zone. ${nearestSafeZone ? `Move towards ${nearestSafeZone.zone.name} (${Math.round(nearestSafeZone.distance)}m away)` : "Move to a safe area immediately."}`,
      nearestSafeZone,
    }
  }

  // User is in clear area
  return {
    type: "clear",
    message: `✅ CLEAR: You are in a safe area. ${nearestSafeZone ? `Nearest safe zone: ${nearestSafeZone.zone.name} (${Math.round(nearestSafeZone.distance)}m away)` : ""}`,
    nearestSafeZone,
  }
}

/**
 * Check if user should receive a push notification based on zone changes
 */
export function shouldSendNotification(
  previousAlert: string | null,
  currentAlert: { type: string; message: string },
): boolean {
  // Send notification if:
  // 1. User enters a danger zone
  // 2. User enters a warning zone
  // 3. User enters a safe zone from danger/warning
  // 4. Alert type changes

  if (!previousAlert) return currentAlert.type !== "clear"

  const alertChanged = previousAlert !== currentAlert.message
  const isDangerOrWarning = currentAlert.type === "danger" || currentAlert.type === "warning"
  const isSafeFromDanger =
    currentAlert.type === "safe" && (previousAlert.includes("DANGER") || previousAlert.includes("WARNING"))

  return alertChanged && (isDangerOrWarning || isSafeFromDanger)
}
