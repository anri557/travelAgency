"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';

// Simple native translations for database terms to ensure unified Georgian experience
const categoryTranslations = {
  ka: {
    "All": "ყველა",
    "City Break": "ქალაქის ტური",
    "Relaxing": "დასვენება",
    "Nightlife": "ღამის ცხოვრება"
  },
  en: {
    "All": "All Vibes",
    "City Break": "City Break",
    "Relaxing": "Relaxing",
    "Nightlife": "Nightlife"
  }
};

const countryTranslations = {
  ka: {
    "Turkey": "თურქეთი",
    "Italy": "იტალია",
    "Greece": "საბერძნეთი",
    "Thailand": "ტაილანდი",
    "United Arab Emirates": "არაბთა გაერთიანებული საამიროები"
  },
  en: {
    "Turkey": "Turkey",
    "Italy": "Italy",
    "Greece": "Greece",
    "Thailand": "Thailand",
    "United Arab Emirates": "United Arab Emirates"
  }
};

const uiTranslations = {
  ka: {
    searchPlaceholder: "მოძებნე ქალაქი ან ქვეყანა...",
    noResults: "ტურები არ მოიძებნა",
    tryAgain: "შეცვალეთ ძებნის პარამეტრები",
    loading: "ტურები იტვირთება...",
    durationText: "4 დღე 5 ღამე",
    priceLabel: "ფასი:"
  },
  en: {
    searchPlaceholder: "Search city or country...",
    noResults: "No tours found",
    tryAgain: "Try adjusting your filters or search term",
    loading: "Loading premium packages...",
    durationText: "4 Days, 5 Nights",
    priceLabel: "Price:"
  }
};

export default function ToursPage() {
  const { lang } = useLanguage();
  const t = translations[lang].pages;
  const ui = uiTranslations[lang];

  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVibe, setSelectedVibe] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchPackages() {
      try {
        const response = await fetch('/api/bundles');
        const data = await response.json();
        if (data.success) {
          setBundles(data.bundles);
        }
      } catch (error) {
        console.error("Failed fetching live tours:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPackages();
  }, []);

  // Filter & Search Logic
  const filteredBundles = bundles.filter(bundle => {
    const matchesVibe = selectedVibe === "All" || bundle.vibe === selectedVibe;
    const searchLower = searchQuery.toLowerCase();
    
    // Check match against original English names and local translations
    const translatedCountry = countryTranslations[lang][bundle.country] || bundle.country;
    const matchesSearch = 
      bundle.city.toLowerCase().includes(searchLower) ||
      bundle.country.toLowerCase().includes(searchLower) ||
      translatedCountry.toLowerCase().includes(searchLower) ||
      bundle.title.toLowerCase().includes(searchLower);

    return matchesVibe && matchesSearch;
  });

  const vibeCategories = ["All", "City Break", "Relaxing", "Nightlife"];

  return (
    <main className="w-full max-w-[1440px] mx-auto px-4 md:px-12 py-12 min-h-[80vh] bg-slate-50/30">
      
      {/* Premium Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-2">
            {t.toursTitle}
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            {lang === 'ka' ? 'აღმოაჩინე შენი შემდეგი თავგადასავალი საუკეთესო ფასად' : 'Discover your next dream destination at the absolute best live market price'}
          </p>
        </div>

        {/* Modern Live Pulse Badge */}
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 w-fit self-start md:self-auto shadow-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-sm font-bold tracking-wide uppercase">
            {lang === 'ka' ? 'ფასები განახლებადია' : 'Live Realtime Rates'}
          </span>
        </div>
      </div>

      {/* Advanced Filter and Search Bar */}
      <div className="flex flex-col gap-6 mb-10 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_10px_35px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-grow max-w-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder={ui.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-[#A3D1D6] focus:ring-2 focus:ring-[#A3D1D6]/20 transition-all font-medium text-slate-700 placeholder-slate-400"
            />
          </div>

          {/* Vibe Category Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            {vibeCategories.map((vibe) => (
              <button
                key={vibe}
                onClick={() => setSelectedVibe(vibe)}
                className={`px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 ${
                  selectedVibe === vibe
                    ? 'bg-[#A3D1D6] text-white shadow-md shadow-[#A3D1D6]/20 scale-102'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700 border border-slate-100'
                }`}
              >
                {categoryTranslations[lang][vibe] || vibe}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Dynamic Tours Grid */}
      {loading ? (
        // Premium Skeleton Loader
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 p-2 shadow-sm animate-pulse">
              <div className="h-56 bg-slate-100 rounded-[1.5rem] mb-4"></div>
              <div className="px-4 pb-4">
                <div className="h-6 bg-slate-100 rounded-md w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-100 rounded-md w-1/2 mb-6"></div>
                <div className="flex justify-between items-center">
                  <div className="h-8 bg-slate-100 rounded-md w-1/3"></div>
                  <div className="h-10 bg-slate-100 rounded-xl w-1/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredBundles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredBundles.map((bundle) => {
            const translatedCountry = countryTranslations[lang][bundle.country] || bundle.country;
            const translatedVibe = categoryTranslations[lang][bundle.vibe] || bundle.vibe;
            
            return (
              <div
                key={bundle.id}
                className="group bg-white rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-100/80 flex flex-col transition-all duration-500 hover:shadow-[0_20px_50px_rgba(163,209,214,0.15)] p-2.5"
              >
                {/* Clean Image Container with Hover Scale */}
                <div className="h-56 w-full relative overflow-hidden rounded-[1.5rem]">
                  <Image
                    src={bundle.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600"}
                    alt={bundle.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  
                  {/* Glassmorphic Vibe Badge */}
                  <span className="absolute top-4 left-4 backdrop-blur-md bg-white/70 text-slate-800 text-xs font-extrabold px-3.5 py-1.5 rounded-xl border border-white/40 tracking-wide uppercase shadow-sm">
                    {translatedVibe}
                  </span>
                </div>

                {/* Bundle Details Content */}
                <div className="p-5 flex flex-col flex-grow">
                  <span className="text-xs font-bold text-[#A3D1D6] tracking-wider uppercase mb-1">
                    {translatedCountry}
                  </span>
                  
                  <h3 className="font-extrabold text-slate-800 text-xl leading-snug mb-2 group-hover:text-[#8cc4ca] transition-colors duration-300">
                    {bundle.city}
                  </h3>
                  
                  <p className="text-slate-400 text-sm font-semibold mb-4">
                    {bundle.description || ui.durationText}
                  </p>

                  <Link 
                    href={`/tours/${bundle.id}`}
                    className="w-full text-center bg-[#A3D1D6] text-white hover:bg-[#8cc4ca] font-bold py-3.5 rounded-2xl transition-all duration-300 hover:scale-102 active:scale-98 shadow-md shadow-[#A3D1D6]/10 text-sm block mt-auto"
                  >
                    {translations[lang].popular.detailsButton}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Beautiful Empty State
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="font-extrabold text-slate-800 text-2xl mb-2">{ui.noResults}</h3>
          <p className="text-slate-400 font-medium text-center px-6">{ui.tryAgain}</p>
        </div>
      )}

    </main>
  );
}

