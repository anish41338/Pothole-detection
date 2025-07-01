"use client"

import { MapPin } from "lucide-react"
import type { Pothole } from "@/types/pothole"
import Image from "next/image"
import type { SupabaseClient } from "@supabase/supabase-js"

interface PotholeCardProps {
  pothole: Pothole
  getGoogleMapsLink: (lat: number, lng: number) => string
  supabase: SupabaseClient
}

export default function PotholeCard({ pothole, getGoogleMapsLink, supabase }: PotholeCardProps) {

  const { data } = supabase
    .storage
    .from('images')
    .getPublicUrl(pothole.image_path)

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow duration-300 border border-slate-100">
      <div className="relative h-56 bg-slate-200">
        {pothole.image_path ? (
          <div className="relative w-full h-full">
            <Image
              src={data["publicUrl"] || "/placeholder.svg"}
              alt={`Pothole ID: ${pothole.id}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <span className="text-sm">No image available</span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-teal-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
          {pothole.count} {pothole.count === 1 ? "pothole" : "potholes"}
        </div>
      </div>

      <div className="p-5 flex-grow">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-slate-500">ID: {pothole.id}</span>
        </div>

        <div className="space-y-3 text-sm text-slate-700">
          <div className="flex items-start">
            <span className="font-medium mr-2">Coordinates:</span>
            <span className="font-mono">
              {pothole.latitude.toFixed(6)}, {pothole.longitude.toFixed(6)}
            </span>
          </div>

          <a
            href={getGoogleMapsLink(pothole.latitude, pothole.longitude)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-teal-600 hover:text-teal-700 transition-colors"
          >
            <MapPin className="w-4 h-4 mr-1" />
            View on Google Maps
          </a>
        </div>
      </div>

      <div className="p-5 pt-0">
        <a
          href={getGoogleMapsLink(pothole.latitude, pothole.longitude)}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2.5 px-4 rounded-lg flex items-center justify-center transition-colors duration-300 font-medium"
        >
          <MapPin className="w-4 h-4 mr-2" />
          Navigate to Location
        </a>
      </div>
    </div>
  )
}
