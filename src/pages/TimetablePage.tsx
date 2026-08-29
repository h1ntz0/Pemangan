import React from 'react';
import { Calendar, Info } from 'lucide-react';
import { TimetableMatrix } from '../components/timetable/TimetableMatrix';

export const TimetablePage: React.FC = () => {
  return (
    <div className="py-6 sm:py-10 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
          <Calendar className="w-4 h-4" />
          <span>Monitoring Fasilitas Real-Time</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
          Matriks Jadwal Penggunaan Ruangan
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
          Visualisasi pemakaian 13 ruangan dan lab SMKN 1 Jakarta dari pukul 07:00 hingga 17:00 WIB. Klik slot kosong untuk langsung melakukan reservasi.
        </p>
      </div>

      {/* Timetable Interactive Grid */}
      <TimetableMatrix />

      {/* Additional Notice */}
      <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/60 flex items-start gap-3 text-xs text-blue-900 dark:text-blue-200">
        <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Catatan Sarpras:</strong> Ruangan yang berstatus <em>Disetujui</em> memiliki prioritas penggunaan mutlak. Untuk kebutuhan mendesak atau pergeseran jadwal kedinasan, silakan hubungi Ruang Tata Usaha / Koordinator Sarpras.
        </p>
      </div>

    </div>
  );
};
