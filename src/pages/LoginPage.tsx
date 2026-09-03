import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  GraduationCap, 
  UserCheck, 
  Shield, 
  Wrench, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  User as UserIcon,
  Sparkles,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const { login, quickLoginAs, currentUser } = useAuth();
  const navigate = useNavigate();

  const [nis, setNis] = useState<string>('102144');
  const [password, setPassword] = useState<string>('123');
  const [selectedRole, setSelectedRole] = useState<UserRole>('siswa');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const roleConfigs = [
    {
      role: 'siswa' as UserRole,
      title: 'Siswa / OSIS',
      subtitle: 'Pengajuan Ruang & Lab',
      nis: '102144',
      pass: '123',
      name: 'Arrofi Zein',
      desc: 'Akses peminjaman lab komputer SIJA/RPL, ekskul, dan cek status tiket.',
      icon: <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      tag: 'NIS: 102144',
      badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-900'
    },
    {
      role: 'guru' as UserRole,
      title: 'Guru Pendidik',
      subtitle: 'KBM & Bimbingan',
      nis: '19800101',
      pass: 'guru',
      name: 'Pak Amrul Khairullah',
      desc: 'Persetujuan bimbingan praktikum, booking ruang teater dan aula rapat.',
      icon: <UserCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      tag: 'NIP: 19800101',
      badgeClass: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900'
    },
    {
      role: 'admin' as UserRole,
      title: 'Administrator',
      subtitle: 'Manajemen Sistem',
      nis: 'admin',
      pass: 'admin',
      name: 'Staf Tata Usaha',
      desc: 'Kelola data seluruh ruangan, ekspor CSV rekapitulasi, dan audit log.',
      icon: <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      tag: 'User: admin',
      badgeClass: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 border-purple-200 dark:border-purple-900'
    },
    {
      role: 'sarpras' as UserRole,
      title: 'Petugas Sarpras',
      subtitle: 'Approval & Fasilitas',
      nis: 'sarpras',
      pass: '123',
      name: 'Tim Sarpras SMKN 1',
      desc: 'Review tiket masuk, verifikasi bentrok jadwal, terbitkan surat izin resmi.',
      icon: <Wrench className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      tag: 'User: sarpras',
      badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-900'
    }
  ];

  const slides = [
    {
      image: '/img/image1.png',
      title: 'Lab Cloud Computing & SIJA',
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

  const handleSelectRoleCard = (config: typeof roleConfigs[0]) => {
    setSelectedRole(config.role);
    setNis(config.nis);
    setPassword(config.pass);
    setErrorMessage('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    if (!nis.trim() || !password.trim()) {
      setErrorMessage('Harap masukkan NIS/NIP/Username dan Kata Sandi.');
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      const res = login(nis, password);
      setIsLoading(false);
      if (res.success) {
        navigate('/');
      } else {
        setErrorMessage(res.message || 'Login gagal. Periksa data kredensial Anda.');
      }
    }, 200);
  };

  const handleQuickEnter = (role: UserRole) => {
    quickLoginAs(role);
    navigate('/');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-6 sm:py-10 animate-fadeIn">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Side: Facility Showcase & Brand (5 Cols) */}
        <div className="relative hidden lg:flex lg:col-span-5 flex-col justify-between p-8 bg-slate-950 text-white overflow-hidden">
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="absolute inset-0 w-full h-full object-cover opacity-35 transition-all duration-700 scale-102"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/img/image1.png';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />

          {/* Top Brand Header */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <img src="/img/logo.png" alt="Logo SMKN 1 Jakarta" className="h-10 w-auto object-contain drop-shadow" />
              <div>
                <span className="font-bold text-base tracking-tight text-white">
                  PEMANGAN
                </span>
                <p className="text-xs text-slate-300 font-medium">SMK Negeri 1 Jakarta</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs text-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 text-blue-300 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sistem Peminjaman Terpadu</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Platform digital resmi pengelolaan dan reservasi sarana prasarana, lab komputer, smart class, dan aula sekolah.
              </p>
            </div>
          </div>

          {/* Bottom Carousel Highlights */}
          <div className="relative z-10 space-y-3 pt-6">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400">
                Fasilitas Unggulan Kampus
              </span>
              <h3 className="text-base font-bold text-white">
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
                    currentSlide === idx ? 'w-6 bg-blue-500' : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Role Picker & Auth Form (7 Cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          
          {/* Header Mobile / Title */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 lg:hidden">
                <img src="/img/logo.png" alt="Logo SMKN 1" className="h-8 w-auto object-contain" />
                <span className="font-bold text-base text-slate-900 dark:text-slate-100">PEMANGAN</span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden sm:inline-block">
                Pemerintah Provinsi DKI Jakarta
              </span>
            </div>
            
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Portal Masuk Pengguna
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Pilih peran untuk simulasi instan atau masukkan data akun terdaftar Anda.
              </p>
            </div>
          </div>

          {/* Role Picker Interactive Cards (Siswa, Guru, Admin, Sarpras) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                Pilih Akses Peran Pengujian:
              </label>
              <span className="text-[10px] text-slate-500">Klik kartu untuk isi otomatis</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {roleConfigs.map((cfg) => {
                const isSelected = selectedRole === cfg.role && nis === cfg.nis;
                return (
                  <button
                    key={cfg.role}
                    type="button"
                    onClick={() => handleSelectRoleCard(cfg)}
                    className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 dark:border-blue-500 ring-1 ring-blue-600 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-2xs">
                        {cfg.icon}
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-900 dark:text-white">{cfg.title}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{cfg.name}</p>
                    </div>
                    <span className={`inline-block mt-2 px-1.5 py-0.5 rounded text-[9px] font-mono border ${cfg.badgeClass}`}>
                      {cfg.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                <span>NIS / NIP / Username Pengenal</span>
              </label>
              <input
                type="text"
                value={nis}
                onChange={(e) => setNis(e.target.value)}
                placeholder="Contoh: 102144 / 19800101 / admin / sarpras"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-slate-100 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Kata Sandi</span>
                </label>
                <span className="text-[10px] text-slate-500">Default: 123 / admin / guru</span>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi..."
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-slate-100 transition-all"
              />
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isLoading ? 'Memverifikasi...' : 'Masuk ke Sistem'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                type="button"
                onClick={() => handleQuickEnter(selectedRole)}
                title="Bypass form dan langsung masuk dengan peran terpilih"
                className="py-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors shrink-0"
              >
                Langsung Masuk
              </button>
            </div>
          </form>

          {/* Current Session Banner if logged in */}
          {currentUser && (
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-blue-700 text-white text-[10px] font-bold flex items-center justify-center">
                  {currentUser.avatar}
                </div>
                <span className="text-slate-700 dark:text-slate-300">
                  Saat ini masuk sebagai <strong>{currentUser.name}</strong> ({currentUser.role})
                </span>
              </div>
              <button
                onClick={() => navigate('/')}
                className="text-blue-700 dark:text-blue-400 font-semibold hover:underline shrink-0"
              >
                Buka Beranda →
              </button>
            </div>
          )}

          {/* Footer links */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Link to="/" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
              ← Kembali ke Beranda
            </Link>
            <span>SMKN 1 Jakarta • SIJA & Sarpras</span>
          </div>

        </div>

      </div>
    </div>
  );
};
