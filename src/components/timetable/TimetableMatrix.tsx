import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  ArrowRight, 
  Plus, 
  Building2,
  SlidersHorizontal
} from 'lucide-react';
import { useStorage } from '../../context/StorageContext';
import { Booking } from '../../types';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/Badge';

export const TimetableMatrix: React.FC = () => {
  const { getHourlyMatrix } = useStorage();
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const rawMatrixData = getHourlyMatrix(selectedDate);
  const hours = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

  // Quick category categories filter items
  const categoryOptions = [
    { id: 'all', label: 'Semua Ruangan' },
    { id: 'Lab SIJA', label: 'Lab SIJA' },
    { id: 'Lab RPL', label: 'Lab RPL' },
    { id: 'Teori & Kelas', label: 'Ruang Teori' },
    { id: 'Aula Serbaguna', label: 'Aula & Auditorium' }
  ];

  const filteredMatrixData = useMemo(() => {
    if (selectedCategory === 'all') return rawMatrixData;
    
    return rawMatrixData.filter(({ room }) => {
      if (selectedCategory === 'Lab SIJA') {
        return room.name.toLowerCase().includes('sija') || room.description.toLowerCase().includes('sija');
      }
      if (selectedCategory === 'Lab RPL') {
        return room.name.toLowerCase().includes('rekayasa') || room.name.toLowerCase().includes('rpl') || room.description.toLowerCase().includes('rpl');
      }
      if (selectedCategory === 'Teori & Kelas') {
        return room.category === 'Teori & Kelas' || room.category === 'Reguler';
      }
      if (selectedCategory === 'Aula Serbaguna') {
        return room.category === 'Aula Serbaguna' || room.category === 'Auditorium';
      }
      return room.category === selectedCategory;
    });
  }, [rawMatrixData, selectedCategory]);

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const formattedDate = new Date(selectedDate).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const totalSlotsCount = filteredMatrixData.length * hours.length;
  const bookedSlotsCount = filteredMatrixData.reduce((acc, row) => {
    return acc + row.slots.filter(s => s.isBooked).length;
  }, 0);

  return (
    <div className="space-y-4">
      {/* Timetable Controller & Date Picker */}
      <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center text-blue-700 dark:text-blue-400 shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Jadwal Pemakaian Ruangan
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {bookedSlotsCount}/{totalSlotsCount} Terisi
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
              {formattedDate}
            </h3>
          </div>
        </div>

        {/* Date Controls */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={handlePrevDay}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer transition-colors active:scale-95"
            title="Hari Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button
            type="button"
            onClick={handleToday}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 min-h-[38px] cursor-pointer transition-colors"
          >
            Hari Ini
          </button>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[38px] cursor-pointer"
          />

          <button
            type="button"
            onClick={handleNextDay}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer transition-colors active:scale-95"
            title="Hari Berikutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Quick Filter & Legend */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold mr-1 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kategori:</span>
          </div>
          {categoryOptions.map(opt => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelectedCategory(opt.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                selectedCategory === opt.id
                  ? 'bg-blue-700 text-white shadow-xs font-semibold'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Legend Indicator */}
        <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shrink-0 self-start sm:self-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm border border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-950" />
            <span className="text-[11px]">Tersedia (+)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-100 border border-blue-300 dark:bg-blue-900/60 dark:border-blue-700" />
            <span className="text-[11px]">Disetujui</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-100 border border-amber-300 dark:bg-amber-950/60 dark:border-amber-700" />
            <span className="text-[11px]">Menunggu</span>
          </div>
        </div>
      </div>

      {/* Matrix Table with Sticky Left Column and Top Header */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="p-3 pl-4 sticky left-0 bg-slate-50 dark:bg-slate-950 z-20 w-60 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.05)] dark:shadow-[2px_0_4px_-2px_rgba(0,0,0,0.5)]">
                  Ruangan & Fasilitas
                </th>
                {hours.map(h => (
                  <th key={h} className="p-2 text-center w-16 border-l border-slate-100 dark:border-slate-800">
                    <span className="block font-bold">{String(h).padStart(2, '0')}:00</span>
                    <span className="text-[9px] font-normal text-slate-400">-{String(h + 1).padStart(2, '0')}:00</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredMatrixData.length > 0 ? (
                filteredMatrixData.map(({ room, slots }) => (
                  <tr key={room.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors group">
                    {/* Sticky Room Info Cell */}
                    <td className="p-3 pl-4 sticky left-0 bg-white dark:bg-slate-900 z-10 border-r border-slate-200 dark:border-slate-800 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.05)] dark:shadow-[2px_0_4px_-2px_rgba(0,0,0,0.5)]">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400 shrink-0" />
                          <p className="font-bold text-slate-900 dark:text-white line-clamp-1 text-xs">
                            {room.name}
                          </p>
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-1 pl-5">
                          {room.building} • Kap. {room.capacity}
                        </p>
                      </div>
                    </td>

                    {/* Hourly Slots */}
                    {slots.map(slot => {
                      if (slot.isBooked && slot.booking) {
                        const isApproved = slot.booking.status === 'approved';
                        return (
                          <td key={slot.hour} className="p-1 border-l border-slate-100 dark:border-slate-800 align-middle">
                            <button
                              type="button"
                              onClick={() => setSelectedBooking(slot.booking)}
                              className={`w-full h-10 rounded-md border flex flex-col items-center justify-center p-1 text-[9px] font-bold transition-all cursor-pointer hover:shadow-xs active:scale-98 ${
                                isApproved
                                  ? 'bg-blue-50 border-blue-200 text-blue-900 hover:bg-blue-100 dark:bg-blue-950/60 dark:border-blue-800/80 dark:text-blue-200 dark:hover:bg-blue-900/80'
                                  : 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100 dark:bg-amber-950/60 dark:border-amber-800/80 dark:text-amber-200 dark:hover:bg-amber-900/80'
                              }`}
                              title={`Terjadwal: ${slot.booking.userName} (${slot.booking.id}) - Klik untuk rincian`}
                            >
                              <span className="truncate w-full text-center leading-tight">
                                {slot.booking.userClass || slot.booking.userName}
                              </span>
                              <span className="text-[8px] opacity-70 font-mono">
                                {slot.booking.id}
                              </span>
                            </button>
                          </td>
                        );
                      }

                      return (
                        <td key={slot.hour} className="p-1 border-l border-slate-100 dark:border-slate-800 align-middle">
                          <button
                            type="button"
                            onClick={() => navigate(`/booking?roomId=${room.id}&date=${selectedDate}&hour=${slot.hour}`)}
                            className="w-full h-10 rounded-md border border-dashed border-slate-200 dark:border-slate-800/80 hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 flex flex-col items-center justify-center text-xs font-semibold transition-all cursor-pointer group/btn"
                            title={`Tersedia pada pukul ${String(slot.hour).padStart(2, '0')}:00 - Klik untuk Booking Ruangan Ini`}
                          >
                            <Plus className="w-3.5 h-3.5 transition-transform group-hover/btn:scale-125" />
                            <span className="text-[8px] font-normal opacity-0 group-hover/btn:opacity-100 transition-opacity hidden sm:inline">
                              Booking
                            </span>
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={hours.length + 1} className="p-8 text-center text-slate-400 text-xs">
                    Tidak ada ruangan yang cocok dengan filter kategori "{selectedCategory}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Detail Popup Modal */}
      {selectedBooking && (
        <Modal
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          title={`Detail Reservasi: ${selectedBooking.id}`}
          subtitle={selectedBooking.roomName}
          maxWidth="md"
        >
          <div className="space-y-4">
            
            {/* Status & ID Badge Box */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
              <div className="space-y-1">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Status Reservasi</p>
                <div>
                  <StatusBadge status={selectedBooking.status} size="md" />
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Nomor Resi</p>
                <p className="text-xs sm:text-sm font-mono font-bold text-slate-900 dark:text-white">{selectedBooking.id}</p>
              </div>
            </div>

            {/* Applicant & Timing Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase text-[10px]">
                  <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Pemohon</span>
                </div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{selectedBooking.userName}</p>
                <p className="text-slate-500 font-medium capitalize">{selectedBooking.userRole} • {selectedBooking.userClass || '-'}</p>
                {selectedBooking.userContact && (
                  <p className="text-[11px] text-slate-400 font-mono">WA: {selectedBooking.userContact}</p>
                )}
              </div>

              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase text-[10px]">
                  <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Waktu Pemakaian</span>
                </div>
                <p className="font-bold text-blue-700 dark:text-blue-400 text-sm">
                  {new Date(selectedBooking.startDateTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - {new Date(selectedBooking.endDateTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                </p>
                <p className="text-slate-500 font-medium">
                  {new Date(selectedBooking.startDateTime).toLocaleDateString('id-ID', { dateStyle: 'full' })}
                </p>
              </div>
            </div>

            {/* Purpose & Supervisor */}
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1 text-xs">
              <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase text-[10px]">
                <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Keperluan / Agenda</span>
              </div>
              <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                "{selectedBooking.reason}"
              </p>
              {selectedBooking.supervisorName && (
                <p className="text-[11px] text-slate-500 pt-1">
                  Guru Pembimbing / PJ: <strong className="text-slate-700 dark:text-slate-300">{selectedBooking.supervisorName}</strong>
                </p>
              )}
            </div>

            {/* Equipment if any */}
            {selectedBooking.equipment && selectedBooking.equipment.length > 0 && (
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400">Peralatan Tambahan</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedBooking.equipment.map((eq, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium">
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer transition-colors"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  const bId = selectedBooking.id;
                  setSelectedBooking(null);
                  navigate(`/tracking?ticketId=${bId}`);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
              >
                <span>Lacak Status Tiket</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
