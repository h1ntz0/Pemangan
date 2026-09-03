import React, { useState, useMemo } from 'react';
import { 
  Download, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Activity, 
  Layers, 
  TrendingUp, 
  CheckSquare, 
  Square,
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useStorage } from '../context/StorageContext';
import { useAuth } from '../context/AuthContext';
import { Booking, BookingStatus } from '../types';
import { StatusBadge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { OfficialSlipModal } from '../components/slip/OfficialSlipModal';

type FilterTab = 'all' | 'pending' | 'approved' | 'rejected' | 'ongoing' | 'completed';

export const AdminPage: React.FC = () => {
  const { bookings, analytics, updateBookingStatus, exportCSV, resetDemoData } = useStorage();
  const { currentUser, isGuruOrAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Single Review Modal State
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<Booking | null>(null);
  const [reviewAction, setReviewAction] = useState<BookingStatus>('approved');
  const [feedbackNote, setFeedbackNote] = useState<string>('');
  
  // Batch Action Modal State
  const [isBatchModalOpen, setIsBatchModalOpen] = useState<boolean>(false);
  const [batchActionType, setBatchActionType] = useState<BookingStatus>('approved');
  const [batchFeedbackNote, setBatchFeedbackNote] = useState<string>('');

  // Slip & Toast State
  const [slipBooking, setSlipBooking] = useState<Booking | null>(null);
  const [toastMsg, setToastMsg] = useState<string>('');

  // Filter and search logic
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      // Tab filter
      if (activeTab !== 'all' && b.status !== activeTab) {
        return false;
      }
      
      // Search filter (room name, PIC / user name, ticket ID, supervisor)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchId = b.id.toLowerCase().includes(q);
        const matchRoom = b.roomName.toLowerCase().includes(q);
        const matchUser = b.userName.toLowerCase().includes(q);
        const matchSupervisor = (b.supervisorName || '').toLowerCase().includes(q);
        const matchReason = (b.reason || '').toLowerCase().includes(q);
        if (!matchId && !matchRoom && !matchUser && !matchSupervisor && !matchReason) {
          return false;
        }
      }

      return true;
    });
  }, [bookings, activeTab, searchQuery]);

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      all: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      approved: bookings.filter(b => b.status === 'approved').length,
      rejected: bookings.filter(b => b.status === 'rejected').length,
      ongoing: bookings.filter(b => b.status === 'ongoing').length,
      completed: bookings.filter(b => b.status === 'completed').length,
    };
  }, [bookings]);

  // Single Action Triggers
  const handleOpenReviewModal = (booking: Booking, action: BookingStatus) => {
    setSelectedBookingForReview(booking);
    setReviewAction(action);
    if (action === 'approved') {
      setFeedbackNote('Disetujui resmi oleh petugas Sarpras. Harap jaga kebersihan dan fasilitas.');
    } else if (action === 'rejected') {
      setFeedbackNote('Ditolak karena ruangan dialokasikan untuk kegiatan kedinasan.');
    } else if (action === 'ongoing') {
      setFeedbackNote('Peminjaman sedang berlangsung di ruangan.');
    } else if (action === 'completed') {
      setFeedbackNote('Peminjaman telah selesai. Ruangan dan inventaris dalam kondisi baik.');
    }
  };

  const handleConfirmReview = () => {
    if (!selectedBookingForReview) return;

    const approver = currentUser ? `${currentUser.name} (${currentUser.role.toUpperCase()})` : 'Sarpras SMKN 1';
    updateBookingStatus(selectedBookingForReview.id, reviewAction, feedbackNote, approver);
    
    setToastMsg(`Status tiket ${selectedBookingForReview.id} berhasil diperbarui.`);
    setSelectedBookingForReview(null);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // Selection Logic for Batch Actions
  const handleSelectAll = () => {
    if (selectedIds.length === filteredBookings.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredBookings.map(b => b.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleOpenBatchModal = (action: BookingStatus) => {
    if (selectedIds.length === 0) return;
    setBatchActionType(action);
    setBatchFeedbackNote(
      action === 'approved' 
        ? 'Disetujui massal oleh Sarpras SMKN 1 Jakarta.' 
        : action === 'rejected'
        ? 'Ditolak massal karena penyesuaian jadwal sarana.'
        : 'Status diperbarui massal oleh Sarpras.'
    );
    setIsBatchModalOpen(true);
  };

  const handleConfirmBatchAction = () => {
    const approver = currentUser ? `${currentUser.name} (${currentUser.role.toUpperCase()})` : 'Sarpras SMKN 1';
    
    selectedIds.forEach(id => {
      updateBookingStatus(id, batchActionType, batchFeedbackNote, approver);
    });

    setToastMsg(`${selectedIds.length} tiket berhasil diperbarui serentak.`);
    setSelectedIds([]);
    setIsBatchModalOpen(false);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleExportCSV = () => {
    const csvContent = exportCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `rekap-sarpras-smkn1-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    if (window.confirm('Reset seluruh data booking ke setelan demo awal SMKN 1 Jakarta?')) {
      resetDemoData();
      setSelectedIds([]);
      setToastMsg('Data demo berhasil direset ke pengaturan awal.');
      setTimeout(() => setToastMsg(''), 4000);
    }
  };

  return (
    <div className="py-4 sm:py-6 space-y-6 animate-fadeIn">
      
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Dashboard Manajemen Sarpras
            </h1>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300">
              SMKN 1 JKT
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Pusat verifikasi peminjaman lab komputer, ruang teori, teater, dan pengelolaan fasilitas.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Unduh CSV</span>
          </button>

          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Non-Admin Role Alert Info */}
      {!isGuruOrAdmin && (
        <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-300 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
            <span>
              <strong>Mode Eksplorasi:</strong> Anda dapat melakukan simulasi persetujuan tiket secara langsung tanpa batasan hak akses.
            </span>
          </div>
          <span className="text-[10px] font-mono uppercase bg-blue-200/60 dark:bg-blue-900 px-2 py-0.5 rounded">
            Simulasi Aktif
          </span>
        </div>
      )}

      {/* Live KPI Cards Grid with Trend Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        {/* Total Bookings */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-wider">Total Tiket</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{analytics.total}</p>
          <div className="flex items-center gap-1 text-[10px] text-slate-500">
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            <span>Semua permohonan</span>
          </div>
        </div>

        {/* Pending Review */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-amber-500">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Menunggu</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{analytics.pending}</p>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">Perlu review cepat</span>
        </div>

        {/* Approved */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-blue-600">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Disetujui</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-400 tracking-tight">{analytics.approved}</p>
          <span className="text-[10px] text-slate-500">Siap digunakan</span>
        </div>

        {/* Ongoing */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Berlangsung</span>
            <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">{analytics.ongoing}</p>
          <span className="text-[10px] text-slate-500">Sedang aktif</span>
        </div>

        {/* Rejected */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-rose-500">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Ditolak</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold text-slate-700 dark:text-slate-300 tracking-tight">{analytics.rejected}</p>
          <span className="text-[10px] text-slate-500">Jadwal bentrok/lainnya</span>
        </div>

        {/* Approval Rate */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-indigo-500">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Efektivitas</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{analytics.approvalRate}%</p>
          <span className="text-[10px] text-slate-500">Rasio persetujuan</span>
        </div>

      </div>

      {/* Notification Toast Banner */}
      {toastMsg && (
        <div className="p-3 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-semibold flex items-center justify-between shadow-lg animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            <span>{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg('')} className="text-slate-400 hover:text-white dark:hover:text-slate-900">
            ×
          </button>
        </div>
      )}

      {/* Management Controls: Tabs, Search Bar, Batch Actions */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        
        {/* Top Control Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-3">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            {/* Search Input Box */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama ruangan, pemohon, guru, atau ID tiket (BK-2026-xxx)..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-slate-100"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Batch Action Toolbar */}
            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 px-3 py-1.5 rounded-xl animate-fadeIn">
                <span className="text-xs font-bold text-blue-800 dark:text-blue-300">
                  {selectedIds.length} tiket terpilih:
                </span>
                <button
                  onClick={() => handleOpenBatchModal('approved')}
                  className="px-2.5 py-1 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold transition-colors"
                >
                  Setujui Massal
                </button>
                <button
                  onClick={() => handleOpenBatchModal('rejected')}
                  className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
                >
                  Tolak Massal
                </button>
                <button
                  onClick={() => setSelectedIds([])}
                  className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline ml-1"
                >
                  Batal
                </button>
              </div>
            )}
          </div>

          {/* Filter Status Tabs (Semua, Menunggu, Disetujui, Ditolak, Berlangsung, Selesai) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'all'
                  ? 'bg-blue-700 text-white dark:bg-blue-600 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Semua ({tabCounts.all})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'pending'
                  ? 'bg-blue-700 text-white dark:bg-blue-600 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Menunggu ({tabCounts.pending})
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'approved'
                  ? 'bg-blue-700 text-white dark:bg-blue-600 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Disetujui ({tabCounts.approved})
            </button>
            <button
              onClick={() => setActiveTab('ongoing')}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'ongoing'
                  ? 'bg-blue-700 text-white dark:bg-blue-600 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Berlangsung ({tabCounts.ongoing})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'completed'
                  ? 'bg-blue-700 text-white dark:bg-blue-600 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Selesai ({tabCounts.completed})
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'rejected'
                  ? 'bg-blue-700 text-white dark:bg-blue-600 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Ditolak ({tabCounts.rejected})
            </button>
          </div>

        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100 dark:border-slate-800">
                <th className="p-3 pl-4 w-10">
                  <button
                    onClick={handleSelectAll}
                    className="p-0.5 rounded text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    title="Pilih Semua"
                  >
                    {selectedIds.length === filteredBookings.length && filteredBookings.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </th>
                <th className="p-3">ID Tiket</th>
                <th className="p-3">Ruangan & Waktu Reservasi</th>
                <th className="p-3">Pemohon & Pembimbing</th>
                <th className="p-3">Status</th>
                <th className="p-3 pr-4 text-right">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 dark:text-slate-500">
                    <p className="font-semibold text-sm">Tidak ada tiket peminjaman ditemukan</p>
                    <p className="text-xs mt-1">Coba sesuaikan kata kunci pencarian atau tab status di atas.</p>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  const isChecked = selectedIds.includes(b.id);
                  return (
                    <tr 
                      key={b.id} 
                      className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
                        isChecked ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                      }`}
                    >
                      <td className="p-3 pl-4">
                        <button
                          onClick={() => handleToggleSelect(b.id)}
                          className="p-0.5 rounded text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                        >
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                          )}
                        </button>
                      </td>
                      <td className="p-3">
                        <span className="font-mono font-bold text-slate-900 dark:text-white block">
                          {b.id}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(b.createdAt).toLocaleDateString('id-ID')}
                        </span>
                      </td>
                      <td className="p-3">
                        <p className="font-bold text-slate-900 dark:text-white">{b.roomName}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {new Date(b.startDateTime).toLocaleDateString('id-ID', { dateStyle: 'medium' })} • {new Date(b.startDateTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - {new Date(b.endDateTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                        </p>
                        <p className="text-[10px] text-slate-400 italic line-clamp-1 mt-0.5">
                          Keperluan: {b.reason}
                        </p>
                      </td>
                      <td className="p-3">
                        <p className="font-semibold text-slate-900 dark:text-white">{b.userName}</p>
                        <p className="text-[10px] text-slate-500">{b.userClass || b.userRole}</p>
                        {b.supervisorName && (
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Pembimbing: {b.supervisorName}
                          </p>
                        )}
                      </td>
                      <td className="p-3">
                        <StatusBadge status={b.status} size="sm" />
                      </td>
                      <td className="p-3 pr-4 text-right space-x-1 whitespace-nowrap">
                        {b.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleOpenReviewModal(b, 'approved')}
                              className="px-2.5 py-1 rounded-lg bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
                            >
                              Setujui
                            </button>
                            <button
                              onClick={() => handleOpenReviewModal(b, 'rejected')}
                              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
                            >
                              Tolak
                            </button>
                          </>
                        )}

                        {b.status === 'approved' && (
                          <button
                            onClick={() => handleOpenReviewModal(b, 'ongoing')}
                            className="px-2.5 py-1 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                          >
                            Mulai
                          </button>
                        )}

                        {b.status === 'ongoing' && (
                          <button
                            onClick={() => handleOpenReviewModal(b, 'completed')}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 text-white text-xs font-semibold transition-colors"
                          >
                            Selesai
                          </button>
                        )}
                        
                        <button
                          onClick={() => setSlipBooking(b)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
                        >
                          Surat Izin
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Review Modal for Single Item */}
      {selectedBookingForReview && (
        <Modal
          isOpen={!!selectedBookingForReview}
          onClose={() => setSelectedBookingForReview(null)}
          title={
            reviewAction === 'approved'
              ? 'Persetujuan Peminjaman Ruangan'
              : reviewAction === 'rejected'
              ? 'Penolakan Permohonan Peminjaman'
              : reviewAction === 'ongoing'
              ? 'Mulai Pemakaian Ruangan'
              : 'Selesaikan Peminjaman Ruangan'
          }
          subtitle={`Tiket: ${selectedBookingForReview.id} • ${selectedBookingForReview.roomName}`}
        >
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-xs space-y-1 border border-slate-100 dark:border-slate-700">
              <p><strong>Pemohon:</strong> {selectedBookingForReview.userName} ({selectedBookingForReview.userClass || selectedBookingForReview.userRole})</p>
              <p><strong>Waktu:</strong> {new Date(selectedBookingForReview.startDateTime).toLocaleString('id-ID')}</p>
              <p><strong>Keperluan:</strong> {selectedBookingForReview.reason}</p>
              {selectedBookingForReview.equipment?.length > 0 && (
                <p><strong>Inventaris Tambahan:</strong> {selectedBookingForReview.equipment.join(', ')}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Catatan / Feedback Verifikasi Sarpras
              </label>
              <textarea
                rows={3}
                value={feedbackNote}
                onChange={(e) => setFeedbackNote(e.target.value)}
                placeholder="Tuliskan catatan arahan atau alasan penolakan/persetujuan..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedBookingForReview(null)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmReview}
                className="px-4 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 text-white text-xs font-semibold transition-colors"
              >
                Konfirmasi Status
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Batch Action Modal */}
      {isBatchModalOpen && (
        <Modal
          isOpen={isBatchModalOpen}
          onClose={() => setIsBatchModalOpen(false)}
          title={`Konfirmasi Aksi Massal (${selectedIds.length} Tiket)`}
          subtitle={`Aksi: ${batchActionType === 'approved' ? 'Persetujuan Serentak' : 'Penolakan Serentak'}`}
        >
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-300 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Pemberitahuan Eksekusi Massal</span>
              </p>
              <p>
                Anda akan mengubah status {selectedIds.length} tiket sekaligus menjadi <strong>{batchActionType.toUpperCase()}</strong>.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Catatan Serentak untuk Semua Tiket Terpilih
              </label>
              <textarea
                rows={3}
                value={batchFeedbackNote}
                onChange={(e) => setBatchFeedbackNote(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIsBatchModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmBatchAction}
                className="px-4 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 text-white text-xs font-semibold"
              >
                Terapkan ke {selectedIds.length} Tiket
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
