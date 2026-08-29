import React, { useState, useEffect, useRef } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
  durationMs?: number;
}

interface StepStatus {
  id: string;
  label: string;
  detail: string;
}

const SYSTEM_STEPS: StepStatus[] = [
  { id: '01', label: 'Inisialisasi Node', detail: 'SMKN 1 Jakarta Server' },
  { id: '02', label: 'Sinkronisasi Jadwal', detail: '13 Lab & Ruangan Matriks' },
  { id: '03', label: 'Validasi Anti-Bentrok', detail: 'Conflict Engine Terkalibrasi' },
  { id: '04', label: 'Sistem Terhubung', detail: 'Siap Digunakan' },
];

export const SplashScreen: React.FC<SplashScreenProps> = ({ 
  onComplete, 
  durationMs = 3000 
}) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  // Interactive Tilt State
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const startTimeRef = useRef(Date.now());
  const boostRef = useRef(0); // Boost increment when user taps

  // Handle Interactive Tap to Accelerate Loading & Ripple Effect
  const handleInteraction = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    // Determine coordinate
    let clientX = 0;
    let clientY = 0;
    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    // Add interactive ripple
    const rippleId = Date.now() + Math.random();
    setRipples((prev) => [...prev.slice(-3), { id: rippleId, x: clientX, y: clientY }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 600);

    // Boost progress by 20% on tap for instant interactive feedback!
    boostRef.current += 20;
  };

  // Handle Mouse/Touch Move for Interactive 3D Card Tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 14, y: -y * 14 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Main Timer & Smooth Progress Physics
  useEffect(() => {
    startTimeRef.current = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const basePct = (elapsed / durationMs) * 100;
      const totalPct = Math.min(Math.round(basePct + boostRef.current), 100);

      progressRef.current = totalPct;
      setProgress(totalPct);

      // Determine step
      if (totalPct < 25) setCurrentStepIndex(0);
      else if (totalPct < 55) setCurrentStepIndex(1);
      else if (totalPct < 85) setCurrentStepIndex(2);
      else setCurrentStepIndex(3);

      if (totalPct >= 100) {
        clearInterval(interval);
        setIsFadingOut(true);
        setTimeout(() => {
          onComplete();
        }, 350);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [durationMs, onComplete]);

  // Instant Finish
  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 200);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-10 bg-slate-950 text-white select-none overflow-hidden transition-opacity duration-350 ease-out cursor-pointer ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Interactive Touch Ripples */}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute pointer-events-none rounded-full border border-blue-500/60 bg-blue-500/10 animate-ping"
          style={{
            left: r.x - 40,
            top: r.y - 40,
            width: 80,
            height: 80,
            animationDuration: '600ms'
          }}
        />
      ))}

      {/* Subtle Background Grid Line System (Clean, No AI Blobs) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" 
      />

      {/* Top Bar: System ID & Skip Button */}
      <div className="w-full max-w-4xl flex items-center justify-between z-10 text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="tracking-wider">SMKN 1 JAKARTA // SARPRAS-CORE</span>
        </div>

        <button
          onClick={handleSkip}
          className="px-3 py-1 rounded-md border border-slate-800 hover:border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-[11px] font-sans transition-colors cursor-pointer"
        >
          Lewati →
        </button>
      </div>

      {/* Center Interactive Stage with 3D Tilt */}
      <div 
        className="flex flex-col items-center text-center space-y-6 max-w-md z-10 transition-transform duration-150 ease-out"
        style={{
          transform: `perspective(1000px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`
        }}
      >
        {/* Animated Geometric Orbit Ring & Official Logo */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
          
          {/* Outer Precision Tick Ring */}
          <svg className="absolute inset-0 w-full h-full animate-[spin_12s_linear_infinite]" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="#1e293b"
              strokeWidth="1.5"
              strokeDasharray="2 4"
            />
          </svg>

          {/* Active Orbit Progress Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeDasharray="289"
              strokeDashoffset={289 - (289 * progress) / 100}
              strokeLinecap="round"
              className="transition-all duration-75"
            />
          </svg>

          {/* Clean Official Logo */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center p-1">
            <img
              src="/img/logo.png"
              alt="Logo SMKN 1 Jakarta"
              className="w-full h-full object-contain filter drop-shadow-sm"
            />
          </div>
        </div>

        {/* Title & Brand */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              PEMANGAN
            </h1>
            <span className="px-2 py-0.5 text-xs font-mono font-bold rounded bg-slate-800 text-blue-400 border border-slate-700">
              2.0
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Sistem Informasi Sarana & Prasarana
          </p>
        </div>

        {/* System Diagnostics Step Checklist */}
        <div className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2 text-left shadow-lg">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800 text-[10px] uppercase font-mono tracking-wider text-slate-400">
            <span>Diagnostik Sistem</span>
            <span className="text-blue-400 font-bold">{progress}% SELESAI</span>
          </div>

          <div className="space-y-1.5 text-xs">
            {SYSTEM_STEPS.map((step, idx) => {
              const isDone = progress >= (idx + 1) * 25 || idx < currentStepIndex;
              const isActive = idx === currentStepIndex && progress < 100;

              return (
                <div 
                  key={step.id} 
                  className={`flex items-center justify-between py-0.5 transition-colors ${
                    isDone 
                      ? 'text-slate-300' 
                      : isActive 
                      ? 'text-blue-400 font-semibold' 
                      : 'text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-mono text-[10px] opacity-60">[{step.id}]</span>
                    <span className="truncate text-[11px]">{step.label}</span>
                  </div>
                  <span className="font-mono text-[10px] shrink-0">
                    {isDone ? (
                      <span className="text-blue-400 font-bold">OK</span>
                    ) : isActive ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      '--'
                    )}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Hairline Precision Loading Bar */}
          <div className="pt-1">
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-75 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Interactive Touch Hint */}
        <p className="text-[11px] text-slate-500 font-medium animate-pulse">
          ⚡ Ketuk di mana saja untuk mempercepat
        </p>
      </div>

      {/* Bottom Bar: Public Service Standards */}
      <div className="w-full max-w-4xl flex items-center justify-between z-10 text-[10px] text-slate-500 font-mono">
        <span>SMK NEGERI 1 JAKARTA</span>
        <span>STANDAR KEDINASAN DKI</span>
      </div>
    </div>
  );
};
