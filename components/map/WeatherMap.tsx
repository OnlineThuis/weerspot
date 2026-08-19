"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useWeatherStore } from "@/store/useWeatherStore";
import WeatherCard from "./WeatherCard";

// This is required to make Leaflet play nicely with Next.js Server Side Rendering 
// even when dynamically imported
import L from "leaflet";
delete (L.Icon.Default.prototype as any)._getIconUrl;

// Map Updater component to fly to new locations
function MapFlyTo() {
  const { lat, lng } = useWeatherStore();
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 10, { duration: 1.5 });
    }
  }, [lat, lng, map]);
  return null;
}

export default function WeatherMap({ lang }: { lang: string }) {
  // Determine initial center and zoom based on the current language/region
  let initialCenter: [number, number] = [52.1326, 5.2913]; // Default: Netherlands
  let initialZoom = 7;

  if (lang === "fr") {
    initialCenter = [46.2276, 2.2137]; // France
    initialZoom = 6;
  } else if (lang === "en") {
    initialCenter = [52.3555, -1.1743]; // United Kingdom
    initialZoom = 6;
  } 
  
  return (
    <div className="w-full h-full relative z-0">
      <WeatherCard />
      
      <MapContainer 
        center={initialCenter} 
        zoom={initialZoom} 
        zoomControl={false} // Disabled because we built our own Zoom buttons in the toolbar!
        className="w-full h-full absolute inset-0 bg-[#f8f9fa]"
        attributionControl={false}
      >
        <MapFlyTo />

        {/* Stadia Maps Alidade Smooth - Beautiful, clean light styling */}
        <TileLayer
          url={`https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png${process.env.NEXT_PUBLIC_STADIA_API_KEY ? `?api_key=${process.env.NEXT_PUBLIC_STADIA_API_KEY}` : ''}`}
        />

        {/* OpenWeather Precipitation Radar Overlay */}
        <TileLayer
          url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || 'demo'}`}
          opacity={0.6}
        />
        
      </MapContainer>
      
      {/* Custom Attribution */}
      <div className="absolute bottom-2 right-2 text-[10px] text-gray-500 bg-black/40 px-2 py-1 rounded backdrop-blur-sm z-[400] select-none">
        &copy; OpenStreetMap contributors &copy; CARTO
      </div>
    </div>
  );
}
