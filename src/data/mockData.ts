import { Room, Equipment, User, Booking } from '../types';

export const ROOMS_DATA: Room[] = [
  {
    id: "r-401",
    name: "Ruang 401 - Lab Komputer SIJA",
    building: "Gedung Teori & Praktik (Lantai 4)",
    category: "Laboratorium",
    capacity: 36,
    type: "Lab Cloud & Jaringan",
    facilities: [
      "36 Unit PC Intel Core i7 / 16GB RAM / SSD",
      "Cisco Router & Mikrotik CCR Rack Mounted",
      "AC Split 3 Unit (1.5 PK Tiap Sisi)",
      "Gigabit Managed Switch 48-Port",
      "Dedicated Internet Fiber Optic 200 Mbps",
      "Proyektor Full HD & Smart Screen Wall",
      "CCTV Surveillance 24/7"
    ],
    image: "/img/image1.png",
    pic: "Pak Amrul Khairullah, S.Kom",
    nipPic: "198001012005011002",
    status: "available",
    operationalHours: "07:00 - 17:00 WIB",
    description: "Laboratorium utama kompetensi keahlian SIJA untuk simulasi sistem komputer, cloud computing, arsitektur server Linux, dan praktikum mikrotik / cisco networking."
  },
  {
    id: "r-403",
    name: "Ruang 403 - Lab Rekayasa Perangkat Lunak",
    building: "Gedung Teori & Praktik (Lantai 4)",
    category: "Laboratorium",
    capacity: 36,
    type: "Lab Software & Database",
    facilities: [
      "36 Unit PC High-End Dual Screen Workstation",
      "Server On-Premise Docker & Local Gitlab",
      "AC Split 3 Unit",
      "Interactive Smartboard 75\"",
      "Koneksi LAN Kabel Cat6 Tiap Meja",
      "Sound Monitor & Audio Speaker"
    ],
    image: "/img/image2.png",
    pic: "Pak Rian Firmansyah, M.Kom",
    nipPic: "198506122010011005",
    status: "available",
    operationalHours: "07:00 - 17:00 WIB",
    description: "Lab pengembangan aplikasi software web, mobile Android/iOS, database SQL, machine learning, dan tempat uji kompetensi sertifikasi BNSP bidang programmer."
  },
  {
    id: "r-405",
    name: "Ruang 405 - Lab Cyber Security & Fiber Optic",
    building: "Gedung Teori & Praktik (Lantai 4)",
    category: "Laboratorium",
    capacity: 32,
    type: "Lab Cyber & Infrastruktur",
    facilities: [
      "32 Workstation Linux Security Hardened",
      "Fusion Splicer & OTDR Kit Fiber Optic",
      "AC 2 Unit",
      "Isolated Sandbox Network VLAN",
      "Smart Projector Epson Laser"
    ],
    image: "/img/image3.png",
    pic: "Ibu Nurhayati, M.Pd",
    nipPic: "197803152002122001",
    status: "available",
    operationalHours: "07:30 - 16:30 WIB",
    description: "Laboratorium khusus simulasi keamanan siber, analisis paket jaringan, dan praktik terminasi kabel fiber optic transmisi data cepat."
  },
  {
    id: "r-teater",
    name: "Ruang 1 - Teater Audio Visual (Auditorium)",
    building: "Gedung Utama (Lantai 3)",
    category: "Auditorium",
    capacity: 120,
    type: "Auditorium Megah",
    facilities: [
      "Panggung Teater Akustik & Podium Resmi",
      "Sound System Line Array 5000 Watt",
      "Dual Laser Projector 6000 Lumens",
      "Kursi Bioskop Teater Bertingkat",
      "Central AC System & Lighting DMX Kontrol",
      "Wireless Microphone 4 Set & Clip-on",
      "Live Streaming Control Switcher"
    ],
    image: "/img/image3.png",
    pic: "Ibu Dra. Endang Lestari",
    nipPic: "196908201994032003",
    status: "available",
    operationalHours: "07:00 - 18:00 WIB",
    description: "Auditorium teater kedinasan SMKN 1 Jakarta untuk seminar industri, workshop pakar dinas, pemutaran video edukasi, wisuda angkatan, dan presentasi karya besar PKK."
  },
  {
    id: "r-serbaguna",
    name: "Ruang 2 - Gedung Serbaguna (Aula GSG)",
    building: "Gedung Serbaguna (Lantai 1)",
    category: "Aula Serbaguna",
    capacity: 350,
    type: "Aula Utama",
    facilities: [
      "Panggung Utama Dimensi 14 x 8 Meter",
      "Kapasitas Daya Listrik PLN 33.000 VA",
      "Lapangan Olahraga Futsal / Basket / Bulutangkis",
      "Sound System Lapangan Out-door 8000 Watt",
      "Area Display Stan Pameran Kewirausahaan",
      "Ruang Ganti & Toilet Bersih Terpisah"
    ],
    image: "/img/image2.png",
    pic: "Waka Bidang Sarana & Prasarana",
    nipPic: "197504042000031004",
    status: "available",
    operationalHours: "06:30 - 18:00 WIB",
    description: "Aula serbaguna indoor untuk peringatan hari besar nasional/agama, pameran expo karya produk PKK SIJA/RPL, rapat pleno komite orang tua, dan perhelatan akbar sekolah."
  },
  {
    id: "r-guru",
    name: "Ruang Guru & Konferensi Pimpinan",
    building: "Gedung Utama (Lantai 1)",
    category: "Meeting Room",
    capacity: 45,
    type: "Ruang Rapat Eksekutif",
    facilities: [
      "Meja Rapat Konferensi U-Shape Kayu Jati",
      "Smart TV 75\" 4K dengan Kamera Video Conf Polycom",
      "AC Central & Coffee Break Station",
      "Mikrofon Meja Konferensi Gooseneck",
      "High Speed WiFi 150 Mbps"
    ],
    image: "/img/image1.png",
    pic: "Koordinator Tata Usaha & Sarpras",
    nipPic: "198205102008011012",
    status: "available",
    operationalHours: "07:00 - 17:00 WIB",
    description: "Ruang rapat kedinasan, musyawarah dewan guru pengajar, koordinasi pimpinan sekolah, dan briefing pengawas Dinas Pendidikan."
  },
  {
    id: "r-podcast",
    name: "Studio Podcast & Broadcasting SMKN 1",
    building: "Gedung Utama (Lantai 3)",
    category: "Laboratorium",
    capacity: 15,
    type: "Studio Rekaman",
    facilities: [
      "Dinding Peredam Suara Akustik Rockwool 100%",
      "4 Mic Shure SM7B & Audio Interface Rodecaster Pro",
      "3 Unit Kamera Sony Cinema Mirrorless 4K",
      "Lighting Softbox Godox Studio",
      "Green Screen Wall & Teleprompter",
      "AC Inverter Ultra Quiet"
    ],
    image: "/img/image2.png",
    pic: "Pak Budi Hartono, S.Kom",
    nipPic: "198809142014021003",
    status: "available",
    operationalHours: "08:00 - 16:30 WIB",
    description: "Studio siaran podcast edukasi, pembuatan video konten pembelajaran guru, media branding sekolah, dan pelatihan public speaking kesiswaan."
  },
  {
    id: "r-22",
    name: "Ruang 22 - Gedung Baru",
    building: "Gedung Baru (Lantai 2)",
    category: "Teori & Kelas",
    capacity: 36,
    type: "Kelas Teori Modern",
    facilities: [
      "Proyektor Epson 3600 Lumens",
      "AC Split 2 Unit (2 PK)",
      "Whiteboard Kaca Lebar",
      "Stopkontak Listrik Mandiri Tiap Meja",
      "WiFi SMKN 1 Dedicated 100 Mbps",
      "Sound Speaker Dinding Aktif"
    ],
    image: "/img/image1.png",
    pic: "Pak Sukirman, S.Pd",
    nipPic: "197702112003121002",
    status: "available",
    operationalHours: "07:00 - 16:30 WIB",
    description: "Ruang kelas teori jurusan teknologi modern dengan pencahayaan alami optimal, meja lipat standar ergonomis, cocok untuk KBM interaktif dan simulasi ujian."
  },
  {
    id: "r-23",
    name: "Ruang 23 - Gedung Baru",
    building: "Gedung Baru (Lantai 2)",
    category: "Teori & Kelas",
    capacity: 36,
    type: "Kelas Teori Modern",
    facilities: [
      "Proyektor LCD",
      "AC Split 2 Unit",
      "Whiteboard",
      "WiFi SMKN 1 100 Mbps",
      "Terminal Stopkontak Daya Listrik Laptop"
    ],
    image: "/img/image2.png",
    pic: "Ibu Nurhayati, M.Pd",
    nipPic: "197803152002122001",
    status: "available",
    operationalHours: "07:00 - 16:30 WIB",
    description: "Ruang kelas teori jurusan SIJA & TKJ dilengkapi instalasi kelistrikan aman untuk pengoperasian laptop siswa secara simultan."
  },
  {
    id: "r-24",
    name: "Ruang 24 - Gedung Baru (Smart Class)",
    building: "Gedung Baru (Lantai 2)",
    category: "Teori & Kelas",
    capacity: 40,
    type: "Smart Classroom",
    facilities: [
      "Interactive Smart TV 65\" Touchscreen",
      "AC Split 2 Unit",
      "Whiteboard Glass Frameless",
      "WiFi 100 Mbps",
      "Wireless Microphone & Speaker",
      "Kamera Portabel Hybrid Meeting"
    ],
    image: "/img/image3.png",
    pic: "Pak Budi Hartono, S.Kom",
    nipPic: "198809142014021003",
    status: "available",
    operationalHours: "07:00 - 16:30 WIB",
    description: "Ruang kelas multimedia interaktif dengan layar sentuh smart display untuk workshop, presentasi digital kesiswaan, dan diskusi kelompok."
  },
  {
    id: "r-25",
    name: "Ruang 25 - Gedung Baru (Hybrid Class)",
    building: "Gedung Baru (Lantai 2)",
    category: "Teori & Kelas",
    capacity: 36,
    type: "Kelas Hybrid",
    facilities: [
      "Proyektor LCD Full HD",
      "AC Split 2 Unit",
      "Whiteboard",
      "LAN Socket RJ-45 Tiap Meja",
      "Kamera Meeting 1080p",
      "Sound Speaker Surround"
    ],
    image: "/img/image1.png",
    pic: "Pak Dedi Prasetyo, S.T",
    nipPic: "198407222009021004",
    status: "available",
    operationalHours: "07:00 - 16:30 WIB",
    description: "Ruang kelas siap hybrid learning dengan jaringan kabel Ethernet berkecepatan tinggi di tiap sisi ruangan untuk simulasi ujian online."
  },
  {
    id: "r-15",
    name: "Ruang 15 - Gedung Lama",
    building: "Gedung Lama (Lantai 1)",
    category: "Reguler",
    capacity: 32,
    type: "Kelas Reguler Sejuk",
    facilities: [
      "Kipas Angin Dinding 4 Unit",
      "Whiteboard Besar",
      "WiFi Kampus SMKN 1",
      "Mimbar Pembicara Kayu Jati"
    ],
    image: "/img/image2.png",
    pic: "Ibu Sri Wahyuni, S.Pd",
    nipPic: "197304191998022001",
    status: "available",
    operationalHours: "07:00 - 16:00 WIB",
    description: "Ruang kelas asri dekat taman utama sekolah, ideal untuk kegiatan pendalaman materi pelajaran normatif adaptif atau ekskul akademik."
  },
  {
    id: "r-16",
    name: "Ruang 16 - Gedung Lama (Organisasi Kesiswaan)",
    building: "Gedung Lama (Lantai 1)",
    category: "Reguler",
    capacity: 32,
    type: "Ruang Organisasi",
    facilities: [
      "Proyektor Portabel",
      "Whiteboard",
      "Kipas Angin Dinding 4 Unit",
      "WiFi Kampus",
      "Papan Informasi Kesiswaan"
    ],
    image: "/img/image3.png",
    pic: "Pak Hendra Gunawan, S.Pd",
    nipPic: "198111052006041008",
    status: "available",
    operationalHours: "07:00 - 17:30 WIB",
    description: "Ruang sekretariat bersama & rapat organisasi kesiswaan (OSIS/MPK/Pramuka/PMR/Rohanis) dan musyawarah perwakilan kelas."
  }
];

export const EQUIPMENT_OPTIONS: Equipment[] = [
  { id: "eq-mic", name: "Mikrofon Wireless Extra (2 Unit)", category: "Audio" },
  { id: "eq-sound", name: "Portable Sound System + Bluetooth", category: "Audio" },
  { id: "eq-projector", name: "Laser Pointer Presenter + Kabel HDMI 10m", category: "Display" },
  { id: "eq-switch", name: "Gigabit Switch 16-Port & Kabel Patch Cord", category: "Jaringan" },
  { id: "eq-chairs", name: "Kursi Tambahan Lipat (20 Unit)", category: "Furnitur" },
  { id: "eq-streaming", name: "Kit Web Camera 1080p & Tripod", category: "Multimedia" }
];

export const INITIAL_USERS: User[] = [
  {
    nis: "102144",
    name: "Arrofi Zein",
    class: "XI SIJA 1",
    role: "siswa",
    password: "123",
    email: "arrofi.zein@sija.smkn1jkt.sch.id",
    avatar: "AZ",
    phone: "081299887766"
  },
  {
    nis: "102145",
    name: "Rasya Aryasatya",
    class: "XI SIJA 1",
    role: "siswa",
    password: "123",
    email: "rasya.aryasatya@sija.smkn1jkt.sch.id",
    avatar: "RA",
    phone: "087783926736"
  },
  {
    nis: "19800101",
    name: "Pak Amrul Khairullah, S.Kom",
    class: "Guru Produktif SIJA",
    role: "guru",
    password: "guru",
    email: "amrul.khairullah@smkn1jakarta.sch.id",
    avatar: "AK",
    phone: "081311223344"
  },
  {
    nis: "admin",
    name: "Staf Sarana & Prasarana SMKN 1",
    class: "Unit Sarpras & Tata Usaha",
    role: "admin",
    password: "admin",
    email: "sarpras@smkn1jakarta.sch.id",
    avatar: "SP",
    phone: "0213813630"
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "BK-2026-001",
    roomId: "r-401",
    roomName: "Ruang 401 - Lab Komputer SIJA",
    userName: "Rasya Aryasatya",
    userRole: "siswa",
    userClass: "XI SIJA 1",
    userContact: "087783926736",
    supervisorName: "Pak Amrul Khairullah, S.Kom",
    equipment: ["Mikrofon Wireless Extra (2 Unit)", "Gigabit Switch 16-Port & Kabel Patch Cord"],
    reason: "Simulasi Uji Kompetensi Jaringan Cloud & Server Linux SIJA",
    startDateTime: "2026-08-29T08:00",
    endDateTime: "2026-08-29T12:00",
    status: "approved",
    createdAt: "2026-08-28T09:30:00",
    approvedBy: "Pak Amrul Khairullah, S.Kom",
    approvalDate: "2026-08-28T10:00:00",
    feedback: "Disetujui. Pastikan kabel patch cord dan switch lab dalam keadaan rapi dan matikan AC setelah selesai."
  },
  {
    id: "BK-2026-002",
    roomId: "r-teater",
    roomName: "Ruang 1 - Teater Audio Visual (Auditorium)",
    userName: "Arrofi Zein",
    userRole: "siswa",
    userClass: "XI SIJA 1",
    userContact: "081299887766",
    supervisorName: "Pak Amrul Khairullah, S.Kom",
    equipment: ["Laser Pointer Presenter + Kabel HDMI 10m", "Kit Web Camera 1080p & Tripod"],
    reason: "Presentasi Final Project PKK Web Pemangan dan Uji Coba Sistem Terpadu",
    startDateTime: "2026-08-29T13:00",
    endDateTime: "2026-08-29T15:30",
    status: "approved",
    createdAt: "2026-08-28T10:15:00",
    approvedBy: "Staf Sarana & Prasarana SMKN 1",
    approvalDate: "2026-08-28T11:00:00",
    feedback: "Disetujui. Koordinasikan kebutuhan operator sound system teater ke petugas piket audio visual."
  },
  {
    id: "BK-2026-003",
    roomId: "r-serbaguna",
    roomName: "Ruang 2 - Gedung Serbaguna (Aula GSG)",
    userName: "Pak Amrul Khairullah, S.Kom",
    userRole: "guru",
    userClass: "Guru Produktif SIJA",
    userContact: "081311223344",
    supervisorName: "Wakil Kepala Sekolah Bidang Sarpras",
    equipment: ["Portable Sound System + Bluetooth", "Kursi Tambahan Lipat (20 Unit)"],
    reason: "Briefing Akbar Koordinasi Pameran Karya Kreatif & Kewirausahaan (PKK) Kelas XI Seluruh Jurusan",
    startDateTime: "2026-08-30T09:00",
    endDateTime: "2026-08-30T12:00",
    status: "approved",
    createdAt: "2026-08-28T11:00:00",
    approvedBy: "Kepala Sekolah SMKN 1 Jakarta",
    approvalDate: "2026-08-28T11:30:00",
    feedback: "Disetujui untuk seluruh dewan guru dan perwakilan kelas XI."
  },
  {
    id: "BK-2026-004",
    roomId: "r-403",
    roomName: "Ruang 403 - Lab Rekayasa Perangkat Lunak",
    userName: "Arrofi Zein",
    userRole: "siswa",
    userClass: "XI SIJA 1",
    userContact: "081299887766",
    supervisorName: "Pak Rian Firmansyah, M.Kom",
    equipment: ["Laser Pointer Presenter + Kabel HDMI 10m"],
    reason: "Workshop Git & GitHub Collaboration untuk Tim Pengembang Proyek Sekolah",
    startDateTime: "2026-08-31T14:00",
    endDateTime: "2026-08-31T16:30",
    status: "pending",
    createdAt: "2026-08-28T12:00:00",
    approvedBy: "-",
    approvalDate: "-",
    feedback: "Menunggu verifikasi ketersediaan jadwal lab dari Sarpras."
  }
];
