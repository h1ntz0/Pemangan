import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import { Printer, ArrowLeft } from 'lucide-react';
import { useStorage } from '../context/StorageContext';
import { KopSurat } from '../components/common/KopSurat';

export const SlipPrintPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getBookingById } = useStorage();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const booking = id ? getBookingById(id) : undefined;

  useEffect(() => {
    if (booking) {
      const payload = JSON.stringify({
        id: booking.id,
        room: booking.roomName,
        user: booking.userName,
        date: booking.startDateTime,
        status: booking.status,
        authority: 'Sarpras SMKN 1 Jakarta'
      });

      QRCode.toDataURL(payload, { width: 160, margin: 1 })
        .then(url => setQrCodeUrl(url))
        .catch(err => console.error(err));
    }
  }, [booking]);

  if (!booking) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold">Tiket Tidak Ditemukan</h2>
        <button
          onClick={() => navigate('/tracking')}
          className="px-4 py-2 bg-blue-700 text-white rounded-lg text-xs font-semibold"
        >
          Kembali ke Pelacakan
        </button>
      </div>
    );
  }

  const formattedStartDate = new Date(booking.startDateTime).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const startTimeStr = new Date(booking.startDateTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  const endTimeStr = new Date(booking.endDateTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="py-6 max-w-3xl mx-auto space-y-6">
      
      {/* Action Header (Hidden on Print) */}
      <div className="flex items-center justify-between no-print p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-700 text-white text-xs font-semibold hover:bg-blue-800"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak Surat Izin</span>
        </button>
      </div>

      {/* Printable Paper A4 */}
      <div className="bg-white text-slate-900 p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-sm printable-area">
        <KopSurat />

        <div className="text-center my-6 space-y-1">
          <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider underline decoration-2 underline-offset-4 text-slate-900">
            Surat Izin Penggunaan Fasilitas & Laboratorium
          </h2>
          <p className="text-xs font-mono font-medium text-slate-600">
            Nomor: {booking.id}/SARPRAS-SMKN1/{new Date(booking.createdAt).getFullYear()}
          </p>
        </div>

        <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-800">
          <p>
            Berdasarkan permohonan reservasi fasilitas sekolah yang diajukan melalui Sistem Informasi <strong>PEMANGAN (Peminjaman Ruangan)</strong>, dengan ini Wakil Kepala Sekolah Bidang Sarana & Prasarana SMK Negeri 1 Jakarta memberikan izin penggunaan fasilitas kepada:
          </p>

          <div className="my-4 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
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

        <div className="mt-10 pt-4 grid grid-cols-3 gap-4 text-center text-xs">
          <div className="space-y-12">
            <p className="text-slate-600 font-medium">Pemohon,</p>
            <div>
              <p className="font-bold text-slate-900 underline">{booking.userName}</p>
              <p className="text-[10px] text-slate-500">{booking.userClass || 'Pemohon'}</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center space-y-1">
            {qrCodeUrl ? (
              <img src={qrCodeUrl} alt="QR Code Verifikasi" className="w-20 h-20 object-contain border p-1 rounded-lg bg-white" />
            ) : (
              <div className="w-20 h-20 bg-slate-100 rounded-lg" />
            )}
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
              VERIFIKASI RESMI
            </span>
          </div>

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
    </div>
  );
};
