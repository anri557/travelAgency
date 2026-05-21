"use client";
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';

// Inclusions/Highlights translations
const detailTranslations = {
  ka: {
    backToList: "კატალოგში დაბრუნება",
    aboutTour: "ტურის შესახებ",
    durationLabel: "ხანგრძლივობა",
    vibeLabel: "ვაიბი / ტიპი",
    inclusionsTitle: "რა შედის პაკეტში?",
    flightsIncl: "ორმხრივი ავიაბილეთები (თბილისიდან)",
    hotelIncl: "სასტუმროში განთავსება",
    guideIncl: "ადგილობრივი ჯგუფის ხელმძღვანელი",
    activitiesIncl: "აქტივობები და თავგადასავლები",
    datePrompt: "შეადგინე შენი გეგმა",
    dateLabel: "1. აირჩიეთ ფრენის თარიღი",
    durationLabelPrompt: "2. დარჩენის ხანგრძლივობა",
    tourTypePrompt: "3. აირჩიეთ ტურის ტიპი",
    selectDatePrompt: "აირჩიეთ თარიღი ფასის საჩვენებლად",
    selectTourTypePrompt: "აირჩიეთ ტურის ტიპი სასტუმროების სანახავად",
    calculatingPrice: "მიმდინარეობს ფასის გამოთვლა...",
    totalPriceLabel: "ჯამური ღირებულება",
    flightBreakdown: "ფრენა (ორმხრივი)",
    hotelBreakdown: "სასტუმრო (არჩეული)",
    bookButton: "ბილეთის დაჯავშნა",
    trustSearch: "ფრენის ფასი მოწმდება რეალურ დროში",
    trustHotel: "სასტუმრო გარანტირებულია",
    trustRefund: "უსაფრთხო გადახდა",
    errorLoading: "ტურის ჩატვირთვა ვერ მოხერხდა",
    loadingTour: "იტვირთება ტურის დეტალები...",
    daysNights: "4 დღე 5 ღამე",
    hotelSectionTitle: "ნაბიჯი 4: აირჩიეთ სასტუმრო",
    hotelSectionDesc: "მოცემული სასტუმროები გაფილტრულია თქვენი ტურის ტიპის მიხედვით",
    hotelPerNight: "ღამე",
    hotelTotalStay: "ჯამში",
    hotelSelected: "არჩეულია",
    selectHotelBtn: "არჩევა",
    hotelAmenitiesLabel: "სერვისები:",
    hotelLoading: "იტვირთება სასტუმროები...",
    hotelNoResults: "სასტუმროები ვერ მოიძებნა.",
    vibeNames: {
      "City Break": "ქალაქის ტური",
      "Relaxing": "დასვენება",
      "Nightlife": "ღამის ცხოვრება"
    },
    tourTypes: {
      "Fun Tour": "🎉 Fun ტური",
      "Romantic Tour": "💑 რომანტიკული",
      "Adventure Tour": "🏛️ სათავგადასავლო"
    }
  },
  en: {
    backToList: "Back to Catalog",
    aboutTour: "About this Tour",
    durationLabel: "Duration",
    vibeLabel: "Vibe / Category",
    inclusionsTitle: "What's Included?",
    flightsIncl: "Roundtrip Flights (From Tbilisi)",
    hotelIncl: "Hotel Accommodation",
    guideIncl: "Local Group Leader",
    activitiesIncl: "Activities & Sightseeing",
    datePrompt: "Build Your Plan",
    dateLabel: "1. Select Departure Date",
    durationLabelPrompt: "2. Stay Duration",
    tourTypePrompt: "3. Choose Tour Type",
    selectDatePrompt: "Select departure date to see pricing",
    selectTourTypePrompt: "Choose tour style to load hotels",
    calculatingPrice: "Calculating live pricing...",
    totalPriceLabel: "Total Package Price",
    flightBreakdown: "Flight (Roundtrip)",
    hotelBreakdown: "Hotel (Selected)",
    bookButton: "Book Package",
    trustSearch: "Live flight rate check",
    trustHotel: "Hotel room guaranteed",
    trustRefund: "Secure checkout",
    errorLoading: "Could not load tour details",
    loadingTour: "Loading tour details...",
    daysNights: "4 Days, 5 Nights",
    hotelSectionTitle: "Step 4: Choose Your Accommodation",
    hotelSectionDesc: "Premium hotels filtered by your chosen tour category",
    hotelPerNight: "night",
    hotelTotalStay: "total stay",
    hotelSelected: "Selected",
    selectHotelBtn: "Select Hotel",
    hotelAmenitiesLabel: "Amenities:",
    hotelLoading: "Fetching available hotels...",
    hotelNoResults: "No hotels found matching search parameters.",
    vibeNames: {
      "City Break": "City Break",
      "Relaxing": "Relaxing",
      "Nightlife": "Nightlife"
    },
    tourTypes: {
      "Fun Tour": "Fun Tour",
      "Romantic Tour": "Romantic Tour",
      "Adventure Tour": "Adventure Tour"
    }
  }
};

export default function TourDetailsPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { lang } = useLanguage();
  const t = translations[lang];
  const dt = detailTranslations[lang];

  const [bundle, setBundle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Date, Tour Type, Hotels, and Pricing states
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(4);
  const [selectedTourType, setSelectedTourType] = useState('');
  const [hotels, setHotels] = useState([]);
  const [loadingHotels, setLoadingHotels] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);

  const [pricing, setPricing] = useState(null);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [activeImage, setActiveImage] = useState('');

  const calculateCheckoutDate = (dateStr, durationVal) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    d.setDate(d.getDate() + (durationVal || selectedDuration));
    return d.toISOString().split('T')[0];
  };

  // Fetch bundle details on load
  useEffect(() => {
    async function fetchBundleDetails() {
      try {
        const res = await fetch(`/api/bundles/${id}`);
        const data = await res.json();
        if (data.success) {
          setBundle(data.bundle);
          if (data.bundle.images && data.bundle.images.length > 0) {
            setActiveImage(data.bundle.images[0]);
          } else {
            setActiveImage("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200");
          }
        } else {
          setError(data.error || 'Failed loading bundle details');
        }
      } catch (err) {
        setError('Connection error');
      } finally {
        setLoading(false);
      }
    }
    fetchBundleDetails();
  }, [id]);

  // Fetch dynamic pricing when date changes
  useEffect(() => {
    if (!selectedDate) {
      setPricing(null);
      return;
    }

    async function fetchLivePrice() {
      setLoadingPrice(true);
      try {
        const res = await fetch(`/api/flights/price?bundleId=${id}&date=${selectedDate}`);
        const data = await res.json();
        if (data.success) {
          setPricing(data);
        } else {
          console.error("Pricing API error:", data.error);
        }
      } catch (err) {
        console.error("Failed loading pricing details:", err);
      } finally {
        setLoadingPrice(false);
      }
    }

    fetchLivePrice();
  }, [selectedDate, id]);

  // Fetch hotels when date, tour type, or duration changes
  useEffect(() => {
    if (!selectedDate || !selectedTourType || !bundle?.city) {
      setHotels([]);
      setSelectedHotel(null);
      return;
    }

    async function fetchHotels() {
      setLoadingHotels(true);
      try {
        const checkOutDate = calculateCheckoutDate(selectedDate, selectedDuration);
        const res = await fetch(`/api/hotels?city=${encodeURIComponent(bundle.city)}&checkIn=${selectedDate}&checkOut=${checkOutDate}&tourType=${encodeURIComponent(selectedTourType)}`);
        const data = await res.json();
        if (data.success && data.hotels) {
          setHotels(data.hotels);
          if (data.hotels.length > 0) {
            setSelectedHotel(data.hotels[0]);
          } else {
            setSelectedHotel(null);
          }
        } else {
          setHotels([]);
          setSelectedHotel(null);
        }
      } catch (err) {
        console.error("Failed loading hotels:", err);
        setHotels([]);
        setSelectedHotel(null);
      } finally {
        setLoadingHotels(false);
      }
    }

    fetchHotels();
  }, [selectedDate, selectedTourType, selectedDuration, bundle?.city]);

  const handleBookNow = () => {
    if (!pricing || !bundle || !selectedHotel) return;
    const finalPrice = (pricing.breakdown?.roundtripFlight || 0) + (selectedHotel.totalRateGel || 0);
    // Redirect to contact booking form pre-populated
    router.push(`/contact?destination=${encodeURIComponent(bundle.city)}&date=${selectedDate}&duration=${selectedDuration}&tourType=${encodeURIComponent(selectedTourType)}&hotel=${encodeURIComponent(selectedHotel.name)}&hotelPrice=${finalPrice}`);
  };

  // Get translated country name
  const getCountryName = (country) => {
    const countries = {
      "Turkey": lang === 'ka' ? 'თურქეთი' : 'Turkey',
      "Italy": lang === 'ka' ? 'იტალია' : 'Italy',
      "Greece": lang === 'ka' ? 'საბერძნეთი' : 'Greece',
      "Thailand": lang === 'ka' ? 'ტაილანდი' : 'Thailand',
      "United Arab Emirates": lang === 'ka' ? 'არაბთა გაერთიანებული საამიროები' : 'United Arab Emirates'
    };
    return countries[country] || country;
  };

  if (loading) {
    return (
      <main className="w-full bg-[#f8fafc] min-h-screen max-w-[1440px] mx-auto px-4 md:px-12 py-12 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-[#A3D1D6] border-t-transparent animate-spin"></div>
          <p className="text-slate-500 font-semibold">{dt.loadingTour}</p>
        </div>
      </main>
    );
  }

  if (error || !bundle) {
    return (
      <main className="w-full bg-[#f8fafc] min-h-screen max-w-[1440px] mx-auto px-4 md:px-12 py-20 text-center">
        <h2 className="text-2xl font-black text-slate-800 mb-4">{dt.errorLoading}</h2>
        <p className="text-slate-500 mb-8">{error}</p>
        <Link href="/tours" className="bg-[#A3D1D6] text-white font-bold px-8 py-3.5 rounded-2xl hover:bg-[#8cc4ca] transition">
          {dt.backToList}
        </Link>
      </main>
    );
  }

  const translatedVibe = dt.vibeNames[bundle.vibe] || bundle.vibe;

  return (
    <main className="w-full bg-[#f8fafc] min-h-screen max-w-[1440px] mx-auto px-4 md:px-12 py-8 flex flex-col gap-8">
      {/* Back Button */}
      <div>
        <Link
          href="/tours"
          className="inline-flex items-center gap-2.5 text-slate-500 hover:text-[#A3D1D6] font-bold text-sm transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {dt.backToList}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Images & Information (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Main Visual Display */}
          <div className="bg-white rounded-[2.5rem] p-3 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <div className="h-[300px] md:h-[450px] w-full overflow-hidden rounded-[2rem] relative">
              <Image
                src={activeImage}
                alt={bundle.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover transition-all duration-700 hover:scale-105"
              />
              <span className="absolute top-6 left-6 backdrop-blur-md bg-white/70 text-slate-800 text-xs font-black px-4 py-2 rounded-xl border border-white/40 tracking-wider uppercase">
                {translatedVibe}
              </span>
            </div>

            {/* Gallery Thumbnails */}
            {bundle.images && bundle.images.length > 1 && (
              <div className="flex gap-4 p-3 overflow-x-auto mt-2">
                {bundle.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all relative ${activeImage === img ? 'border-[#A3D1D6] scale-105 shadow-sm' : 'border-transparent hover:border-slate-300'
                      }`}
                  >
                    <Image src={img} alt="" fill sizes="80px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tour Metadata & Content */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col gap-6">
            <div>
              <span className="text-xs font-black text-[#A3D1D6] tracking-widest uppercase mb-1.5 block">
                {getCountryName(bundle.country)}
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight leading-none mb-4">
                {bundle.city}
              </h1>

              <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500">
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 text-[#A3D1D6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{dt.durationLabel}: {dt.daysNights}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 text-[#A3D1D6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{dt.vibeLabel}: {translatedVibe}</span>
                </div>
              </div>
            </div>

            <div className="w-full h-[1px] bg-slate-100"></div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">{dt.aboutTour}</h2>
              <p className="text-slate-500 leading-relaxed font-medium">
                {bundle.description || "Explore beautiful destinations, discover the historic sights, taste local cuisine, and meet amazing people. Our package provides the best balance of structure and free time."}
              </p>
            </div>

            <div className="w-full h-[1px] bg-slate-100"></div>

            {/* Inclusions Grid */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-5">{dt.inclusionsTitle}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3.5 p-4 bg-slate-50 rounded-2xl">
                  <div className="w-8 h-8 rounded-full bg-[#edf7f8] flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 text-[#A3D1D6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-slate-700">{dt.flightsIncl}</span>
                </div>

                <div className="flex items-center gap-3.5 p-4 bg-slate-50 rounded-2xl">
                  <div className="w-8 h-8 rounded-full bg-[#edf7f8] flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 text-[#A3D1D6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-slate-700">{dt.hotelIncl}</span>
                </div>

                <div className="flex items-center gap-3.5 p-4 bg-slate-50 rounded-2xl">
                  <div className="w-8 h-8 rounded-full bg-[#edf7f8] flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 text-[#A3D1D6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-slate-700">{dt.guideIncl}</span>
                </div>

                <div className="flex items-center gap-3.5 p-4 bg-slate-50 rounded-2xl">
                  <div className="w-8 h-8 rounded-full bg-[#edf7f8] flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 text-[#A3D1D6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-slate-700">{dt.activitiesIncl}</span>
                </div>
              </div>
            </div>
            {/* Step 3: Choose Your Accommodation (Loaded once Date & Tour Type are picked) */}
            {selectedDate && selectedTourType && (
              <div className="mt-4 flex flex-col gap-6">
                <div className="w-full h-[1px] bg-slate-100"></div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-2">
                    {dt.hotelSectionTitle}
                  </h2>
                  <p className="text-slate-500 font-medium text-sm">
                    {dt.hotelSectionDesc}
                  </p>
                </div>

                {loadingHotels ? (
                  // Gorgeous shimmer card skeleton
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2].map((i) => (
                      <div key={i} className="bg-white rounded-[2rem] border border-slate-100 p-4 flex flex-col gap-4 animate-pulse">
                        <div className="h-48 bg-slate-100 rounded-2xl w-full"></div>
                        <div className="h-6 bg-slate-100 rounded w-2/3"></div>
                        <div className="h-4 bg-slate-100 rounded w-1/3"></div>
                        <div className="h-10 bg-slate-100 rounded w-full"></div>
                      </div>
                    ))}
                  </div>
                ) : hotels.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {hotels.map((hotel) => {
                      const isSelected = selectedHotel?.id === hotel.id;
                      return (
                        <div
                          key={hotel.id}
                          onClick={() => setSelectedHotel(hotel)}
                          className={`bg-white rounded-[2rem] border transition-all duration-300 p-4 flex flex-col gap-4 cursor-pointer relative overflow-hidden group ${isSelected
                              ? 'border-[#A3D1D6] shadow-[0_10px_30px_rgba(163,209,214,0.15)] ring-2 ring-[#A3D1D6]/20'
                              : 'border-slate-100 hover:border-[#A3D1D6]/50 hover:shadow-md'
                            }`}
                        >
                          {/* Image */}
                          <div className="h-48 w-full overflow-hidden rounded-2xl relative">
                            <Image
                              src={hotel.image}
                              alt={hotel.name}
                              fill
                              sizes="(max-width: 768px) 100vw, 300px"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {isSelected && (
                              <span className="absolute top-4 right-4 bg-[#A3D1D6] text-white text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-sm">
                                {dt.hotelSelected}
                              </span>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex flex-col flex-grow justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-1 text-[#A3D1D6] mb-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                                <span className="text-xs font-black text-slate-700">{hotel.rating}</span>
                                <span className="text-slate-400 text-[10px] font-bold">({hotel.reviewsCount})</span>
                              </div>

                              <h3 className="text-lg font-black text-slate-800 leading-tight mb-1.5">
                                {hotel.name}
                              </h3>

                              <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider mb-2">
                                {hotel.address}
                              </p>

                              <p className="text-slate-500 text-xs font-medium leading-relaxed line-clamp-3">
                                {hotel.description}
                              </p>
                            </div>

                            {/* Amenities tag list */}
                            <div className="flex flex-wrap gap-1.5 pt-2">
                              {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                                <span key={idx} className="bg-slate-50 text-slate-500 text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md">
                                  {amenity}
                                </span>
                              ))}
                            </div>

                            <div className="w-full h-[1px] bg-slate-50 my-1"></div>

                            {/* Pricing & Selection */}
                            <div className="flex items-center justify-between mt-1">
                              <div>
                                <span className="text-slate-400 text-[10px] font-bold block">
                                  {dt.hotelTotalStay}
                                </span>
                                <span className="text-lg font-black text-slate-800">
                                  {hotel.totalRateGel} GEL
                                </span>
                                <span className="text-slate-400 text-[10px] font-medium block">
                                  ({hotel.baseNightRateGel} GEL / {dt.hotelPerNight})
                                </span>
                              </div>

                              <button
                                type="button"
                                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${isSelected
                                    ? 'bg-[#A3D1D6]/10 text-[#A3D1D6]'
                                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                  }`}
                              >
                                {isSelected ? dt.hotelSelected : dt.selectHotelBtn}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-slate-500 font-bold py-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    {dt.hotelNoResults}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Interactive Date & Live Price Booking Panel (4 cols) */}
        <div className="lg:col-span-4 lg:sticky lg:top-8 flex flex-col gap-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_15px_50px_rgba(0,0,0,0.03)] flex flex-col gap-6">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              {dt.datePrompt}
            </h2>

            {/* Date Input field */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                {dt.dateLabel}
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#A3D1D6]/30 focus:border-[#A3D1D6] transition"
                />
              </div>
            </div>

            <div className="w-full h-[1px] bg-slate-100"></div>

            {/* Stay Duration Select field */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                {dt.durationLabelPrompt}
              </label>
              <div className="relative">
                <select
                  value={selectedDuration}
                  disabled={!selectedDate}
                  onChange={(e) => setSelectedDuration(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#A3D1D6]/30 focus:border-[#A3D1D6] transition appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {[3, 4, 5, 6, 7, 8, 9, 10, 12, 14].map((nights) => (
                    <option key={nights} value={nights}>
                      {nights} {lang === 'ka' ? 'ღამე' : 'Nights'}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-slate-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="w-full h-[1px] bg-slate-100"></div>

            {/* Tour Type Selection dropdown/buttons */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                {dt.tourTypePrompt}
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                {Object.entries(dt.tourTypes).map(([key, label]) => {
                  const isActive = selectedTourType === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedTourType(key)}
                      disabled={!selectedDate}
                      className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-xs border transition-all flex items-center justify-between ${!selectedDate
                          ? 'bg-slate-50/50 border-slate-100 text-slate-300 cursor-not-allowed'
                          : isActive
                            ? 'bg-[#A3D1D6]/10 border-[#A3D1D6] text-slate-800 ring-2 ring-[#A3D1D6]/20'
                            : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
                        }`}
                    >
                      <span>{label}</span>
                      {isActive && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#A3D1D6]" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="w-full h-[1px] bg-slate-100"></div>

            {/* Realtime Pricing Display box */}
            <div className="flex flex-col gap-4 min-h-[140px] justify-center">
              {loadingPrice || loadingHotels ? (
                // Blinking loading skeleton
                <div className="flex flex-col gap-3.5 animate-pulse">
                  <div className="h-4 bg-slate-100 rounded w-1/3"></div>
                  <div className="h-10 bg-slate-100 rounded w-2/3"></div>
                  <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                  <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                </div>
              ) : !selectedDate ? (
                // Prompt to pick date
                <div className="flex flex-col items-center justify-center gap-3 text-center py-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider max-w-[200px]">
                    {dt.selectDatePrompt}
                  </p>
                </div>
              ) : !selectedTourType ? (
                // Prompt to pick tour type
                <div className="flex flex-col items-center justify-center gap-3 text-center py-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider max-w-[200px]">
                    {dt.selectTourTypePrompt}
                  </p>
                </div>
              ) : pricing && selectedHotel ? (
                // Fetched dynamic details
                <div className="flex flex-col gap-4">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                      {dt.totalPriceLabel}
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-slate-800 tracking-tight">
                        {pricing.breakdown?.roundtripFlight + selectedHotel.totalRateGel}
                      </span>
                      <span className="text-xl font-bold text-[#A3D1D6]">
                        {pricing.currency}
                      </span>
                    </div>
                  </div>

                  {/* Breakdown details */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-slate-50">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-400">{dt.flightBreakdown}</span>
                      <span className="text-slate-700">{pricing.breakdown?.roundtripFlight} {pricing.currency}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-400">{dt.hotelBreakdown}</span>
                        <span className="text-slate-700">{selectedHotel.totalRateGel} {pricing.currency}</span>
                      </div>
                      <span className="text-[9.5px] font-black text-slate-500 truncate max-w-[250px] block mt-0.5">
                        {selectedHotel.name}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-xs font-bold text-slate-400 py-4">
                  {dt.hotelNoResults}
                </div>
              )}
            </div>

            {/* Action booking CTA button */}
            <button
              onClick={handleBookNow}
              disabled={!pricing || !selectedHotel}
              className={`w-full font-bold py-4 rounded-2xl transition-all duration-300 shadow-md ${pricing && selectedHotel
                  ? 'bg-[#A3D1D6] text-white hover:bg-[#8cc4ca] hover:scale-[1.02] active:scale-[0.98] shadow-[#A3D1D6]/20'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                }`}
            >
              {dt.bookButton}
            </button>

            {/* Trust highlights */}
            <div className="flex flex-col gap-2.5 pt-2">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#A3D1D6] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>{dt.trustSearch}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#A3D1D6] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>{dt.trustHotel}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
