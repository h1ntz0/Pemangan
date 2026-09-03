import React from 'react';
import { Room } from '../../types';
import { 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Sun, 
  Sunrise, 
  Sunset, 
  CalendarDays,
  ShieldAlert
} from 'lucide-react';

interface StepDateTimeProps {
  selectedRoom: Room | undefined;
  bookingDate: string;
  onDateChange: (val: string) => void;
  startTime: string;
  onStartTimeChange: (val: string) => void;
  endTime: string;
  onEndTimeChange: (val: string) => void;
  hasConflict: boolean;
}

export const StepDateTime: React.FC<StepDateTimeProps> = ({
  selectedRoom,
  bookingDate,
  onDateChange,
  startTime,
  onStartTimeChange,
  endTime,
  onEndTimeChange,
  hasConflict
}) => {
  // Preset Time Slots
  const timePresets = [
    {
      id: 'pagi',
      label: 'Sesi Pagi',
      start: '07:30',
      end: '11:30',
      desc: '07:30 - 11:30 WIB',
      icon: Sunrise,
    },
    {
      id: 'siang',
      label: 'Sesi Siang',
      start: '12:30',
      end: '15:30',
      desc: '12:30 - 15:30 WIB',
      icon: Sun,
    },
    {
      id: 'sore',
      label: 'Sesi Sore',
      start: '15:30',
      end: '17:30',
      desc: '15:30 - 17:30 WIB',
      icon: Sunset,
    },
    {
      id: 'seharian',
      label: 'Seharian Penuh',
      start: '07:30',
      end: '16:30',
      desc: '07:30 - 16:30 WIB',
      icon: CalendarDays,
    }
  ];

  // Quick Date presets
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(dayAfter.getDate() + 2);

  const formatDateVal = (d: Date) => d.toISOString().split('T')[0];

  const datePresets = [
    { label: 'Hari Ini', val: formatDateVal(today) },
    { label: 'Besok', val: formatDateVal(tomorrow) },
    { label: 'Lusa', val: formatDateVal(dayAfter) },
  ];

  const handleApplyPreset = (start: string, end: string) => {
    onStartTimeChange(start);
    onEndTimeChange(end);
  };

  const isInvalidRange = startTime && endTime && startTime >= endTime;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-900 dark:bg-blue-600 text-white text-xs font-bold flex items-center justify-center shadow-xs">
            2
          </span>
          Waktu Peminjaman & Deteksi Bentrok
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Sistem otomatis memvalidasi jadwal secara real-time untuk mencegah tumpang tindih reservasi.
        </p>
      </div>

      {/* Selected Room Context Banner */}
      {selectedRoom && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
              Ruangan Terpilih
            </span>
            <p className="font-bold text-sm text-slate-900 dark:text-slate-100">
              {selectedRoom.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {selectedRoom.building} • Kapasitas {selectedRoom.capacity} Orang
            </p>
          </div>
          <div className="text-left sm:text-right text-xs bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
            <span className="text-slate-400 text-[11px] block">Jam Operasional:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
              {selectedRoom.operationalHours}
            </span>
          </div>
        </div>
      )}

      {/* Preset Waktu Cepat */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          Pilihan Preset Sesi Cepat:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {timePresets.map((preset) => {
            const isMatch = startTime === preset.start && endTime === preset.end;
            const Icon = preset.icon;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset.start, preset.end)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isMatch
                    ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/50 dark:border-blue-500 shadow-xs ring-1 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className={`w-3.5 h-3.5 ${isMatch ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {preset.label}
                  </span>
                </div>
                <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  {preset.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Manual Input Form */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Date Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              Tanggal Peminjaman
            </span>
          </label>
          <input
            type="date"
            value={bookingDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-slate-100"
          />
          {/* Quick Date Shortcuts */}
          <div className="flex items-center gap-1.5 pt-0.5">
            {datePresets.map(dp => (
              <button
                key={dp.label}
                type="button"
                onClick={() => onDateChange(dp.val)}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                  bookingDate === dp.val
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {dp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Start Time */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            Jam Mulai (WIB)
          </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => onStartTimeChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm font-semibold font-mono focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-slate-100"
          />
          <span className="text-[10px] text-slate-400 block">Minimal jam 07:00 WIB</span>
        </div>

        {/* End Time */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            Jam Selesai (WIB)
          </label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => onEndTimeChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm font-semibold font-mono focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-slate-100"
          />
          <span className="text-[10px] text-slate-400 block">Maksimal jam 18:00 WIB</span>
        </div>
      </div>

      {/* Live Conflict & Validation Status Banner */}
      {isInvalidRange ? (
        <div className="p-4 rounded-2xl border bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-start gap-3 text-xs animate-shake">
          <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>
            <p className="font-bold text-sm">Rentang Waktu Tidak Valid</p>
            <p className="mt-0.5 text-amber-800 dark:text-amber-300/90 text-xs">
              Jam selesai harus lebih akhir daripada jam mulai ({startTime} &ge; {endTime}).
            </p>
          </div>
        </div>
      ) : hasConflict ? (
        <div className="p-4 rounded-2xl border bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 flex items-start gap-3 text-xs animate-shake">
          <ShieldAlert className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
          <div>
            <p className="font-bold text-sm">Jadwal Bentrok Terdeteksi!</p>
            <p className="mt-0.5 text-rose-800 dark:text-rose-300/90 text-xs leading-relaxed">
              Ruangan <strong>{selectedRoom?.name}</strong> sudah dipesan atau sedang dipakai pada rentang {bookingDate} pukul {startTime} - {endTime} WIB. Silakan gunakan sesi atau jam lain.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl border bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-start gap-3 text-xs">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
          <div>
            <p className="font-bold text-sm">Jadwal Tersedia & Terverifikasi Bebas Bentrok</p>
            <p className="mt-0.5 text-emerald-800 dark:text-emerald-300/90 text-xs">
              Ruangan dapat dipesan untuk tanggal <strong>{bookingDate}</strong> pada pukul <strong>{startTime} - {endTime} WIB</strong>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

