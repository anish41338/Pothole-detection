"use client"

import { useState, useCallback, useEffect } from "react"
import { GoogleMap, useJsApiLoader, HeatmapLayer } from "@react-google-maps/api"
import { Loader2, AlertTriangle } from "lucide-react"
import type { Pothole } from "@/types/pothole"

interface PotholeHeatmapProps {
  potholes: Pothole[]
}

const containerStyle = {
  width: "100%",
  height: "70vh",
}

// Default center (will be updated based on pothole data)
const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629, // Default to center of India
}

export default function PotholeHeatmap({ potholes }: PotholeHeatmapProps) {
  const [center, setCenter] = useState(defaultCenter)
  const [heatmapData, setHeatmapData] = useState<any[]>([])
  const [mapError, setMapError] = useState<string | null>(null)

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["visualization"],
  })

  const [map, setMap] = useState<any>(null)

  const onLoad = useCallback(function callback(map: any) {
    setMap(map)
  }, [])

  const onUnmount = useCallback(function callback() {
    setMap(null)
  }, [])

  useEffect(() => {
    if (isLoaded && potholes.length > 0) {
      try {
        // Calculate center based on average of all pothole coordinates
        const totalLat = potholes.reduce((sum, pothole) => sum + pothole.latitude, 0)
        const totalLng = potholes.reduce((sum, pothole) => sum + pothole.longitude, 0)

        setCenter({
          lat: totalLat / potholes.length,
          lng: totalLng / potholes.length,
        })

        // Create heatmap data points
        if (window.google && window.google.maps) {
          const heatmapPoints = potholes.map(
            (pothole) => new window.google.maps.LatLng(pothole.latitude, pothole.longitude),
          )
          setHeatmapData(heatmapPoints)
        }
      } catch (err) {
        console.error("Error setting up map data:", err)
        setMapError("Failed to initialize map data")
      }
    }
  }, [potholes, isLoaded])

  // Handle Google Maps API loading error
  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] bg-red-50 p-6 rounded-xl border border-red-200">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-xl font-medium text-red-700 mb-2">Google Maps API Error</h3>
        <p className="text-red-600 mb-4 text-center max-w-md">
          There was an error loading the Google Maps API. This could be due to:
        </p>
        <ul className="text-red-600 text-sm list-disc pl-6 mb-4 max-w-md">
          <li>Invalid API key</li>
          <li>Maps JavaScript API not enabled for your API key</li>
          <li>API key restrictions (domain, IP, etc.)</li>
          <li>Billing not enabled on your Google Cloud project</li>
        </ul>
        <p className="text-red-600 text-sm text-center max-w-md">
          Please check your Google Maps API key configuration in the Google Cloud Console.
        </p>
        <a
          href="https://developers.google.com/maps/documentation/javascript/error-messages#api-project-map-error"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          View Google Maps Documentation
        </a>
      </div>
    )
  }

  if (mapError) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] bg-red-50 p-6 rounded-xl border border-red-200">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <div className="text-xl font-medium text-red-700 mb-2">{mapError}</div>
        <p className="text-red-600 text-center">There was an error initializing the map. Please try again later.</p>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] bg-slate-50 rounded-xl border border-slate-100">
        <Loader2 className="h-12 w-12 text-teal-500 animate-spin mb-4" />
        <div className="text-xl font-medium text-slate-700">Loading Google Maps...</div>
      </div>
    )
  }

  // Create a fallback component if Google Maps isn't available
  if (!window.google || !window.google.maps) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] bg-yellow-50 p-6 rounded-xl border border-yellow-200">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
        <div className="text-xl font-medium text-yellow-700 mb-2">Google Maps Not Available</div>
        <p className="text-yellow-600 text-center max-w-md">
          Google Maps API could not be initialized. Please check your browser console for more details.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full rounded-xl overflow-hidden shadow-sm border border-slate-100">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          styles: [
            {
              featureType: "all",
              elementType: "geometry",
              stylers: [{ color: "#f5f5f5" }],
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#c9c9c9" }],
            },
            {
              featureType: "water",
              elementType: "labels.text.fill",
              stylers: [{ color: "#9e9e9e" }],
            },
          ],
        }}
      >
        {heatmapData.length > 0 && (
          <HeatmapLayer
            options={{
              radius: 20,
              opacity: 0.7,
              gradient: [
                "rgba(0, 255, 255, 0)",
                "rgba(0, 255, 255, 1)",
                "rgba(0, 191, 255, 1)",
                "rgba(0, 127, 255, 1)",
                "rgba(0, 63, 255, 1)",
                "rgba(0, 0, 255, 1)",
                "rgba(0, 0, 223, 1)",
                "rgba(0, 0, 191, 1)",
                "rgba(0, 0, 159, 1)",
                "rgba(0, 0, 127, 1)",
                "rgba(63, 0, 91, 1)",
                "rgba(127, 0, 63, 1)",
                "rgba(191, 0, 31, 1)",
                "rgba(255, 0, 0, 1)",
              ],
            }}
            data={heatmapData}
          />
        )}
      </GoogleMap>
    </div>
  )
}
