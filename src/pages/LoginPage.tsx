import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const { login, quickLoginAs } = useAuth();
  const navigate = useNavigate();

  const [nis, setNis] = useState<string>('102144');
  const [password, setPassword] = useState<string>('123');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const slides = [
    {
      image: '/img/image1.png',
      title: 'Lab Cloud & SIJA',
      desc: '36 Workstation Intel Core i7 & Cisco Router Rack Mounted'
    },
    {
      image: '/img/image2.png',
      title: 'Lab Rekayasa Perangkat Lunak',
      desc: 'Dual Screen Workstation & Smartboard Interaktif 75 Inch'
    },
    {
      image: '/img/image3.png',
      title: 'Teater Audio Visual & Auditorium',
      desc: 'Sound System Line Array 5000W & Dual Laser Projector'
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!nis.trim() || !password.trim()) {
      setErrorMessage('Harap masukkan NIS/NIP dan Kata Sandi.');
      return;
    }

    const res = login(nis, password);
    if (res.success) {
      navigate('/');
    } else {
      setErrorMessage(res.message || 'Login gagal. Periksa data kredensial Anda.');
    }
  };

  const handleQuickDemo = (role: UserRole, demoNis: string, demoPass: string) => {
    setNis(demoNis);
    setPassword(demoPass);
    quickLoginAs(role);
    navigate('/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-6 animate-fadeIn">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Side: Facility Showcase Carousel */}
        <div className="relative hidden md:flex flex-col justify-between p-8 bg-slate-950 text-white overflow-hidden">
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="absolute inset-0 w-full h-full object-cover opacity-30 transition-all duration-700 scale-102"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/img/image1.png';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

          {/* Top Brand */}
          <div className="relative z-10 flex items-center gap-3">
            <img src="/img/logo.png" alt="Logo SMKN 1 Jakarta" className="h-9 w-auto object-contain" />
            <div>
              <span className="font-bold text-sm tracking-tight">PEMANGAN</span>
              <p className="text-[10px] text-slate-400">SMK Negeri 1 Jakarta</p>
            </div>
          </div>

          {/* Bottom Carousel Text */}
          <div className="relative z-10 space-y-3">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                Fasilitas Unggulan
              </span>
              <h3 className="text-lg font-bold text-white">
                {slides[currentSlide].title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {slides[currentSlide].desc}
              </p>
            </div>

            {/* Slider Dots */}
            <div className="flex items-center gap-1.5 pt-1">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    currentSlide === idx ? 'w-5 bg-blue-500' : 'w-2 bg-slate-700'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-6 sm:p-8 flex flex-col justify-between space-y-5">
          
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 md:hidden pb-2">
              <img src="/img/logo.png" alt="Logo SMKN 1" className="h-8 w-auto object-contain" />
              <span className="font-bold text-base text-slate-900 dark:text-slate-100">PEMANGAN 2.0</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Masuk ke Portal
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Gunakan akun NIS (Siswa), NIP (Guru), atau Admin Sarpras.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-3.5">
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                NIS / NIP / Username
              </label>
              <input
                type="text"
                value={nis}
                onChange={(e) => setNis(e.target.value)}
                placeholder="102144 / 19800101 / admin"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Kata Sandi
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kata sandi default: 123"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-slate-100"
              />
            </div>

            {errorMessage && (
              <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
            >
              Masuk
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Akses Cepat Mode Uji Coba:
            </p>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemo('siswa', '102144', '123')}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-center transition-colors"
              >
                <p className="font-semibold text-slate-900 dark:text-slate-100 text-xs">Siswa</p>
                <span className="text-[10px] text-slate-500">NIS: 102144</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('guru', '19800101', '123')}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-center transition-colors"
              >
                <p className="font-semibold text-slate-900 dark:text-slate-100 text-xs">Guru</p>
                <span className="text-[10px] text-slate-500">NIP: 19800101</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('admin', 'admin', 'admin123')}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-center transition-colors"
              >
                <p className="font-semibold text-slate-900 dark:text-slate-100 text-xs">Admin</p>
                <span className="text-[10px] text-slate-500">admin</span>
              </button>
            </div>
          </div>

          <div className="text-center pt-1">
            <Link to="/" className="text-xs text-slate-500 hover:text-blue-700 dark:hover:text-blue-400">
              ← Kembali ke Beranda
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};
