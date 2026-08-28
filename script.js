/**
 * CORE CONTROLLER — PEMANGAN SMKN 1 JAKARTA
 * Standard: Minimalist Enterprise & High-Fidelity Education Architecture
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Drawer Navigation & Backdrop
    const burgerToggle = document.getElementById('burgerToggle');
    const navDrawer = document.getElementById('navDrawer');
    const navLinks = document.querySelectorAll('.nav-link');
    
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
        const scrollY = window.pageYOffset + 100;
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

    // 4. User Session & RBAC Sync
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
        const initial = (currentUser.name || 'User').charAt(0).toUpperCase();

        if (desktopUserNavSlot) {
            desktopUserNavSlot.innerHTML = `
                <div class="user-profile-badge">
                    <div class="user-avatar">${initial}</div>
                    <span>${currentUser.name.split(' ')[0]} <small style="color: var(--color-primary-light);">(${currentUser.role})</small></span>
                    <button id="desktopLogoutBtn" class="btn btn-sm btn-secondary" title="Keluar" style="padding: 2px 8px; border:none; background:none; cursor:pointer;">
                        <i class="fas fa-right-from-bracket"></i>
                    </button>
                </div>
            `;

            document.getElementById('desktopLogoutBtn')?.addEventListener('click', () => {
                window.StorageService.logout();
                showToast('Berhasil keluar dari akun.', 'info');
                setTimeout(() => window.location.reload(), 400);
            });
        }

        if (mobileUserCard) {
            mobileUserCard.style.display = 'flex';
            if (mobileUserAvatar) mobileUserAvatar.textContent = initial;
            if (mobileUserName) mobileUserName.textContent = currentUser.name;
            if (mobileUserRole) mobileUserRole.textContent = `${currentUser.role.toUpperCase()} (${currentUser.class || 'SMKN 1'})`;
            
            if (mobileLogoutBtn) {
                mobileLogoutBtn.addEventListener('click', () => {
                    window.StorageService.logout();
                    showToast('Berhasil keluar dari akun.', 'info');
                    setTimeout(() => window.location.reload(), 400);
                });
            }
        }

        // Prefill Wizard inputs
        const nameInp = document.getElementById('wizardUserName');
        const roleInp = document.getElementById('wizardUserRole');
        const classInp = document.getElementById('wizardUserClass');
        const contactInp = document.getElementById('wizardUserContact');
        
        if (nameInp) nameInp.value = currentUser.name;
        if (roleInp && currentUser.role) roleInp.value = currentUser.role;
        if (classInp && currentUser.class) classInp.value = currentUser.class;
        if (contactInp && currentUser.phone) contactInp.value = currentUser.phone;

        // Show Admin / Approver Tab if Role is Admin or Guru
        if (currentUser.role === 'admin' || currentUser.role === 'guru') {
            if (adminNavTab) adminNavTab.style.display = 'block';
            if (adminPanel) adminPanel.style.display = 'block';
            if (adminRoleDisplay) adminRoleDisplay.textContent = `Akses Kelola: ${currentUser.name} (${currentUser.role === 'admin' ? 'Sarpras SMKN 1' : 'Guru Pembimbing'})`;
        }
    }

    // 5. Hero Quick Interactive Tabs (Cari Ruangan vs Lacak Tiket)
    const tabQuickSearch = document.getElementById('tabQuickSearch');
    const tabQuickTrack = document.getElementById('tabQuickTrack');
    const quickSearchPanel = document.getElementById('quickSearchPanel');
    const quickTrackPanel = document.getElementById('quickTrackPanel');
    const btnQuickSearchSubmit = document.getElementById('btnQuickSearchSubmit');
    const btnHeroTrackSubmit = document.getElementById('btnHeroTrackSubmit');
    const heroTrackCode = document.getElementById('heroTrackCode');
    const heroTrackResult = document.getElementById('heroTrackResult');

    if (tabQuickSearch && tabQuickTrack) {
        tabQuickSearch.addEventListener('click', () => {
            tabQuickSearch.classList.add('active');
            tabQuickTrack.classList.remove('active');
            quickSearchPanel?.classList.add('active');
            quickTrackPanel?.classList.remove('active');
        });

        tabQuickTrack.addEventListener('click', () => {
            tabQuickTrack.classList.add('active');
            tabQuickSearch.classList.remove('active');
            quickTrackPanel?.classList.add('active');
            quickSearchPanel?.classList.remove('active');
        });
    }

    if (btnQuickSearchSubmit) {
        btnQuickSearchSubmit.addEventListener('click', () => {
            const query = document.getElementById('quickSearchInput')?.value || '';
            const category = document.getElementById('quickCategorySelect')?.value || 'ALL';

            const roomSearchInput = document.getElementById('roomSearchInput');
            if (roomSearchInput) roomSearchInput.value = query;

            categoryPills.forEach(p => {
                if (p.dataset.category === category) p.classList.add('active');
                else p.classList.remove('active');
            });

            currentCategory = category;
            searchQuery = query;
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

    if (btnHeroTrackSubmit) {
        btnHeroTrackSubmit.addEventListener('click', () => {
            const code = heroTrackCode?.value.trim();
            if (!code) {
                showToast('Masukkan nomor tiket peminjaman.', 'warning');
                return;
            }

            const booking = window.StorageService.getBookingById(code);
            if (heroTrackResult) {
                heroTrackResult.style.display = 'block';
                if (!booking) {
                    heroTrackResult.innerHTML = `
                        <div style="background: var(--color-danger-bg); border: 1px solid var(--color-danger-border); padding: 0.75rem; border-radius: var(--radius-sm); font-size: 0.8rem; color: var(--color-danger);">
                            <i class="fas fa-circle-exclamation"></i> Nomor tiket <strong>${code}</strong> tidak ditemukan dalam database.
                        </div>
                    `;
                } else {
                    const statusClass = booking.status === 'approved' ? 'approved' : booking.status === 'pending' ? 'pending' : 'rejected';
                    const statusText = booking.status === 'approved' ? 'Disetujui' : booking.status === 'pending' ? 'Menunggu Review' : 'Ditolak';
                    
                    heroTrackResult.innerHTML = `
                        <div style="background: var(--color-bg-alt); border: 1px solid var(--color-border); padding: 0.85rem; border-radius: var(--radius-sm); font-size: 0.8rem; margin-top: 0.75rem;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                                <strong>${booking.id}</strong>
                                <span class="status-pill ${statusClass}">${statusText}</span>
                            </div>
                            <div><strong>${booking.roomName}</strong></div>
                            <div style="color: var(--color-text-muted); font-size: 0.75rem;">Pemohon: ${booking.userName} (${booking.userClass})</div>
                            <div style="margin-top: 0.5rem; display: flex; justify-content: flex-end;">
                                <button class="btn btn-primary btn-sm print-slip-btn" data-id="${booking.id}">
                                    <i class="fas fa-file-pdf"></i> Lihat Surat Izin
                                </button>
                            </div>
                        </div>
                    `;

                    heroTrackResult.querySelector('.print-slip-btn')?.addEventListener('click', () => {
                        openSlipModal(booking.id);
                    });
                }
            }
        });
    }

    // 6. Populate & Render Rooms
    const rooms = window.StorageService ? window.StorageService.getRooms() : (window.ROOMS_DATA || []);
    const roomsContainer = document.getElementById('roomsContainer');
    const wizardRoomSelect = document.getElementById('wizardRoomSelect');
    const searchInput = document.getElementById('roomSearchInput');
    const categoryPills = document.querySelectorAll('.filter-pill');

    let currentCategory = 'ALL';
    let searchQuery = '';

    function populateWizardRoomSelect() {
        if (!wizardRoomSelect) return;
        wizardRoomSelect.innerHTML = '<option value="" disabled selected>-- Pilih Ruangan / Laboratorium --</option>';
        rooms.forEach(room => {
            const opt = document.createElement('option');
            opt.value = room.id;
            opt.textContent = `${room.name} (Kap: ${room.capacity} Org) — ${room.building}`;
            wizardRoomSelect.appendChild(opt);
        });
    }

    function populateEquipmentCheckboxes() {
        const container = document.getElementById('equipmentCheckboxes');
        if (!container || !window.EQUIPMENT_OPTIONS) return;

        container.innerHTML = window.EQUIPMENT_OPTIONS.map(eq => `
            <label class="equipment-label-box">
                <input type="checkbox" name="equipmentAddons" value="${eq.name}">
                <span>${eq.name}</span>
            </label>
        `).join('');
    }

    function renderRoomCards() {
        if (!roomsContainer) return;

        const filtered = rooms.filter(room => {
            const matchCategory = currentCategory === 'ALL' || 
                (room.category && room.category.toLowerCase().includes(currentCategory.toLowerCase())) ||
                (room.type && room.type.toLowerCase().includes(currentCategory.toLowerCase())) || 
                (room.building && room.building.toLowerCase().includes(currentCategory.toLowerCase()));
            
            const matchSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                room.building.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (room.pic && room.pic.toLowerCase().includes(searchQuery.toLowerCase())) ||
                room.facilities.some(f => f.toLowerCase().includes(searchQuery.toLowerCase())) ||
                room.type.toLowerCase().includes(searchQuery.toLowerCase());

            return matchCategory && matchSearch;
        });

        // Update Stat Counters in Hero
        const statTotalRooms = document.getElementById('statTotalRooms');
        if (statTotalRooms) statTotalRooms.textContent = `${rooms.length}`;

        if (filtered.length === 0) {
            roomsContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; background: var(--color-surface); border-radius: var(--radius-md); border: 1px dashed var(--color-border);">
                    <i class="fas fa-filter-circle-xmark" style="font-size: 2.5rem; color: var(--color-text-light); margin-bottom: 0.75rem;"></i>
                    <h4 style="font-size: 1.1rem; color: var(--color-text-main); margin-bottom: 0.3rem;">Tidak ada fasilitas yang cocok</h4>
                    <p style="color: var(--color-text-muted); font-size: 0.85rem;">Coba cari dengan kata kunci lain atau klik filter 'Semua'.</p>
                </div>
            `;
            return;
        }

        roomsContainer.innerHTML = filtered.map(room => {
            const facilitiesTags = room.facilities.slice(0, 3).map(f => `<span class="facility-chip">${f}</span>`).join('');
            const moreCount = room.facilities.length > 3 ? `<span class="facility-chip">+${room.facilities.length - 3} fasilitas</span>` : '';

            return `
                <div class="room-card" data-room-id="${room.id}">
                    <div class="room-card-img">
                        <img src="${room.image}" alt="${room.name}" loading="lazy">
                        <span class="room-badge-type">${room.type}</span>
                        <span class="room-badge-status ${room.status === 'available' ? 'status-available' : 'status-booked'}">
                            ${room.status === 'available' ? '● Tersedia' : '● Digunakan'}
                        </span>
                    </div>
                    <div class="room-card-body">
                        <div class="room-meta-tags">
                            <span><i class="fas fa-location-dot"></i> ${room.building}</span>
                            <span>•</span>
                            <span><i class="fas fa-users"></i> Kapasitas ${room.capacity} Org</span>
                        </div>
                        <h3 class="room-title">${room.name}</h3>
                        <p class="room-desc">${room.description}</p>
                        <div class="room-facilities-chips">
                            ${facilitiesTags}
                            ${moreCount}
                        </div>
                        <div class="room-card-footer">
                            <button class="btn btn-secondary btn-sm view-detail-btn" data-id="${room.id}">
                                <i class="fas fa-info-circle"></i> Detail
                            </button>
                            <button class="btn btn-primary btn-sm book-this-btn" data-id="${room.id}">
                                <i class="fas fa-calendar-plus"></i> Pinjam
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Attach listeners
        document.querySelectorAll('.view-detail-btn').forEach(btn => {
            btn.addEventListener('click', () => openRoomDetail(btn.dataset.id));
        });

        document.querySelectorAll('.book-this-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.dataset.id;
                if (wizardRoomSelect) {
                    wizardRoomSelect.value = targetId;
                    goToWizardStep(2);
                    const bookingSection = document.getElementById('booking');
                    if (bookingSection) {
                        const offset = document.getElementById('navbar').offsetHeight;
                        window.scrollTo({
                            top: bookingSection.offsetTop - offset,
                            behavior: 'smooth'
                        });
                        showToast(`Ruangan dipilih: ${rooms.find(r => r.id === targetId)?.name}`, 'info');
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

    // 7. Interactive Room Detail Modal
    const modal = document.getElementById('roomDetailModal');
    const modalTitle = document.getElementById('modalRoomTitle');
    const modalBody = document.getElementById('modalRoomBody');
    const modalCloseBtn = document.getElementById('modalCloseBtn');

    function openRoomDetail(roomId) {
        const room = rooms.find(r => r.id === roomId);
        if (!room || !modal) return;

        modalTitle.textContent = room.name;
        modalBody.innerHTML = `
            <div style="margin-bottom: 1.25rem; border-radius: var(--radius-md); overflow: hidden; height: 210px; box-shadow: var(--shadow-sm);">
                <img src="${room.image}" alt="${room.name}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.25rem; background: var(--color-bg-alt); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--color-border); font-size: 0.85rem;">
                <div><strong>Lokasi:</strong> ${room.building}</div>
                <div><strong>Kapasitas:</strong> ${room.capacity} Orang</div>
                <div><strong>Penanggung Jawab (PIC):</strong> ${room.pic}</div>
                <div><strong>NIP PIC:</strong> ${room.nipPic || '-'}</div>
                <div><strong>Jam Operasional:</strong> ${room.operationalHours || '07:00 - 17:00 WIB'}</div>
                <div><strong>Status Saat Ini:</strong> <span class="status-pill ${room.status === 'available' ? 'approved' : 'pending'}">${room.status === 'available' ? 'Tersedia' : 'Sedang Dipakai'}</span></div>
            </div>

            <h4 style="font-size: 0.95rem; margin-bottom: 0.35rem; color: var(--color-text-main);">Deskripsi & Fungsi Ruangan</h4>
            <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 1.25rem; line-height: 1.6;">${room.description}</p>
            
            <h4 style="font-size: 0.95rem; margin-bottom: 0.45rem; color: var(--color-text-main);">Fasilitas & Sarana Terpasang:</h4>
            <ul style="margin-left: 1.25rem; font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 1.5rem; line-height: 1.75;">
                ${room.facilities.map(f => `<li>${f}</li>`).join('')}
            </ul>

            <button class="btn btn-primary" id="modalBookNowBtn" style="width: 100%;">
                <i class="fas fa-calendar-plus"></i> Gunakan Ruangan Ini di Formulir
            </button>
        `;

        modal.classList.add('active');

        document.getElementById('modalBookNowBtn')?.addEventListener('click', () => {
            modal.classList.remove('active');
            if (wizardRoomSelect) {
                wizardRoomSelect.value = room.id;
                goToWizardStep(2);
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

    // 8. Interactive Visual Timetable Matrix (Schedule Timeline)
    const timetableDate = document.getElementById('timetableDate');
    const timetableGrid = document.getElementById('timetableGrid');

    // Set default date to today
    const todayStr = new Date().toISOString().slice(0, 10);
    if (timetableDate) {
        timetableDate.value = todayStr;
        timetableDate.addEventListener('change', renderTimetable);
    }

    function renderTimetable() {
        if (!timetableGrid) return;
        const selectedDate = timetableDate ? timetableDate.value : todayStr;
        const matrix = window.StorageService.getHourlyMatrix(selectedDate);
        const hours = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

        let headerHtml = `
            <thead>
                <tr>
                    <th>Ruangan & Fasilitas</th>
                    ${hours.map(h => `<th>${String(h).padStart(2, '0')}:00</th>`).join('')}
                </tr>
            </thead>
        `;

        let bodyHtml = `<tbody>`;
        matrix.forEach(row => {
            bodyHtml += `
                <tr>
                    <td>
                        <strong style="color: var(--color-primary);">${row.room.name}</strong><br>
                        <small style="color: var(--color-text-muted);">${row.room.category}</small>
                    </td>
                    ${row.slots.map(slot => {
                        if (slot.isBooked && slot.booking) {
                            const b = slot.booking;
                            const isPending = b.status === 'pending';
                            const cellClass = isPending ? 'slot-pending' : 'slot-booked';
                            const cellText = isPending ? 'Review' : 'Dipakai';
                            const tooltip = `${b.roomName}\nPemohon: ${b.userName} (${b.userClass})\nAgenda: ${b.reason}\nWaktu: ${b.startDateTime.slice(11,16)} - ${b.endDateTime.slice(11,16)}`;
                            return `
                                <td>
                                    <div class="time-slot-cell ${cellClass}" title="${tooltip}">
                                        ${cellText}
                                    </div>
                                </td>
                            `;
                        } else {
                            return `
                                <td>
                                    <div class="time-slot-cell slot-available" title="Tersedia untuk dipinjam">
                                        Kosong
                                    </div>
                                </td>
                            `;
                        }
                    }).join('')}
                </tr>
            `;
        });
        bodyHtml += `</tbody>`;

        timetableGrid.innerHTML = headerHtml + bodyHtml;
    }

    // 9. Multi-Step Reservation Wizard Engine
    let currentStep = 1;
    const wizardPanes = document.querySelectorAll('.wizard-pane');
    const stepItems = document.querySelectorAll('.step-item');

    function goToWizardStep(step) {
        currentStep = step;
        wizardPanes.forEach(pane => pane.classList.remove('active'));
        document.getElementById(`wizardStep${step}`)?.classList.add('active');

        stepItems.forEach(item => {
            const itemStep = parseInt(item.dataset.step, 10);
            item.classList.remove('active', 'completed');
            if (itemStep === step) item.classList.add('active');
            else if (itemStep < step) item.classList.add('completed');
        });
    }

    // Step 1 -> 2
    document.getElementById('btnNextStep1')?.addEventListener('click', () => {
        const selectedRoom = wizardRoomSelect?.value;
        if (!selectedRoom) {
            showToast('Silakan pilih ruangan terlebih dahulu.', 'warning');
            return;
        }
        goToWizardStep(2);
    });

    // Step 2 -> 1
    document.getElementById('btnPrevStep2')?.addEventListener('click', () => goToWizardStep(1));

    // Live Conflict Checker in Step 2
    const startInp = document.getElementById('wizardStartDateTime');
    const endInp = document.getElementById('wizardEndDateTime');
    const conflictBanner = document.getElementById('liveConflictBanner');

    function validateScheduleConflict() {
        if (!startInp || !endInp || !conflictBanner) return;
        const startVal = startInp.value;
        const endVal = endInp.value;
        const roomId = wizardRoomSelect?.value;

        if (!startVal || !endVal || !roomId) {
            conflictBanner.style.display = 'none';
            return;
        }

        if (new Date(startVal) >= new Date(endVal)) {
            conflictBanner.style.display = 'flex';
            conflictBanner.className = 'conflict-banner conflict';
            conflictBanner.innerHTML = `<i class="fas fa-circle-exclamation"></i> <span>Waktu selesai harus lebih akhir dari waktu mulai.</span>`;
            return;
        }

        const isConflict = window.StorageService.checkConflict(roomId, startVal, endVal);
        conflictBanner.style.display = 'flex';

        if (isConflict) {
            conflictBanner.className = 'conflict-banner conflict';
            conflictBanner.innerHTML = `<i class="fas fa-circle-xmark"></i> <span>Perhatian: Ruangan sudah dipinjam pada rentang waktu ini. Silakan ganti jam/tanggal.</span>`;
        } else {
            conflictBanner.className = 'conflict-banner available';
            conflictBanner.innerHTML = `<i class="fas fa-circle-check"></i> <span>Jadwal tersedia & bebas dari bentrok permohonan lain.</span>`;
        }
    }

    startInp?.addEventListener('input', validateScheduleConflict);
    endInp?.addEventListener('input', validateScheduleConflict);

    // Step 2 -> 3
    document.getElementById('btnNextStep2')?.addEventListener('click', () => {
        const startVal = startInp?.value;
        const endVal = endInp?.value;
        const roomId = wizardRoomSelect?.value;

        if (!startVal || !endVal) {
            showToast('Lengkapi waktu mulai dan selesai.', 'warning');
            return;
        }

        if (new Date(startVal) >= new Date(endVal)) {
            showToast('Waktu selesai harus lebih akhir dari waktu mulai.', 'warning');
            return;
        }

        if (window.StorageService.checkConflict(roomId, startVal, endVal)) {
            showToast('Jadwal bentrok dengan peminjaman lain. Silakan ubah jam.', 'danger');
            return;
        }

        goToWizardStep(3);
    });

    // Step 3 -> 2
    document.getElementById('btnPrevStep3')?.addEventListener('click', () => goToWizardStep(2));

    // Step 3 -> 4 (Populate Review Summary)
    document.getElementById('btnNextStep3')?.addEventListener('click', () => {
        const name = document.getElementById('wizardUserName')?.value.trim();
        const userClass = document.getElementById('wizardUserClass')?.value.trim();
        const contact = document.getElementById('wizardUserContact')?.value.trim();
        const supervisor = document.getElementById('wizardSupervisor')?.value.trim();
        const reason = document.getElementById('wizardReason')?.value.trim();

        if (!name || !userClass || !contact || !supervisor || !reason) {
            showToast('Harap lengkapi semua kolom bertanda bintang (*).', 'warning');
            return;
        }

        // Populate summary box
        const targetRoom = rooms.find(r => r.id === wizardRoomSelect.value);
        const selectedEquipments = Array.from(document.querySelectorAll('input[name="equipmentAddons"]:checked')).map(c => c.value);
        const startFmt = new Date(startInp.value).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' });
        const endFmt = new Date(endInp.value).toLocaleString('id-ID', { timeStyle: 'short' });

        const summaryBox = document.getElementById('reviewSummaryBox');
        if (summaryBox) {
            summaryBox.innerHTML = `
                <div class="review-row"><span>Ruangan:</span><strong>${targetRoom?.name}</strong></div>
                <div class="review-row"><span>Waktu:</span><strong>${startFmt} s.d. ${endFmt} WIB</strong></div>
                <div class="review-row"><span>Pemohon:</span><strong>${name} (${userClass})</strong></div>
                <div class="review-row"><span>Kontak WhatsApp:</span><strong>${contact}</strong></div>
                <div class="review-row"><span>Guru Pendamping:</span><strong>${supervisor}</strong></div>
                <div class="review-row"><span>Peralatan Tambahan:</span><span>${selectedEquipments.length > 0 ? selectedEquipments.join(', ') : 'Tidak ada'}</span></div>
                <div class="review-row"><span>Keperluan:</span><em>"${reason}"</em></div>
            `;
        }

        goToWizardStep(4);
    });

    // Step 4 -> 3
    document.getElementById('btnPrevStep4')?.addEventListener('click', () => goToWizardStep(3));

    // Submit Wizard Form
    const wizardBookingForm = document.getElementById('wizardBookingForm');
    if (wizardBookingForm) {
        // Set default minimum datetime to now
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        const minDateTime = now.toISOString().slice(0, 16);
        if (startInp) startInp.min = minDateTime;
        if (endInp) endInp.min = minDateTime;

        wizardBookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const targetRoom = rooms.find(r => r.id === wizardRoomSelect.value);
            const userName = document.getElementById('wizardUserName').value.trim();
            const userRole = document.getElementById('wizardUserRole').value;
            const userClass = document.getElementById('wizardUserClass').value.trim();
            const userContact = document.getElementById('wizardUserContact').value.trim();
            const supervisor = document.getElementById('wizardSupervisor').value.trim();
            const reason = document.getElementById('wizardReason').value.trim();
            const startDateTime = startInp.value;
            const endDateTime = endInp.value;
            const selectedEquipments = Array.from(document.querySelectorAll('input[name="equipmentAddons"]:checked')).map(c => c.value);

            if (window.StorageService.checkConflict(targetRoom.id, startDateTime, endDateTime)) {
                showToast('Terjadi bentrok jadwal saat pengajuan diproses. Silakan ubah jam.', 'danger');
                return;
            }

            const isAutoApproved = currentUser && (currentUser.role === 'admin' || currentUser.role === 'guru');

            const newBooking = {
                id: `BK-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
                roomId: targetRoom.id,
                roomName: targetRoom.name,
                userName: userName,
                userRole: userRole,
                userClass: userClass,
                userContact: userContact,
                supervisorName: supervisor,
                equipment: selectedEquipments,
                reason: reason,
                startDateTime: startDateTime,
                endDateTime: endDateTime,
                status: isAutoApproved ? 'approved' : 'pending',
                createdAt: new Date().toISOString(),
                approvedBy: isAutoApproved ? currentUser.name : '-',
                approvalDate: isAutoApproved ? new Date().toISOString() : '-',
                feedback: isAutoApproved ? 'Disetujui otomatis melalui wewenang guru/sarpras.' : 'Menunggu verifikasi dan paraf petugas Sarpras SMKN 1 Jakarta.'
            };

            window.StorageService.saveBooking(newBooking);
            showToast(`Pengajuan ${newBooking.id} berhasil terkirim!`, 'success');

            // Reset wizard
            wizardBookingForm.reset();
            goToWizardStep(1);
            if (conflictBanner) conflictBanner.style.display = 'none';

            if (currentUser) {
                document.getElementById('wizardUserName').value = currentUser.name;
                document.getElementById('wizardUserClass').value = currentUser.class || '';
            }

            renderSchedulesAndAdmin();
            renderTimetable();
        });
    }

    // 10. Direct Ticket Tracking Section
    const btnDirectTrack = document.getElementById('btnDirectTrack');
    const directTrackCode = document.getElementById('directTrackCode');
    const directTrackResultContainer = document.getElementById('directTrackResultContainer');

    if (btnDirectTrack && directTrackCode && directTrackResultContainer) {
        btnDirectTrack.addEventListener('click', () => {
            const code = directTrackCode.value.trim();
            if (!code) {
                showToast('Ketikkan nomor ID tiket peminjaman.', 'warning');
                return;
            }

            const b = window.StorageService.getBookingById(code);
            directTrackResultContainer.style.display = 'block';

            if (!b) {
                directTrackResultContainer.innerHTML = `
                    <div class="ticket-receipt-card" style="text-align: center;">
                        <i class="fas fa-triangle-exclamation" style="font-size: 2.5rem; color: var(--color-danger); margin-bottom: 0.75rem;"></i>
                        <h3>Nomor Tiket Tidak Ditemukan</h3>
                        <p style="color: var(--color-text-muted); font-size: 0.875rem;">Periksa kembali nomor tiket yang Anda masukkan (contoh format: BK-2026-001).</p>
                    </div>
                `;
            } else {
                const startFmt = new Date(b.startDateTime).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' });
                const endFmt = new Date(b.endDateTime).toLocaleString('id-ID', { timeStyle: 'short' });
                const statusClass = b.status === 'approved' ? 'approved' : b.status === 'pending' ? 'pending' : 'rejected';
                const statusText = b.status === 'approved' ? 'Disetujui / Surat Izin Resmi Terbit' : b.status === 'pending' ? 'Dalam Antrean Verifikasi Sarpras' : 'Permohonan Ditolak';

                directTrackResultContainer.innerHTML = `
                    <div class="ticket-receipt-card">
                        <div class="ticket-header">
                            <div>
                                <span class="badge-pill badge-primary">Resi Peminjaman Sarpras</span>
                                <h3 style="font-size: 1.25rem;">No. Tiket: ${b.id}</h3>
                            </div>
                            <span class="status-pill ${statusClass}">${statusText}</span>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.875rem; margin-bottom: 1.25rem;">
                            <div><strong>Nama Pemohon:</strong> ${b.userName} (${b.userClass || b.userRole})</div>
                            <div><strong>Ruangan:</strong> ${b.roomName}</div>
                            <div><strong>Waktu:</strong> ${startFmt} - ${endFmt} WIB</div>
                            <div><strong>Guru Pendamping:</strong> ${b.supervisorName || '-'}</div>
                            <div><strong>Peralatan Tambahan:</strong> ${b.equipment && b.equipment.length > 0 ? b.equipment.join(', ') : 'Standar Ruangan'}</div>
                            <div><strong>Disetujui Oleh:</strong> ${b.approvedBy}</div>
                        </div>

                        <div style="background: var(--color-bg-alt); padding: 1rem; border-radius: var(--radius-sm); font-size: 0.825rem; margin-bottom: 1.25rem;">
                            <strong>Catatan Sarpras:</strong><br>
                            <span style="color: var(--color-text-muted);">${b.feedback}</span>
                        </div>

                        <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
                            <button class="btn btn-primary btn-sm print-slip-btn" data-id="${b.id}">
                                <i class="fas fa-file-pdf"></i> Buka Surat Izin Resmi
                            </button>
                        </div>
                    </div>
                `;

                directTrackResultContainer.querySelector('.print-slip-btn')?.addEventListener('click', () => {
                    openSlipModal(b.id);
                });
            }
        });
    }

    // 11. Schedule List & Admin Table Rendering
    const scheduleListContainer = document.getElementById('scheduleListContainer');
    const scheduleCountBadge = document.getElementById('scheduleCountBadge');
    const adminTableBody = document.getElementById('adminTableBody');
    const btnFilterAllBookings = document.getElementById('btnFilterAllBookings');
    const btnFilterPendingBookings = document.getElementById('btnFilterPendingBookings');
    const btnFilterApprovedBookings = document.getElementById('btnFilterApprovedBookings');
    const adminSearchInput = document.getElementById('adminSearchInput');

    let adminFilterMode = 'all';
    let adminSearchQuery = '';

    if (btnFilterAllBookings && btnFilterPendingBookings && btnFilterApprovedBookings) {
        btnFilterAllBookings.addEventListener('click', () => {
            adminFilterMode = 'all';
            btnFilterAllBookings.className = 'btn btn-primary btn-sm';
            btnFilterPendingBookings.className = 'btn btn-secondary btn-sm';
            btnFilterApprovedBookings.className = 'btn btn-secondary btn-sm';
            renderSchedulesAndAdmin();
        });

        btnFilterPendingBookings.addEventListener('click', () => {
            adminFilterMode = 'pending';
            btnFilterPendingBookings.className = 'btn btn-primary btn-sm';
            btnFilterAllBookings.className = 'btn btn-secondary btn-sm';
            btnFilterApprovedBookings.className = 'btn btn-secondary btn-sm';
            renderSchedulesAndAdmin();
        });

        btnFilterApprovedBookings.addEventListener('click', () => {
            adminFilterMode = 'approved';
            btnFilterApprovedBookings.className = 'btn btn-primary btn-sm';
            btnFilterAllBookings.className = 'btn btn-secondary btn-sm';
            btnFilterPendingBookings.className = 'btn btn-secondary btn-sm';
            renderSchedulesAndAdmin();
        });
    }

    if (adminSearchInput) {
        adminSearchInput.addEventListener('input', (e) => {
            adminSearchQuery = e.target.value.toLowerCase();
            renderSchedulesAndAdmin();
        });
    }

    // Admin Tools: Export CSV & Reset Demo
    document.getElementById('btnExportCSV')?.addEventListener('click', () => {
        const csvContent = window.StorageService.exportBookingsCSV();
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', `Laporan_Peminjaman_SMKN1_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Laporan CSV berhasil diunduh.', 'success');
    });

    document.getElementById('btnResetData')?.addEventListener('click', () => {
        if (confirm('Kembalikan seluruh data peminjaman ke data awal sekolah?')) {
            window.StorageService.resetDataToDefault();
            showToast('Data demo berhasil direset ke standar awal.', 'info');
            renderSchedulesAndAdmin();
            renderTimetable();
            renderRoomCards();
        }
    });

    function renderSchedulesAndAdmin() {
        const bookings = window.StorageService ? window.StorageService.getBookings() : [];
        const analytics = window.StorageService ? window.StorageService.getAnalytics() : { total: 0, approved: 0, pending: 0, topRoomName: '-' };

        // Update KPI Counters
        const kpiTotal = document.getElementById('kpiTotal');
        const kpiPending = document.getElementById('kpiPending');
        const kpiApproved = document.getElementById('kpiApproved');
        const kpiTopRoom = document.getElementById('kpiTopRoom');
        const statTotalBookings = document.getElementById('statTotalBookings');

        if (kpiTotal) kpiTotal.textContent = `${analytics.total}`;
        if (kpiPending) kpiPending.textContent = `${analytics.pending}`;
        if (kpiApproved) kpiApproved.textContent = `${analytics.approved}`;
        if (kpiTopRoom) kpiTopRoom.textContent = analytics.topRoomName;
        if (statTotalBookings) statTotalBookings.textContent = `${bookings.length}+`;

        // Render User Active Schedule List
        if (scheduleListContainer) {
            if (scheduleCountBadge) scheduleCountBadge.textContent = `${bookings.length} Terdata`;

            if (bookings.length === 0) {
                scheduleListContainer.innerHTML = `<p style="text-align: center; color: var(--color-text-muted); padding: 2rem 0;">Belum ada jadwal peminjaman terdata.</p>`;
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
                                <div><i class="fas fa-clock"></i> ${startFormatted} - ${endFormatted} WIB</div>
                                <div style="margin-top: 3px; color: var(--color-text-muted); font-style: italic;">"${b.reason}"</div>
                            </div>
                            <div class="schedule-action-bar">
                                <button class="btn btn-secondary btn-sm print-slip-btn" data-id="${b.id}">
                                    <i class="fas fa-file-pdf"></i> Surat Izin
                                </button>
                            </div>
                        </div>
                    `;
                }).join('');

                document.querySelectorAll('.schedule-list .print-slip-btn').forEach(btn => {
                    btn.addEventListener('click', () => openSlipModal(btn.dataset.id));
                });
            }
        }

        // Render Admin Table
        if (adminTableBody) {
            let displayed = bookings;
            if (adminFilterMode === 'pending') displayed = displayed.filter(b => b.status === 'pending');
            else if (adminFilterMode === 'approved') displayed = displayed.filter(b => b.status === 'approved');

            if (adminSearchQuery) {
                displayed = displayed.filter(b => 
                    b.id.toLowerCase().includes(adminSearchQuery) ||
                    b.userName.toLowerCase().includes(adminSearchQuery) ||
                    b.roomName.toLowerCase().includes(adminSearchQuery) ||
                    (b.userClass && b.userClass.toLowerCase().includes(adminSearchQuery))
                );
            }

            if (displayed.length === 0) {
                adminTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--color-text-muted);">Tidak ada permohonan dalam kategori ini.</td></tr>`;
            } else {
                adminTableBody.innerHTML = displayed.map(b => {
                    const startFmt = new Date(b.startDateTime).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' });
                    const endFmt = new Date(b.endDateTime).toLocaleString('id-ID', { timeStyle: 'short' });

                    return `
                        <tr>
                            <td data-label="No. Tiket"><strong>${b.id}</strong></td>
                            <td data-label="Pemohon">
                                <strong>${b.userName}</strong><br>
                                <small style="color: var(--color-text-muted);">${b.userClass || b.userRole} | ${b.userContact || '-'}</small>
                            </td>
                            <td data-label="Ruangan">
                                <strong>${b.roomName}</strong><br>
                                <small style="color: var(--color-text-muted);">Alat: ${b.equipment && b.equipment.length > 0 ? b.equipment.slice(0, 2).join(', ') : 'Standar'}</small>
                            </td>
                            <td data-label="Waktu">${startFmt} - ${endFmt} WIB</td>
                            <td data-label="Status"><span class="status-pill ${b.status}">${b.status === 'approved' ? 'Disetujui' : b.status === 'pending' ? 'Menunggu' : 'Ditolak'}</span></td>
                            <td data-label="Tindakan">
                                <div class="action-buttons">
                                    ${b.status === 'pending' ? `
                                        <button class="btn btn-success btn-sm approve-booking-btn" data-id="${b.id}" title="Setujui Permohonan"><i class="fas fa-check"></i> Setujui</button>
                                        <button class="btn btn-danger btn-sm reject-booking-btn" data-id="${b.id}" title="Tolak Permohonan"><i class="fas fa-xmark"></i> Tolak</button>
                                    ` : ''}
                                    <button class="btn btn-secondary btn-sm print-slip-btn" data-id="${b.id}" title="Lihat Surat"><i class="fas fa-file-lines"></i> Surat</button>
                                    <button class="btn btn-secondary btn-sm delete-booking-btn" data-id="${b.id}" style="color: var(--color-danger);" title="Hapus"><i class="fas fa-trash"></i></button>
                                </div>
                            </td>
                        </tr>
                    `;
                }).join('');

                // Action listeners
                document.querySelectorAll('.approve-booking-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const approver = currentUser ? currentUser.name : 'Sarpras SMKN 1';
                        window.StorageService.updateBookingStatus(btn.dataset.id, 'approved', 'Disetujui resmi untuk kegiatan KBM / Ekskul.', approver);
                        showToast('Peminjaman telah disetujui.', 'success');
                        renderSchedulesAndAdmin();
                        renderTimetable();
                    });
                });

                document.querySelectorAll('.reject-booking-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const reason = prompt('Masukkan alasan penolakan: ') || 'Jadwal ruangan dialihkan untuk agenda kedinasan sekolah.';
                        const approver = currentUser ? currentUser.name : 'Sarpras SMKN 1';
                        window.StorageService.updateBookingStatus(btn.dataset.id, 'rejected', reason, approver);
                        showToast('Peminjaman telah ditolak.', 'danger');
                        renderSchedulesAndAdmin();
                        renderTimetable();
                    });
                });

                document.querySelectorAll('.delete-booking-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        if (confirm('Hapus entri peminjaman ini secara permanen?')) {
                            window.StorageService.deleteBooking(btn.dataset.id);
                            showToast('Data peminjaman dihapus.', 'info');
                            renderSchedulesAndAdmin();
                            renderTimetable();
                        }
                    });
                });

                document.querySelectorAll('#adminTableBody .print-slip-btn').forEach(btn => {
                    btn.addEventListener('click', () => openSlipModal(btn.dataset.id));
                });
            }
        }
    }

    // 12. Official Printable Surat Peminjaman 2.0 (with QR Code Verification)
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
                    <p>Jl. Budi Utomo No.7, Pasar Baru, Sawah Besar, Jakarta Pusat 10710 | Telp: (021) 3813630 | info@smkn1jakarta.sch.id</p>
                </div>
            </div>

            <div style="text-align: center; margin-bottom: 1.5rem;">
                <h4 style="text-decoration: underline; text-transform: uppercase; font-size: 1.1rem; margin-bottom: 4px; font-family: 'Times New Roman', serif;">SURAT IZIN PENGGUNAAN RUANGAN & LAB</h4>
                <p style="font-size: 0.85rem;">Nomor: ${b.id}/SMKN1/SARPRAS/${new Date().getFullYear()}</p>
            </div>

            <p style="font-size: 0.9rem; text-align: justify; margin-bottom: 1rem;">
                Berdasarkan permohonan reservasi sarana pembelajaran yang terdaftar pada sistem <strong>Pemangan</strong>, Unit Pengelola Sarana & Prasarana SMK Negeri 1 Jakarta memberikan izin penggunaan fasilitas kepada:
            </p>

            <table class="letter-meta-table">
                <tr><td width="30%"><strong>Nama Pemohon</strong></td><td width="3%">:</td><td>${b.userName}</td></tr>
                <tr><td><strong>Kelas / Unit Kerja</strong></td><td>:</td><td>${b.userClass || b.userRole}</td></tr>
                <tr><td><strong>Nomor Kontak WhatsApp</strong></td><td>:</td><td>${b.userContact || '-'}</td></tr>
                <tr><td><strong>Guru Pendamping</strong></td><td>:</td><td>${b.supervisorName || 'Pak Amrul Khairullah, S.Kom'}</td></tr>
                <tr><td><strong>Ruangan / Fasilitas</strong></td><td>:</td><td><strong>${b.roomName}</strong></td></tr>
                <tr><td><strong>Peralatan Tambahan</strong></td><td>:</td><td>${b.equipment && b.equipment.length > 0 ? b.equipment.join(', ') : 'Standar Kelengkapan Ruangan'}</td></tr>
                <tr><td><strong>Keperluan / Agenda</strong></td><td>:</td><td>${b.reason}</td></tr>
                <tr><td><strong>Waktu Penggunaan</strong></td><td>:</td><td><strong>${startFmt} s.d. ${endFmt} WIB</strong></td></tr>
                <tr><td><strong>Status Verifikasi</strong></td><td>:</td><td><strong style="color: ${b.status === 'approved' ? '#047857' : '#b45309'}; text-transform: uppercase;">${b.status === 'approved' ? 'DISETUJUI (RESMI)' : 'MENUNGGU VERIFIKASI'}</strong></td></tr>
                <tr><td><strong>Catatan & Ketentuan</strong></td><td>:</td><td>${b.feedback || 'Wajib menjaga kebersihan, ketertiban, dan mematikan AC serta mengunci pintu setelah pemakaian.'}</td></tr>
            </table>

            <!-- Digital QR Code Verification Box -->
            <div class="letter-qr-container">
                <div class="qr-placeholder">
                    <i class="fas fa-qrcode"></i>
                </div>
                <div class="qr-info-text">
                    <strong>VERIFIKASI DIGITAL DOKUMEN RESMI SMKN 1 JAKARTA</strong><br>
                    ID Tiket: <code>${b.id}</code> | Diterbitkan: ${new Date(b.createdAt).toLocaleString('id-ID')}<br>
                    Surat ini merupakan dokumen digital sah yang diterbitkan melalui Sistem Pemangan SMKN 1 Jakarta.
                </div>
            </div>

            <div class="letter-signature-grid">
                <div>
                    <p>Pemohon,</p>
                    <div class="letter-signature-space"></div>
                    <p><strong>(${b.userName})</strong></p>
                    <p style="font-size: 0.78rem; color: #555;">NIS/NIP: ${b.userClass || '-'}</p>
                </div>
                <div>
                    <p>Guru Pembimbing / Pendamping,</p>
                    <div class="letter-signature-space"></div>
                    <p><strong>(${b.supervisorName || 'Pak Amrul Khairullah, S.Kom'})</strong></p>
                    <p style="font-size: 0.78rem; color: #555;">NIP. 198001012005011002</p>
                </div>
                <div>
                    <p>Jakarta, ${new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}<br>Waka Bidang Sarpras,</p>
                    <div class="letter-signature-space"></div>
                    <p><strong>(${b.approvedBy !== '-' ? b.approvedBy : 'Pak Amrul Khairullah, S.Kom'})</strong></p>
                    <p style="font-size: 0.78rem; color: #555;">NIP. 197504042000031004</p>
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

    // 13. Toast Notification Helper
    function showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'circle-check' : type === 'danger' ? 'circle-xmark' : type === 'warning' ? 'triangle-exclamation' : 'circle-info'}"></i> ${message}`;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            toast.style.transition = 'all 0.25s ease';
            setTimeout(() => toast.remove(), 250);
        }, 3500);
    }
    window.showToast = showToast;

    // Initial Execution
    populateWizardRoomSelect();
    populateEquipmentCheckboxes();
    renderRoomCards();
    renderTimetable();
    renderSchedulesAndAdmin();
});
