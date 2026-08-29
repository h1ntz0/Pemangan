import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search
} from 'lucide-react';
import { useStorage } from '../context/StorageContext';
import { Booking } from '../types';
import { StatusBadge } from '../components/common/Badge';
import { OfficialSlipModal } from '../components/slip/OfficialSlipModal';

export const TrackingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getBookingById, bookings } = useStorage();

  const [inputTicket, setInputTicket] = useState<string>(() => {
    return searchParams.get('ticketId') || '';
  });

  const [matchedBooking, setMatchedBooking] = useState<Booking | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [isSlipOpen, setIsSlipOpen] = useState<boolean>(false);

  const performSearch = (ticketId: string) => {
    const clean = ticketId.trim();
    if (!clean) return;

    const found = getBookingById(clean);
    setMatchedBooking(found || null);
    setHasSearched(true);
    setSearchParams({ ticketId: clean });
  };

  useEffect(() => {
    const q = searchParams.get('ticketId');
    if (q) {
      setInputTicket(q);
      performSearch(q);
    }
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(inputTicket);
  };

  const sampleTickets = bookings.slice(0, 4).map(b => b.id);

  return (
    <div className="py-4 sm:py-6 space-y-5 animate-fadeIn max-w-2xl mx-auto">
      
      {/* Header */}
      <div className="space-y-1 text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Pusat Pelacakan Status Tiket
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Ketik nomor tiket resi (contoh: <span className="font-mono font-bold text-blue-700 dark:text-blue-400">BK-2026-001</span>) untuk memverifikasi status.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inputTicket}
              onChange={(e) => setInputTicket(e.target.value)}
              placeholder="Nomor Tiket (misal: BK-2026-001)..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 text-white text-xs sm:text-sm font-semibold transition-colors shrink-0"
          >
            Lacak
          </button>
        </form>

        {/* Quick Sample Tickets */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
          <span className="text-[11px]">Contoh:</span>
          {sampleTickets.map((id) => (
            <button
              key={id}
              onClick={() => {
                setInputTicket(id);
                performSearch(id);
              }}
              className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-mono text-[11px] font-medium text-slate-700 dark:text-slate-300 transition-colors"
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      {/* Result Display */}
      {hasSearched && (
        matchedBooking ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-4 animate-fadeIn">
            
            {/* Header Result */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3.5 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {matchedBooking.id}
                  </span>
                  <StatusBadge status={matchedBooking.status} size="md" />
                </div>
                <p className="text-[11px] text-slate-500">
                  Diajukan pada {new Date(matchedBooking.createdAt).toLocaleDateString('id-ID', { dateStyle: 'full' })}
                </p>
              </div>

              {matchedBooking.status === 'approved' && (
                <button
                  onClick={() => setIsSlipOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
                >
                  Cetak Surat Izin Resmi
                </button>
              )}
            </div>

            {/* Visual Timeline Steps */}
            <div className="space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Progres Peninjauan
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">1. Diajukan</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Data tercatat di sistem</p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">2. Verifikasi</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {matchedBooking.status !== 'pending' ? 'Selesai diverifikasi' : 'Sedang diproses'}
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">3. Keputusan</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {matchedBooking.status === 'approved' ? 'Disetujui Resmi' : matchedBooking.status === 'rejected' ? 'Ditolak' : 'Menunggu Keputusan'}
                  </p>
                </div>
              </div>
            </div>

            {/* Details Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-0.5">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Ruangan</span>
                <p className="font-bold text-slate-900 dark:text-white">{matchedBooking.roomName}</p>
                <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                  {new Date(matchedBooking.startDateTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - {new Date(matchedBooking.endDateTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-0.5">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Pemohon</span>
                <p className="font-bold text-slate-900 dark:text-white">{matchedBooking.userName} ({matchedBooking.userRole})</p>
                <p className="text-slate-600 dark:text-slate-400 text-[11px]">PJ: {matchedBooking.supervisorName || '-'}</p>
              </div>
            </div>

            {/* Feedback Note */}
            {matchedBooking.feedback && (
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-0.5">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Catatan Petugas Sarpras</span>
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed italic">
                  "{matchedBooking.feedback}"
                </p>
              </div>
            )}

            {/* Official Slip Modal */}
            <OfficialSlipModal
              booking={matchedBooking}
              isOpen={isSlipOpen}
              onClose={() => setIsSlipOpen(false)}
            />
          </div>
        ) : (
          <div className="p-6 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
              Nomor Tiket "{inputTicket}" Tidak Ditemukan
            </p>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Periksa kembali nomor resi tiket Anda (contoh format: BK-2026-001).
            </p>
          </div>
        )
      )}

    </div>
  );
};
