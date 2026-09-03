import React from 'react';
import { UserRole } from '../../types';
import { 
  User, 
  Phone, 
  BookOpen, 
  GraduationCap, 
  FileSpreadsheet, 
  Check,
  HelpCircle
} from 'lucide-react';

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
  // Preset SuperVisor Quick Suggestions
  const supervisorSuggestions = [
    'Pak Amrul Khairullah, S.Kom',
    'Pak Rian Firmansyah, M.Kom',
    'Ibu Nurhayati, M.Pd',
    'Ibu Dra. Endang Lestari',
    'Pak Sukirman, S.Pd',
    'Waka Bidang Sarpras SMKN 1'
  ];

  // Quick Agenda Templates
  const agendaTemplates = [
    'Simulasi Uji Kompetensi Keahlian (UKK) & Uji Sertifikasi BNSP',
    'Praktikum Kejuruan Tambahan dan Sinkronisasi Server Cloud',
    'Rapat Koordinasi & Briefing Pengurus OSIS / MPK',
    'Workshop & Presentasi Final Project Pembelajaran Berbasis Proyek (PjBL)'
  ];

  const roleOptions: { role: UserRole; label: string; desc: string; badge: string }[] = [
    {
      role: 'siswa',
      label: 'Siswa / Kesiswaan',
      desc: 'OSIS, MPK, Ekskul, atau Perwakilan Kelas',
      badge: 'Wajib PJ Guru'
    },
    {
      role: 'guru',
      label: 'Dewan Guru',
      desc: 'Tenaga Pendidik / Guru Produktif & Normatif',
      badge: 'Prioritas KBM'
    },
    {
      role: 'admin',
      label: 'Staf / Tata Usaha',
      desc: 'Unit Sarpras, Tenaga Kependidikan, Kedinasan',
      badge: 'Kedinasan'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-900 dark:bg-blue-600 text-white text-xs font-bold flex items-center justify-center shadow-xs">
            3
          </span>
          Identitas Pemohon & Penanggung Jawab
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Lengkapi data PIC resmi untuk pencetakan Surat Izin Pemakaian Sarpras SMKN 1 Jakarta.
        </p>
      </div>

      {/* Role Selection Cards */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
          Pilih Kategori PIC Pemohon:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {roleOptions.map((opt) => {
            const isSelected = userRole === opt.role;
            return (
              <div
                key={opt.role}
                onClick={() => onUserRoleChange(opt.role)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 dark:border-blue-500 shadow-xs ring-2 ring-blue-600/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1.5 mb-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {opt.label}
                    </span>
                    <span className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded">
                      {opt.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {opt.desc}
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Status Terpilih</span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 dark:border-slate-700'
                  }`}>
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-blue-600" />
            Nama Lengkap Pemohon (PIC)
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => onUserNameChange(e.target.value)}
            placeholder="Contoh: Arrofi Zein / Rasya Aryasatya"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-slate-100"
          />
        </div>

        {/* Class / Unit */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
            Kelas / Program Keahlian / Unit
          </label>
          <input
            type="text"
            value={userClass}
            onChange={(e) => onUserClassChange(e.target.value)}
            placeholder="Contoh: XI SIJA 1 / Guru Produktif RPL"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-slate-100"
          />
        </div>

        {/* Contact Phone */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            Nomor WhatsApp Aktif (Untuk Notifikasi)
          </label>
          <input
            type="text"
            value={userContact}
            onChange={(e) => onUserContactChange(e.target.value)}
            placeholder="Contoh: 081299887766"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm font-mono font-medium focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-slate-100"
          />
        </div>

        {/* Supervisor / Pembimbing */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            Guru Pembimbing / Penanggung Jawab
          </label>
          <input
            type="text"
            value={supervisorName}
            onChange={(e) => onSupervisorNameChange(e.target.value)}
            placeholder="Contoh: Pak Amrul Khairullah, S.Kom"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-slate-100"
          />
          {/* Quick Suggestions for Teachers */}
          <div className="flex flex-wrap gap-1 pt-1">
            {supervisorSuggestions.slice(0, 3).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onSupervisorNameChange(s)}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 font-medium transition-colors"
              >
                + {s.split(',')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Reason / Agenda */}
        <div className="sm:col-span-2 space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
              Tujuan & Rincian Agenda Kegiatan
            </label>
            <span className="text-[10px] text-slate-400 font-medium">Minimal 10 karakter</span>
          </div>

          <textarea
            rows={3}
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            placeholder="Jelaskan secara jelas agenda kegiatan praktikum/acara yang akan dilaksanakan..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-slate-100"
          />

          {/* Quick Agenda Templates */}
          <div className="space-y-1 pt-1">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <HelpCircle className="w-3 h-3" />
              Contoh Agenda Cepat:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {agendaTemplates.map((tpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onReasonChange(tpl)}
                  className="text-left text-[11px] px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors line-clamp-1"
                >
                  "{tpl}"
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

