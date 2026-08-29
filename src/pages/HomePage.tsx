import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStorage } from '../context/StorageContext';
import { RoomCard } from '../components/rooms/RoomCard';
import { StatusBadge } from '../components/common/Badge';

export const HomePage: React.FC = () => {
  const { rooms, bookings, analytics } = useStorage();
  const navigate = useNavigate();

  const featuredRooms = rooms.slice(0, 3);
  const recentBookings = bookings.slice(0, 4);

  return (
    <div className="space-y-6 sm:space-y-10 py-4 sm:py-8 animate-fadeIn">
      
      {/* Hero Section (Clean Institutional 3-Color Tone) */}
      <section className="rounded-2xl bg-slate-900 text-white p-5 sm:p-8 lg:p-10 border border-slate-800">
        <div className="max-w-2xl space-y-4">
          <span className="inline-block text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
            Sistem Informasi Sarana & Prasarana SMKN 1 Jakarta
          </span>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight leading-tight">
            Peminjaman Ruangan & Laboratorium
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            Layanan resmi peminjaman 13 laboratorium komputer SIJA/RPL, studio multimedia, aula, dan ruang serbaguna secara transparan dan terdata.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-2 pt-2">
            <Link
              to="/booking"
              className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
            >
              Ajukan Peminjaman
            </Link>

            <Link
              to="/timetable"
              className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold transition-colors"
            >
              Cek Jadwal
            </Link>

            <Link
              to="/tracking"
              className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold transition-colors"
            >
              Lacak Resi
            </Link>
          </div>
        </div>

        {/* Hero Metrics */}
        <div className="mt-8 pt-5 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          <div>
            <p className="text-xl sm:text-2xl font-bold text-white">{rooms.length}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Total Ruangan</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-white">{analytics.approved}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Disetujui</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-white">{analytics.pending}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Menunggu Review</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-white">100%</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Validasi Anti-Bentrok</p>
          </div>
        </div>
      </section>

      {/* Feature Navigation Cards (Clean 3-Color, No Icon Clutter) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
        
        <div 
          onClick={() => navigate('/rooms')}
          className="group cursor-pointer p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors space-y-1.5"
        >
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
            Katalog Fasilitas Ruangan
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Daftar 13 lab SIJA, RPL, workstation komputer, studio podcast, dan aula serbaguna.
          </p>
          <span className="inline-block pt-1 text-xs font-semibold text-blue-700 dark:text-blue-400">
            Buka Katalog →
          </span>
        </div>

        <div 
          onClick={() => navigate('/timetable')}
          className="group cursor-pointer p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors space-y-1.5"
        >
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
            Jadwal Matriks Per-Jam
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Matriks ketersediaan jadwal ruangan dari pukul 07:00 hingga 17:00 WIB.
          </p>
          <span className="inline-block pt-1 text-xs font-semibold text-blue-700 dark:text-blue-400">
            Lihat Jadwal →
          </span>
        </div>

        <div 
          onClick={() => navigate('/tracking')}
          className="group cursor-pointer p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors space-y-1.5"
        >
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
            Pelacakan Status & Surat Izin
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Lacak nomor resi tiket, verifikasi persetujuan, dan cetak Surat Izin Resmi.
          </p>
          <span className="inline-block pt-1 text-xs font-semibold text-blue-700 dark:text-blue-400">
            Lacak Resi →
          </span>
        </div>

      </section>

      {/* Featured Rooms Section */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              Ruangan & Laboratorium Utama
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Fasilitas yang paling sering digunakan untuk praktikum dan kegiatan sekolah
            </p>
          </div>
          <Link
            to="/rooms"
            className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline"
          >
            Lihat Semua ({rooms.length}) →
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
        
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
              Permohonan Terkini
            </h3>
            <Link to="/tracking" className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline">
              Pusat Pelacakan
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentBookings.map((b) => (
              <div key={b.id} className="py-2.5 flex items-center justify-between gap-3">
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
                    {b.userName} • {new Date(b.startDateTime).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/tracking?ticketId=${b.id}`)}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shrink-0"
                >
                  Detail
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
              Prosedur Peminjaman
            </h3>
            
            <ol className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 list-decimal list-inside leading-relaxed">
              <li>Pilih ruangan di katalog.</li>
              <li>Tentukan tanggal & jam yang tersedia.</li>
              <li>Isi identitas & nama guru pendamping.</li>
              <li>Tunggu verifikasi persetujuan Sarpras.</li>
              <li>Unduh & cetak Surat Izin Resmi.</li>
            </ol>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <Link
              to="/booking"
              className="w-full py-2 rounded-lg bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 text-white text-xs font-semibold text-center block transition-colors"
            >
              Mulai Ajukan Permohonan
            </Link>
          </div>
        </div>

      </section>

    </div>
  );
};
