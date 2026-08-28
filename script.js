document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Drawer Navigation & Backdrop Toggle
    const burgerToggle = document.getElementById('burgerToggle');
    const navDrawer = document.getElementById('navDrawer');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Create backdrop element for mobile drawer
    let navBackdrop = document.querySelector('.nav-backdrop');
    if (!navBackdrop) {
        navBackdrop = document.createElement('div');
        navBackdrop.className = 'nav-backdrop';
        document.body.appendChild(navBackdrop);
    }

    function toggleMenu(isOpen) {
        if (burgerToggle && navDrawer) {
            const shouldOpen = isOpen !== undefined ? isOpen : !navDrawer.classList.contains('active');
            burgerToggle.classList.toggle('active', shouldOpen);
            navDrawer.classList.toggle('active', shouldOpen);
            navBackdrop.classList.toggle('active', shouldOpen);
            document.body.style.overflow = shouldOpen ? 'hidden' : '';
        }
    }

    if (burgerToggle) {
        burgerToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
    }

    if (navBackdrop) {
        navBackdrop.addEventListener('click', () => toggleMenu(false));
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu(false);
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // 2. Scroll-Spy for Active Navbar Link
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset + 90;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop;
            const sectionId = current.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(l => l.classList.remove('active'));
                if (correspondingLink) correspondingLink.classList.add('active');
            }
        });
    });

    // 3. Dark / Light Mode Toggle
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('pemangan_theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const activeTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('pemangan_theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeToggle) return;
        const icon = themeToggle.querySelector('i');
        if (icon) {
            if (theme === 'dark') {
                icon.className = 'fas fa-sun';
                icon.style.color = '#f59e0b';
            } else {
                icon.className = 'fas fa-moon';
                icon.style.color = '';
            }
        }
    }

    // 4. User Session & Role-Based UI
    const desktopUserNavSlot = document.getElementById('desktopUserNavSlot');
    const mobileUserCard = document.getElementById('mobileUserCard');
    const mobileUserAvatar = document.getElementById('mobileUserAvatar');
    const mobileUserName = document.getElementById('mobileUserName');
    const mobileUserRole = document.getElementById('mobileUserRole');
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');

    const adminNavTab = document.getElementById('adminNavTab');
    const adminPanel = document.getElementById('adminPanel');
    const adminRoleDisplay = document.getElementById('adminRoleDisplay');
    const currentUser = window.StorageService ? window.StorageService.getCurrentUser() : null;

    if (currentUser) {
        const initial = currentUser.name.charAt(0).toUpperCase();

        // Populate Desktop Nav User Profile
        if (desktopUserNavSlot) {
            desktopUserNavSlot.innerHTML = `
                <div class="user-profile-badge">
                    <div class="user-avatar">${initial}</div>
                    <span>${currentUser.name.split(' ')[0]} <small style="color: var(--color-primary-light);">(${currentUser.role})</small></span>
                    <button id="desktopLogoutBtn" class="btn btn-sm btn-secondary" title="Keluar" style="padding: 2px 6px; border:none; background:none; cursor:pointer;">
                        Keluar
                    </button>
                </div>
            `;

            document.getElementById('desktopLogoutBtn')?.addEventListener('click', () => {
                window.StorageService.logout();
                showToast('Berhasil keluar dari akun.', 'info');
                setTimeout(() => window.location.reload(), 400);
            });
        }

        // Populate Mobile Drawer User Profile (Pure CSS controls display)
        if (mobileUserCard) {
            mobileUserCard.classList.add('has-user');
            if (mobileUserAvatar) mobileUserAvatar.textContent = initial;
            if (mobileUserName) mobileUserName.textContent = currentUser.name;
            if (mobileUserRole) mobileUserRole.textContent = `${currentUser.role} (${currentUser.class || 'SMKN 1'})`;
            
            if (mobileLogoutBtn) {
                mobileLogoutBtn.addEventListener('click', () => {
                    window.StorageService.logout();
                    showToast('Berhasil keluar dari akun.', 'info');
                    setTimeout(() => window.location.reload(), 400);
                });
            }
        }

        // Prefill booking inputs
        const nameInp = document.getElementById('booking-name');
        const roleInp = document.getElementById('booking-role');
        const classInp = document.getElementById('booking-class');
        
        if (nameInp) nameInp.value = currentUser.name;
        if (roleInp && currentUser.role) roleInp.value = currentUser.role;
        if (classInp && currentUser.class) classInp.value = currentUser.class;

        // Show Admin / Approver Tab if Role is Admin or Guru
        if (currentUser.role === 'admin' || currentUser.role === 'guru') {
            if (adminNavTab) adminNavTab.style.display = 'block';
            if (adminPanel) adminPanel.style.display = 'block';
            if (adminRoleDisplay) adminRoleDisplay.textContent = `Akses Kelola: ${currentUser.name} (${currentUser.role === 'admin' ? 'Sarpras SMKN 1' : 'Guru Pembimbing'})`;
        }
    }

    // 5. Populate & Render Rooms
    const rooms = window.StorageService ? window.StorageService.getRooms() : (window.ROOMS_DATA || []);
    const roomsContainer = document.getElementById('roomsContainer');
    const roomSelect = document.getElementById('selected-room');
    const searchInput = document.getElementById('roomSearchInput');
    const categoryPills = document.querySelectorAll('.filter-pill');
    const quickSearch = document.getElementById('quickSearch');
    const quickCategory = document.getElementById('quickCategory');
    const btnQuickFilter = document.getElementById('btnQuickFilter');

    let currentCategory = 'ALL';
    let searchQuery = '';

    function populateRoomSelect() {
        if (!roomSelect) return;
        roomSelect.innerHTML = '<option value="" disabled selected>-- Pilih Ruangan Target --</option>';
        rooms.forEach(room => {
            const opt = document.createElement('option');
            opt.value = room.id;
            opt.textContent = `${room.name} (Kap: ${room.capacity}) - ${room.building}`;
            roomSelect.appendChild(opt);
        });
    }

    function renderRoomCards() {
        if (!roomsContainer) return;

        const filtered = rooms.filter(room => {
            const matchCategory = currentCategory === 'ALL' || 
                room.type.toLowerCase().includes(currentCategory.toLowerCase()) || 
                room.building.toLowerCase().includes(currentCategory.toLowerCase());
            
            const matchSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                room.building.toLowerCase().includes(searchQuery.toLowerCase()) ||
                room.facilities.some(f => f.toLowerCase().includes(searchQuery.toLowerCase())) ||
                room.type.toLowerCase().includes(searchQuery.toLowerCase());

            return matchCategory && matchSearch;
        });

        if (filtered.length === 0) {
            roomsContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem 1rem; background: var(--color-surface); border-radius: var(--radius-md); border: 1px dashed var(--color-border);">
                    <h4 style="font-size: 1.05rem; color: var(--color-text-main); margin-bottom: 0.3rem;">Tidak ada ruangan yang sesuai</h4>
                    <p style="color: var(--color-text-muted); font-size: 0.85rem;">Coba cari dengan kata kunci lain atau pilih filter Semua.</p>
                </div>
            `;
            return;
        }

        roomsContainer.innerHTML = filtered.map(room => {
            const facilitiesTags = room.facilities.slice(0, 3).map(f => `<span class="facility-tag">${f}</span>`).join('');
            const moreCount = room.facilities.length > 3 ? `<span class="facility-tag">+${room.facilities.length - 3}</span>` : '';

            return `
                <div class="room-card" data-room-id="${room.id}">
                    <div class="room-card-img">
                        <img src="${room.image}" alt="${room.name}" loading="lazy">
                        <span class="room-badge-type">${room.type}</span>
                        <span class="room-badge-status ${room.status === 'available' ? 'status-available' : 'status-booked'}">
                            ${room.status === 'available' ? 'Tersedia' : 'Sedang Dipakai'}
                        </span>
                    </div>
                    <div class="room-card-body">
                        <div class="room-meta">
                            <span>${room.building}</span>
                            <span>•</span>
                            <span>Kapasitas ${room.capacity}</span>
                        </div>
                        <h3 class="room-title">${room.name}</h3>
                        <p class="room-desc">${room.description}</p>
                        <div class="room-facilities">
                            ${facilitiesTags}
                            ${moreCount}
                        </div>
                        <div class="room-card-footer">
                            <button class="btn btn-secondary btn-sm view-detail-btn" data-id="${room.id}">
                                Detail
                            </button>
                            <button class="btn btn-primary btn-sm book-this-btn" data-id="${room.id}">
                                Pinjam
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Card button actions
        document.querySelectorAll('.view-detail-btn').forEach(btn => {
            btn.addEventListener('click', () => openRoomDetail(btn.dataset.id));
        });

        document.querySelectorAll('.book-this-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.dataset.id;
                if (roomSelect) {
                    roomSelect.value = targetId;
                    const bookingSection = document.getElementById('booking');
                    if (bookingSection) {
                        const offset = document.getElementById('navbar').offsetHeight;
                        window.scrollTo({
                            top: bookingSection.offsetTop - offset,
                            behavior: 'smooth'
                        });
                        showToast(`Ruangan terpilih: ${rooms.find(r => r.id === targetId)?.name}`, 'info');
                    }
                }
            });
        });
    }

    // Filter Listeners
    categoryPills.forEach(pill => {
        pill.addEventListener('click', () => {
            categoryPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            currentCategory = pill.dataset.category;
            renderRoomCards();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderRoomCards();
        });
    }

    if (btnQuickFilter) {
        btnQuickFilter.addEventListener('click', () => {
            searchQuery = quickSearch.value;
            currentCategory = quickCategory.value;
            categoryPills.forEach(p => {
                if (p.dataset.category === currentCategory) p.classList.add('active');
                else p.classList.remove('active');
            });
            if (searchInput) searchInput.value = searchQuery;
            renderRoomCards();

            const roomsSection = document.getElementById('rooms');
            if (roomsSection) {
                const offset = document.getElementById('navbar').offsetHeight;
                window.scrollTo({
                    top: roomsSection.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        });
    }

    // 6. Room Detail Modal
    const modal = document.getElementById('roomDetailModal');
    const modalTitle = document.getElementById('modalRoomTitle');
    const modalBody = document.getElementById('modalRoomBody');
    const modalCloseBtn = document.getElementById('modalCloseBtn');

    function openRoomDetail(roomId) {
        const room = rooms.find(r => r.id === roomId);
        if (!room || !modal) return;

        modalTitle.textContent = room.name;
        modalBody.innerHTML = `
            <div style="margin-bottom: 1rem; border-radius: var(--radius-sm); overflow: hidden; height: 190px;">
                <img src="${room.image}" alt="${room.name}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 1rem; background: var(--color-bg); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--color-border); font-size: 0.825rem;">
                <div><strong>Lokasi:</strong> ${room.building} (${room.floor})</div>
                <div><strong>Kapasitas:</strong> ${room.capacity} Orang</div>
                <div><strong>Penanggung Jawab:</strong> ${room.pic}</div>
                <div><strong>Status:</strong> <span class="status-pill ${room.status === 'available' ? 'approved' : 'pending'}">${room.status === 'available' ? 'Tersedia' : 'Sedang Dipakai'}</span></div>
            </div>
            <h4 style="font-size: 0.9rem; margin-bottom: 0.35rem; color: var(--color-text-main);">Deskripsi & Fungsi</h4>
            <p style="font-size: 0.825rem; color: var(--color-text-muted); margin-bottom: 1rem; line-height: 1.55;">${room.description}</p>
            
            <h4 style="font-size: 0.9rem; margin-bottom: 0.35rem; color: var(--color-text-main);">Fasilitas Ruangan:</h4>
            <ul style="margin-left: 1.25rem; font-size: 0.825rem; color: var(--color-text-muted); margin-bottom: 1.25rem; line-height: 1.7;">
                ${room.facilities.map(f => `<li>${f}</li>`).join('')}
            </ul>

            <button class="btn btn-primary" id="modalBookNowBtn" style="width: 100%;">
                Isi Formulir Peminjaman
            </button>
        `;

        modal.classList.add('active');

        document.getElementById('modalBookNowBtn')?.addEventListener('click', () => {
            modal.classList.remove('active');
            if (roomSelect) {
                roomSelect.value = room.id;
                const bookingSection = document.getElementById('booking');
                const offset = document.getElementById('navbar').offsetHeight;
                window.scrollTo({
                    top: bookingSection.offsetTop - offset,
                    behavior: 'smooth'
                });
                showToast(`Ruangan terpilih: ${room.name}`, 'info');
            }
        });
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', () => modal.classList.remove('active'));
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    }

    // 7. Schedule List & Admin Table Rendering
    const scheduleListContainer = document.getElementById('scheduleListContainer');
    const scheduleCountBadge = document.getElementById('scheduleCountBadge');
    const adminTableBody = document.getElementById('adminTableBody');
    const btnFilterAllBookings = document.getElementById('btnFilterAllBookings');
    const btnFilterPendingBookings = document.getElementById('btnFilterPendingBookings');

    let adminFilterMode = 'all';

    if (btnFilterAllBookings && btnFilterPendingBookings) {
        btnFilterAllBookings.addEventListener('click', () => {
            adminFilterMode = 'all';
            btnFilterAllBookings.className = 'btn btn-primary btn-sm';
            btnFilterPendingBookings.className = 'btn btn-secondary btn-sm';
            renderSchedulesAndAdmin();
        });

        btnFilterPendingBookings.addEventListener('click', () => {
            adminFilterMode = 'pending';
            btnFilterPendingBookings.className = 'btn btn-primary btn-sm';
            btnFilterAllBookings.className = 'btn btn-secondary btn-sm';
            renderSchedulesAndAdmin();
        });
    }

    function renderSchedulesAndAdmin() {
        const bookings = window.StorageService ? window.StorageService.getBookings() : [];

        // Update Stat Counters in Hero
        const statTotalBookings = document.getElementById('statTotalBookings');
        if (statTotalBookings) statTotalBookings.textContent = `${bookings.length}+`;

        // Render User Schedule List
        if (scheduleListContainer) {
            if (scheduleCountBadge) scheduleCountBadge.textContent = `${bookings.length} Terdata`;

            if (bookings.length === 0) {
                scheduleListContainer.innerHTML = `<p style="text-align: center; color: var(--color-text-muted); padding: 1.5rem 0;">Belum ada jadwal peminjaman.</p>`;
            } else {
                scheduleListContainer.innerHTML = bookings.map(b => {
                    const startFormatted = new Date(b.startDateTime).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
                    const endFormatted = new Date(b.endDateTime).toLocaleString('id-ID', { timeStyle: 'short' });
                    const statusText = b.status === 'approved' ? 'Disetujui' : b.status === 'pending' ? 'Menunggu' : 'Ditolak';

                    return `
                        <div class="schedule-item">
                            <div class="schedule-top">
                                <span class="schedule-room">${b.roomName}</span>
                                <span class="status-pill ${b.status}">${statusText}</span>
                            </div>
                            <div class="schedule-details">
                                <div><strong>${b.userName}</strong> (${b.userClass || b.userRole})</div>
                                <div>${startFormatted} - ${endFormatted} WIB</div>
                                <div style="margin-top: 3px; color: var(--color-text-muted); font-style: italic;">"${b.reason}"</div>
                            </div>
                            <div class="schedule-action-bar">
                                <button class="btn btn-secondary btn-sm print-slip-btn" data-id="${b.id}">
                                    Surat Izin
                                </button>
                            </div>
                        </div>
                    `;
                }).join('');

                // Attach Print Slip Listeners
                document.querySelectorAll('.print-slip-btn').forEach(btn => {
                    btn.addEventListener('click', () => openSlipModal(btn.dataset.id));
                });
            }
        }

        // Render Admin Management Table (With data-label for Mobile Cards View)
        if (adminTableBody) {
            const displayedBookings = adminFilterMode === 'pending' ? bookings.filter(b => b.status === 'pending') : bookings;

            if (displayedBookings.length === 0) {
                adminTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 1.5rem; color: var(--color-text-muted);">Tidak ada permohonan dalam kategori ini.</td></tr>`;
            } else {
                adminTableBody.innerHTML = displayedBookings.map(b => {
                    const startFmt = new Date(b.startDateTime).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' });
                    const endFmt = new Date(b.endDateTime).toLocaleString('id-ID', { timeStyle: 'short' });

                    return `
                        <tr>
                            <td data-label="No. Tiket"><strong>${b.id}</strong></td>
                            <td data-label="Pemohon">
                                <strong>${b.userName}</strong><br>
                                <small style="color: var(--color-text-muted);">${b.userClass || b.userRole} | ${b.userContact || '-'}</small>
                            </td>
                            <td data-label="Ruangan">${b.roomName}</td>
                            <td data-label="Waktu">${startFmt} - ${endFmt} WIB</td>
                            <td data-label="Status"><span class="status-pill ${b.status}">${b.status === 'approved' ? 'Disetujui' : b.status === 'pending' ? 'Menunggu' : 'Ditolak'}</span></td>
                            <td data-label="Tindakan">
                                <div class="action-buttons">
                                    ${b.status === 'pending' ? `
                                        <button class="btn btn-success btn-sm approve-booking-btn" data-id="${b.id}">Setujui</button>
                                        <button class="btn btn-danger btn-sm reject-booking-btn" data-id="${b.id}">Tolak</button>
                                    ` : ''}
                                    <button class="btn btn-secondary btn-sm print-slip-btn" data-id="${b.id}">Surat Izin</button>
                                    <button class="btn btn-secondary btn-sm delete-booking-btn" data-id="${b.id}" style="color: var(--color-danger);">Hapus</button>
                                </div>
                            </td>
                        </tr>
                    `;
                }).join('');

                // Admin Action Listeners
                document.querySelectorAll('.approve-booking-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const approver = currentUser ? currentUser.name : 'Sarpras SMKN 1';
                        window.StorageService.updateBookingStatus(btn.dataset.id, 'approved', 'Disetujui untuk kegiatan KBM / Ekskul resmi.', approver);
                        showToast('Peminjaman telah disetujui.', 'success');
                        renderSchedulesAndAdmin();
                    });
                });

                document.querySelectorAll('.reject-booking-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const reason = prompt('Masukkan alasan penolakan: ') || 'Jadwal ruangan dialihkan untuk agenda dinas sekolah.';
                        const approver = currentUser ? currentUser.name : 'Sarpras SMKN 1';
                        window.StorageService.updateBookingStatus(btn.dataset.id, 'rejected', reason, approver);
                        showToast('Peminjaman telah ditolak.', 'danger');
                        renderSchedulesAndAdmin();
                    });
                });

                document.querySelectorAll('.delete-booking-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        if (confirm('Hapus data peminjaman ini?')) {
                            window.StorageService.deleteBooking(btn.dataset.id);
                            showToast('Data peminjaman dihapus.', 'info');
                            renderSchedulesAndAdmin();
                        }
                    });
                });
            }
        }
    }

    // 8. Booking Form Handler
    const bookingForm = document.getElementById('booking-form');

    if (bookingForm) {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        const minDateTime = now.toISOString().slice(0, 16);
        
        const startInput = document.getElementById('start-date-time');
        const endInput = document.getElementById('end-date-time');
        if (startInput) startInput.min = minDateTime;
        if (endInput) endInput.min = minDateTime;

        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const selectedRoomId = document.getElementById('selected-room').value;
            const targetRoom = rooms.find(r => r.id === selectedRoomId);
            const userName = document.getElementById('booking-name').value.trim();
            const userRole = document.getElementById('booking-role').value;
            const userClass = document.getElementById('booking-class').value.trim();
            const userContact = document.getElementById('booking-contact').value.trim();
            const reason = document.getElementById('booking-reason').value.trim();
            const startDateTime = startInput.value;
            const endDateTime = endInput.value;

            if (new Date(startDateTime) >= new Date(endDateTime)) {
                showToast('Waktu selesai harus lebih akhir dari waktu mulai.', 'warning');
                return;
            }

            // Anti-Conflict Engine
            const currentBookings = window.StorageService.getBookings();
            const hasConflict = currentBookings.some(b => {
                if (b.roomId !== selectedRoomId || b.status === 'rejected') return false;
                const bStart = new Date(b.startDateTime).getTime();
                const bEnd = new Date(b.endDateTime).getTime();
                const reqStart = new Date(startDateTime).getTime();
                const reqEnd = new Date(endDateTime).getTime();

                return (reqStart < bEnd && reqEnd > bStart);
            });

            if (hasConflict) {
                showToast('Bentrok Jadwal: Ruangan sudah dipinjam pada rentang jam tersebut.', 'danger');
                return;
            }

            const newBooking = {
                id: `BK-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
                roomId: targetRoom.id,
                roomName: targetRoom.name,
                userName: userName,
                userRole: userRole,
                userClass: userClass,
                userContact: userContact,
                reason: reason,
                startDateTime: startDateTime,
                endDateTime: endDateTime,
                status: (currentUser && (currentUser.role === 'admin' || currentUser.role === 'guru')) ? 'approved' : 'pending',
                createdAt: new Date().toISOString(),
                approvedBy: (currentUser && (currentUser.role === 'admin' || currentUser.role === 'guru')) ? currentUser.name : '-',
                approvalDate: (currentUser && (currentUser.role === 'admin' || currentUser.role === 'guru')) ? new Date().toISOString() : '-',
                feedback: (currentUser && (currentUser.role === 'admin' || currentUser.role === 'guru')) ? 'Disetujui otomatis oleh pejabat wewenang.' : 'Menunggu verifikasi dari Sarpras SMKN 1 Jakarta.'
            };

            window.StorageService.saveBooking(newBooking);
            showToast('Pengajuan peminjaman berhasil disimpan.', 'success');
            bookingForm.reset();
            if (currentUser) {
                document.getElementById('booking-name').value = currentUser.name;
                document.getElementById('booking-class').value = currentUser.class || '';
            }
            renderSchedulesAndAdmin();
        });
    }

    // 9. Printable Surat Peminjaman
    const slipModal = document.getElementById('slipModal');
    const printableSlip = document.getElementById('printableSlip');
    const slipCloseBtn = document.getElementById('slipCloseBtn');
    const btnPrintSlip = document.getElementById('btnPrintSlip');

    function openSlipModal(bookingId) {
        const bookings = window.StorageService.getBookings();
        const b = bookings.find(item => item.id === bookingId);
        if (!b || !printableSlip) return;

        const startFmt = new Date(b.startDateTime).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' });
        const endFmt = new Date(b.endDateTime).toLocaleString('id-ID', { timeStyle: 'short' });

        printableSlip.innerHTML = `
            <div class="letter-header">
                <img src="./img/logo.png" alt="Logo SMKN 1 Jakarta" class="letter-logo">
                <div class="letter-title-header">
                    <h3>PEMERINTAH PROVINSI DAERAH KHUSUS IBUKOTA JAKARTA</h3>
                    <h3>DINAS PENDIDIKAN</h3>
                    <h2>SMK NEGERI 1 JAKARTA</h2>
                    <p>Jl. Budi Utomo No.7, Pasar Baru, Sawah Besar, Jakarta Pusat 10710 | Telp: (021) 3813630</p>
                </div>
            </div>

            <div style="text-align: center; margin-bottom: 1.25rem;">
                <h4 style="text-decoration: underline; text-transform: uppercase; font-size: 1.05rem; margin-bottom: 4px;">SURAT IZIN PENGGUNAAN RUANGAN</h4>
                <p style="font-size: 0.85rem;">Nomor: ${b.id}/SMKN1/SARPRAS/${new Date().getFullYear()}</p>
            </div>

            <p style="font-size: 0.88rem; text-align: justify; margin-bottom: 0.85rem;">
                Berdasarkan permohonan reservasi yang diajukan melalui sistem <strong>Pemangan</strong>, pihak Pengelola Sarana SMKN 1 Jakarta memberikan izin penggunaan fasilitas kepada:
            </p>

            <table class="letter-meta-table">
                <tr><td width="30%"><strong>Nama Pemohon</strong></td><td width="3%">:</td><td>${b.userName}</td></tr>
                <tr><td><strong>Kelas / Unit Kerja</strong></td><td>:</td><td>${b.userClass || b.userRole}</td></tr>
                <tr><td><strong>Kontak WhatsApp</strong></td><td>:</td><td>${b.userContact || '-'}</td></tr>
                <tr><td><strong>Ruangan / Fasilitas</strong></td><td>:</td><td><strong>${b.roomName}</strong></td></tr>
                <tr><td><strong>Keperluan</strong></td><td>:</td><td>${b.reason}</td></tr>
                <tr><td><strong>Waktu Penggunaan</strong></td><td>:</td><td>${startFmt} s.d. ${endFmt} WIB</td></tr>
                <tr><td><strong>Status</strong></td><td>:</td><td><strong style="color: ${b.status === 'approved' ? '#047857' : '#b45309'}; text-transform: uppercase;">${b.status === 'approved' ? 'DISETUJUI / RESMI' : 'MENUNGGU VERIFIKASI'}</strong></td></tr>
                <tr><td><strong>Ketentuan</strong></td><td>:</td><td>${b.feedback || 'Wajib menjaga kebersihan, ketertiban, dan mematikan AC/listrik setelah pemakaian.'}</td></tr>
            </table>

            <div class="letter-signature-grid">
                <div>
                    <p>Pemohon,</p>
                    <div class="letter-signature-space"></div>
                    <p><strong>(${b.userName})</strong></p>
                    <p style="font-size: 0.78rem; color: #555;">NIS/NIP: ${b.userClass || '-'}</p>
                </div>
                <div>
                    <p>Jakarta, ${new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}<br>Petugas Sarpras / Pembimbing,</p>
                    <div class="letter-signature-space"></div>
                    <p><strong>(${b.approvedBy !== '-' ? b.approvedBy : 'Pak Amrul Khairullah, S.Kom'})</strong></p>
                    <p style="font-size: 0.78rem; color: #555;">NIP: 198001012005011002</p>
                </div>
            </div>
        `;

        if (slipModal) slipModal.classList.add('active');
    }

    if (slipCloseBtn) slipCloseBtn.addEventListener('click', () => slipModal.classList.remove('active'));
    if (slipModal) {
        slipModal.addEventListener('click', (e) => {
            if (e.target === slipModal) slipModal.classList.remove('active');
        });
    }

    if (btnPrintSlip) {
        btnPrintSlip.addEventListener('click', () => {
            window.print();
        });
    }

    // 10. Toast Notification Helper
    function showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'all 0.25s ease';
            setTimeout(() => toast.remove(), 250);
        }, 3500);
    }
    window.showToast = showToast;

    // Initial render
    populateRoomSelect();
    renderRoomCards();
    renderSchedulesAndAdmin();
});
