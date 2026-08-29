import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
  durationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ 
  onComplete, 
  durationMs = 3000 
}) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [statusText, setStatusText] = useState('Menghubungkan ke sistem Sarpras...');

  useEffect(() => {
    const startTime = Date.now();
    const intervalTime = 30;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.round((elapsed / durationMs) * 100), 100);
      setProgress(pct);

      if (pct < 35) {
        setStatusText('Memuat katalog fasilitas & laboratorium...');
      } else if (pct < 75) {
        setStatusText('Memverifikasi jadwal matriks anti-bentrok...');
      } else if (pct < 100) {
        setStatusText('Menyiapkan portal peminjaman...');
      } else {
        setStatusText('Sistem siap digunakan');
      }

      if (elapsed >= durationMs) {
        clearInterval(timer);
        setIsFadingOut(true);
        setTimeout(() => {
          onComplete();
        }, 400); // Allow fade out transition to complete
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [durationMs, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-10 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-opacity duration-400 ease-out select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top Spacer */}
      <div className="w-full flex justify-between items-center text-[11px] text-slate-400 font-mono">
        <span>SMKN 1 JAKARTA</span>
        <span>SARPRAS V2.0</span>
      </div>

      {/* Center Brand & Logo */}
      <div className="flex flex-col items-center text-center space-y-4 max-w-sm">
        {/* Official Logo */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center animate-fadeIn">
          <img
            src="/img/logo.png"
            alt="Logo SMKN 1 Jakarta"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Title */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              PEMANGAN
            </h1>
            <span className="px-2 py-0.5 text-xs font-bold rounded bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
              2.0
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
            Sistem Peminjaman Ruangan & Lab Komputer
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            SMK Negeri 1 Jakarta Pusat
          </p>
        </div>

        {/* Progress Bar & Status (3-Color Strict) */}
        <div className="w-64 sm:w-72 space-y-2 pt-4">
          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-700 dark:bg-blue-500 rounded-full transition-all duration-75 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 font-medium">
            <span className="truncate max-w-[200px]">{statusText}</span>
            <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Bottom Footer Credits */}
      <div className="text-center text-[10px] text-slate-400 dark:text-slate-500">
        <span>Teknologi Informasi & Komunikasi • Standar Pelayanan Publik</span>
      </div>
    </div>
  );
};
