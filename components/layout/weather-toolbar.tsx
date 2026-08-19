"use client";

import { useState, useEffect } from "react";
import { 
  MousePointer2, 
  Droplets, 
  Wind, 
  Thermometer, 
  CloudRain,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  Layers,
  Share,
  Code,
  ChevronDown,
  Menu
} from "lucide-react";

export default function WeatherToolbar() {
  const [activeTool, setActiveTool] = useState("cursor");
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  
  // Mock Time State
  const [timeHour, setTimeHour] = useState(14);
  const [timeMin, setTimeMin] = useState(0);

  // Playback Simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeMin((prev) => {
          if (prev === 45) {
            setTimeHour((h) => (h === 23 ? 0 : h + 1));
            return 0;
          }
          return prev + 15;
        });
      }, 500); // Ticks every 500ms
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleZoomIn = () => setZoomLevel(z => Math.min(z + 10, 200));
  const handleZoomOut = () => setZoomLevel(z => Math.max(z - 10, 10));

  // Format time (e.g. 14:00)
  const formattedTime = `Today, ${timeHour.toString().padStart(2, '0')}:${timeMin.toString().padStart(2, '0')}`;

  const ToolButton = ({ id, icon: Icon, label, isActive, onClick, hasDropdown = false }: any) => (
    <button 
      onClick={() => onClick(id)}
      className={`shrink-0 h-8 px-2.5 rounded-md flex items-center justify-center gap-1.5 transition-all duration-200 ${
        isActive 
          ? 'bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-500/20' 
          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
      }`}
      title={label}
    >
      <Icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2.5 : 2} />
      {hasDropdown && <ChevronDown className={`w-3.5 h-3.5 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />}
    </button>
  );

  return (
    <div className="fixed top-[61px] left-0 right-0 z-40 h-12 bg-white border-b border-gray-200 flex items-center px-2 lg:px-4 text-sm select-none overflow-hidden">
      
      {/* Scrollable Container for Mobile */}
      <div className="flex-1 flex items-center overflow-x-auto no-scrollbar gap-1 py-2">
        
        {/* Left Group: Tools */}
        <div className="flex items-center gap-1 shrink-0">
          <button className="h-8 w-8 shrink-0 rounded-md flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 mr-1 transition-colors">
            <Menu className="w-5 h-5" />
          </button>

          <ToolButton id="cursor" icon={MousePointer2} label="Select" isActive={activeTool === "cursor"} onClick={setActiveTool} hasDropdown />
          <div className="w-[1px] h-5 bg-gray-200 mx-1 shrink-0"></div>
          
          <ToolButton id="radar" icon={Droplets} label="Radar Layer" isActive={activeTool === "radar"} onClick={setActiveTool} />
          <ToolButton id="wind" icon={Wind} label="Wind Layer" isActive={activeTool === "wind"} onClick={setActiveTool} />
          <ToolButton id="temp" icon={Thermometer} label="Temperature Layer" isActive={activeTool === "temp"} onClick={setActiveTool} />
          <ToolButton id="clouds" icon={CloudRain} label="Cloud Cover" isActive={activeTool === "clouds"} onClick={setActiveTool} hasDropdown />
          
          <div className="w-[1px] h-5 bg-gray-200 mx-1 shrink-0"></div>
          
          <button className="shrink-0 h-8 px-2.5 rounded-md flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors">
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 11V6a2 2 0 0 0-4 0v4 M14 11V4a2 2 0 0 0-4 0v6 M10 11V3a2 2 0 0 0-4 0v11 M6 14v-2a2 2 0 0 0-4 0v5a8 8 0 0 0 16 0v-4a2 2 0 0 0-4 0v-2" />
            </svg>
          </button>
        </div>

        {/* Separator for desktop centering */}
        <div className="hidden lg:block flex-1"></div>

        {/* Middle Group: Playback Controls */}
        <div className="flex items-center shrink-0 ml-4 lg:ml-0">
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-0.5 shadow-sm">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className={`h-8 px-3 rounded-md text-gray-600 hover:text-gray-900 hover:bg-white flex items-center gap-1.5 transition-all ${isPlaying ? 'bg-white shadow-sm text-blue-600' : ''}`}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
            <div className="w-[1px] h-4 bg-gray-200 mx-1"></div>
            <button className="h-8 px-4 rounded-md text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm flex items-center gap-2 transition-all min-w-[120px] justify-center">
              <span className="text-[13px] font-semibold tracking-wide tabular-nums">{formattedTime}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="hidden lg:block flex-1"></div>

        {/* Right Group: View & Settings */}
        <div className="flex items-center gap-1 shrink-0 ml-4 lg:ml-0">
          {/* Zoom Controls */}
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-0.5 shadow-sm mr-2">
            <button onClick={handleZoomOut} className="h-8 w-8 rounded-md flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-white hover:shadow-sm transition-all active:scale-95">
              <ZoomOut className="w-[18px] h-[18px]" />
            </button>
            <span className="text-gray-600 text-[12px] px-2 font-semibold select-text cursor-text w-[46px] text-center tabular-nums">{zoomLevel}%</span>
            <button onClick={handleZoomIn} className="h-8 w-8 rounded-md flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-white hover:shadow-sm transition-all active:scale-95">
              <ZoomIn className="w-[18px] h-[18px]" />
            </button>
          </div>

          <button className="shrink-0 h-8 w-8 rounded-md flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors mr-2">
            <Layers className="w-[18px] h-[18px]" />
          </button>

          <button className="shrink-0 h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-[13px] font-semibold transition-all shadow-sm tracking-wide flex items-center gap-1.5 active:scale-95">
            <Share className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>
          
          <button className="shrink-0 h-8 w-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
            <Code className="w-[18px] h-[18px]" />
          </button>
        </div>

      </div>
    </div>
  );
}
