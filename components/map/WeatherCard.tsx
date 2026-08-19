"use client";

import { useWeatherStore } from "@/store/useWeatherStore";
import { CloudRain, Wind, Thermometer, Sun } from "lucide-react";

export default function WeatherCard() {
  const { cityName, weather, uvIndex, isLoading, error } = useWeatherStore();

  if (!cityName && !isLoading) return null;

  return (
    <div className="absolute top-4 left-4 z-[400] w-72 bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl overflow-hidden text-gray-800">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 text-white flex justify-between items-center">
        <h2 className="text-lg font-bold tracking-tight truncate pr-2">
          {cityName || "Loading..."}
        </h2>
        {weather?.icon && (
          <img 
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} 
            alt="Weather Icon" 
            className="w-12 h-12 -my-2 drop-shadow-md"
          />
        )}
      </div>

      <div className="p-4 flex flex-col gap-3">
        {isLoading ? (
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-3 py-1">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        ) : error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : weather ? (
          <>
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-gray-500">Temperature</span>
              </div>
              <span className="font-semibold">{weather.temp}°C</span>
            </div>
            
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <div className="flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-500">Humidity</span>
              </div>
              <span className="font-semibold">{weather.humidity}%</span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-teal-500" />
                <span className="text-sm text-gray-500">Wind Speed</span>
              </div>
              <span className="font-semibold">{weather.windSpeed} m/s</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-500">UV Index</span>
              </div>
              <span className={`font-semibold ${uvIndex && uvIndex > 5 ? 'text-red-500' : 'text-green-500'}`}>
                {uvIndex !== null ? uvIndex : "N/A"}
              </span>
            </div>
            <div className="text-[10px] text-gray-400 mt-1 capitalize text-right">
              {weather.description}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
