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

  // Actions
  setLocation: (lat: number, lng: number, city: string) => void;
  setWeatherData: (weather: WeatherData, uvIndex: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
}

export const useWeatherStore = create<WeatherStore>((set) => ({
  lat: null,
  lng: null,
  cityName: null,
  weather: null,
  uvIndex: null,
  isLoading: false,
  error: null,

  setLocation: (lat, lng, cityName) => set({ lat, lng, cityName }),
  setWeatherData: (weather, uvIndex) => set({ weather, uvIndex, isLoading: false, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false })
}));
