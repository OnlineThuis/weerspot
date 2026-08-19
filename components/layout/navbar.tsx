"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, FileText, Shield, Database, Cookie, Copyright, ArrowRight, Search, Wifi, Clock, Menu as MenuIcon, X, Bell, Bookmark, User } from "lucide-react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { useWeatherStore } from "@/store/useWeatherStore";
import { fetchLiveWeather } from "@/lib/api/weather";

interface NavbarProps {
  currentLang: string;
  dictionary: {
    termsOfService: string;
    privacyPolicy: string;
    dataSources: string;
    cookiePolicy: string;
    copyrightPolicy: string;
    reportIssue: string;
    goPremium: string;
    searchPlaceholder?: string;
  };
}

interface GeocodeSuggestion {
  id: string;
  description: string;
  mainText: string;
  secondaryText: string;
  lat?: number;
  lng?: number;
  source: "google" | "openmeteo";
}

export default function Navbar({ currentLang, dictionary }: NavbarProps) {
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [manualSuggestions, setManualSuggestions] = useState<GeocodeSuggestion[]>([]);
  const [isManualSearchLoading, setIsManualSearchLoading] = useState(false);
  
  const { setLocation, setWeatherData, setLoading, setError } = useWeatherStore();

  const {
    ready,
    value,
    suggestions: { data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
    },
    debounce: 300,
  });

  const hasGooglePlacesKey = Boolean(process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY);
  const shouldUseGooglePlaces = hasGooglePlacesKey && ready;

  useEffect(() => {
    const query = value.trim();
    if (shouldUseGooglePlaces || query.length < 3) {
      setManualSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        setIsManualSearchLoading(true);
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          setManualSuggestions([]);
          return;
        }

        const payload = await response.json();
        const formatted: GeocodeSuggestion[] = (payload?.results || []).map((result: any) => ({
          id: String(result.id),
          description: `${result.name}, ${result.admin1 ? `${result.admin1}, ` : ""}${result.country}`,
          mainText: result.name,
          secondaryText: `${result.admin1 ? `${result.admin1}, ` : ""}${result.country}`,
          lat: result.latitude,
          lng: result.longitude,
          source: "openmeteo",
        }));
        setManualSuggestions(formatted);
      } catch {
        setManualSuggestions([]);
      } finally {
        setIsManualSearchLoading(false);
      }
    }, 280);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [value, shouldUseGooglePlaces]);

  const placeSuggestions: GeocodeSuggestion[] = shouldUseGooglePlaces
    ? data.map((suggestion) => ({
        id: suggestion.place_id,
        description: suggestion.description,
        mainText: suggestion.structured_formatting.main_text,
        secondaryText: suggestion.structured_formatting.secondary_text,
        source: "google",
      }))
    : manualSuggestions;

  const handleSelect =
    (suggestion: GeocodeSuggestion) =>
    async () => {
      setValue(suggestion.description, false);
      clearSuggestions();
      setManualSuggestions([]);
      setLoading(true);

      try {
        let lat = suggestion.lat;
        let lng = suggestion.lng;
        if (suggestion.source === "google" || lat === undefined || lng === undefined) {
          const results = await getGeocode({ address: suggestion.description });
          const coords = await getLatLng(results[0]);
          lat = coords.lat;
          lng = coords.lng;
        }
        if (lat === undefined || lng === undefined) {
          throw new Error("No coordinates found for selected place");
        }
        
        setLocation(lat, lng, suggestion.mainText);
        
        const { weather, uvIndex } = await fetchLiveWeather(lat, lng);
        setWeatherData(weather, uvIndex);
      } catch (error) {
        console.error("Error: ", error);
        setError("Could not find location data.");
      }
    };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <nav className="flex items-center justify-between px-4 lg:px-6 py-3 w-full max-w-[1400px] mx-auto relative">
        
        <div className="flex items-center gap-4 lg:gap-8">
          <Link href={`/${currentLang}`} className="flex items-center shrink-0">
            <Image src="/weerspot.svg" alt="WeetSpot Logo" width={140} height={36} className="h-6 lg:h-7 w-auto" priority />
          </Link>

          <div className="relative hidden md:block">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-gray-400 absolute left-3" />
              <input 
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={!ready}
                placeholder={dictionary?.searchPlaceholder || "Search locations..."}
                className="pl-10 pr-4 py-2 bg-white focus:outline-none rounded-lg w-[280px] text-sm transition-all border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-gray-300 focus:border-[#0070f3] focus:ring-4 focus:ring-[#0070f3]/10"
              />
            </div>

            {/* Desktop Search Autocomplete Dropdown */}
            {placeSuggestions.length > 0 && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-2 w-[340px] z-50">
                <ul className="space-y-1">
                  {placeSuggestions.map((suggestion) => {
                    return (
                      <li
                        key={suggestion.id}
                        onClick={handleSelect(suggestion)}
                        className="w-full flex flex-col px-3 py-2 hover:bg-blue-50 rounded-lg text-left cursor-pointer transition-colors"
                      >
                        <span className="text-sm font-semibold text-gray-800">{suggestion.mainText}</span>
                        <span className="text-[11px] text-gray-500">{suggestion.secondaryText}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            {!shouldUseGooglePlaces && isManualSearchLoading && value.trim().length >= 3 && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 px-3 py-2 w-[340px] z-50 text-xs text-gray-500">
                Searching locations...
              </div>
            )}
          </div>

          {/* User Icons (Near Searchbar) */}
          <div className="hidden md:flex items-center gap-1 border-l border-gray-200 pl-2 md:pl-4 ml-1 md:ml-2">
            <button className="p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors relative" title="Saved Locations">
              <Bookmark className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors relative" title="Notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors relative" title="Profile">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Side: Desktop Links */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="relative" onMouseEnter={() => setIsLegalOpen(true)} onMouseLeave={() => setIsLegalOpen(false)}>
            <button className="flex items-center gap-1.5 text-[15px] font-medium text-gray-600 hover:text-gray-900 transition-colors py-2">
              Legal & Data
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isLegalOpen ? 'rotate-180' : ''}`} />
            </button>
            {/* Desktop Mega Menu Dropdown */}
            {isLegalOpen && (
              <div className="absolute top-full right-0 pt-4 cursor-default">
                <div className="bg-white rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 p-6 w-[800px] flex gap-8">
                  <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-6">
                      <Link href={`/${currentLang}/terms`} className="group flex gap-4 items-start" onClick={() => setIsLegalOpen(false)}>
                        <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors"><FileText className="w-5 h-5" /></div>
                        <div><div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{dictionary.termsOfService}</div><div className="text-sm text-gray-500 mt-1 leading-snug">Rules and guidelines for using WeetSpot.</div></div>
                      </Link>
                      <Link href={`/${currentLang}/privacy`} className="group flex gap-4 items-start" onClick={() => setIsLegalOpen(false)}>
                        <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors"><Shield className="w-5 h-5" /></div>
                        <div><div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{dictionary.privacyPolicy}</div><div className="text-sm text-gray-500 mt-1 leading-snug">How we collect and protect your data.</div></div>
                      </Link>
                    </div>
                    <div className="space-y-6">
                      <Link href={`/${currentLang}/data-sources`} className="group flex gap-4 items-start" onClick={() => setIsLegalOpen(false)}>
                        <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors"><Database className="w-5 h-5" /></div>
                        <div><div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{dictionary.dataSources}</div><div className="text-sm text-gray-500 mt-1 leading-snug">Where our weather data comes from.</div></div>
                      </Link>
                      <Link href={`/${currentLang}/cookies`} className="group flex gap-4 items-start" onClick={() => setIsLegalOpen(false)}>
                        <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors"><Cookie className="w-5 h-5" /></div>
                        <div><div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{dictionary.cookiePolicy}</div><div className="text-sm text-gray-500 mt-1 leading-snug">Information about our use of cookies.</div></div>
                      </Link>
                    </div>
                  </div>
                  <div className="w-[280px] bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Data Transparency</div>
                      <h3 className="font-bold text-gray-900 mb-2 text-lg">Real-Time Accuracy</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">We process millions of data points every hour to bring you the most accurate hyper-local forecasting possible.</p>
                    </div>
                    <Link href={`/${currentLang}/data-sources`} className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 mt-6" onClick={() => setIsLegalOpen(false)}>Explore the details <ArrowRight className="w-4 h-4" /></Link>
                  </div>
                </div>
              </div>
            )}
          </div>
          <Link href={`/${currentLang}/report-issue`} className="text-[15px] font-medium text-gray-600 hover:text-gray-900 transition-colors py-2">{dictionary.reportIssue}</Link>
          <Link href={`/${currentLang}/premium`} className="bg-[#0070f3] hover:bg-[#005bb5] text-white font-medium py-2 px-5 rounded-full shadow-sm transition-colors text-[15px] shrink-0">{dictionary.goPremium}</Link>
        </div>

        {/* Mobile Right Side: Icons + Hamburger */}
        <div className="flex md:hidden items-center gap-1">
          <button className="p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors relative" title="Saved Locations">
            <Bookmark className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors relative" title="Notifications">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors relative" title="Profile">
            <User className="w-5 h-5" />
          </button>
          
          <button 
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-md ml-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-xl p-4 flex flex-col gap-6 h-screen overflow-y-auto pb-24">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-gray-400 absolute left-4" />
            <input type="text" placeholder="Search locations..." className="pl-12 pr-4 py-3 bg-gray-50 focus:bg-white rounded-xl w-full text-base border border-gray-200 focus:border-[#0070f3] focus:ring-4 focus:ring-[#0070f3]/10 transition-all outline-none" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Navigation</div>
            <Link href={`/${currentLang}/premium`} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between p-4 bg-[#0070f3] text-white rounded-xl font-semibold mb-2">
              {dictionary.goPremium}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href={`/${currentLang}/report-issue`} onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 rounded-xl">{dictionary.reportIssue}</Link>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Legal & Policies</div>
            <Link href={`/${currentLang}/terms`} onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl flex items-center gap-3"><FileText className="w-5 h-5 text-gray-400" /> {dictionary.termsOfService}</Link>
            <Link href={`/${currentLang}/privacy`} onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl flex items-center gap-3"><Shield className="w-5 h-5 text-gray-400" /> {dictionary.privacyPolicy}</Link>
            <Link href={`/${currentLang}/data-sources`} onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl flex items-center gap-3"><Database className="w-5 h-5 text-gray-400" /> {dictionary.dataSources}</Link>
            <Link href={`/${currentLang}/cookies`} onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl flex items-center gap-3"><Cookie className="w-5 h-5 text-gray-400" /> {dictionary.cookiePolicy}</Link>
            <Link href={`/${currentLang}/copyright`} onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl flex items-center gap-3"><Copyright className="w-5 h-5 text-gray-400" /> {dictionary.copyrightPolicy}</Link>
          </div>
        </div>
      )}
    </div>
  );
}
