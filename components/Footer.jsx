"use client";
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';

export default function Footer() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <footer className="w-full bg-[#f8fafa] py-12 px-4 md:px-12 border-t border-slate-100">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <div className="text-2xl font-bold text-slate-800 mb-2">Explora</div>
          <p className="text-slate-500 text-sm max-w-xs">
            {t.footer.desc}
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-6 md:gap-12 text-slate-700 font-medium text-sm">
          <Link href="/" className="hover:text-[#A3D1D6] transition">{t.nav.home}</Link>
          <Link href="/tours" className="hover:text-[#A3D1D6] transition">{t.nav.tours}</Link>
          <Link href="/about" className="hover:text-[#A3D1D6] transition">{t.nav.about}</Link>
          <Link href="/contact" className="hover:text-[#A3D1D6] transition">{t.nav.contact}</Link>
          <Link href="/admin" className="hover:text-[#A3D1D6] transition">{lang === 'ka' ? 'ადმინი' : 'Admin'}</Link>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto mt-12 pt-8 border-t border-slate-200 text-center text-slate-400 text-xs font-medium">
        &copy; {new Date().getFullYear()} Explora Travel. {t.footer.rights}
      </div>
    </footer>
  );
}
