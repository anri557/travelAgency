"use client";
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const adminTranslations = {
  ka: {
    title: "ადმინისტრატორის პანელი",
    subtitle: "Explora-ს ჯავშნები და შეტყობინებები",
    searchPlaceholder: "ძებნა სახელით, ელ-ფოსტით ან ქალაქით...",
    allVibes: "ყველა ტიპი",
    totalInquiries: "სულ ჯავშნები",
    salesValue: "ჯამური გაყიდვები",
    topCity: "ტოპ ქალაქი",
    favoriteStyle: "პოპულარული სტილი",
    noInquiries: "ჯავშნები არ მოიძებნა",
    noInquiriesDesc: "როდესაც მომხმარებლები შეავსებენ საკონტაქტო ფორმას, მათი შეტყობინებები აქ გამოჩნდება.",
    deleteBtn: "ჯავშნის წაშლა",
    deleting: "იშლება...",
    customerDetails: "კლიენტის ინფორმაცია",
    bookingDetails: "პაკეტის დეტავები",
    contactInfo: "საკონტაქტო ინფორმაცია",
    selectedHotel: "შერჩეული სასტუმრო",
    priceLabel: "პაკეტის ღირებულება",
    durationLabel: "ხანგრძლივობა",
    vibeLabel: "ტურის ტიპი",
    dateLabel: "გამგზავრების თარიღი",
    messageLabel: "მომხმარებლის შეტყობინება",
    toastSuccess: "ჯავშანი წარმატებით წაიშალა",
    toastError: "შეცდომა ჯავშნის წაშლისას",
    phone: "ტელეფონი",
    email: "ფოსტა",
    datePlaceholder: "არ არის მითითებული",
    nights: "ღამე",
    tourTypes: {
      "Fun Tour": "🎉 Fun ტური",
      "Romantic Tour": "💑 რომანტიკული",
      "Adventure Tour": "🏛️ სათავგადასავლო",
      "N/A": "ზოგადი შეკითხვა"
    },
    // Login translations
    loginTitle: "ადმინისტრატორის ავტორიზაცია",
    loginSubtitle: "გთხოვთ შეიყვანოთ პაროლი შესასვლელად",
    passwordPlaceholder: "შეიყვანეთ პაროლი...",
    loginBtn: "შესვლა",
    invalidPassword: "არასწორი პაროლი, სცადეთ თავიდან."
  },
  en: {
    title: "Admin Dashboard",
    subtitle: "Explora Bookings & Inquiries CRM",
    searchPlaceholder: "Search by name, email, or city...",
    allVibes: "All Types",
    totalInquiries: "Total Inquiries",
    salesValue: "Total Sales Value",
    topCity: "Top Destination",
    favoriteStyle: "Favorite Style",
    noInquiries: "No inquiries found",
    noInquiriesDesc: "When users submit the booking contact form, their records will appear here.",
    deleteBtn: "Delete Booking",
    deleting: "Deleting...",
    customerDetails: "Customer Information",
    bookingDetails: "Booking Package Details",
    contactInfo: "Contact Details",
    selectedHotel: "Selected Hotel",
    priceLabel: "Package Price",
    durationLabel: "Duration of Stay",
    vibeLabel: "Tour Vibe/Type",
    dateLabel: "Departure Date",
    messageLabel: "Customer's Message",
    toastSuccess: "Booking deleted successfully",
    toastError: "Error deleting booking",
    phone: "Phone",
    email: "Email",
    datePlaceholder: "Not Specified",
    nights: "nights",
    tourTypes: {
      "Fun Tour": "🎉 Fun Tour",
      "Romantic Tour": "💑 Romantic Tour",
      "Adventure Tour": "🏛️ Adventure Tour",
      "N/A": "General Inquiry"
    },
    // Login translations
    loginTitle: "Admin Access",
    loginSubtitle: "Please enter the admin password to continue",
    passwordPlaceholder: "Enter password...",
    loginBtn: "Sign In",
    invalidPassword: "Incorrect password, please try again."
  }
};

export default function AdminPage() {
  const { lang, toggleLanguage } = useLanguage();
  const t = adminTranslations[lang];

  // Auth states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  // CRM data states
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVibe, setFilterVibe] = useState('All');
  const [toast, setToast] = useState({ show: false, success: false, message: '' });
  const [actionLoading, setActionLoading] = useState(false);

  // Load inquiries
  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/inquiries');
      const data = await res.json();
      if (data.success) {
        setInquiries(data.inquiries);
        if (data.inquiries.length > 0) {
          setSelectedInquiry(data.inquiries[0]);
        } else {
          setSelectedInquiry(null);
        }
      }
    } catch (err) {
      console.error("Error fetching inquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  // Check auth session storage on mount
  useEffect(() => {
    const authStatus = sessionStorage.getItem('adminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      fetchInquiries();
    }
    setCheckingAuth(false);
  }, []);

  // Handle Login submission
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'explora2026!') {
      sessionStorage.setItem('adminAuth', 'true');
      setIsAuthenticated(true);
      setLoginError(false);
      fetchInquiries();
    } else {
      setLoginError(true);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    setPassword('');
  };

  // Handle manual language toggles
  const changeLanguage = (target) => {
    if (lang !== target) {
      toggleLanguage();
    }
  };

  // Show status feedback
  const showToast = (success, msg) => {
    setToast({ show: true, success, message: msg });
    setTimeout(() => {
      setToast({ show: false, success: false, message: '' });
    }, 4000);
  };

  // Delete an inquiry
  const handleDelete = async (id) => {
    if (!confirm(lang === 'ka' ? "ნამდვილად გსურთ ამ ჯავშნის წაშლა?" : "Are you sure you want to delete this booking?")) {
      return;
    }
    setActionLoading(true);
    try {
      const res = await fetch(`/api/inquiries?id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        showToast(true, t.toastSuccess);
        // Refresh local state list
        const updated = inquiries.filter(inq => inq.id !== id);
        setInquiries(updated);
        // Reselect
        if (updated.length > 0) {
          setSelectedInquiry(updated[0]);
        } else {
          setSelectedInquiry(null);
        }
      } else {
        showToast(false, data.error || t.toastError);
      }
    } catch (err) {
      console.error("Delete error:", err);
      showToast(false, t.toastError);
    } finally {
      setActionLoading(false);
    }
  };

  // Compute CRM metrics
  const totalSales = inquiries.reduce((acc, inq) => {
    const priceVal = parseFloat(inq.hotelPrice) || 0;
    return acc + priceVal;
  }, 0);

  // Compute top city mode
  const getTopCity = () => {
    if (inquiries.length === 0) return '—';
    const counts = {};
    inquiries.forEach(inq => {
      if (inq.destination && inq.destination !== 'General Inquiry') {
        counts[inq.destination] = (counts[inq.destination] || 0) + 1;
      }
    });
    const cities = Object.keys(counts);
    if (cities.length === 0) return '—';
    return cities.reduce((a, b) => counts[a] > counts[b] ? a : b);
  };

  // Compute favorite vibe style mode
  const getFavoriteStyle = () => {
    if (inquiries.length === 0) return '—';
    const counts = {};
    inquiries.forEach(inq => {
      if (inq.tourType && inq.tourType !== 'N/A') {
        counts[inq.tourType] = (counts[inq.tourType] || 0) + 1;
      }
    });
    const styles = Object.keys(counts);
    if (styles.length === 0) return '—';
    const bestKey = styles.reduce((a, b) => counts[a] > counts[b] ? a : b);
    return t.tourTypes[bestKey] || bestKey;
  };

  // Filter and search lists
  const filteredInquiries = inquiries.filter(inq => {
    const matchesSearch = 
      inq.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.destination?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesVibe = filterVibe === 'All' || inq.tourType === filterVibe;

    return matchesSearch && matchesVibe;
  });

  // Render Authentication screen
  if (checkingAuth) {
    return (
      <div className="w-full min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-slate-200 border-t-[#A3D1D6] animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="w-full min-h-screen bg-[#0F172A] flex items-center justify-center px-4 relative overflow-hidden">
        {/* Decorative background gradients */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#A3D1D6]/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-800/60 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="w-full max-w-md bg-slate-900/80 border border-slate-800/80 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl flex flex-col gap-8 relative z-10">
          
          {/* Language Switcher in Login Screen */}
          <div className="absolute top-8 right-8 flex items-center gap-2">
            <button 
              onClick={() => changeLanguage('en')} 
              className={`text-xs font-black transition ${lang === 'en' ? 'text-[#A3D1D6]' : 'text-slate-500 hover:text-slate-400'}`}
            >
              EN
            </button>
            <span className="text-slate-800 text-[10px]">&bull;</span>
            <button 
              onClick={() => changeLanguage('ka')} 
              className={`text-xs font-black transition ${lang === 'ka' ? 'text-[#A3D1D6]' : 'text-slate-500 hover:text-slate-400'}`}
            >
              KA
            </button>
          </div>

          <div className="flex flex-col gap-2 text-center mt-4">
            <span className="text-[#A3D1D6] font-bold text-xs uppercase tracking-widest leading-none mb-1">
              Explora CRM
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight leading-none">
              {t.loginTitle}
            </h2>
            <p className="text-slate-400 font-semibold text-xs leading-relaxed mt-1">
              {t.loginSubtitle}
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <input
                type="password"
                placeholder={t.passwordPlaceholder}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (loginError) setLoginError(false);
                }}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-5 py-4 font-bold text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#A3D1D6]/30 focus:border-[#A3D1D6] transition"
                autoFocus
              />
              {loginError && (
                <span className="text-rose-500 text-[11px] font-black tracking-wide uppercase px-1 mt-1 block">
                  {t.invalidPassword}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="bg-[#A3D1D6] hover:bg-[#A3D1D6]/90 text-white font-black text-xs uppercase tracking-widest py-4.5 rounded-2xl transition shadow-lg shadow-[#A3D1D6]/10 flex items-center justify-center gap-2 mt-2"
            >
              <span>{t.loginBtn}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M10 17l5-5-5-5v10z"/>
              </svg>
            </button>
          </form>
        </div>
      </main>
    );
  }

  // Render Admin Dashboard CRM
  return (
    <main className="w-full bg-slate-50/50 min-h-screen px-4 md:px-12 py-10 flex flex-col gap-8 relative animate-fade-in">
      
      {/* Toast Alert Box */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-[100] max-w-sm p-5 rounded-2xl border backdrop-blur-md shadow-lg flex items-center gap-3 transition-all duration-300 ${
          toast.success ? 'bg-emerald-50/90 border-emerald-200 text-emerald-800' : 'bg-rose-50/90 border-rose-200 text-rose-800'
        }`}>
          <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {toast.success ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            )}
          </svg>
          <span className="text-xs font-black tracking-wide uppercase">{toast.message}</span>
        </div>
      )}

      {/* Header section with Logout */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-2 max-w-2xl">
          <span className="text-[#A3D1D6] font-bold text-xs uppercase tracking-widest">
            {lang === 'ka' ? 'მართვის პანელი' : 'EXPLORA MANAGEMENT'}
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight leading-none mb-1">
            {t.title}
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            {t.subtitle}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-slate-200 hover:bg-slate-300/80 text-slate-700 px-5 py-3.5 rounded-2xl text-xs font-black tracking-wide uppercase transition flex items-center gap-2"
        >
          <span>{lang === 'ka' ? 'გამოსვლა' : 'Logout'}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current" viewBox="0 0 24 24">
            <path d="M14.08 15.59L16.67 13H7v-2h9.67l-2.59-2.59L15.5 7l5 5-5 5-1.42-1.41M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c3.15 0 5.96-1.46 7.82-3.74l-1.57-1.24C16.63 18.77 14.44 20 12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8c2.44 0 4.63 1.23 6.25 3.12l1.57-1.24C17.96 3.46 15.15 2 12 2z"/>
          </svg>
        </button>
      </div>

      {/* CRM Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Stat 1: Total inquiries */}
        <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm flex flex-col gap-2">
          <span className="text-slate-400 text-xs font-black uppercase tracking-wider">{t.totalInquiries}</span>
          <span className="text-4xl font-black text-slate-800 leading-none">{inquiries.length}</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">
            {lang === 'ka' ? 'ჯამში შემოსული' : 'Inquiries in DB'}
          </span>
        </div>

        {/* Stat 2: Total dynamic package value */}
        <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm flex flex-col gap-2">
          <span className="text-slate-400 text-xs font-black uppercase tracking-wider">{t.salesValue}</span>
          <span className="text-4xl font-black text-[#A3D1D6] leading-none">{totalSales.toLocaleString()} <span className="text-xl font-bold">GEL</span></span>
          <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">
            {lang === 'ka' ? 'დაჯავშნილი პაკეტები' : 'Booked packages sum'}
          </span>
        </div>

        {/* Stat 3: Top city */}
        <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm flex flex-col gap-2">
          <span className="text-slate-400 text-xs font-black uppercase tracking-wider">{t.topCity}</span>
          <span className="text-3xl font-black text-slate-800 leading-none truncate block max-w-full">{getTopCity()}</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">
            {lang === 'ka' ? 'მოთხოვნადი ქალაქი' : 'Most popular destination'}
          </span>
        </div>

        {/* Stat 4: Top Tour type style */}
        <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm flex flex-col gap-2">
          <span className="text-slate-400 text-xs font-black uppercase tracking-wider">{t.favoriteStyle}</span>
          <span className="text-2xl font-black text-slate-800 leading-none truncate block max-w-full">{getFavoriteStyle()}</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">
            {lang === 'ka' ? 'მოთხოვნადი სტილი' : 'Most popular vibe type'}
          </span>
        </div>
      </div>

      {/* Main CRM interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left/Center Column (8 cols): Filters & List of bookings */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Search bar & filter controls */}
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <input 
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow bg-white border border-slate-100 rounded-2xl px-5 py-4 font-bold text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#A3D1D6]/30 focus:border-[#A3D1D6] transition shadow-sm"
            />
            
            <div className="flex gap-2 shrink-0">
              {['All', 'Fun Tour', 'Romantic Tour', 'Adventure Tour'].map((vibe) => (
                <button
                  key={vibe}
                  onClick={() => setFilterVibe(vibe)}
                  className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide border transition-all ${
                    filterVibe === vibe
                      ? 'bg-[#A3D1D6] border-[#A3D1D6] text-white'
                      : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                  }`}
                >
                  {vibe === 'All' ? t.allVibes : t.tourTypes[vibe] || vibe}
                </button>
              ))}
            </div>
          </div>

          {/* Bookings inquiry list */}
          <div className="flex flex-col gap-4">
            {loading ? (
              // Pulse loadings
              [1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-[2rem] border border-slate-100 p-6 flex flex-col gap-3 animate-pulse">
                  <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                  <div className="h-6 bg-slate-100 rounded w-1/2"></div>
                  <div className="h-4 bg-slate-100 rounded w-1/3"></div>
                </div>
              ))
            ) : filteredInquiries.length > 0 ? (
              filteredInquiries.map((inq) => {
                const isSelected = selectedInquiry?.id === inq.id;
                const formattedDate = new Date(inq.createdAt).toLocaleDateString(lang === 'ka' ? 'ka-GE' : 'en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div
                    key={inq.id}
                    onClick={() => setSelectedInquiry(inq)}
                    className={`bg-white rounded-[2rem] border p-6 flex flex-col gap-3 cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                      isSelected
                        ? 'border-[#A3D1D6] shadow-[0_10px_35px_rgba(163,209,214,0.1)] ring-2 ring-[#A3D1D6]/20'
                        : 'border-slate-100 hover:border-[#A3D1D6]/40 hover:shadow-sm'
                    }`}
                  >
                    {/* Top Row: customer name and timestamp */}
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {formattedDate}
                      </span>
                      {inq.tourType !== 'N/A' && (
                        <span className="bg-slate-50 text-slate-500 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border border-slate-100">
                          {t.tourTypes[inq.tourType] || inq.tourType}
                        </span>
                      )}
                    </div>

                    {/* Middle Row: Name and destination */}
                    <div>
                      <h3 className="text-xl font-black text-slate-800 leading-tight mb-1 group-hover:text-[#A3D1D6] transition-colors">
                        {inq.name}
                      </h3>
                      <p className="text-[#A3D1D6] text-xs font-bold flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        <span>{inq.destination}</span>
                        {inq.hotel !== 'N/A' && (
                          <span className="text-slate-400 font-medium">
                            &bull; {inq.hotel}
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Bottom message teaser snippet */}
                    <p className="text-slate-500 text-xs font-semibold leading-relaxed line-clamp-2">
                      {inq.message}
                    </p>

                    {/* Detail total indicator */}
                    {inq.hotelPrice !== 'N/A' && (
                      <div className="absolute right-6 bottom-5 flex flex-col items-end">
                        <span className="text-xs font-black text-slate-800">
                          {inq.hotelPrice} GEL
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              // Gorgeous empty state
              <div className="flex flex-col items-center justify-center gap-4 text-center py-16 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="h-16 w-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 19v-8.93a2 2 0 01.89-1.664l8-4.796a2 2 0 012.22 0l8 4.796A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                  </svg>
                </div>
                <div className="max-w-xs flex flex-col gap-1">
                  <h3 className="text-base font-black text-slate-800">{t.noInquiries}</h3>
                  <p className="text-slate-400 text-xs font-semibold leading-relaxed">
                    {t.noInquiriesDesc}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Active Booking Details Inspector Panel */}
        <div className="lg:col-span-5 lg:sticky lg:top-10">
          {selectedInquiry ? (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-md p-8 flex flex-col gap-6">
              
              {/* Inspection Header */}
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-1">
                    {selectedInquiry.name}
                  </h2>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    ID: {selectedInquiry.id}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(selectedInquiry.id)}
                  disabled={actionLoading}
                  className="bg-rose-50 hover:bg-rose-100/80 text-rose-600 px-4 py-2.5 rounded-xl text-xs font-black tracking-wide transition disabled:opacity-50"
                >
                  {actionLoading ? t.deleting : t.deleteBtn}
                </button>
              </div>

              <div className="w-full h-[1px] bg-slate-100"></div>

              {/* Customer Contact Details block */}
              <div className="flex flex-col gap-3">
                <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  {t.customerDetails}
                </h3>
                <div className="bg-slate-50/60 rounded-2xl p-4 flex flex-col gap-2 text-xs font-bold text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t.email}</span>
                    <a href={`mailto:${selectedInquiry.email}`} className="text-[#A3D1D6] hover:underline">
                      {selectedInquiry.email}
                    </a>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t.phone}</span>
                    <a href={`tel:${selectedInquiry.phone}`} className="text-slate-700">
                      {selectedInquiry.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Booking Package details grid block */}
              <div className="flex flex-col gap-3">
                <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  {t.bookingDetails}
                </h3>
                
                <div className="grid grid-cols-2 gap-3.5">
                  {/* Destination */}
                  <div className="bg-slate-50/40 rounded-xl p-3.5 flex flex-col gap-0.5">
                    <span className="text-slate-400 text-[9px] font-black uppercase tracking-wider">
                      {lang === 'ka' ? 'მიმართულება' : 'Destination'}
                    </span>
                    <span className="text-sm font-black text-slate-800">
                      {selectedInquiry.destination}
                    </span>
                  </div>

                  {/* Travel Date */}
                  <div className="bg-slate-50/40 rounded-xl p-3.5 flex flex-col gap-0.5">
                    <span className="text-slate-400 text-[9px] font-black uppercase tracking-wider">
                      {t.dateLabel}
                    </span>
                    <span className="text-sm font-black text-slate-800">
                      {selectedInquiry.travelDate === 'N/A' ? t.datePlaceholder : selectedInquiry.travelDate}
                    </span>
                  </div>

                  {/* Duration */}
                  <div className="bg-slate-50/40 rounded-xl p-3.5 flex flex-col gap-0.5">
                    <span className="text-slate-400 text-[9px] font-black uppercase tracking-wider">
                      {t.durationLabel}
                    </span>
                    <span className="text-sm font-black text-slate-800">
                      {selectedInquiry.duration !== 'N/A' ? `${selectedInquiry.duration} ${t.nights}` : '—'}
                    </span>
                  </div>

                  {/* Tour Type Vibe */}
                  <div className="bg-slate-50/40 rounded-xl p-3.5 flex flex-col gap-0.5">
                    <span className="text-slate-400 text-[9px] font-black uppercase tracking-wider">
                      {t.vibeLabel}
                    </span>
                    <span className="text-sm font-black text-slate-800 truncate">
                      {t.tourTypes[selectedInquiry.tourType] || selectedInquiry.tourType}
                    </span>
                  </div>
                </div>

                {/* Hotel and Total dynamic pricing panel */}
                {selectedInquiry.hotel !== 'N/A' && (
                  <div className="bg-[#A3D1D6]/5 border border-[#A3D1D6]/20 rounded-2xl p-4 flex flex-col gap-3 mt-1">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[#88bdc2] text-[9.5px] font-black uppercase tracking-wider">
                          {t.selectedHotel}
                        </span>
                        <span className="text-sm font-black text-slate-800 truncate max-w-[200px]">
                          {selectedInquiry.hotel}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[#88bdc2] text-[9.5px] font-black uppercase tracking-wider block">
                          {t.priceLabel}
                        </span>
                        <span className="text-lg font-black text-slate-800">
                          {selectedInquiry.hotelPrice} GEL
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Inquiry custom message */}
              <div className="flex flex-col gap-3 flex-grow">
                <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  {t.messageLabel}
                </h3>
                <div className="bg-slate-50/60 rounded-2xl p-5 text-xs font-semibold leading-relaxed text-slate-600 border border-slate-100 flex-grow min-h-[120px] whitespace-pre-line">
                  {selectedInquiry.message}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-slate-50/30 rounded-[2.5rem] border border-dashed border-slate-200 py-16 px-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center justify-center">
              {lang === 'ka' ? 'აირჩიეთ ჯავშანი საჩვენებლად' : 'Select a booking to inspect'}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
