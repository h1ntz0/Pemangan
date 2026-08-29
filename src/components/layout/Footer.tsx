import React from 'react';
import { Shield, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-10 transition-colors no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center pb-8 border-b border-slate-100 dark:border-slate-800/80">
          
          {/* Institution Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
                SMK NEGERI 1 JAKARTA
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-semibold">
                Sarpras
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              Sistem Informasi Peminjaman Ruangan, Laboratorium Cloud & Jaringan SIJA, Studio Podcast, dan Fasilitas Resmi SMKN 1 Jakarta.
            </p>
          </div>

          {/* Standards & Accreditation */}
          <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">
                Standar Sarpras Berintegritas
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Pemerintah Provinsi DKI Jakarta • Dinas Pendidikan
              </p>
            </div>
          </div>

          {/* Development Credits */}
          <div className="text-left md:text-right space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Pemangan Enterprise v2.0</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Proyek Kreatif & Kewirausahaan (PKK) XI SIJA 1
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              Arrofi Zein & Rasya Aryasatya • Pembimbing: Pak Amrul Khairullah, S.Kom
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SMK Negeri 1 Jakarta. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>SOP Peminjaman</span>
            <span>•</span>
            <span>Kebijakan Lab</span>
            <span>•</span>
            <span>Bantuan Sarpras</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
