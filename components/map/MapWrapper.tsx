"use client";

import dynamic from "next/dynamic";

// Leaflet relies on the browser's `window` object to render maps.
// Next.js Server-Side Rendering (SSR) does not have a `window` object.
// We use Next.js dynamic imports with { ssr: false } to ensure the map 
// only loads on the client side, preventing hydration errors.
const MapWrapperComponent = dynamic(() => import("./WeatherMap"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#121212] flex items-center justify-center">
      <div className="text-gray-500 text-sm font-medium tracking-wide animate-pulse">
        Loading Weather Radar...
      </div>
    </div>
  )
});

export default function MapWrapper({ lang }: { lang: string }) {
  return <MapWrapperComponent lang={lang} />;
}
