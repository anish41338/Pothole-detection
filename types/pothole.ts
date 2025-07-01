export interface Pothole {
  id: number
  image_path: string
  count: number
  latitude: number
  longitude: number
  created_at?: string
}

// Add window augmentation for Google Maps
declare global {
  interface Window {
    google?: any
  }
}
