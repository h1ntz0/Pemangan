import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Printer, X, ShieldCheck } from 'lucide-react';
import { Booking } from '../../types';
import { KopSurat } from '../common/KopSurat';

interface OfficialSlipModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OfficialSlipModal: React.FC<OfficialSlipModalProps> = ({
  booking,
  isOpen,
  onClose
}) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  useEffect(() => {
    if (booking) {
      const qrPayload = JSON.stringify({
        id: booking.id,
        room: booking.roomName,
        user: booking.userName,
        date: booking.startDateTime,
        status: booking.status,
        authority: 'SMK Negeri 1 Jakarta Sarpras'
      });

      QRCode.toDataURL(qrPayload, {
        width: 160,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      })
        .then(url => setQrCodeDataUrl(url))
        .catch(err => console.error('Failed to generate QR code', err));
    }
  }, [booking]);

  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedStartDate = new Date(booking.startDateTime).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const startTimeStr = new Date(booking.startDateTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  const endTimeStr = new Date(booking.endDateTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      
      {/* Background Overlay */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-10 overflow-hidden my-6 max-h-[95vh] flex flex-col">
        
        {/* Modal Top Bar (Non-Printable) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 no-print">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold font-heading text-slate-900 dark:text-white">
                Surat Izin Resmi Sarpras
              </h3>
              <p className="text-xs text-slate-500">Nomor Tiket: {booking.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Letterhead & Permit Sheet (Printable Area) */}
        <div className="p-6 sm:p-10 overflow-y-auto flex-1 bg-white text-slate-900 printable-area selection:bg-slate-200">
          
          {/* Authentic KOP Surat */}
          <KopSurat />

          {/* Letter Title */}
          <div className="text-center my-6 space-y-1">
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider underline decoration-2 underline-offset-4 text-slate-900 font-heading">
              Surat Izin Penggunaan Fasilitas & Laboratorium
            </h2>
            <p className="text-xs font-mono font-medium text-slate-600">
              Nomor: {booking.id}/SARPRAS-SMKN1/{new Date(booking.createdAt).getFullYear()}
            </p>
          </div>

          {/* Content Body */}
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-800">
            <p>
              Berdasarkan permohonan reservasi fasilitas sekolah yang diajukan melalui Sistem Informasi <strong>Pemangan 2.0</strong>, dengan ini Wakil Kepala Sekolah Bidang Sarana & Prasarana SMK Negeri 1 Jakarta memberikan izin penggunaan fasilitas kepada:
            </p>

            {/* Applicant Details Table */}
            <div className="my-4 bg-slate-50/60 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500 font-medium">Nama Pemohon</span>
                <span className="col-span-2 font-bold text-slate-900">: {booking.userName}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500 font-medium">Kategori / Unit</span>
                <span className="col-span-2 capitalize text-slate-900">: {booking.userRole} ({booking.userClass || '-'})</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500 font-medium">Kontak WhatsApp</span>
                <span className="col-span-2 text-slate-900">: {booking.userContact || '-'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500 font-medium">Ruangan / Lab</span>
                <span className="col-span-2 font-bold text-blue-900">: {booking.roomName}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500 font-medium">Waktu Penggunaan</span>
                <span className="col-span-2 font-bold text-slate-900">: {formattedStartDate}, Pukul {startTimeStr} - {endTimeStr} WIB</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500 font-medium">Guru Pembimbing / PJ</span>
                <span className="col-span-2 text-slate-900">: {booking.supervisorName || '-'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500 font-medium">Keperluan / Agenda</span>
                <span className="col-span-2 text-slate-900 italic">: "{booking.reason}"</span>
              </div>
              {booking.equipment && booking.equipment.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500 font-medium">Peralatan Tambahan</span>
                  <span className="col-span-2 text-slate-900">: {booking.equipment.join(', ')}</span>
                </div>
              )}
            </div>

            <p>
              Dengan ketentuan wajib menaati Standar Operasional Prosedur (SOP) Sarana & Prasarana, menjaga ketertiban, kebersihan, dan keselamatan sarana laboratorium.
            </p>
          </div>

          {/* Signatures & Dynamic QR Verification */}
          <div className="mt-10 pt-4 grid grid-cols-3 gap-4 text-center text-xs">
            
            {/* Signature 1: Pemohon */}
            <div className="space-y-12">
              <p className="text-slate-600 font-medium">Pemohon,</p>
              <div>
                <p className="font-bold text-slate-900 underline">{booking.userName}</p>
                <p className="text-[10px] text-slate-500">{booking.userClass || 'Pemohon'}</p>
              </div>
            </div>

            {/* Signature 2: QR Code Verifikasi */}
            <div className="flex flex-col items-center justify-center space-y-1">
              {qrCodeDataUrl ? (
                <img src={qrCodeDataUrl} alt="QR Code Verifikasi" className="w-20 h-20 object-contain border p-1 rounded-lg bg-white" />
              ) : (
                <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] text-slate-400">QR Code</div>
              )}
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                VERIFIED DIGITAL
              </span>
            </div>

            {/* Signature 3: Waka Sarpras */}
            <div className="space-y-12">
              <p className="text-slate-600 font-medium">
                Jakarta, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br />
                Waka Bidang Sarpras,
              </p>
              <div>
                <p className="font-bold text-slate-900 underline">
                  {booking.approvedBy !== '-' ? booking.approvedBy : 'Waka Bidang Sarpras SMKN 1'}
                </p>
                <p className="text-[10px] text-slate-500">NIP. 197504042000031004</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer (Non-Printable) */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between no-print">
          <span className="text-xs text-slate-500">
            Format A4 Portrait • Dokumen Resmi Kedinasan
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-bold"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
