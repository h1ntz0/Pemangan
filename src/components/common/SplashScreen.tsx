import React, { useState, useEffect, useRef } from 'react';

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
  const [statusMessage, setStatusMessage] = useState('Menghubungkan ke layanan...');
  
  const startTimeRef = useRef(Date.now());
  const boostRef = useRef(0);

  // Tap anywhere to accelerate loading smoothly
  const handleScreenTap = () => {
    boostRef.current += 25;
  };

  useEffect(() => {
    startTimeRef.current = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const basePct = (elapsed / durationMs) * 100;
      const totalPct = Math.min(Math.round(basePct + boostRef.current), 100);

      setProgress(totalPct);

      if (totalPct < 35) {
        setStatusMessage('Menghubungkan ke layanan...');
      } else if (totalPct < 70) {
        setStatusMessage('Menyiapkan daftar ruangan & laboratorium...');
      } else if (totalPct < 100) {
        setStatusMessage('Memeriksa jadwal peminjaman...');
      } else {
        setStatusMessage('Halaman siap ditampilkan');
      }

      if (totalPct >= 100) {
        clearInterval(interval);
        setIsFadingOut(true);
        setTimeout(() => {
          onComplete();
        }, 300);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [durationMs, onComplete]);

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 150);
  };

  return (
    <div
      onClick={handleScreenTap}
      onTouchStart={handleScreenTap}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-10 bg-slate-900 text-white select-none transition-opacity duration-300 ease-out cursor-pointer ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top Bar */}
      <div className="w-full max-w-lg flex items-center justify-between text-xs text-slate-400">
        <span className="font-medium tracking-wide">SMK Negeri 1 Jakarta</span>
        <button
          onClick={handleSkip}
          className="px-2.5 py-1 rounded border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs transition-colors"
        >
          Lewati
        </button>
      </div>

      {/* Center Content: Genuine Human Copywriting about PEMANGAN */}
      <div className="flex flex-col items-center text-center space-y-5 max-w-md px-4">
        
        {/* Official Transparent Logo */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
          <img
            src="/img/logo.png"
            alt="Logo SMK Negeri 1 Jakarta"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Brand & Meaning */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            PEMANGAN
          </h1>
          <p className="text-xs sm:text-sm font-medium text-blue-400">
            Peminjaman Ruangan & Laboratorium
          </p>
          <p className="text-xs text-slate-300 leading-relaxed max-w-sm pt-1">
            Layanan resmi peminjaman fasilitas belajar, lab komputer kejuruan, dan ruang pertemuan untuk warga SMK Negeri 1 Jakarta.
          </p>
        </div>

        {/* Clean Hairline Progress */}
        <div className="w-full max-w-xs space-y-2 pt-2">
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-75 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-400">
            <span className="truncate">{statusMessage}</span>
            <span className="font-mono text-slate-300 font-semibold">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="text-center text-[11px] text-slate-500">
        <span>Seksi Sarana & Prasarana</span>
      </div>
    </div>
  );
};
