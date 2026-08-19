import { create } from "zustand";

interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  windSpeed: number;
  humidity: number;
}

interface WeatherStore {
  // Map location
  lat: number | null;
  lng: number | null;
  cityName: string | null;
  
  // Data
  weather: WeatherData | null;
  uvIndex: number | null;
  isLoading: boolean;
  error: string | null;
  activeLayer: "radar" | "wind" | "temp" | "clouds";
  isPlaying: boolean;
  timeHour: number;
  timeMin: number;
  zoomLevel: number;

  // Actions
  setLocation: (lat: number, lng: number, city: string) => void;
  setWeatherData: (weather: WeatherData, uvIndex: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  setActiveLayer: (layer: "radar" | "wind" | "temp" | "clouds") => void;
  setIsPlaying: (isPlaying: boolean) => void;
  tickPlayback: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
}

export const useWeatherStore = create<WeatherStore>((set) => ({
  lat: null,
  lng: null,
  cityName: null,
  weather: null,
  uvIndex: null,
  isLoading: false,
  error: null,
  activeLayer: "radar",
  isPlaying: false,
  timeHour: 14,
  timeMin: 0,
  zoomLevel: 100,

  setLocation: (lat, lng, cityName) => set({ lat, lng, cityName }),
  setWeatherData: (weather, uvIndex) => set({ weather, uvIndex, isLoading: false, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  setActiveLayer: (activeLayer) => set({ activeLayer }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  tickPlayback: () =>
    set((state) => {
      const nextMinute = state.timeMin === 45 ? 0 : state.timeMin + 15;
      const nextHour = state.timeMin === 45 ? (state.timeHour === 23 ? 0 : state.timeHour + 1) : state.timeHour;
      return { timeMin: nextMinute, timeHour: nextHour };
    }),
  zoomIn: () => set((state) => ({ zoomLevel: Math.min(state.zoomLevel + 10, 200) })),
  zoomOut: () => set((state) => ({ zoomLevel: Math.max(state.zoomLevel - 10, 10) })),
}));
