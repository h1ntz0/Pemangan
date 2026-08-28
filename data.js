// Data Ruangan SMK Negeri 1 Jakarta
const ROOMS_DATA = [
    {
        id: "r-22",
        name: "Ruang 22 - Gedung Baru",
        building: "Gedung Baru",
        floor: "Lantai 2",
        capacity: 36,
        type: "Teori & Kelas",
        facilities: ["Proyektor LCD Epson", "AC 2 Unit (2 PK)", "Whiteboard Kaca", "WiFi Dedicated 100Mbps", "Sound Speaker Aktif", "Stopkontak Tiap Meja"],
        image: "./img/image1.png",
        pic: "Pak Sukirman, S.Pd",
        status: "available",
        description: "Ruang kelas modern dengan pencahayaan alami optimal, meja lipat standar ergonomis, cocok untuk KBM interaktif dan simulasi ujian."
    },
    {
        id: "r-23",
        name: "Ruang 23 - Gedung Baru",
        building: "Gedung Baru",
        floor: "Lantai 2",
        capacity: 36,
        type: "Teori & Kelas",
        facilities: ["Proyektor LCD", "AC 2 Unit", "Whiteboard", "WiFi SMKN1 100Mbps", "Terminal Daya Listrik"],
        image: "./img/image2.png",
        pic: "Ibu Nurhayati, M.Pd",
        status: "available",
        description: "Ruang kelas teori jurusan SIJA & TKJ dilengkapi instalasi kelistrikan aman untuk laptop siswa."
    },
    {
        id: "r-24",
        name: "Ruang 24 - Gedung Baru",
        building: "Gedung Baru",
        floor: "Lantai 2",
        capacity: 40,
        type: "Teori & Kelas",
        facilities: ["Interactive Smart TV 65\"", "AC 2 Unit", "Whiteboard Glass", "WiFi 100Mbps", "Microphone Wireless"],
        image: "./img/image3.png",
        pic: "Pak Budi Hartono, S.Kom",
        status: "available",
        description: "Ruang kelas multimedia interaktif dengan layar sentuh smart display untuk workshop & presentasi digital."
    },
    {
        id: "r-25",
        name: "Ruang 25 - Gedung Baru",
        building: "Gedung Baru",
        floor: "Lantai 2",
        capacity: 36,
        type: "Teori & Kelas",
        facilities: ["Proyektor LCD", "AC 2 Unit", "Whiteboard", "LAN Socket RJ-45", "Kamera Meeting 1080p"],
        image: "./img/image1.png",
        pic: "Pak Dedi Prasetyo, S.T",
        status: "available",
        description: "Ruang kelas siap hybrid learning dengan jaringan kabel Ethernet berkecepatan tinggi di tiap sisi ruangan."
    },
    {
        id: "r-15",
        name: "Ruang 15 - Gedung Lama",
        building: "Gedung Lama",
        floor: "Lantai 1",
        capacity: 32,
        type: "Reguler",
        facilities: ["Kipas Angin Dinding 4 Unit", "Whiteboard Besar", "WiFi Kampus", "Mimbar Pembicara"],
        image: "./img/image2.png",
        pic: "Ibu Sri Wahyuni, S.Pd",
        status: "available",
        description: "Ruang kelas sejuk dekat taman utama sekolah, ideal untuk kegiatan pendalaman materi atau ekstra kurikuler akademik."
    },
    {
        id: "r-16",
        name: "Ruang 16 - Gedung Lama",
        building: "Gedung Lama",
        floor: "Lantai 1",
        capacity: 32,
        type: "Reguler",
        facilities: ["Proyektor Portabel", "Whiteboard", "Kipas Angin Dinding", "WiFi Kampus"],
        image: "./img/image3.png",
        pic: "Pak Hendra Gunawan, S.Pd",
        status: "available",
        description: "Ruang rapat organisasi kesiswaan (OSIS/MPK) dan kegiatan musyawarah perwakilan kelas."
    },
    {
        id: "r-401",
        name: "Ruang 401 - Lab Komputer SIJA",
        building: "Lantai 4",
        floor: "Lantai 4",
        capacity: 36,
        type: "Laboratorium",
        facilities: ["36 Unit PC Intel i7 / 16GB RAM", "Cisco Router & Mikrotik Rack", "AC Split 3 Unit", "Gigabit Managed Switch", "CCTV 24/7", "Proyektor Full HD"],
        image: "./img/image1.png",
        pic: "Pak Amrul Khairullah, S.Kom",
        status: "available",
        description: "Laboratorium Jaringan, Sistem Komputer, dan Cloud SIJA untuk praktikum mikrotik, cisco networking, dan server cloud."
    },
    {
        id: "r-403",
        name: "Ruang 403 - Lab Rekayasa Perangkat Lunak",
        building: "Lantai 4",
        floor: "Lantai 4",
        capacity: 36,
        type: "Laboratorium",
        facilities: ["36 Unit PC High-End Dual Screen", "AC 3 Unit", "High Speed Optical Fiber", "Server Lokal Docker & Git", "Smartboard 75\""],
        image: "./img/image2.png",
        pic: "Pak Rian Firmansyah, M.Kom",
        status: "available",
        description: "Lab pengembangan aplikasi software web, mobile Android/iOS, database SQL, dan uji sertifikasi BNSP."
    },
    {
        id: "r-teater",
        name: "Ruang 1 - Teater Audio Visual",
        building: "Gedung Utama",
        floor: "Lantai 3",
        capacity: 120,
        type: "Auditorium",
        facilities: ["Panggung Teater Akustik", "Sound System 5000 Watt", "Dual Screen Laser Projector", "Kursi Teater Bertingkat", "Full AC Central", "Lighting Panggung DMX"],
        image: "./img/image3.png",
        pic: "Ibu Dra. Endang Lestari",
        status: "available",
        description: "Auditorium teater megah SMKN 1 Jakarta untuk seminar industri, pemutaran film edukasi, workshop tamu dinas, dan wisuda angkatan."
    },
    {
        id: "r-guru",
        name: "Ruang Guru & Konferensi Staff",
        building: "Gedung Lama",
        floor: "Lantai 1",
        capacity: 45,
        type: "Meeting Room",
        facilities: ["Meja Konferensi U-Shape", "Smart TV 70\" Video Conf", "AC Central", "Dispenser & Coffee Corner", "Sistem Mic Konferensi"],
        image: "./img/image1.png",
        pic: "Koordinator Tata Usaha",
        status: "available",
        description: "Ruang rapat kedinasan, koordinasi bapak/ibu guru pengajar, dan musyawarah komite orang tua murid."
    },
    {
        id: "r-serbaguna",
        name: "Ruang 2 - Gedung Serbaguna (GSG)",
        building: "Gedung Serbaguna",
        floor: "Lantai 1",
        capacity: 350,
        type: "Aula Serbaguna",
        facilities: ["Panggung Utama 12x6 Meter", "Lapangan Futsal/Basket Indoor", "Sound System Lapangan", "Area Display Pameran", "Kapasitas Listrik 25.000 VA"],
        image: "./img/image2.png",
        pic: "Pak Amrul Khairullah / Waka Sarpras",
        status: "available",
        description: "Aula raksasa untuk peringatan hari besar, expo pameran produk PKK & kewirausahaan, serta kegiatan olahraga indoor."
    }
];

// Akun Pengguna SMKN 1 Jakarta
const INITIAL_USERS = [
    { nis: "102144", name: "Arrofi Zein", class: "XI SIJA", role: "siswa", password: "123", email: "zein@sija.smkn1jkt.sch.id" },
    { nis: "102145", name: "Rasya Aryasatya", class: "XI SIJA", role: "siswa", password: "123", email: "rasya@sija.smkn1jkt.sch.id" },
    { nis: "19800101", name: "Pak Amrul Khairullah, S.Kom", class: "Guru Produktif SIJA", role: "guru", password: "guru", email: "amrul@smkn1jakarta.sch.id" },
    { nis: "admin", name: "Staf Sarpras & Tata Usaha", class: "Unit Pengelola Sarana", role: "admin", password: "admin", email: "sarpras@smkn1jakarta.sch.id" }
];

// Data Awal Peminjaman
const INITIAL_BOOKINGS = [
    {
        id: "BK-2026-001",
        roomId: "r-401",
        roomName: "Ruang 401 - Lab Komputer SIJA",
        userName: "Rasya Aryasatya",
        userRole: "siswa",
        userClass: "XI SIJA",
        userContact: "087783926736",
        reason: "Simulasi Uji Kompetensi Jaringan Cloud & Server Linux SIJA",
        startDateTime: "2026-08-29T08:00",
        endDateTime: "2026-08-29T12:00",
        status: "approved", // pending | approved | rejected | completed
        createdAt: "2026-08-28T09:30:00",
        approvedBy: "Pak Amrul Khairullah, S.Kom",
        approvalDate: "2026-08-28T10:00:00",
        feedback: "Disetujui. Harap memastikan kabel patch cord dan switch lab dalam keadaan rapi sebelum ditinggalkan."
    },
    {
        id: "BK-2026-002",
        roomId: "r-teater",
        roomName: "Ruang 1 - Teater Audio Visual",
        userName: "Arrofi Zein",
        userRole: "siswa",
        userClass: "XI SIJA",
        userContact: "081299887766",
        reason: "Presentasi Final Project PKK Web Pemangan dan Uji Coba Sistem Terpadu",
        startDateTime: "2026-08-29T13:00",
        endDateTime: "2026-08-29T15:30",
        status: "approved",
        createdAt: "2026-08-28T10:15:00",
        approvedBy: "Staf Sarpras & Tata Usaha",
        approvalDate: "2026-08-28T11:00:00",
        feedback: "Disetujui. Koordinasikan kebutuhan operator sound system dan kabel proyektor teater."
    },
    {
        id: "BK-2026-003",
        roomId: "r-serbaguna",
        roomName: "Ruang 2 - Gedung Serbaguna (GSG)",
        userName: "Pak Amrul Khairullah, S.Kom",
        userRole: "guru",
        userClass: "Guru Produktif SIJA",
        userContact: "081311223344",
        reason: "Briefing Akbar Koordinasi Pameran Karya Kreatif & Kewirausahaan (PKK) Kelas XI",
        startDateTime: "2026-08-30T09:00",
        endDateTime: "2026-08-30T11:30",
        status: "approved",
        createdAt: "2026-08-28T11:00:00",
        approvedBy: "Kepala Sekolah SMKN 1 Jakarta",
        approvalDate: "2026-08-28T11:30:00",
        feedback: "Disetujui untuk seluruh kelas XI."
    },
    {
        id: "BK-2026-004",
        roomId: "r-403",
        roomName: "Ruang 403 - Lab Rekayasa Perangkat Lunak",
        userName: "Arrofi Zein",
        userRole: "siswa",
        userClass: "XI SIJA",
        userContact: "081299887766",
        reason: "Workshop Git & GitHub Collaboration untuk Tim Proyek Sekolah",
        startDateTime: "2026-08-31T14:00",
        endDateTime: "2026-08-31T16:30",
        status: "pending",
        createdAt: "2026-08-28T12:00:00",
        approvedBy: "-",
        approvalDate: "-",
        feedback: "Menunggu verifikasi ketersediaan jadwal lab dari Sarpras."
    }
];

// Storage Engine
const StorageService = {
    init() {
        if (!localStorage.getItem('pemangan_rooms')) {
            localStorage.setItem('pemangan_rooms', JSON.stringify(ROOMS_DATA));
        }
        if (!localStorage.getItem('pemangan_bookings')) {
            localStorage.setItem('pemangan_bookings', JSON.stringify(INITIAL_BOOKINGS));
        }
        if (!localStorage.getItem('pemangan_users')) {
            localStorage.setItem('pemangan_users', JSON.stringify(INITIAL_USERS));
        }
    },
    getRooms() {
        return JSON.parse(localStorage.getItem('pemangan_rooms') || '[]');
    },
    getBookings() {
        return JSON.parse(localStorage.getItem('pemangan_bookings') || '[]');
    },
    saveBooking(bookingData) {
        const bookings = this.getBookings();
        bookings.unshift(bookingData);
        localStorage.setItem('pemangan_bookings', JSON.stringify(bookings));
        return bookingData;
    },
    updateBookingStatus(id, newStatus, feedback = '', approverName = 'Admin Sarpras') {
        const bookings = this.getBookings();
        const item = bookings.find(b => b.id === id);
        if (item) {
            item.status = newStatus;
            item.feedback = feedback || (newStatus === 'approved' ? 'Disetujui oleh petugas Sarpras.' : 'Ditolak karena alasan jadwal / teknis.');
            item.approvedBy = approverName;
            item.approvalDate = new Date().toISOString();
            localStorage.setItem('pemangan_bookings', JSON.stringify(bookings));
        }
        return item;
    },
    deleteBooking(id) {
        let bookings = this.getBookings();
        bookings = bookings.filter(b => b.id !== id);
        localStorage.setItem('pemangan_bookings', JSON.stringify(bookings));
    },
    getUsers() {
        return JSON.parse(localStorage.getItem('pemangan_users') || '[]');
    },
    addUser(user) {
        const users = this.getUsers();
        users.push(user);
        localStorage.setItem('pemangan_users', JSON.stringify(users));
    },
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('pemangan_current_user') || 'null');
    },
    setCurrentUser(user) {
        localStorage.setItem('pemangan_current_user', JSON.stringify(user));
    },
    logout() {
        localStorage.removeItem('pemangan_current_user');
    },
    resetDataToDefault() {
        localStorage.setItem('pemangan_rooms', JSON.stringify(ROOMS_DATA));
        localStorage.setItem('pemangan_bookings', JSON.stringify(INITIAL_BOOKINGS));
        localStorage.setItem('pemangan_users', JSON.stringify(INITIAL_USERS));
    }
};

StorageService.init();
window.StorageService = StorageService;
window.ROOMS_DATA = ROOMS_DATA;
