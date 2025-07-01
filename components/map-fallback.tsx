"use client"

import { MapPin } from "lucide-react"
import type { Pothole } from "@/types/pothole"

interface MapFallbackProps {
  potholes: Pothole[]
}

export default function MapFallback({ potholes }: MapFallbackProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100 p-6">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">Pothole Locations</h2>
      <p className="text-slate-600 mb-6">
        Map view is currently unavailable. Here are the coordinates of detected potholes:
      </p>

      <div className="max-h-[60vh] overflow-y-auto pr-2">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-2 px-4 font-medium text-slate-600">ID</th>
              <th className="text-left py-2 px-4 font-medium text-slate-600">Latitude</th>
              <th className="text-left py-2 px-4 font-medium text-slate-600">Longitude</th>
              <th className="text-left py-2 px-4 font-medium text-slate-600">Count</th>
              <th className="text-left py-2 px-4 font-medium text-slate-600">Location</th>
            </tr>
          </thead>
          <tbody>
            {potholes.map((pothole) => (
              <tr key={pothole.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 text-slate-800">{pothole.id}</td>
                <td className="py-3 px-4 text-slate-800 font-mono">{pothole.latitude.toFixed(6)}</td>
                <td className="py-3 px-4 text-slate-800 font-mono">{pothole.longitude.toFixed(6)}</td>
                <td className="py-3 px-4 text-slate-800">{pothole.count}</td>
                <td className="py-3 px-4">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${pothole.latitude},${pothole.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-teal-600 hover:text-teal-700 transition-colors"
                  >
                    <MapPin className="w-4 h-4 mr-1" />
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
