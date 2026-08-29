import React from 'react';

export const KopSurat: React.FC = () => {
  return (
    <div className="border-b-4 border-double border-slate-900 dark:border-slate-100 pb-3 mb-6">
      <div className="flex items-center justify-between gap-4">
        {/* Logo Resmi SMKN 1 Jakarta */}
        <div className="w-16 h-16 shrink-0 flex items-center justify-center">
          <img
            src="/img/logo.png"
            alt="Logo SMKN 1 Jakarta"
            className="w-14 h-14 object-contain"
          />
        </div>

        {/* Text Header Kedinasan */}
        <div className="text-center flex-1">
          <h4 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-slate-800 dark:text-slate-200">
            Pemerintah Provinsi Daerah Khusus Ibukota Jakarta
          </h4>
          <h3 className="text-xs sm:text-sm font-bold tracking-wide uppercase text-slate-800 dark:text-slate-200">
            Dinas Pendidikan
          </h3>
          <h2 className="text-base sm:text-lg font-extrabold tracking-wide uppercase text-blue-900 dark:text-blue-400">
            Sekolah Menengah Kejuruan Negeri 1 Jakarta
          </h2>
          <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-tight">
            Jl. Budi Utomo No. 7, Pasar Baru, Kec. Sawah Besar, Kota Jakarta Pusat, DKI Jakarta 10710
          </p>
          <p className="text-[9px] sm:text-[11px] text-slate-500 dark:text-slate-400">
            Telepon: (021) 3813630 | Laman: smkn1jakarta.sch.id | Pos-el: info@smkn1jakarta.sch.id
          </p>
        </div>

        {/* Logo Sisi Kanan */}
        <div className="w-16 h-16 shrink-0 flex items-center justify-center">
          <img
            src="/img/logo.png"
            alt="Logo SMKN 1 Jakarta"
            className="w-14 h-14 object-contain"
          />
        </div>
      </div>
    </div>
  );
};
