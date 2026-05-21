"use client";
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';

function ContactForm() {
  const { lang } = useLanguage();
  const t = translations[lang].contactPage;
  const searchParams = useSearchParams();
  
  // State variables for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [tourType, setTourType] = useState('');
  const [message, setMessage] = useState('');

  // Pre-populate fields from URL search parameters if available
  useEffect(() => {
    const destParam = searchParams.get('destination');
    const dateParam = searchParams.get('date');
    const durationParam = searchParams.get('duration') || '4';
    const tourTypeParam = searchParams.get('tourType');
    const hotelParam = searchParams.get('hotel');
    const hotelPriceParam = searchParams.get('hotelPrice');

    if (destParam) setDestination(destParam);
    if (dateParam) setDate(dateParam);
    if (tourTypeParam) setTourType(tourTypeParam);

    if (hotelParam && hotelPriceParam) {
      if (lang === 'ka') {
        const typeLabel = tourTypeParam === 'Fun Tour' ? 'გასართობი (Fun)' : tourTypeParam === 'Romantic Tour' ? 'რომანტიკული' : 'სათავგადასავლო';
        setMessage(`გამარჯობა Explora! მსურს დავჯავშნო პაკეტი მიმართულებით: ${destParam || ''}, გამგზავრების თარიღი: ${dateParam || ''}, ხანგრძლივობა: ${durationParam} ღამე. ჩემ მიერ შერჩეულია ${typeLabel} ტიპის ტური სასტუმროში: ${hotelParam}. პაკეტის სრული ღირებულებაა ${hotelPriceParam} GEL. გთხოვთ დამიკავშირდეთ ანგარიშსწორების დეტალებისთვის.`);
      } else {
        setMessage(`Hello Explora! I'd like to book the dynamic package to ${destParam || ''} starting on ${dateParam || ''} for ${durationParam} nights. I've chosen the ${tourTypeParam || 'Adventure'} style, staying at ${hotelParam}. The total package price is ${hotelPriceParam} GEL. Please contact me with payment details.`);
      }
    }
  }, [searchParams, lang]);
  
  // UI states
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, success: false, message: '' });

  // Fetch active destinations from the database API on load
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await fetch('/api/bundles');
        const data = await res.json();
        if (data.success && data.bundles) {
          // Extract unique list of cities
          const cities = data.bundles.map(b => b.city);
          setDestinations(cities);
        } else {
          // Fallbacks
          setDestinations(["Athens", "Rome", "Lisbon", "Dubrovnik"]);
        }
      } catch (err) {
        console.error("Failed to load destinations:", err);
        setDestinations(["Athens", "Rome", "Lisbon", "Dubrovnik"]);
      }
    };
    fetchDestinations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Quick validation
    if (!name || !email || !message) {
      showToast(false, t.errorDesc);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          destination,
          date,
          tourType,
          message,
          hotel: searchParams.get('hotel') || '',
          hotelPrice: searchParams.get('hotelPrice') || '',
          duration: searchParams.get('duration') || ''
        })
      });

      const data = await res.json();
      
      if (res.ok && data.success) {
        showToast(true, t.successDesc);
        // Reset form fields
        setName('');
        setEmail('');
        setPhone('');
        setDestination('');
        setDate('');
        setTourType('');
        setMessage('');
      } else {
        showToast(false, data.error || t.errorDesc);
      }
    } catch (err) {
      console.error("Submission error:", err);
      showToast(false, t.errorDesc);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (success, msg) => {
    setToast({ show: true, success, message: msg });
    setTimeout(() => {
      setToast({ show: false, success: false, message: '' });
    }, 5000);
  };

  return (
    <main className="w-full bg-slate-50/30 flex flex-col items-center relative min-h-[85vh]">
      
      {/* Toast Notification Container */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-[100] max-w-md p-6 rounded-3xl shadow-xl border backdrop-blur-md transition-all duration-300 animate-fade-in flex gap-4 ${
          toast.success 
            ? 'bg-emerald-50/95 border-emerald-200 text-emerald-800' 
            : 'bg-rose-50/95 border-rose-200 text-rose-800'
        }`}>
          <div className="flex-shrink-0">
            {toast.success ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <div>
            <h4 className="font-extrabold text-sm mb-1 uppercase tracking-wider">
              {toast.success ? t.successTitle : t.errorTitle}
            </h4>
            <p className="text-xs font-semibold leading-relaxed opacity-90">{toast.message}</p>
          </div>
        </div>
      )}

      {/* Page Header */}
      <section className="w-full max-w-[1440px] px-4 md:px-12 pt-8 pb-4">
        <div className="flex flex-col gap-2 max-w-xl">
          <span className="text-[#A3D1D6] font-bold text-xs uppercase tracking-wider">{t.heroSub}</span>
          <h1 className="text-3xl md:text-5xl font-black text-slate-800 leading-tight tracking-tight">
            {t.heroTitle}
          </h1>
        </div>
      </section>

      {/* Main Grid */}
      <section className="w-full max-w-[1440px] px-4 md:px-12 py-8 pb-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Info Column (Left 5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-8 w-full">
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex flex-col gap-8">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">{t.officeTitle}</h2>
            
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#A3D1D6] shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-0.5">{t.phone}</h4>
                  <p className="text-slate-700 font-bold">+995 599 12 34 56</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#A3D1D6] shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-0.5">{t.email}</h4>
                  <p className="text-slate-700 font-bold">info@exploratravel.ge</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#A3D1D6] shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-0.5">{t.address}</h4>
                  <p className="text-slate-700 font-bold">{t.addressVal}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Embedded Map Placeholder card */}
          <div className="w-full h-[250px] rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-md relative bg-slate-200">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d95267.0673410659!2d44.718047913337965!3d41.730310237976785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40440cd7e64f6241%3A0x3087e2212bb98c0!2sTbilisi%2C%20Georgia!5e0!3m2!1sen!2sus!4v1716200000000!5m2!1sen!2sus" 
              className="w-full h-full border-0" 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Form Column (Right 7 cols) */}
        <div className="lg:col-span-7 w-full bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-[0_15px_45px_rgba(0,0,0,0.015)]">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-8">{t.formTitle}</h2>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Row 1: Name and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-slate-500 font-bold text-xs uppercase tracking-wider">{t.nameLabel} *</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  className="w-full px-5 py-3.5 bg-slate-50/50 rounded-2xl border border-slate-100 focus:outline-none focus:border-[#A3D1D6] focus:bg-white text-slate-800 font-medium transition"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-500 font-bold text-xs uppercase tracking-wider">{t.emailLabel} *</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="w-full px-5 py-3.5 bg-slate-50/50 rounded-2xl border border-slate-100 focus:outline-none focus:border-[#A3D1D6] focus:bg-white text-slate-800 font-medium transition"
                />
              </div>
            </div>

            {/* Row 2: Phone and Destination */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-slate-500 font-bold text-xs uppercase tracking-wider">{t.phoneLabel}</label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="+995"
                  className="w-full px-5 py-3.5 bg-slate-50/50 rounded-2xl border border-slate-100 focus:outline-none focus:border-[#A3D1D6] focus:bg-white text-slate-800 font-medium transition"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-500 font-bold text-xs uppercase tracking-wider">{t.destLabel}</label>
                <select 
                  value={destination} 
                  onChange={(e) => setDestination(e.target.value)} 
                  className="w-full px-5 py-3.5 bg-slate-50/50 rounded-2xl border border-slate-100 focus:outline-none focus:border-[#A3D1D6] focus:bg-white text-slate-800 font-medium transition appearance-none"
                >
                  <option value="">{t.destPlaceholder}</option>
                  {destinations.map((dest, idx) => (
                    <option key={idx} value={dest}>{dest}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3: Travel Date and Tour Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-slate-500 font-bold text-xs uppercase tracking-wider">{t.dateLabel}</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  className="w-full px-5 py-3.5 bg-slate-50/50 rounded-2xl border border-slate-100 focus:outline-none focus:border-[#A3D1D6] focus:bg-white text-slate-800 font-medium transition"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-500 font-bold text-xs uppercase tracking-wider">{t.tourTypeLabel}</label>
                <select 
                  value={tourType} 
                  onChange={(e) => setTourType(e.target.value)} 
                  className="w-full px-5 py-3.5 bg-slate-50/50 rounded-2xl border border-slate-100 focus:outline-none focus:border-[#A3D1D6] focus:bg-white text-slate-800 font-medium transition appearance-none"
                >
                  <option value="">{t.tourTypePlaceholder}</option>
                  <option value="Fun Tour">{t.tourTypeOptions.fun}</option>
                  <option value="Romantic Tour">{t.tourTypeOptions.romantic}</option>
                  <option value="Adventure Tour">{t.tourTypeOptions.adventure}</option>
                </select>
              </div>
            </div>

            {/* Row 4: Message */}
            <div className="flex flex-col gap-2">
              <label className="text-slate-500 font-bold text-xs uppercase tracking-wider">{t.msgLabel} *</label>
              <textarea 
                rows="4" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                required 
                className="w-full px-5 py-3.5 bg-slate-50/50 rounded-2xl border border-slate-100 focus:outline-none focus:border-[#A3D1D6] focus:bg-white text-slate-800 font-medium transition resize-none"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#A3D1D6] text-white py-4 rounded-2xl font-semibold hover:bg-[#8cc4ca] transition duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{t.sending}</span>
                </>
              ) : (
                <span>{t.sendBtn}</span>
              )}
            </button>

          </form>
        </div>

      </section>

    </main>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={
      <main className="w-full bg-[#f8fafc] min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-[#A3D1D6] border-t-transparent animate-spin"></div>
        </div>
      </main>
    }>
      <ContactForm />
    </Suspense>
  );
}

