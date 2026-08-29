import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const matrixData = getHourlyMatrix(selectedDate);
  const hours = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

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

  return (
    <div className="space-y-4">
      {/* Timetable Controller & Date Picker */}
      <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Jadwal Pemakaian Ruangan
          </span>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
            {formattedDate}
          </h3>
        </div>

        {/* Date Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={handlePrevDay}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 min-h-[36px] min-w-[36px] flex items-center justify-center"
            title="Hari Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleToday}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 min-h-[36px]"
          >
            Hari Ini
          </button>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[36px]"
          />

          <button
            onClick={handleNextDay}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 min-h-[36px] min-w-[36px] flex items-center justify-center"
            title="Hari Berikutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Legend Indicator */}
      <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-white border border-slate-300 dark:bg-slate-800 dark:border-slate-700" />
          <span className="text-[11px]">Tersedia</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-slate-200 border border-slate-400 dark:bg-slate-700 dark:border-slate-600" />
          <span className="text-[11px]">Terjadwal</span>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="p-2.5 pl-3.5 sticky left-0 bg-slate-50 dark:bg-slate-950 z-10 w-52">
                  Ruangan
                </th>
                {hours.map(h => (
                  <th key={h} className="p-2 text-center w-14 border-l border-slate-100 dark:border-slate-800">
                    {String(h).padStart(2, '0')}:00
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {matrixData.map(({ room, slots }) => (
                <tr key={room.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-2.5 pl-3.5 sticky left-0 bg-white dark:bg-slate-900 z-10 border-r border-slate-100 dark:border-slate-800">
                    <p className="font-semibold text-slate-900 dark:text-white line-clamp-1 text-xs">
                      {room.name}
                    </p>
                    <p className="text-[10px] text-slate-400 line-clamp-1">
                      {room.building}
                    </p>
                  </td>

                  {slots.map(slot => {
                    if (slot.isBooked && slot.booking) {
                      return (
                        <td key={slot.hour} className="p-1 border-l border-slate-100 dark:border-slate-800">
                          <button
                            onClick={() => setSelectedBooking(slot.booking)}
                            className="w-full h-8 rounded bg-slate-100 border border-slate-300 dark:bg-slate-800 dark:border-slate-700 flex flex-col items-center justify-center p-0.5 text-[9px] font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                            title={`Klik: ${slot.booking.id} (${slot.booking.userName})`}
                          >
                            <span className="truncate w-full text-center">{slot.booking.userClass || slot.booking.userName}</span>
                          </button>
                        </td>
                      );
                    }

                    return (
                      <td key={slot.hour} className="p-1 border-l border-slate-100 dark:border-slate-800">
                        <button
                          onClick={() => navigate(`/booking?roomId=${room.id}&date=${selectedDate}&hour=${slot.hour}`)}
                          className="w-full h-8 rounded border border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 flex items-center justify-center text-xs font-semibold transition-colors"
                          title={`Kosong — Reservasi ${room.name}`}
                        >
                          <span className="text-[9px]">+</span>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <Modal
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          title={`Detail Reservasi: ${selectedBooking.id}`}
          subtitle={selectedBooking.roomName}
        >
          <div className="space-y-3.5">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Status Tiket</p>
                <div className="mt-0.5">
                  <StatusBadge status={selectedBooking.status} size="md" />
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Nomor Resi</p>
                <p className="text-xs font-mono font-bold text-slate-900 dark:text-white">{selectedBooking.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-0.5">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Pemohon</span>
                <p className="font-bold text-slate-900 dark:text-white">{selectedBooking.userName}</p>
                <p className="text-slate-500">{selectedBooking.userRole} • {selectedBooking.userClass || '-'}</p>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-0.5">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Waktu</span>
                <p className="font-bold text-blue-700 dark:text-blue-400">
                  {new Date(selectedBooking.startDateTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - {new Date(selectedBooking.endDateTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                </p>
                <p className="text-slate-500">{new Date(selectedBooking.startDateTime).toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
              </div>
            </div>

            <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-0.5">
              <span className="text-slate-400 font-semibold uppercase text-[10px]">Agenda</span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{selectedBooking.reason}</p>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  setSelectedBooking(null);
                  navigate(`/tracking?ticketId=${selectedBooking.id}`);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 text-white text-xs font-semibold"
              >
                Lacak Tiket
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
