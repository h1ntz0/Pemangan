import React from 'react';
import { Room } from '../../types';
import { 
  Building2, 
  Clock, 
  Calendar, 
  User, 
  BookOpen, 
  Package, 
  FileText, 
  AlertTriangle
} from 'lucide-react';

interface StepSummaryProps {
  selectedRoom: Room | undefined;
  selectedEquipment: string[];
  equipmentQuantities: Record<string, number>;
  bookingDate: string;
  startTime: string;
  endTime: string;
  userName: string;
  userRole: string;
  userClass: string;
  userContact: string;
  supervisorName: string;
  reason: string;
  agreedSOP: boolean;
  onAgreeSOPChange: (val: boolean) => void;
}

export const StepSummary: React.FC<StepSummaryProps> = ({
  selectedRoom,
  selectedEquipment,
  equipmentQuantities,
  bookingDate,
  startTime,
  endTime,
  userName,
  userRole,
  userClass,
  userContact,
  supervisorName,
  reason,
  agreedSOP,
  onAgreeSOPChange
}) => {
  const formattedDate = bookingDate
    ? new Date(bookingDate).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : '-';

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-900 dark:bg-blue-600 text-white text-xs font-bold flex items-center justify-center shadow-xs">
            4
          </span>
          Ringkasan Permohonan & Konfirmasi SOP Sarpras
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Tinjau kembali data permohonan sebelum menerbitkan tiket resmi registrasi Sarpras SMKN 1 Jakarta.
        </p>
      </div>

      {/* Review Information Card */}
      <div className="bg-slate-50/80 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-5">
        {/* Section 1: Fasilitas & Jadwal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-400 tracking-wider flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              Fasilitas / Ruangan
            </span>
            <p className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
              {selectedRoom?.name || '-'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {selectedRoom?.building} • Kapasitas {selectedRoom?.capacity} Orang
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-400 tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Waktu & Tanggal
            </span>
            <p className="text-sm sm:text-base font-extrabold text-blue-900 dark:text-blue-300 font-mono">
              {startTime} - {endTime} WIB
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {formattedDate}
            </p>
          </div>
        </div>

        {/* Section 2: Pemohon & PIC */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Identitas Pemohon (PIC)
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              {userName}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {userClass} • <span className="capitalize">{userRole}</span> • {userContact}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              Guru Pembimbing / Penanggung Jawab
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              {supervisorName || '-'}
            </p>
            <p className="text-[11px] text-slate-400">
              Penanggung jawab teknis & operasional
            </p>
          </div>
        </div>

        {/* Section 3: Keperluan */}
        <div className="space-y-1 pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            Keperluan / Agenda
          </span>
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            "{reason}"
          </p>
        </div>

        {/* Section 4: Peralatan & Kuantitas */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
            <Package className="w-3.5 h-3.5 text-slate-400" />
            Peralatan Tambahan yang Disiapkan
          </span>
          {selectedEquipment.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {selectedEquipment.map((eq, idx) => {
                const qty = equipmentQuantities[eq] || 1;
                return (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-300 text-xs font-semibold"
                  >
                    <span>{eq}</span>
                    <span className="px-1.5 py-0.5 rounded-md bg-blue-200/70 dark:bg-blue-800 text-[10px] font-bold">
                      {qty} Unit
                    </span>
                  </span>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">
              Tidak ada peralatan tambahan (menggunakan fasilitas standar ruangan).
            </p>
          )}
        </div>
      </div>

      {/* SOP Agreement Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 space-y-2.5">
        <div className="flex items-center gap-2 font-bold text-sm text-amber-950 dark:text-amber-100">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>Ketentuan SOP Sarpras SMKN 1 Jakarta:</span>
        </div>
        <ul className="space-y-1.5 text-xs text-amber-900/90 dark:text-amber-200/90 pl-6 list-disc">
          <li>Pemohon dan peserta wajib menjaga kebersihan, ketertiban, dan keutuhan sarana prasarana.</li>
          <li>Wajib mematikan AC, proyektor LCD, lampu ruangan, dan merapikan kembali kursi/meja setelah pemakaian selesai.</li>
          <li>Penggunaan peralatan lab wajib didampingi guru pembimbing atau instruktur kejuruan terkait.</li>
        </ul>
      </div>

      {/* Interactive Checkbox */}
      <label className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
        agreedSOP
          ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 dark:border-emerald-700 shadow-xs'
          : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-400'
      }`}>
        <input
          type="checkbox"
          checked={agreedSOP}
          onChange={(e) => onAgreeSOPChange(e.target.checked)}
          className="mt-0.5 w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800"
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
            Saya telah membaca, memahami, dan menyetujui seluruh ketentuan SOP Sarpras SMKN 1 Jakarta
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
            Bertanggung jawab penuh atas kebersihan dan keselamatan fasilitas selama waktu peminjaman.
          </span>
        </div>
      </label>
    </div>
  );
};

