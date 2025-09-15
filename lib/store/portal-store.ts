import { create } from "zustand"
import { devtools } from "zustand/middleware"

interface User {
  id: string
  name: string
  email: string
  role: "citizen" | "admin" | "analyst"
  location?: { lat: number; lng: number }
  isActive: boolean
}

interface Report {
  id: string
  userId: string
  type: string
  severity: "low" | "medium" | "high" | "critical"
  location: { lat: number; lng: number }
  description: string
  media: string[]
  status: "pending" | "verified" | "rejected"
  timestamp: string
  confidence?: number
}

interface Zone {
  id: string
  type: "danger" | "safe"
  name: string
  coordinates: Array<[number, number]>
  capacity?: number
  currentOccupancy?: number
  instructions?: string
  isActive: boolean
}

interface PortalState {
  // User state
  currentUser: User | null
  users: User[]

  // Reports state
  reports: Report[]
  pendingReports: Report[]

  // Zones state
  zones: Zone[]

  // UI state
  activePortal: "citizen" | "admin" | "analyst"
  isLoading: boolean

  // Actions
  setCurrentUser: (user: User | null) => void
  setActivePortal: (portal: "citizen" | "admin" | "analyst") => void
  addReport: (report: Omit<Report, "id" | "timestamp">) => void
  updateReport: (id: string, updates: Partial<Report>) => void
  addZone: (zone: Omit<Zone, "id">) => void
  updateZone: (id: string, updates: Partial<Zone>) => void
  updateUserLocation: (userId: string, location: { lat: number; lng: number }) => void
  setLoading: (loading: boolean) => void
}

export const usePortalStore = create<PortalState>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentUser: null,
      users: [
        {
          id: "1",
          name: "John Citizen",
          email: "john@example.com",
          role: "citizen",
          location: { lat: 19.076, lng: 72.8777 },
          isActive: true,
        },
        {
          id: "2",
          name: "Admin User",
          email: "admin@atlas-alert.com",
          role: "admin",
          isActive: true,
        },
        {
          id: "3",
          name: "Data Analyst",
          email: "analyst@atlas-alert.com",
          role: "analyst",
          isActive: true,
        },
      ],
      reports: [],
      pendingReports: [],
      zones: [
        {
          id: "1",
          type: "danger",
          name: "Flood Zone - Marine Drive",
          coordinates: [
            [19.075, 72.8767],
            [19.077, 72.8767],
            [19.077, 72.8787],
            [19.075, 72.8787],
          ],
          instructions: "Avoid this area due to severe flooding",
          isActive: true,
        },
        {
          id: "2",
          type: "safe",
          name: "Emergency Shelter - Community Center",
          coordinates: [
            [19.089, 72.865],
            [19.09, 72.865],
            [19.09, 72.866],
            [19.089, 72.866],
          ],
          capacity: 500,
          currentOccupancy: 127,
          instructions: "Emergency shelter with medical facilities",
          isActive: true,
        },
      ],
      activePortal: "citizen",
      isLoading: false,

      // Actions
      setCurrentUser: (user) => set({ currentUser: user }),

      setActivePortal: (portal) => set({ activePortal: portal }),

      addReport: (reportData) => {
        const newReport: Report = {
          ...reportData,
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
        }
        set((state) => ({
          reports: [...state.reports, newReport],
          pendingReports: [...state.pendingReports, newReport],
        }))
      },

      updateReport: (id, updates) =>
        set((state) => ({
          reports: state.reports.map((report) => (report.id === id ? { ...report, ...updates } : report)),
          pendingReports: state.pendingReports.map((report) => (report.id === id ? { ...report, ...updates } : report)),
        })),

      addZone: (zoneData) => {
        const newZone: Zone = {
          ...zoneData,
          id: Date.now().toString(),
        }
        set((state) => ({ zones: [...state.zones, newZone] }))
      },

      updateZone: (id, updates) =>
        set((state) => ({
          zones: state.zones.map((zone) => (zone.id === id ? { ...zone, ...updates } : zone)),
        })),

      updateUserLocation: (userId, location) =>
        set((state) => ({
          users: state.users.map((user) => (user.id === userId ? { ...user, location } : user)),
        })),

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "atlas-alert-store",
    },
  ),
)
