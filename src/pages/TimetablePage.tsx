import React from 'react';
import { Calendar, ShieldCheck, Clock, Layers } from 'lucide-react';
import { TimetableMatrix } from '../components/timetable/TimetableMatrix';

export const TimetablePage: React.FC = () => {
  return (
    <div className="py-4 sm:py-8 space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
            <Calendar className="w-4 h-4" />
            <span>Monitoring Fasilitas Real-Time</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Matriks Jadwal Penggunaan Ruangan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Visualisasi pemakaian 13 laboratorium komputer SIJA/RPL, kelas teori, teater audio visual, dan aula serbaguna SMKN 1 Jakarta dari pukul 07:00 hingga 17:00 WIB.
          </p>
        </div>

        {/* Quick Highlights */}
        <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>07:00 - 17:00 WIB</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <div className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>13 Ruangan & Lab</span>
          </div>
        </div>
      </div>

      {/* Timetable Interactive Grid */}
      <TimetableMatrix />

      {/* Additional Notice */}
      <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 flex items-start gap-3 text-xs text-blue-900 dark:text-blue-200">
        <ShieldCheck className="w-4 h-4 text-blue-700 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold">Prioritas Penggunaan Resmi Sarana & Prasarana</p>
          <p className="leading-relaxed text-blue-800/90 dark:text-blue-300/90">
            Jadwal berstatus <strong>Disetujui</strong> mengikat hak pemakaian ruangan sesuai surat izin. Klik slot bertanda <strong>+ (Tersedia)</strong> untuk langsung mengisi form permohonan reservasi dengan tanggal dan jam otomatis terpilih.
          </p>
        </div>
      </div>

    </div>
  );
};
