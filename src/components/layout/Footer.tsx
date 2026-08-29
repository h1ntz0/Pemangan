import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 transition-colors no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start pb-6 border-b border-slate-100 dark:border-slate-800">
          
          {/* Institution Info */}
          <div className="space-y-1.5">
            <span className="font-bold text-sm text-slate-900 dark:text-white tracking-tight">
              SMK NEGERI 1 JAKARTA
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              Layanan resmi peminjaman laboratorium komputer, ruang praktik kejuruan SIJA & RPL, studio multimedia, dan aula sekolah.
            </p>
          </div>

          {/* Location & Authority */}
          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              Seksi Sarana & Prasarana
            </p>
            <p className="text-[11px] text-slate-500 leading-tight">
              Jl. Budi Utomo No. 7, Pasar Baru, Sawah Besar, Jakarta Pusat
            </p>
            <p className="text-[11px] text-slate-500">
              Dinas Pendidikan Provinsi DKI Jakarta
            </p>
          </div>

          {/* Development Credits */}
          <div className="text-left md:text-right space-y-1 text-xs">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              PEMANGAN (Peminjaman Ruangan)
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Pengembangan Sistem Kejuruan SIJA SMKN 1 Jakarta
            </p>
            <p className="text-[10px] text-slate-400">
              Arrofi Zein & Rasya Aryasatya • Pembimbing: Pak Amrul Khairullah, S.Kom
            </p>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-slate-500 gap-2">
          <p>© {new Date().getFullYear()} SMK Negeri 1 Jakarta.</p>
          <div className="flex items-center gap-3 text-[11px]">
            <span>SOP Peminjaman</span>
            <span>•</span>
            <span>Tata Tertib Lab</span>
            <span>•</span>
            <span>Pusat Bantuan</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
