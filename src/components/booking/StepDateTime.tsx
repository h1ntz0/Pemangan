import React from 'react';
import { Room } from '../../types';

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
  return (
    <div className="space-y-4 animate-fadeIn">
      <div>
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-slate-800 dark:bg-slate-700 text-white text-[11px] font-bold flex items-center justify-center">
            2
          </span>
          Tanggal & Jam Penggunaan
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Sistem memeriksa ketersediaan ruangan secara real-time untuk mencegah jadwal bentrok.
        </p>
      </div>

      {/* Selected Room Reminder */}
      {selectedRoom && (
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-400 uppercase">Ruangan Terpilih</span>
            <p className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">{selectedRoom.name}</p>
            <p className="text-[11px] text-slate-500">{selectedRoom.building} • Kapasitas {selectedRoom.capacity} Orang</p>
          </div>
          <div className="text-right text-[11px] text-slate-500">
            <span>Jam Operasional:</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedRoom.operationalHours}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Date Input */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Tanggal Peminjaman
          </label>
          <input
            type="date"
            value={bookingDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-slate-100"
          />
        </div>

        {/* Start Time */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Jam Mulai (WIB)
          </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => onStartTimeChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-slate-100"
          />
        </div>

        {/* End Time */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Jam Selesai (WIB)
          </label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => onEndTimeChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Conflict Status Banner */}
      {startTime && endTime && (
        <div className={`p-3 rounded-lg border text-xs transition-colors ${
          hasConflict
            ? 'bg-slate-100 border-slate-300 dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-slate-100'
            : 'bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:border-blue-800 text-blue-900 dark:text-blue-200'
        }`}>
          <p className="font-bold">
            {hasConflict ? 'Jadwal Bentrok Terdeteksi' : 'Jadwal Tersedia'}
          </p>
          <p className="text-[11px] mt-0.5 opacity-90">
            {hasConflict
              ? `Ruangan ${selectedRoom?.name} sudah memiliki jadwal pada rentang waktu ini. Silakan pilih jam lain.`
              : `Ruangan bebas digunakan pada ${bookingDate} pukul ${startTime} - ${endTime} WIB.`}
          </p>
        </div>
      )}
    </div>
  );
};
