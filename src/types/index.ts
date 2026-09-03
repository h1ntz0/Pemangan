export type UserRole = 'siswa' | 'guru' | 'admin' | 'sarpras';

export type RoomCategory = 'Laboratorium' | 'Auditorium' | 'Aula Serbaguna' | 'Meeting Room' | 'Teori & Kelas' | 'Reguler';

export type RoomStatus = 'available' | 'maintenance' | 'occupied';

export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'ongoing' | 'completed';

export interface Room {
  id: string;
  name: string;
  building: string;
  category: RoomCategory | string;
  capacity: number;
  type: string;
  facilities: string[];
  image: string;
  pic: string;
  nipPic: string;
  status: RoomStatus;
  operationalHours: string;
  description: string;
}

export interface Equipment {
  id: string;
  name: string;
  category: 'Audio' | 'Display' | 'Jaringan' | 'Furnitur' | 'Multimedia' | string;
}

export interface User {
  nis: string;
  name: string;
  class: string;
  role: UserRole;
  password?: string;
  email: string;
  avatar: string;
  phone: string;
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  userName: string;
  userRole: UserRole;
  userClass?: string;
  userContact?: string;
  supervisorName?: string;
  equipment: string[];
  reason: string;
  startDateTime: string; // ISO string or YYYY-MM-DDTHH:mm
  endDateTime: string;   // ISO string or YYYY-MM-DDTHH:mm
  status: BookingStatus;
  createdAt: string;
  approvedBy?: string;
  approvalDate?: string;
  feedback?: string;
}

export interface HourlySlot {
  hour: number;
  label: string;
  isBooked: boolean;
  booking: Booking | null;
}

export interface RoomHourlyMatrix {
  room: Room;
  slots: HourlySlot[];
}

export interface AnalyticsSummary {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  ongoing: number;
  completed: number;
  approvalRate: number;
  topRoomName: string;
  topRoomCount: number;
  totalRooms: number;
}
