"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';

export default function Home() {
  const { lang } = useLanguage();
  const t = translations[lang];

  const [tours, setTours] = useState([
    {
      id: 1,
      image: "https://www.grayline.com/wp-content/uploads/2025/03/Gray-Line-Athens-Cover-Photo-scaled.jpg",
      title: t.popular.locations.athens,
      duration: t.popular.duration,
      price: "400 ₾"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=600",
      title: t.popular.locations.rome,
      duration: t.popular.duration,
      price: "500 ₾"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1558102822-da570eb113ed?auto=format&fit=crop&q=80&w=600",
      title: t.popular.locations.lisbon,
      duration: t.popular.duration,
      price: "450 ₾"
    },
    {
      id: 4,
      image: "https://www.sea-help.eu/wp-content/uploads/2023-05-04_seahelp_dubrovnik_respect-the-cty_tourismus_as802609059.jpg",
      title: t.popular.locations.dubrovnik,
      duration: t.popular.duration,
      price: "550 ₾"
    }
  ]);

  useEffect(() => {
    const fetchLivePrices = async () => {
      try {
        const res = await fetch('/api/bundles');
        const data = await res.json();

        if (data.success && data.bundles && data.bundles.length > 0) {
          const liveTours = data.bundles.map(bundle => ({
            id: bundle.id,
            image: bundle.image,
            title: bundle.city, // We use city name for now, alternatively bundle.title
            duration: bundle.duration,
            price: `${bundle.price} ${bundle.currency}`
          }));
          setTours(liveTours);
        }
      } catch (err) {
        console.error("Could not fetch live tours:", err);
      }
    };

    fetchLivePrices();
  }, []);

  return (
    <main className="w-full bg-white max-w-[1440px] mx-auto flex flex-col">
      {/* Hero Section */}
      <section className="w-full flex flex-col md:flex-row items-center justify-between px-4 md:px-12 py-12 md:py-20 bg-white">
        <div className="md:w-1/2 flex flex-col items-start gap-8 z-10 pr-4">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-800 leading-[1.1] tracking-tight">
            {t.hero.titleLine1}<br />
            {t.hero.titleLine2}
          </h1>
          <button className="bg-[#A3D1D6] text-white px-8 py-3.5 rounded-2xl font-medium text-lg hover:bg-[#8cc4ca] transition">
            {t.hero.button}
          </button>
        </div>
        <div className="md:w-1/2 mt-12 md:mt-0 relative w-full h-[350px] md:h-[450px]">
          <Image
            src="https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&q=80&w=1200"
            alt="Venice Canal"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover rounded-3xl"
          />
        </div>
      </section>

      {/* Popular Tours Section */}
      <section className="w-full px-4 md:px-12 py-16 bg-white">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-10">{t.popular.title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tours.map((tour) => (
            <div key={tour.id} className="bg-white rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col transition hover:shadow-lg">
              <div className="h-56 w-full relative p-2">
                <div className="relative w-full h-full overflow-hidden rounded-[1.5rem]">
                  <Image 
                    src={tour.image} 
                    alt={tour.title} 
                    fill
                    sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover" 
                  />
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-bold text-slate-800 text-xl mb-1">{tour.title}</h3>
                <p className="text-slate-500 text-sm mb-4 font-medium">{tour.duration}</p>
                <Link 
                  href={`/tours/${tour.id}`}
                  className="w-full text-center bg-[#A3D1D6] text-white py-3 rounded-2xl font-semibold hover:bg-[#8cc4ca] transition block mt-auto"
                >
                  {t.popular.detailsButton}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="w-full px-4 md:px-12 py-16 bg-white">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-12">{t.features.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full flex justify-center items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-[#A3D1D6]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-slate-800 font-bold text-xl leading-tight whitespace-pre-line">{t.features.feature1}</div>
          </div>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full flex justify-center items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-[#A3D1D6]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-slate-800 font-bold text-xl leading-tight whitespace-pre-line">{t.features.feature2}</div>
          </div>

        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full px-4 md:px-12 py-16 bg-white pb-32">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-12">{t.testimonials.title}</h2>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 max-w-4xl">
          <div className="w-28 h-28 shrink-0 relative">
            <Image
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200"
              alt="Dilan Kılıç"
              fill
              sizes="112px"
              className="object-cover rounded-full shadow-lg"
            />
          </div>
          <div className="flex flex-col gap-4 mt-2">
            <p className="text-slate-700 text-xl font-medium leading-relaxed">
              {t.testimonials.text}
            </p>
            <p className="text-slate-600 font-bold text-lg">Dilan Kılıç</p>
          </div>
        </div>
      </section>
    </main>
  );
}