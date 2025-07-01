"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { MapPin, AlertTriangle, Loader2, List, Map } from "lucide-react"
import PotholeCard from "./pothole-card"
import PotholeHeatmap from "./pothole-heatmap"
import MapFallback from "./map-fallback"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import type { Pothole } from "@/types/pothole"

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

export default function PotholeDetectionDashboard() {
  const [potholes, setPotholes] = useState<Pothole[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("list")
  const [mapsAvailable, setMapsAvailable] = useState(true)

  useEffect(() => {
    fetchPotholes()

    // Check if Google Maps API key is available
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      setMapsAvailable(false)
    }
  }, [])

  async function fetchPotholes() {
    try {
      setLoading(true)

      const { data, error } = await supabase.from("potholes").select("*")

      if (error) throw error

      setPotholes(data || [])
    } catch (err) {
      console.error("Error fetching potholes:", err)
      setError("Failed to load pothole data")
    } finally {
      setLoading(false)
    }
  }

  function getGoogleMapsLink(lat: number, lng: number) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
        <Loader2 className="h-12 w-12 text-teal-500 animate-spin mb-4" />
        <div className="text-xl font-medium text-slate-700">Loading pothole data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-6">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <div className="text-xl font-medium text-red-700">{error}</div>
        <button
          onClick={fetchPotholes}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <header className="max-w-7xl mx-auto mb-6 text-center md:text-left">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Pothole Detection System</h1>
        <p className="text-slate-600 mb-6">Monitoring and tracking road infrastructure issues</p>

        <Tabs defaultValue="list" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto md:mx-0 grid-cols-2">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              <span>List View</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              <span>Map View</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-6">
            {potholes.length === 0 ? (
              <div className="max-w-7xl mx-auto text-center py-16 px-4">
                <MapPin className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h2 className="text-2xl font-medium text-slate-700 mb-2">No pothole data available</h2>
                <p className="text-slate-500 max-w-md mx-auto">
                  There are currently no potholes recorded in the database. New detections will appear here.
                </p>
              </div>
            ) : (
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {potholes.map((pothole) => (
                  <PotholeCard
                    key={pothole.id}
                    pothole={pothole}
                    getGoogleMapsLink={getGoogleMapsLink}
                    supabase={supabase}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="map" className="mt-6">
            <div className="max-w-7xl mx-auto">
              {potholes.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <MapPin className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-medium text-slate-700 mb-2">No pothole data available</h2>
                  <p className="text-slate-500 max-w-md mx-auto">
                    There are currently no potholes recorded in the database to display on the map.
                  </p>
                </div>
              ) : mapsAvailable ? (
                <PotholeHeatmap potholes={potholes} />
              ) : (
                <div className="space-y-6">
                  <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                    <h3 className="flex items-center text-lg font-medium text-yellow-800 mb-2">
                      <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
                      Google Maps API Key Issue
                    </h3>
                    <p className="text-yellow-700 mb-4">
                      The Google Maps API key appears to be missing or invalid. Please check your environment variables
                      and Google Cloud Console settings.
                    </p>
                    <div className="bg-yellow-100 p-4 rounded-md text-sm text-yellow-800">
                      <p className="font-medium mb-2">To fix this issue:</p>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>Ensure you have a valid Google Maps API key</li>
                        <li>Enable the Maps JavaScript API and Visualization API in your Google Cloud Console</li>
                        <li>Check for any API key restrictions (domain, IP, etc.)</li>
                        <li>Make sure billing is enabled on your Google Cloud project</li>
                      </ol>
                    </div>
                  </div>
                  <MapFallback potholes={potholes} />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </header>
    </div>
  )
}
