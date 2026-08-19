import Link from "next/link";
import { X, Check } from "lucide-react";

export default function PremiumPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-8 pb-16 px-4">
      {/* Top Bar */}
      <div className="w-full max-w-md flex justify-between items-center mb-12">
        <div className="w-8"></div> {/* Spacer to center the text */}
        <span className="font-semibold text-gray-900 tracking-wide text-sm">Ends in 48h</span>
        <Link href="/" className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
          <X className="w-4 h-4 text-gray-600" />
        </Link>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-md flex flex-col items-center text-center">
        
        {/* Wavy Badge */}
        <div className="relative mb-10 w-[140px] h-[140px] flex items-center justify-center">
          {/* Rotating rounded squares to create a wavy star effect */}
          <div className="absolute inset-2 bg-[#2D2880] opacity-30 rounded-[1.5rem] rotate-[15deg]"></div>
          <div className="absolute inset-2 bg-[#423AA9] opacity-50 rounded-[1.5rem] rotate-[30deg]"></div>
          <div className="absolute inset-2 bg-[#5A50D8] opacity-80 rounded-[1.5rem] rotate-[45deg]"></div>
          <div className="absolute inset-2 bg-[#6E63F2] rounded-[1.5rem] shadow-lg"></div>
          
          <span className="relative text-white font-bold text-5xl z-10 tracking-tight">-50<span className="text-3xl">%</span></span>
        </div>

        {/* Headlines */}
        <h1 className="text-[32px] leading-tight font-bold text-gray-900 mb-4 px-2">
          Become <span className="underline decoration-[#6E63F2] underline-offset-4 decoration-2">premium</span> and enjoy the full experience
        </h1>
        
        <p className="text-gray-600 mb-10 px-8 text-[15px]">
          Join thousands of users already using WeetSpot+ to improve their weather forecasting and daily planning.
        </p>

        {/* Features List */}
        <div className="w-full bg-[#f8f9fa] rounded-[2rem] p-6 mb-10 border border-gray-100">
          <ul className="space-y-5 text-left pl-2">
            <li className="flex items-center gap-4">
              <div className="bg-[#6E63F2] rounded-full p-1 shrink-0">
                <Check className="w-[14px] h-[14px] text-white stroke-[3]" />
              </div>
              <span className="text-gray-800 font-medium text-[15px]">Unlock advanced radar maps</span>
            </li>
            <li className="flex items-center gap-4">
              <div className="bg-[#6E63F2] rounded-full p-1 shrink-0">
                <Check className="w-[14px] h-[14px] text-white stroke-[3]" />
              </div>
              <span className="text-gray-800 font-medium text-[15px]">Ad-free experience</span>
            </li>
            <li className="flex items-center gap-4">
              <div className="bg-[#6E63F2] rounded-full p-1 shrink-0">
                <Check className="w-[14px] h-[14px] text-white stroke-[3]" />
              </div>
              <span className="text-gray-800 font-medium text-[15px]">Support an independent developer</span>
            </li>
          </ul>
        </div>

        {/* CTA Button */}
        <button className="w-full max-w-[280px] bg-[#6E63F2] hover:bg-[#5A50D8] text-white font-medium py-4 rounded-full text-lg shadow-md transition-colors mb-5 active:scale-95">
          Continue
        </button>

        {/* Footer Text */}
        <p className="text-gray-500 text-[13px] font-medium">
          <span className="line-through opacity-60 mr-1">$9.99</span> — Only $4.99 (No subscription)
        </p>

      </div>
    </div>
  );
}
