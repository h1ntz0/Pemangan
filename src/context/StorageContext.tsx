import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Room, Booking, Equipment, BookingStatus, AnalyticsSummary, RoomHourlyMatrix } from '../types';
import { ROOMS_DATA, EQUIPMENT_OPTIONS, INITIAL_BOOKINGS, INITIAL_USERS } from '../data/mockData';

interface StorageContextType {
  rooms: Room[];
  bookings: Booking[];
  equipment: Equipment[];
  getRoomById: (id: string) => Room | undefined;
  getBookingById: (id: string) => Booking | undefined;
  createBooking: (data: Omit<Booking, 'id' | 'createdAt' | 'status'>) => Booking;
  updateBookingStatus: (id: string, newStatus: BookingStatus, feedback?: string, approverName?: string) => Booking | null;
  deleteBooking: (id: string) => void;
  checkConflict: (roomId: string, startDateTime: string, endDateTime: string, excludeId?: string) => boolean;
  getHourlyMatrix: (dateStr: string) => RoomHourlyMatrix[];
  analytics: AnalyticsSummary;
  exportCSV: () => string;
  resetDemoData: () => void;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export const StorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('pemangan_rooms_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return ROOMS_DATA;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('pemangan_bookings_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_BOOKINGS;
  });

  const [equipment] = useState<Equipment[]>(EQUIPMENT_OPTIONS);

  useEffect(() => {
    localStorage.setItem('pemangan_rooms_v2', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('pemangan_bookings_v2', JSON.stringify(bookings));
  }, [bookings]);

  const getRoomById = (id: string) => {
    return rooms.find(r => r.id === id);
  };

  const getBookingById = (id: string) => {
    const clean = id.trim().toLowerCase();
    return bookings.find(b => b.id.toLowerCase() === clean);
  };

  const createBooking = (data: Omit<Booking, 'id' | 'createdAt' | 'status'>): Booking => {
    // Generate next ticket number BK-2026-xxx
    const count = bookings.length + 1;
    const newId = `BK-2026-${String(count).padStart(3, '0')}`;
    const newBooking: Booking = {
      ...data,
      id: newId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      approvedBy: '-',
      approvalDate: '-',
      feedback: 'Menunggu review resmi verifikasi Sarpras SMKN 1 Jakarta.'
    };

    setBookings(prev => [newBooking, ...prev]);
    return newBooking;
  };

  const updateBookingStatus = (
    id: string,
    newStatus: BookingStatus,
    feedback?: string,
    approverName: string = 'Sarpras SMKN 1'
  ): Booking | null => {
    let updatedBooking: Booking | null = null;

    setBookings(prev =>
      prev.map(b => {
        if (b.id === id) {
          const defaultFeedback =
            newStatus === 'approved'
              ? 'Disetujui resmi oleh petugas Sarpras. Harap jaga kebersihan dan fasilitas.'
              : newStatus === 'rejected'
              ? 'Ditolak karena alasan jadwal / teknis kedinasan.'
              : b.feedback;

          updatedBooking = {
            ...b,
            status: newStatus,
            feedback: feedback || defaultFeedback,
            approvedBy: approverName,
            approvalDate: new Date().toISOString()
          };
          return updatedBooking;
        }
        return b;
      })
    );

    return updatedBooking;
  };

  const deleteBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  const checkConflict = (
    roomId: string,
    startDateTime: string,
    endDateTime: string,
    excludeId?: string
  ): boolean => {
    const reqStart = new Date(startDateTime).getTime();
    const reqEnd = new Date(endDateTime).getTime();

    if (isNaN(reqStart) || isNaN(reqEnd) || reqStart >= reqEnd) return false;

    return bookings.some(b => {
      if (excludeId && b.id === excludeId) return false;
      if (b.roomId !== roomId || b.status === 'rejected') return false;

      const bStart = new Date(b.startDateTime).getTime();
      const bEnd = new Date(b.endDateTime).getTime();

      return reqStart < bEnd && reqEnd > bStart;
    });
  };

  const getHourlyMatrix = (dateStr: string): RoomHourlyMatrix[] => {
    const hours = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

    return rooms.map(room => {
      const slots = hours.map(h => {
        const slotStart = new Date(`${dateStr}T${String(h).padStart(2, '0')}:00`).getTime();
        const slotEnd = new Date(`${dateStr}T${String(h + 1).padStart(2, '0')}:00`).getTime();

        const matchedBooking = bookings.find(b => {
          if (b.roomId !== room.id || b.status === 'rejected') return false;
          const bStart = new Date(b.startDateTime).getTime();
          const bEnd = new Date(b.endDateTime).getTime();
          return slotStart < bEnd && slotEnd > bStart;
        });

        return {
          hour: h,
          label: `${String(h).padStart(2, '0')}:00`,
          isBooked: !!matchedBooking,
          booking: matchedBooking || null
        };
      });

      return { room, slots };
    });
  };

  const analytics = useMemo<AnalyticsSummary>(() => {
    const total = bookings.length;
    const approved = bookings.filter(b => b.status === 'approved').length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const rejected = bookings.filter(b => b.status === 'rejected').length;

    const roomCounts: Record<string, number> = {};
    bookings.forEach(b => {
      roomCounts[b.roomName] = (roomCounts[b.roomName] || 0) + 1;
    });

    const sortedRooms = Object.entries(roomCounts).sort((a, b) => b[1] - a[1]);
    const topRoomEntry = sortedRooms[0] || ['Belum Ada', 0];

    return {
      total,
      approved,
      pending,
      rejected,
      approvalRate: total > 0 ? Math.round((approved / total) * 100) : 100,
      topRoomName: topRoomEntry[0],
      topRoomCount: topRoomEntry[1],
      totalRooms: rooms.length
    };
  }, [bookings, rooms]);

  const exportCSV = (): string => {
    const headers = [
      "ID Tiket",
      "Nama Ruangan",
      "Pemohon",
      "Peran",
      "Kelas/Unit",
      "Kontak",
      "Guru Pembimbing",
      "Keperluan",
      "Waktu Mulai",
      "Waktu Selesai",
      "Status",
      "Disetujui Oleh",
      "Tanggal Pengajuan"
    ];

    const rows = bookings.map(b => [
      `"${b.id}"`,
      `"${b.roomName}"`,
      `"${b.userName}"`,
      `"${b.userRole}"`,
      `"${b.userClass || '-'}"`,
      `"${b.userContact || '-'}"`,
      `"${b.supervisorName || '-'}"`,
      `"${(b.reason || '').replace(/"/g, '""')}"`,
      `"${b.startDateTime}"`,
      `"${b.endDateTime}"`,
      `"${b.status}"`,
      `"${b.approvedBy || '-'}"`,
      `"${b.createdAt}"`
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  };

  const resetDemoData = () => {
    setRooms(ROOMS_DATA);
    setBookings(INITIAL_BOOKINGS);
    localStorage.setItem('pemangan_rooms_v2', JSON.stringify(ROOMS_DATA));
    localStorage.setItem('pemangan_bookings_v2', JSON.stringify(INITIAL_BOOKINGS));
    localStorage.setItem('pemangan_users_v2', JSON.stringify(INITIAL_USERS));
  };

  return (
    <StorageContext.Provider
      value={{
        rooms,
        bookings,
        equipment,
        getRoomById,
        getBookingById,
        createBooking,
        updateBookingStatus,
        deleteBooking,
        checkConflict,
        getHourlyMatrix,
        analytics,
        exportCSV,
        resetDemoData
      }}
    >
      {children}
    </StorageContext.Provider>
  );
};

export const useStorage = () => {
  const context = useContext(StorageContext);
  if (!context) throw new Error('useStorage must be used within a StorageProvider');
  return context;
};
