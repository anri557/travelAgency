"use client";
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';

export default function Navbar() {
  const { lang, toggleLanguage } = useLanguage();
  const t = translations[lang].nav;

  return (
    <nav className="w-full py-6 px-4 md:px-12 flex justify-between items-center bg-white z-50">
      <div className="text-2xl font-bold text-slate-800">
        Explora
      </div>
      <div className="hidden md:flex gap-8 text-slate-800 font-medium text-sm">
        <Link href="/" className="hover:text-[#A3D1D6] transition">{t.home}</Link>
        <Link href="/tours" className="hover:text-[#A3D1D6] transition">{t.tours}</Link>
        <Link href="/about" className="hover:text-[#A3D1D6] transition">{t.about}</Link>
        <Link href="/contact" className="hover:text-[#A3D1D6] transition">{t.contact}</Link>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={toggleLanguage} className="text-slate-500 font-bold hover:text-slate-800 transition px-2">
          {lang === 'ka' ? 'EN' : 'KA'}
        </button>
      </div>
    </nav>
  );
}
