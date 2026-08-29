import React from 'react';
import { Room } from '../../types';

interface StepSummaryProps {
  selectedRoom: Room | undefined;
  selectedEquipment: string[];
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
  return (
    <div className="space-y-4 animate-fadeIn">
      <div>
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-slate-800 dark:bg-slate-700 text-white text-[11px] font-bold flex items-center justify-center">
            4
          </span>
          Ringkasan Permohonan & Persetujuan SOP
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Periksa kembali rincian peminjaman sebelum dikirim ke petugas Sarpras SMKN 1 Jakarta.
        </p>
      </div>

      {/* Review Box */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pb-2.5 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400">Ruangan</span>
            <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5">{selectedRoom?.name || '-'}</p>
            <p className="text-[11px] text-slate-500">{selectedRoom?.building}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400">Waktu</span>
            <p className="text-xs sm:text-sm font-bold text-blue-700 dark:text-blue-400 mt-0.5">{startTime} - {endTime} WIB</p>
            <p className="text-[11px] text-slate-500">{bookingDate ? new Date(bookingDate).toLocaleDateString('id-ID', { dateStyle: 'full' }) : '-'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pb-2.5 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400">Pemohon</span>
            <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mt-0.5">{userName} ({userRole})</p>
            <p className="text-[11px] text-slate-500">{userClass} • Kontak: {userContact}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400">Guru Pendamping</span>
            <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mt-0.5">{supervisorName || '-'}</p>
          </div>
        </div>

        <div>
          <span className="text-[10px] uppercase font-semibold text-slate-400">Keperluan</span>
          <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">{reason}</p>
        </div>

        {selectedEquipment.length > 0 && (
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400">Peralatan Tambahan</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {selectedEquipment.map((eq, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium">
                  {eq}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SOP Notice */}
      <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
        <p className="font-semibold text-slate-900 dark:text-slate-100 text-xs">
          Ketentuan SOP Sarpras SMKN 1 Jakarta:
        </p>
        <ul className="list-disc list-inside space-y-0.5 text-[11px] opacity-90 pl-1">
          <li>Pemohon bertanggung jawab atas kebersihan, ketertiban, dan keutuhan fasilitas.</li>
          <li>Wajib mematikan AC, proyektor, lampu, dan merapikan kembali ruangan setelah selesai.</li>
        </ul>
      </div>

      {/* Checkbox Agreement */}
      <label className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
        <input
          type="checkbox"
          checked={agreedSOP}
          onChange={(e) => onAgreeSOPChange(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700"
        />
        <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
          Saya menyetujui seluruh ketentuan SOP Sarpras SMKN 1 Jakarta dan bertanggung jawab penuh atas fasilitas.
        </span>
      </label>
    </div>
  );
};
