"use client";
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';

export default function AboutPage() {
  const { lang } = useLanguage();
  const t = translations[lang].aboutPage;
  const pageT = translations[lang].pages;

  return (
    <main className="w-full bg-slate-50/30 flex flex-col items-center">
      
      {/* Premium Glassmorphic Hero Banner */}
      <section className="w-full max-w-[1440px] px-4 md:px-12 pt-8 pb-12">
        <div className="relative h-[300px] md:h-[450px] w-full rounded-[2.5rem] overflow-hidden shadow-md">
          {/* Background Image */}
          <Image 
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1200" 
            alt="Travel Adventure Banner" 
            fill
            priority
            sizes="(max-width: 1440px) 100vw, 1440px"
            className="object-cover"
          />
          {/* Overlay Darkening */}
          <div className="absolute inset-0 bg-slate-900/30" />
          
          {/* Floating Glassmorphic Content Card */}
          <div className="absolute bottom-6 left-6 right-6 md:bottom-12 md:left-12 md:right-auto md:max-w-2xl backdrop-blur-md bg-white/80 p-8 rounded-3xl border border-white/50 shadow-xl flex flex-col gap-2">
            <span className="text-[#A3D1D6] font-bold text-xs uppercase tracking-wider">{t.heroSub}</span>
            <h1 className="text-3xl md:text-5xl font-black text-slate-800 leading-tight tracking-tight">
              {t.heroTitle}
            </h1>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="w-full max-w-[1440px] px-4 md:px-12 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
            {t.storyTitle}
          </h2>
          <div className="w-20 h-1.5 bg-[#A3D1D6] rounded-full"></div>
          <p className="text-slate-500 font-medium text-lg leading-relaxed mt-2">
            {t.storyText1}
          </p>
          <p className="text-slate-500 font-medium text-lg leading-relaxed">
            {t.storyText2}
          </p>
        </div>
        <div className="relative h-[300px] md:h-[400px] w-full rounded-[2rem] overflow-hidden shadow-lg">
          <Image 
            src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80&w=800" 
            alt="Young travelers enjoying a viewpoint" 
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* Statistics Section with Harmonic Gradient Theme */}
      <section className="w-full max-w-[1440px] px-4 md:px-12 py-16">
        <div className="bg-gradient-to-tr from-[#edf7f8] via-white to-[#edf7f8] p-10 rounded-[3rem] border border-slate-100/50 shadow-[0_15px_45px_rgba(0,0,0,0.01)]">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 text-center tracking-tight mb-12">
            {t.statsTitle}
          </h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {t.stats.map((stat, i) => (
              <div 
                key={i} 
                className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-slate-50/50 shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <span className="text-4xl md:text-5xl font-black text-slate-800 mb-2 tracking-tight">
                  {stat.value}
                </span>
                <span className="text-slate-400 font-bold text-sm text-center">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="w-full max-w-[1440px] px-4 md:px-12 py-16 pb-32">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 text-center tracking-tight mb-16">
          {t.valuesTitle}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.values.map((val, i) => {
            // Icon mapping
            let iconSvg = null;
            if (i === 0) {
              // Adventure (Compass icon)
              iconSvg = (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#A3D1D6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              );
            } else if (i === 1) {
              // Affordability (Price tag / wallet)
              iconSvg = (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#A3D1D6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2zM9 16V8l3 3 3-3v8" />
                </svg>
              );
            } else {
              // Community (Users / Heart)
              iconSvg = (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#A3D1D6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              );
            }

            return (
              <div 
                key={i} 
                className="group bg-white p-8 rounded-[2.2rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] transition-all duration-500 hover:shadow-[0_20px_45px_rgba(163,209,214,0.12)] flex flex-col gap-6"
                >
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-[#A3D1D6]/10 transition-colors duration-300">
                  {iconSvg}
                </div>
                <h3 className="font-extrabold text-slate-800 text-xl leading-tight">
                  {val.title}
                </h3>
                <p className="text-slate-400 font-medium text-sm leading-relaxed">
                  {val.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

    </main>
  );
}

