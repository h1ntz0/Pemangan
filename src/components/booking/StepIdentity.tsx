import React from 'react';
import { UserRole } from '../../types';
import { User, Phone, BookOpen, GraduationCap } from 'lucide-react';

interface StepIdentityProps {
  userName: string;
  onUserNameChange: (val: string) => void;
  userRole: UserRole;
  onUserRoleChange: (val: UserRole) => void;
  userClass: string;
  onUserClassChange: (val: string) => void;
  userContact: string;
  onUserContactChange: (val: string) => void;
  supervisorName: string;
  onSupervisorNameChange: (val: string) => void;
  reason: string;
  onReasonChange: (val: string) => void;
}

export const StepIdentity: React.FC<StepIdentityProps> = ({
  userName,
  onUserNameChange,
  userRole,
  onUserRoleChange,
  userClass,
  onUserClassChange,
  userContact,
  onUserContactChange,
  supervisorName,
  onSupervisorNameChange,
  reason,
  onReasonChange
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-900 text-white text-xs font-bold flex items-center justify-center">
            3
          </span>
          Identitas Pemohon & Guru Penanggung Jawab
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Lengkapi data pemohon resmi untuk dicantumkan pada Lembar Surat Izin Sarpras SMKN 1 Jakarta.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-blue-600" />
            Nama Lengkap Pemohon
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => onUserNameChange(e.target.value)}
            placeholder="Contoh: Arrofi Zein"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-slate-100"
          />
        </div>

        {/* Role Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Kategori Pemohon
          </label>
          <select
            value={userRole}
            onChange={(e) => onUserRoleChange(e.target.value as UserRole)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-slate-100"
          >
            <option value="siswa">Siswa / Organisasi Kesiswaan (OSIS/Ekskul)</option>
            <option value="guru">Guru / Tenaga Pendidik</option>
            <option value="admin">Staf Tata Usaha / Sarpras</option>
          </select>
        </div>

        {/* Class / Unit */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
            Kelas / Unit / Jurusan
          </label>
          <input
            type="text"
            value={userClass}
            onChange={(e) => onUserClassChange(e.target.value)}
            placeholder="Contoh: XI SIJA 1 / Guru Produktif"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-slate-100"
          />
        </div>

        {/* Contact Phone */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            Nomor WhatsApp / HP Aktif
          </label>
          <input
            type="text"
            value={userContact}
            onChange={(e) => onUserContactChange(e.target.value)}
            placeholder="Contoh: 081299887766"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-slate-100"
          />
        </div>

        {/* Supervisor / Pembimbing */}
        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            Guru Pembimbing / Penanggung Jawab Kegiatan
          </label>
          <input
            type="text"
            value={supervisorName}
            onChange={(e) => onSupervisorNameChange(e.target.value)}
            placeholder="Contoh: Pak Amrul Khairullah, S.Kom / Ibu Nurhayati, M.Pd"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-slate-100"
          />
        </div>

        {/* Reason / Agenda */}
        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Tujuan / Keperluan Peminjaman (Detail)
          </label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            placeholder="Jelaskan secara ringkas dan padat agenda kegiatan yang akan diselenggarakan..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>
    </div>
  );
};
