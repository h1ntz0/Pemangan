import React, { useState } from 'react';
import { 
  Download, 
  RefreshCw
} from 'lucide-react';
import { useStorage } from '../context/StorageContext';
import { useAuth } from '../context/AuthContext';
import { Booking } from '../types';
import { StatusBadge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { OfficialSlipModal } from '../components/slip/OfficialSlipModal';

export const AdminPage: React.FC = () => {
  const { bookings, analytics, updateBookingStatus, exportCSV, resetDemoData } = useStorage();
  const { currentUser, isGuruOrAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<Booking | null>(null);
  const [reviewAction, setReviewAction] = useState<'approved' | 'rejected'>('approved');
  const [feedbackNote, setFeedbackNote] = useState<string>('');
  const [slipBooking, setSlipBooking] = useState<Booking | null>(null);
  const [toastMsg, setToastMsg] = useState<string>('');

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'all') return true;
    return b.status === activeTab;
  });

  const handleOpenReviewModal = (booking: Booking, action: 'approved' | 'rejected') => {
    setSelectedBookingForReview(booking);
    setReviewAction(action);
    setFeedbackNote(
      action === 'approved'
        ? 'Disetujui resmi oleh petugas Sarpras. Harap jaga kebersihan dan keselamatan fasilitas.'
        : 'Ditolak karena ruangan telah dialokasikan untuk agenda kedinasan sekolah.'
    );
  };

  const handleConfirmReview = () => {
    if (!selectedBookingForReview) return;

    const approver = currentUser ? `${currentUser.name} (${currentUser.role.toUpperCase()})` : 'Sarpras SMKN 1';
    updateBookingStatus(selectedBookingForReview.id, reviewAction, feedbackNote, approver);
    
    setToastMsg(`Status tiket ${selectedBookingForReview.id} berhasil diperbarui.`);
    setSelectedBookingForReview(null);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleExportCSV = () => {
    const csvContent = exportCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `rekap-sarpras-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    if (window.confirm('Apakah Anda yakin ingin mengatur ulang data ke demo awal?')) {
      resetDemoData();
      setToastMsg('Data demo berhasil direset ke pengaturan awal.');
      setTimeout(() => setToastMsg(''), 4000);
    }
  };

  return (
    <div className="py-4 sm:py-6 space-y-5 animate-fadeIn">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Panel Pengelola Sarpras
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Manajemen permohonan tiket dan verifikasi fasilitas SMKN 1 Jakarta.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>

          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Non-Admin Role Alert Info */}
      {!isGuruOrAdmin && (
        <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
          <p className="font-semibold">Mode Simulasi Pengujian</p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Anda dapat langsung menyetujui/menolak tiket atau berganti akun di menu profil pojok kanan atas.
          </p>
        </div>
      )}

      {/* KPI Cards Grid (Clean 3-Color Tone) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-0.5">
          <span className="text-[10px] uppercase font-semibold text-slate-400">Total Tiket</span>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{analytics.total}</p>
          <span className="text-[10px] text-slate-500">Semua Data</span>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-0.5">
          <span className="text-[10px] uppercase font-semibold text-slate-400">Perlu Review</span>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{analytics.pending}</p>
          <span className="text-[10px] text-slate-500">Menunggu</span>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-0.5">
          <span className="text-[10px] uppercase font-semibold text-slate-400">Disetujui</span>
          <p className="text-xl font-bold text-blue-700 dark:text-blue-400">{analytics.approved}</p>
          <span className="text-[10px] text-slate-500">Telah Di-Acc</span>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-0.5">
          <span className="text-[10px] uppercase font-semibold text-slate-400">Ditolak</span>
          <p className="text-xl font-bold text-slate-600 dark:text-slate-400">{analytics.rejected}</p>
          <span className="text-[10px] text-slate-500">Ditolak</span>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-0.5">
          <span className="text-[10px] uppercase font-semibold text-slate-400">Rasio Persetujuan</span>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{analytics.approvalRate}%</p>
          <span className="text-[10px] text-slate-500">Tingkat Persetujuan</span>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-0.5">
          <span className="text-[10px] uppercase font-semibold text-slate-400">Ruang Favorit</span>
          <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 mt-0.5">{analytics.topRoomName}</p>
          <span className="text-[10px] text-slate-500">{analytics.topRoomCount}x Reservasi</span>
        </div>

      </div>

      {/* Notification Toast */}
      {toastMsg && (
        <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-300 text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 text-xs font-semibold animate-fadeIn">
          {toastMsg}
        </div>
      )}

      {/* Bookings Management Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden space-y-2.5">
        
        {/* Table Filter Tabs */}
        <div className="p-3 pb-0 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1 overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'all'
                  ? 'bg-blue-700 text-white dark:bg-blue-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Semua ({bookings.length})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'pending'
                  ? 'bg-blue-700 text-white dark:bg-blue-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Perlu Review ({analytics.pending})
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'approved'
                  ? 'bg-blue-700 text-white dark:bg-blue-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Disetujui ({analytics.approved})
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'rejected'
                  ? 'bg-blue-700 text-white dark:bg-blue-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Ditolak ({analytics.rejected})
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-100 dark:border-slate-800">
                <th className="p-2.5 pl-3.5">ID Tiket</th>
                <th className="p-2.5">Ruangan & Waktu</th>
                <th className="p-2.5">Pemohon</th>
                <th className="p-2.5">Status</th>
                <th className="p-2.5 pr-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-2.5 pl-3.5 font-mono font-bold text-slate-900 dark:text-white">
                    {b.id}
                  </td>
                  <td className="p-2.5">
                    <p className="font-semibold text-slate-900 dark:text-white">{b.roomName}</p>
                    <p className="text-[10px] text-slate-500">
                      {new Date(b.startDateTime).toLocaleDateString('id-ID', { dateStyle: 'medium' })} ({new Date(b.startDateTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })})
                    </p>
                  </td>
                  <td className="p-2.5">
                    <p className="font-medium text-slate-900 dark:text-white">{b.userName}</p>
                    <p className="text-[10px] text-slate-500">{b.userClass || b.userRole}</p>
                  </td>
                  <td className="p-2.5">
                    <StatusBadge status={b.status} size="sm" />
                  </td>
                  <td className="p-2.5 pr-3.5 text-right space-x-1 whitespace-nowrap">
                    {b.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleOpenReviewModal(b, 'approved')}
                          className="px-2.5 py-1 rounded-md bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 text-white text-xs font-semibold transition-colors"
                        >
                          Setujui
                        </button>
                        <button
                          onClick={() => handleOpenReviewModal(b, 'rejected')}
                          className="px-2.5 py-1 rounded-md border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
                        >
                          Tolak
                        </button>
                      </>
                    )}
                    
                    <button
                      onClick={() => setSlipBooking(b)}
                      className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium"
                    >
                      Surat Izin
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Review Modal */}
      {selectedBookingForReview && (
        <Modal
          isOpen={!!selectedBookingForReview}
          onClose={() => setSelectedBookingForReview(null)}
          title={reviewAction === 'approved' ? 'Persetujuan Peminjaman Ruangan' : 'Penolakan Permohonan'}
          subtitle={`Tiket: ${selectedBookingForReview.id} • ${selectedBookingForReview.roomName}`}
        >
          <div className="space-y-3">
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs space-y-0.5">
              <p><strong>Pemohon:</strong> {selectedBookingForReview.userName} ({selectedBookingForReview.userClass || '-'})</p>
              <p><strong>Waktu:</strong> {new Date(selectedBookingForReview.startDateTime).toLocaleString('id-ID')}</p>
              <p><strong>Keperluan:</strong> {selectedBookingForReview.reason}</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Catatan Petugas Sarpras
              </label>
              <textarea
                rows={3}
                value={feedbackNote}
                onChange={(e) => setFeedbackNote(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedBookingForReview(null)}
                className="px-3 py-1.5 rounded-lg border text-xs font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmReview}
                className="px-3.5 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 text-white text-xs font-semibold"
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Official Slip Modal */}
      {slipBooking && (
        <OfficialSlipModal
          booking={slipBooking}
          isOpen={!!slipBooking}
          onClose={() => setSlipBooking(null)}
        />
      )}

    </div>
  );
};
