/**
 * REVEAL & REACTIVE STATE STORE — PEMANGAN SMKN 1 JAKARTA
 * Standard: Clean Architecture, Pub/Sub Event Bus, Error-Free LocalStorage
 */

const DEFAULT_ROOMS = [
    {
        id: 'r-401',
        name: 'Ruang 401 - Lab Komputer SIJA (Cloud & Network)',
        category: 'Laboratorium',
        type: 'Lab Komputer SIJA',
        building: 'Lantai 4 (Lab SIJA)',
        capacity: 36,
        pic: 'Pak Amrul Khairullah, S.Kom',
        nipPic: '198001012005011002',
        operationalHours: '07:00 - 17:00 WIB',
        facilities: ['36 PC Core i7 16GB RAM', 'Gigabit Managed Switch', 'Access Point Wi-Fi 6', 'AC Dual Unit', 'Projector Laser Full HD', 'Smart Digital Board'],
        image: './img/image1.png',
        description: 'Laboratorium utama SIJA untuk praktikum Cloud Computing, Jaringan Komputer, Cisco & MikroTik Routing, dan Pemrograman Web.',
        status: 'available'
    },
    {
        id: 'r-403',
        name: 'Ruang 403 - Lab Rekayasa Perangkat Lunak & Database',
        category: 'Laboratorium',
        type: 'Lab Software RPL',
        building: 'Lantai 4 (Lab RPL)',
        capacity: 36,
        pic: 'Pak Rian Firmansyah, M.Kom',
        nipPic: '198403152008011004',
        operationalHours: '07:00 - 17:00 WIB',
        facilities: ['36 PC Core i7 16GB RAM Dual Monitor', 'Server Localhost Docker', 'Full AC', 'Interactive TV 65"', 'High-speed Fiber LAN'],
        image: './img/image1.png',
        description: 'Laboratorium pengembangan aplikasi web, mobile Android/iOS, database SQL/NoSQL, dan testing software.',
        status: 'available'
    },
    {
        id: 'r-405',
        name: 'Ruang 405 - Lab Cyber Security & Fiber Optic',
        category: 'Laboratorium',
        type: 'Lab Keamanan Siber',
        building: 'Lantai 4',
        capacity: 32,
        pic: 'Ibu Nurhayati, M.Pd',
        nipPic: '197906122006042003',
        operationalHours: '07:00 - 17:00 WIB',
        facilities: ['32 PC High-End Security Lab', 'Fusion Splicer Fiber Kit', 'OTDR Tester Kit', 'Dedicated Firewall Hardware', 'Dual AC Split'],
        image: './img/image1.png',
        description: 'Laboratorium uji penetrasi jaringan siber, penyambungan kabel fiber optik, dan konfigurasi server security.',
        status: 'available'
    },
    {
        id: 'r-teater',
        name: 'Ruang 1 - Teater Audio Visual (Auditorium)',
        category: 'Auditorium',
        type: 'Teater & Mini Bioskop',
        building: 'Gedung Utama (Lantai 3)',
        capacity: 120,
        pic: 'Ibu Dra. Endang Lestari',
        nipPic: '196811201994032001',
        operationalHours: '07:30 - 16:30 WIB',
        facilities: ['120 Kursi Teater Lipat Berbusa', 'Sound System 5.1 Surround', 'Proyektor Cinema 4K', 'Panggung Presentasi', 'Ruang Kontrol Operator', 'Central AC'],
        image: './img/image3.png',
        description: 'Ruang pertunjukan audio visual untuk pemutaran film edukasi, presentasi karya akhir, seminar industri kejuruan, dan rapat pleno.',
        status: 'available'
    },
    {
        id: 'r-serbaguna',
        name: 'Ruang 2 - Gedung Serbaguna (Aula GSG)',
        category: 'Aula Serbaguna',
        type: 'Aula GSG Indoor',
        building: 'Gedung GSG (Lantai 1)',
        capacity: 350,
        pic: 'Waka Bidang Sarpras',
        nipPic: '197504042000031004',
        operationalHours: '06:30 - 17:30 WIB',
        facilities: ['Kapasitas 350 Orang', 'Lapangan Bulutangkis Indoor', 'Panggung Seni Utama', 'Line Array Sound System', 'Penerangan Sorot LED High Bay'],
        image: './img/image2.png',
        description: 'Gedung aula utama serbaguna untuk upacara tertutup, wisuda, perlombaan olahraga kesiswaan, dan pameran job fair.',
        status: 'available'
    },
    {
        id: 'r-guru',
        name: 'Ruang Guru & Konferensi Pimpinan',
        category: 'Meeting Room',
        type: 'Ruang Rapat VIP',
        building: 'Gedung Utama (Lantai 1)',
        capacity: 45,
        pic: 'Koordinator Tata Usaha',
        nipPic: '198105052007011003',
        operationalHours: '07:00 - 17:00 WIB',
        facilities: ['Meja Konferensi U-Shape', 'Smart TV 75" Video Conference', 'Mic Delegate Wireless', 'AC Split 3 Unit', 'Pantry Kopi & Teh'],
        image: './img/image3.png',
        description: 'Ruang rapat formal untuk koordinasi guru, pimpinan sekolah, komite sekolah, dan audiensi kunjungan dinas.',
        status: 'available'
    },
    {
        id: 'r-podcast',
        name: 'Studio Podcast & Broadcasting SMKN 1',
        category: 'Meeting Room',
        type: 'Studio Kreatif',
        building: 'Gedung Utama (Lantai 3)',
        capacity: 15,
        pic: 'Pak Budi Hartono, S.Kom',
        nipPic: '198602282010011005',
        operationalHours: '08:00 - 16:30 WIB',
        facilities: ['Peredam Suara Acoustic Foam', '4 Shure SM7B Podcasting Mic', 'Audio Mixer Rodecaster Pro', '3 Sony Cinema Line Camera', 'RGB Studio Lighting'],
        image: './img/image3.png',
        description: 'Studio khusus rekaman podcast sekolah, talkshow edukasi, pembuatan konten pembelajaran digital guru, dan siaran live streaming.',
        status: 'available'
    },
    {
        id: 'r-22',
        name: 'Ruang 22 - Gedung Baru (Kelas Teori Modern)',
        category: 'Teori & Kelas',
        type: 'Kelas Teori AC',
        building: 'Gedung Baru (Lantai 2)',
        capacity: 36,
        pic: 'Pak Sukirman, S.Pd',
        nipPic: '198301102008011006',
        operationalHours: '07:00 - 16:30 WIB',
        facilities: ['36 Set Meja Kursi Ergonomis', 'AC 2 PK Dual Unit', 'Whiteboard Magnetik Kaca', 'LCD Projector EPSON', 'Speaker Dinding Pengumuman'],
        image: './img/image2.png',
        description: 'Ruang kelas teori berpendingin udara untuk pembelajaran umum kejuruan dan bimbingan lomba LKS.',
        status: 'available'
    },
    {
        id: 'r-23',
        name: 'Ruang 23 - Gedung Baru (Kelas Teori)',
        category: 'Teori & Kelas',
        type: 'Kelas Teori AC',
        building: 'Gedung Baru (Lantai 2)',
        capacity: 36,
        pic: 'Ibu Nurhayati, M.Pd',
        nipPic: '197906122006042003',
        operationalHours: '07:00 - 16:30 WIB',
        facilities: ['36 Meja Kursi Siswa', 'AC 2 PK', 'Proyektor Dinding', 'Stop Kontak Tiap Deret', 'Wi-Fi Access Point'],
        image: './img/image2.png',
        description: 'Ruang kelas representatif untuk kegiatan KBM teori kejuruan dan simulasi ujian.',
        status: 'available'
    },
    {
        id: 'r-24',
        name: 'Ruang 24 - Gedung Baru (Smart Classroom)',
        category: 'Teori & Kelas',
        type: 'Smart Classroom',
        building: 'Gedung Baru (Lantai 2)',
        capacity: 40,
        pic: 'Pak Budi Hartono, S.Kom',
        nipPic: '198602282010011005',
        operationalHours: '07:00 - 16:30 WIB',
        facilities: ['Interactive Touch Screen 65"', 'Audio Sound Bar Wireless', 'Meja Kursi Modular Fleksibel', 'Full AC', 'Dedicated Wi-Fi 6'],
        image: './img/image2.png',
        description: 'Kelas pintar dengan layar sentuh interaktif untuk pembelajaran kolaboratif abad 21.',
        status: 'available'
    },
    {
        id: 'r-25',
        name: 'Ruang 25 - Gedung Baru (Hybrid Class LAN)',
        category: 'Teori & Kelas',
        type: 'Kelas Teori & LAN',
        building: 'Gedung Baru (Lantai 2)',
        capacity: 36,
        pic: 'Pak Dedi Prasetyo, S.T',
        nipPic: '198709142011011002',
        operationalHours: '07:00 - 16:30 WIB',
        facilities: ['36 Port RJ45 Gigabit LAN Siswa', 'AC 2 Unit', 'LCD Projector', 'Whiteboard Lebar', 'Sound Monitor'],
        image: './img/image2.png',
        description: 'Ruang pembelajaran hybrid dengan colokan LAN kabel pada setiap meja siswa.',
        status: 'available'
    },
    {
        id: 'r-15',
        name: 'Ruang 15 - Gedung Lama (Kelas Asri)',
        category: 'Reguler',
        type: 'Kelas Reguler',
        building: 'Gedung Lama (Lantai 1)',
        capacity: 32,
        pic: 'Ibu Sri Wahyuni, S.Pd',
        nipPic: '198207192009022003',
        operationalHours: '07:00 - 16:30 WIB',
        facilities: ['32 Meja Kursi Kayu Kokoh', 'Kipas Angin Gantung Dual', 'Whiteboard Klasik', 'Ventilasi Udara Lebar Asri'],
        image: './img/image2.png',
        description: 'Ruang kelas asri gedung lama untuk pembelajaran umum, mentoring, dan remedial siswa.',
        status: 'available'
    },
    {
        id: 'r-16',
        name: 'Ruang 16 - Gedung Lama (Sekretariat Bersama)',
        category: 'Reguler',
        type: 'Ruang Kesiswaan',
        building: 'Gedung Lama (Lantai 1)',
        capacity: 32,
        pic: 'Pak Hendra Gunawan, S.Pd',
        nipPic: '198504222010011008',
        operationalHours: '07:00 - 17:30 WIB',
        facilities: ['Meja Rapat Kolaboratif', 'Papan Pengumuman Organisasi', 'Loker Penyimpanan Berkas Ekskul', 'Kipas Angin Dinding', 'Dispenser Air Minum'],
        image: './img/image2.png',
        description: 'Pusat koordinasi OSIS, MPK, Pramuka, Rohis, dan kegiatan kepemudaan kesiswaan SMKN 1 Jakarta.',
        status: 'available'
    }
];

const DEFAULT_EQUIPMENT = [
    { id: 'eq-mic', name: 'Mikrofon Wireless Ekstra (2 Unit)', category: 'Audio' },
    { id: 'eq-sound', name: 'Sound System Portable Wireless', category: 'Audio' },
    { id: 'eq-proj', name: 'Projector Laser HDMI + Kabel 10m', category: 'Visual' },
    { id: 'eq-pointer', name: 'Laser Pointer Wireless Presenter', category: 'Visual' },
    { id: 'eq-switch', name: 'Gigabit Switch 16-Port & Kabel Patch Cord', category: 'Jaringan' },
    { id: 'eq-cam', name: 'Web Camera 4K Kit & Tripod (Hybrid)', category: 'Multimedia' },
    { id: 'eq-chairs', name: 'Kursi Tambahan Lipat (20 Unit)', category: 'Mebel' },
    { id: 'eq-cable', name: 'Kabel Rol Listrik Ekstensi 20 Meter', category: 'Listrik' }
];

const DEFAULT_USERS = [
    { id: 'u-1', name: 'Arrofi Zein (Siswa)', nis: '102144', role: 'siswa', class: 'XI SIJA 1', phone: '081234567890', password: '123' },
    { id: 'u-2', name: 'Pak Amrul Khairullah, S.Kom', nis: '19800101', role: 'guru', class: 'Guru SIJA / Sarpras', phone: '081298765432', password: 'guru' },
    { id: 'u-3', name: 'Admin Sarpras SMKN 1', nis: 'admin', role: 'admin', class: 'Unit Sarpras', phone: '081122334455', password: 'admin' }
];

const DEFAULT_BOOKINGS = [
    {
        id: 'BK-2026-001',
        roomId: 'r-401',
        roomName: 'Ruang 401 - Lab Komputer SIJA (Cloud & Network)',
        userName: 'Arrofi Zein',
        userRole: 'siswa',
        userClass: 'XI SIJA 1',
        userContact: '081234567890',
        supervisorName: 'Pak Amrul Khairullah, S.Kom',
        equipment: ['Mikrofon Wireless Ekstra (2 Unit)', 'Gigabit Switch 16-Port & Kabel Patch Cord'],
        reason: 'Praktikum Uji Kompetensi Cloud Network Architecture dan Simulasi Server SMKN 1 Jakarta',
        startDateTime: '2026-08-29T08:00',
        endDateTime: '2026-08-29T11:30',
        status: 'approved',
        createdAt: '2026-08-28T09:15:00.000Z',
        approvedBy: 'Pak Amrul Khairullah, S.Kom',
        approvalDate: '2026-08-28T10:00:00.000Z',
        feedback: 'Disetujui resmi. Harap menjaga kebersihan dan pastikan kabel patch cord dirapikan kembali setelah selesai praktikum.'
    },
    {
        id: 'BK-2026-002',
        roomId: 'r-teater',
        roomName: 'Ruang 1 - Teater Audio Visual (Auditorium)',
        userName: 'Rasya Aryasatya',
        userRole: 'siswa',
        userClass: 'XI SIJA 1',
        userContact: '081399887766',
        supervisorName: 'Ibu Dra. Endang Lestari',
        equipment: ['Sound System Portable Wireless', 'Laser Pointer Wireless Presenter'],
        reason: 'Seminar Nasional Pengenalan Arsitektur Cloud & Vokasi SIJA Berstandar Industri',
        startDateTime: '2026-08-30T13:00',
        endDateTime: '2026-08-30T15:30',
        status: 'pending',
        createdAt: '2026-08-28T11:45:00.000Z',
        approvedBy: '-',
        approvalDate: '-',
        feedback: 'Menunggu review Waka Sarpras & verifikasi surat tugas guru pendamping.'
    }
];

// Reactive Store Implementation
class PemanganStore {
    constructor() {
        this.listeners = {};
        this.STORAGE_KEYS = {
            ROOMS: 'pemangan_v3_rooms',
            BOOKINGS: 'pemangan_v3_bookings',
            USERS: 'pemangan_v3_users',
            CURRENT_USER: 'pemangan_v3_session',
            THEME: 'pemangan_theme'
        };
        this.init();
    }

    init() {
        if (!localStorage.getItem(this.STORAGE_KEYS.ROOMS)) {
            localStorage.setItem(this.STORAGE_KEYS.ROOMS, JSON.stringify(DEFAULT_ROOMS));
        }
        if (!localStorage.getItem(this.STORAGE_KEYS.BOOKINGS)) {
            localStorage.setItem(this.STORAGE_KEYS.BOOKINGS, JSON.stringify(DEFAULT_BOOKINGS));
        }
        if (!localStorage.getItem(this.STORAGE_KEYS.USERS)) {
            localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
        }
    }

    // Pub-Sub Event Bus
    subscribe(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
        return () => {
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        };
    }

    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => {
                try {
                    callback(data);
                } catch (e) {
                    console.error(`Error in listener for ${event}:`, e);
                }
            });
        }
    }

    // Rooms
    getRooms() {
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.ROOMS)) || DEFAULT_ROOMS;
        } catch {
            return DEFAULT_ROOMS;
        }
    }

    getRoomById(id) {
        return this.getRooms().find(r => r.id === id) || null;
    }

    updateRoomStatus(roomId, newStatus) {
        const rooms = this.getRooms().map(r => r.id === roomId ? { ...r, status: newStatus } : r);
        localStorage.setItem(this.STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
        this.emit('rooms_updated', rooms);
        return true;
    }

    // Equipment
    getEquipmentOptions() {
        return DEFAULT_EQUIPMENT;
    }

    // Bookings
    getBookings() {
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.BOOKINGS)) || DEFAULT_BOOKINGS;
        } catch {
            return DEFAULT_BOOKINGS;
        }
    }

    getBookingById(id) {
        return this.getBookings().find(b => b.id.toLowerCase() === id.trim().toLowerCase()) || null;
    }

    addBooking(bookingData) {
        const bookings = this.getBookings();
        bookings.unshift(bookingData);
        localStorage.setItem(this.STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
        this.emit('bookings_updated', bookings);
        return bookingData;
    }

    updateBookingStatus(bookingId, status, feedback = '', approvedBy = 'Sarpras SMKN 1') {
        const bookings = this.getBookings().map(b => {
            if (b.id === bookingId) {
                return {
                    ...b,
                    status,
                    feedback: feedback || (status === 'approved' ? 'Disetujui resmi oleh Sarpras SMKN 1.' : 'Permohonan ditolak.'),
                    approvedBy: status === 'approved' ? approvedBy : b.approvedBy,
                    approvalDate: new Date().toISOString()
                };
            }
            return b;
        });
        localStorage.setItem(this.STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
        this.emit('bookings_updated', bookings);
        return true;
    }

    deleteBooking(bookingId) {
        const bookings = this.getBookings().filter(b => b.id !== bookingId);
        localStorage.setItem(this.STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
        this.emit('bookings_updated', bookings);
        return true;
    }

    // Conflict Check Algorithm
    checkConflict(roomId, newStartStr, newEndStr, excludeBookingId = null) {
        const newStart = new Date(newStartStr).getTime();
        const newEnd = new Date(newEndStr).getTime();
        const bookings = this.getBookings();

        return bookings.some(b => {
            if (b.roomId !== roomId) return false;
            if (b.status === 'rejected') return false;
            if (excludeBookingId && b.id === excludeBookingId) return false;

            const existingStart = new Date(b.startDateTime).getTime();
            const existingEnd = new Date(b.endDateTime).getTime();

            return (newStart < existingEnd && newEnd > existingStart);
        });
    }

    // Hourly Schedule Matrix (07:00 - 17:00 WIB)
    getHourlyMatrix(dateStr) {
        const rooms = this.getRooms();
        const bookings = this.getBookings();
        const hours = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

        const targetDate = dateStr ? new Date(dateStr) : new Date();
        const targetDateKey = targetDate.toISOString().slice(0, 10);

        return rooms.map(room => {
            const slots = hours.map(h => {
                const slotStart = new Date(`${targetDateKey}T${String(h).padStart(2, '0')}:00:00`).getTime();
                const slotEnd = new Date(`${targetDateKey}T${String(h + 1).padStart(2, '0')}:00:00`).getTime();

                const matchedBooking = bookings.find(b => {
                    if (b.roomId !== room.id || b.status === 'rejected') return false;
                    const bStart = new Date(b.startDateTime).getTime();
                    const bEnd = new Date(b.endDateTime).getTime();
                    return (slotStart < bEnd && slotEnd > bStart);
                });

                return {
                    hour: h,
                    isBooked: !!matchedBooking,
                    booking: matchedBooking || null
                };
            });

            return {
                room,
                slots
            };
        });
    }

    // Analytics Engine
    getAnalytics() {
        const bookings = this.getBookings();
        const total = bookings.length;
        const approved = bookings.filter(b => b.status === 'approved').length;
        const pending = bookings.filter(b => b.status === 'pending').length;
        const rejected = bookings.filter(b => b.status === 'rejected').length;
        const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;

        const countMap = {};
        bookings.forEach(b => {
            countMap[b.roomName] = (countMap[b.roomName] || 0) + 1;
        });

        let topRoomName = '-';
        let maxCount = 0;
        for (const [rName, count] of Object.entries(countMap)) {
            if (count > maxCount) {
                maxCount = count;
                topRoomName = rName;
            }
        }

        return {
            total,
            approved,
            pending,
            rejected,
            approvalRate,
            topRoomName
        };
    }

    // CSV Exporter
    exportCSV() {
        const bookings = this.getBookings();
        const headers = ['No Tiket', 'Ruangan', 'Pemohon', 'Peran', 'Kelas', 'Kontak', 'Guru Pembimbing', 'Alat Tambahan', 'Mulai', 'Selesai', 'Status', 'Disetujui Oleh', 'Catatan'];
        
        const rows = bookings.map(b => [
            `"${b.id}"`,
            `"${b.roomName}"`,
            `"${b.userName}"`,
            `"${b.userRole}"`,
            `"${b.userClass || '-'}"`,
            `"${b.userContact || '-'}"`,
            `"${b.supervisorName || '-'}"`,
            `"${b.equipment ? b.equipment.join('; ') : '-'}"`,
            `"${b.startDateTime}"`,
            `"${b.endDateTime}"`,
            `"${b.status}"`,
            `"${b.approvedBy}"`,
            `"${(b.feedback || '').replace(/"/g, '""')}"`
        ]);

        return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    }

    // Auth & Session
    getUsers() {
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.USERS)) || DEFAULT_USERS;
        } catch {
            return DEFAULT_USERS;
        }
    }

    getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.CURRENT_USER)) || null;
        } catch {
            return null;
        }
    }

    setCurrentUser(user) {
        localStorage.setItem(this.STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        this.emit('auth_changed', user);
    }

    logout() {
        localStorage.removeItem(this.STORAGE_KEYS.CURRENT_USER);
        this.emit('auth_changed', null);
    }

    resetDefaults() {
        localStorage.setItem(this.STORAGE_KEYS.ROOMS, JSON.stringify(DEFAULT_ROOMS));
        localStorage.setItem(this.STORAGE_KEYS.BOOKINGS, JSON.stringify(DEFAULT_BOOKINGS));
        localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
        this.emit('rooms_updated', DEFAULT_ROOMS);
        this.emit('bookings_updated', DEFAULT_BOOKINGS);
    }
}

// Global Store Singleton
window.Store = new PemanganStore();
// Compatibility aliases for previous scripts if any
window.StorageService = {
    getRooms: () => window.Store.getRooms(),
    getBookings: () => window.Store.getBookings(),
    getBookingById: (id) => window.Store.getBookingById(id),
    saveBooking: (b) => window.Store.addBooking(b),
    updateBookingStatus: (id, st, fb, by) => window.Store.updateBookingStatus(id, st, fb, by),
    deleteBooking: (id) => window.Store.deleteBooking(id),
    checkConflict: (r, s, e) => window.Store.checkConflict(r, s, e),
    getHourlyMatrix: (d) => window.Store.getHourlyMatrix(d),
    getAnalytics: () => window.Store.getAnalytics(),
    exportBookingsCSV: () => window.Store.exportCSV(),
    getCurrentUser: () => window.Store.getCurrentUser(),
    setCurrentUser: (u) => window.Store.setCurrentUser(u),
    getUsers: () => window.Store.getUsers(),
    logout: () => window.Store.logout(),
    resetDataToDefault: () => window.Store.resetDefaults()
};
window.ROOMS_DATA = DEFAULT_ROOMS;
window.EQUIPMENT_OPTIONS = DEFAULT_EQUIPMENT;
