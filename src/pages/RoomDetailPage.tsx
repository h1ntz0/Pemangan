import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  Clock, 
  ShieldCheck, 
  ArrowLeft, 
  PlusCircle, 
  CheckCircle2, 
  Calendar,
  Share2,
  Check
} from 'lucide-react';
import { useStorage } from '../context/StorageContext';
import { StatusBadge } from '../components/common/Badge';

export const RoomDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRoomById, bookings } = useStorage();
  const [copied, setCopied] = React.useState(false);

  const room = id ? getRoomById(id) : undefined;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!room) {
    return (
      <div className="py-20 text-center space-y-4">
        <Building2 className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Ruangan Tidak Ditemukan</h2>
        <p className="text-xs text-slate-500">ID ruangan yang dicari tidak terdaftar dalam katalog Sarpras SMKN 1 Jakarta.</p>
        <Link to="/rooms" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog Ruangan</span>
        </Link>
      </div>
    );
  }

  const roomBookings = bookings.filter(b => b.roomId === room.id);

  return (
    <div className="py-4 sm:py-8 space-y-6 animate-fadeIn max-w-4xl mx-auto">
      
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-600">Tautan Disalin!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>Bagikan Ruangan</span>
            </>
          )}
        </button>
      </div>

      {/* Main Room Card Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
        
        {/* Large Banner Image */}
        <div className="relative h-60 sm:h-80 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={room.image}
            alt={room.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/img/image1.png';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
          
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className="px-3 py-1 rounded-xl text-xs font-bold bg-white/95 text-slate-900 dark:bg-slate-900/90 dark:text-slate-100 shadow-md">
              {room.category}
            </span>
            <StatusBadge status={room.status} size="md" />
          </div>

          <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
            <span className="text-xs font-bold text-blue-300 uppercase tracking-widest">{room.type}</span>
            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">{room.name}</h1>
            <p className="text-xs sm:text-sm text-slate-300">{room.building}</p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Kapasitas Maksimal</span>
              <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-600" />
                {room.capacity} Orang
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Jam Operasional</span>
              <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-500" />
                {room.operationalHours}
              </p>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Penanggung Jawab (PIC)</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                {room.pic}
              </p>
              <p className="text-[11px] text-slate-500 font-mono">NIP: {room.nipPic}</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Deskripsi Fasilitas & Peruntukan
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {room.description}
            </p>
          </div>

          {/* Complete Facilities List */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Inventaris Sarana & Perangkat Terpasang
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {room.facilities.map((fac, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>{fac}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Room History / Schedule */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Riwayat & Jadwal Peminjaman Ruangan Ini
              </h3>
              <Link to="/timetable" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Lihat Matriks Lengkap</span>
              </Link>
            </div>

            {roomBookings.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border rounded-2xl border-slate-200 dark:border-slate-800 overflow-hidden">
                {roomBookings.map(b => (
                  <div key={b.id} className="p-4 flex items-center justify-between gap-4 text-xs bg-white dark:bg-slate-900">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold">{b.id}</span>
                        <StatusBadge status={b.status} size="sm" />
                      </div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{b.reason}</p>
                      <p className="text-slate-500 text-[11px]">Pemohon: {b.userName} • {new Date(b.startDateTime).toLocaleDateString('id-ID', { dateStyle: 'medium' })} ({new Date(b.startDateTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - {new Date(b.endDateTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })})</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                Belum ada permohonan reservasi untuk ruangan ini. Ruangan siap digunakan.
              </p>
            )}
          </div>

          {/* Action CTA */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <Link
              to="/rooms"
              className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 text-center transition-colors"
            >
              Lihat Ruangan Lain
            </Link>

            <button
              onClick={() => navigate(`/booking?roomId=${room.id}`)}
              className="px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Ajukan Peminjaman {room.name.split('-')[0]}</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
