import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp
} from 'lucide-react';
import { useStorage } from '../context/StorageContext';
import { RoomCard } from '../components/rooms/RoomCard';
import { StatusBadge } from '../components/common/Badge';

export const HomePage: React.FC = () => {
  const { rooms, bookings, analytics } = useStorage();
  const navigate = useNavigate();
  const [quickSearch, setQuickSearch] = useState('');

  const featuredRooms = rooms.slice(0, 3);
  const recentBookings = bookings.slice(0, 4);

  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      if (quickSearch.trim().toUpperCase().startsWith('BK-')) {
        navigate(`/tracking?ticketId=${encodeURIComponent(quickSearch.trim())}`);
      } else {
        navigate(`/rooms?search=${encodeURIComponent(quickSearch.trim())}`);
      }
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 py-2 sm:py-6 animate-fadeIn">
      
      {/* Hero Card: Clean Institutional & Editorial Design */}
      <section className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 lg:p-10 shadow-xs transition-colors">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"></span>
            <span>Sarana & Prasarana SMKN 1 Jakarta</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Peminjaman Ruang & Lab
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
            Layanan pengajuan izin pemakaian laboratorium komputer kejuruan, ruang teori, studio, dan aula serbaguna untuk kegiatan pembelajaran dan kegiatan siswa.
          </p>

          {/* Quick Search & Ticket Finder Bar */}
          <form onSubmit={handleQuickSearchSubmit} className="pt-2">
            <div className="flex flex-col sm:flex-row gap-2 max-w-xl">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={quickSearch}
                  onChange={(e) => setQuickSearch(e.target.value)}
                  placeholder="Cari ruangan atau nomor tiket (contoh: BK-2026-001)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold transition-colors shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Cari</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Action Navigation */}
          <div className="flex flex-wrap gap-2 pt-1">
            <Link
              to="/booking"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <span>Ajukan Peminjaman</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/timetable"
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <span>Jadwal Ruangan</span>
            </Link>

            <Link
              to="/tracking"
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <span>Lacak Tiket</span>
            </Link>
          </div>
        </div>

        {/* Real Data Counter Cards */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
            <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
              {rooms.length}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              Total Ruang & Lab
            </p>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
            <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
              {analytics.approved}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              Izin Disetujui
            </p>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
            <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
              {analytics.pending}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              Menunggu Verifikasi
            </p>
          </div>
        </div>
      </section>

      {/* Feature Navigation Cards (Refined & Clean) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
        
        <div 
          onClick={() => navigate('/rooms')}
          className="group cursor-pointer p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-2"
        >
          <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            Daftar Ruangan & Lab
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Daftar 13 laboratorium komputer kejuruan, ruang kelas teori, studio, dan aula serbaguna.
          </p>
          <span className="inline-flex items-center gap-1 pt-1 text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
            <span>Buka daftar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div 
          onClick={() => navigate('/timetable')}
          className="group cursor-pointer p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-2"
        >
          <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            Jadwal Pemakaian
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Pantau ketersediaan jam ruangan dari pukul 07:00 hingga 17:00 WIB per hari.
          </p>
          <span className="inline-flex items-center gap-1 pt-1 text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
            <span>Lihat jadwal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div 
          onClick={() => navigate('/tracking')}
          className="group cursor-pointer p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-2"
        >
          <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            Status Pengajuan & Surat Izin
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Periksa status persetujuan surat izin peminjaman dengan memasukkan nomor tiket pengajuan.
          </p>
          <span className="inline-flex items-center gap-1 pt-1 text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
            <span>Lacak tiket</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

      </section>

      {/* Featured Rooms Section */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              Ruangan & Laboratorium
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Fasilitas yang siap digunakan untuk praktikum kejuruan, pembelajaran, dan kegiatan siswa
            </p>
          </div>
          <Link
            to="/rooms"
            className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>Semua Fasilitas ({rooms.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
          {featuredRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </section>

      {/* Recent Activity & Procedure */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                Permohonan Terkini
              </h3>
            </div>
            <Link to="/tracking" className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline">
              Pusat Pelacakan →
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentBookings.map((b) => (
              <div key={b.id} className="py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-lg transition-colors">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                      {b.id}
                    </span>
                    <StatusBadge status={b.status} size="sm" />
                  </div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {b.roomName}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {b.userName} ({b.userClass || b.userRole}) • {new Date(b.startDateTime).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/tracking?ticketId=${b.id}`)}
                  className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shrink-0 transition-colors"
                >
                  Detail
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-2.5">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Prosedur Peminjaman</span>
            </h3>
            
            <ol className="space-y-2 text-xs text-slate-600 dark:text-slate-400 list-decimal list-inside leading-relaxed">
              <li>Pilih ruangan di katalog fasilitas.</li>
              <li>Pilih tanggal & rentang jam yang tersedia.</li>
              <li>Isi identitas diri & guru pembimbing.</li>
              <li>Tinjau dan setujui SOP Sarpras.</li>
              <li>Verifikasi berkas & cetak Surat Izin Resmi.</li>
            </ol>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <Link
              to="/booking"
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold text-center block transition-all shadow-xs"
            >
              Mulai Ajukan Permohonan
            </Link>
          </div>
        </div>

      </section>

    </div>
  );
};
