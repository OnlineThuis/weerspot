"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface FooterProps {
  currentLang: string;
  dictionary: {
    support: string;
    aboutWeetSpot: string;
    weatherNews: string;
    weatherBlog: string;
    weatherAPIs: string;
    radarMaps: string;
    language: string;
    goPremium: string;
    termsOfService: string;
    privacyPolicy: string;
    dataSources: string;
    cookiePolicy: string;
    copyrightPolicy: string;
    reportIssue: string;
  };
}

export default function Footer({ currentLang, dictionary }: FooterProps) {
  const pathname = usePathname();

  // Helper to switch the language in the URL path
  const switchLang = (lang: string) => {
    if (!pathname) return `/${lang}`;
    const segments = pathname.split("/");
    segments[1] = lang; // The first segment after the leading slash is the language
    return segments.join("/");
  };

  const topLinks = [
    { name: dictionary.aboutWeetSpot, href: "#" },
    { name: dictionary.weatherNews, href: "#" },
    { name: dictionary.weatherBlog, href: "#" },
    { name: dictionary.weatherAPIs, href: "#" },
    { name: dictionary.radarMaps, href: "#" },
  ];

  const bottomLinks = [
    { name: dictionary.termsOfService, href: `/${currentLang}/terms` },
    { name: dictionary.privacyPolicy, href: `/${currentLang}/privacy` },
    { name: dictionary.dataSources, href: `/${currentLang}/data-sources` },
    { name: dictionary.cookiePolicy, href: `/${currentLang}/cookies` },
    { name: dictionary.copyrightPolicy, href: `/${currentLang}/copyright` },
  ];

  return (
    <footer className="w-full bg-[#ebebeb] border-t border-gray-300 py-4 font-sans text-[11px] sm:text-xs">
      <div className="max-w-6xl mx-auto px-4 flex flex-col gap-2">
        {/* Top Row */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <Link href="#" className="font-bold text-[#005580] hover:underline">
            {dictionary.support}
          </Link>
          
          {topLinks.map((link) => (
            <div key={link.name} className="flex items-center gap-2">
              <span className="text-gray-300">|</span>
              <Link href={link.href} className="text-[#006699] hover:underline">
                {link.name}
              </Link>
            </div>
          ))}

          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <span className="text-gray-300">|</span>
            <span className="text-gray-500 mr-1">{dictionary.language}:</span>
            <div className="flex gap-1">
              <Link href={switchLang("en")} className={`hover:underline ${currentLang === 'en' ? 'font-bold text-[#005580]' : 'text-[#006699]'}`}>EN</Link>
              <span className="text-gray-400">·</span>
              <Link href={switchLang("nl")} className={`hover:underline ${currentLang === 'nl' ? 'font-bold text-[#005580]' : 'text-[#006699]'}`}>NL</Link>
              <span className="text-gray-400">·</span>
              <Link href={switchLang("fr")} className={`hover:underline ${currentLang === 'fr' ? 'font-bold text-[#005580]' : 'text-[#006699]'}`}>FR</Link>
            </div>
          </div>
          
          <span className="text-gray-300 hidden sm:inline">|</span>
          <Link href="#" className="font-bold text-[#005580] hover:underline">
            {dictionary.goPremium}
          </Link>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-gray-500 mr-1">
            WeetSpot B.V. © {new Date().getFullYear()}
          </span>
          
          {bottomLinks.map((link) => (
            <div key={link.name} className="flex items-center gap-2">
              <Link href={link.href} className="text-[#006699] hover:underline">
                {link.name}
              </Link>
              <span className="text-gray-300">|</span>
            </div>
          ))}
          
          <Link href="#" className="font-bold text-[#005580] hover:underline">
            {dictionary.reportIssue}
          </Link>
        </div>
      </div>
    </footer>
  );
}
