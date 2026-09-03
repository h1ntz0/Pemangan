import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-10 pb-10 transition-colors no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start pb-8 border-b border-slate-100 dark:border-slate-800">
          
          {/* Col 1: Institution & Brand */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <img src="/img/logo.png" alt="Logo SMKN 1 Jakarta" className="h-8 w-auto object-contain" />
              <div>
                <span className="font-bold text-sm text-slate-900 dark:text-white tracking-tight block">
                  PEMANGAN
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  SMK Negeri 1 Jakarta
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Layanan peminjaman laboratorium kejuruan, ruang teori, dan fasilitas sekolah terpadu.
            </p>
          </div>

          {/* Col 2: Location & Contact */}
          <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
            <h4 className="font-semibold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">
              Alamat & Narahubung
            </h4>
            <div className="space-y-1.5 text-slate-500 dark:text-slate-400">
              <p>Jl. Budi Utomo No. 7, Pasar Baru, Sawah Besar, Jakarta Pusat 10710</p>
              <p>(021) 3813630</p>
              <p>sarpras@smkn1jakarta.sch.id</p>
            </div>
          </div>

          {/* Col 3: Quick Navigation & Portals */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-semibold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">
              Menu Layanan
            </h4>
            <ul className="space-y-1.5 text-slate-500 dark:text-slate-400">
              <li>
                <Link to="/rooms" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                  Daftar Ruangan & Lab
                </Link>
              </li>
              <li>
                <Link to="/booking" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                  Formulir Peminjaman
                </Link>
              </li>
              <li>
                <Link to="/timetable" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                  Jadwal Keterisian
                </Link>
              </li>
              <li>
                <Link to="/tracking" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                  Lacak Permohonan
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                  Panel Verifikasi Sarpras
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Development Credits */}
          <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
            <h4 className="font-semibold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">
              Pengembang & Pembimbing
            </h4>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
              <p className="font-medium text-slate-800 dark:text-slate-200 text-xs">
                Karya Siswa SIJA SMKN 1 Jakarta
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Arrofi Zein & Rasya Aryasatya (XI SIJA 1)
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-700/60">
                Pembimbing: Amrul Khairullah, S.Kom
              </p>
            </div>
            <div className="flex items-center gap-3 pt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
              <a 
                href="https://smkn1jakarta.sch.id" 
                target="_blank" 
                rel="noreferrer"
                className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
              >
                Website Sekolah
              </a>
              <span>•</span>
              <a 
                href="https://disdik.jakarta.go.id" 
                target="_blank" 
                rel="noreferrer"
                className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
              >
                Disdik DKI Jakarta
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright & sub-links */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} SMK Negeri 1 Jakarta</p>
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer">SOP Sarana & Prasarana</span>
            <span>•</span>
            <span className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer">Tata Tertib Laboratorium</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
