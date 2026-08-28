/**
 * PUBLIC & SISWA PORTAL CONTROLLER — PEMANGAN SMKN 1 JAKARTA
 * Standard: Clean Single Page Architecture & Instant Reactive Rendering
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 2. Dual-View Routing State
    window.switchView = function(viewName) {
        const portalView = document.getElementById('view-portal');
        const adminView = document.getElementById('view-admin');

        if (viewName === 'admin') {
            const currentUser = window.Store.getCurrentUser();
            if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'guru')) {
                showToast('Akses khusus Guru Pembimbing atau Admin Sarpras.', 'warning');
                return;
            }
            if (portalView) portalView.classList.add('hidden');
            if (adminView) adminView.classList.remove('hidden');
            if (window.AdminSuite) window.AdminSuite.render();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            if (adminView) adminView.classList.add('hidden');
            if (portalView) portalView.classList.remove('hidden');
        }

        if (window.lucide) window.lucide.createIcons();
    };

    // 3. Theme Manager
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const storedTheme = localStorage.getItem('pemangan_theme') || 'light';
    
    if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('pemangan_theme', isDark ? 'dark' : 'light');
            if (window.lucide) window.lucide.createIcons();
        });
    }

    // 4. Mobile Drawer Manager
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const closeDrawerBtn = document.getElementById('closeDrawerBtn');

    window.closeMobileDrawer = function() {
        if (mobileDrawer) mobileDrawer.classList.add('hidden');
    };

    if (mobileMenuBtn && mobileDrawer) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileDrawer.classList.remove('hidden');
            if (window.lucide) window.lucide.createIcons();
        });
    }

    if (closeDrawerBtn && mobileDrawer) {
        closeDrawerBtn.addEventListener('click', closeMobileDrawer);
    }

    if (mobileDrawer) {
        mobileDrawer.addEventListener('click', (e) => {
            if (e.target === mobileDrawer) closeMobileDrawer();
        });
    }

    // 5. User Session & Auth Synchronization
    const userNavSlot = document.getElementById('userNavSlot');
    const navAdminSuiteBtn = document.getElementById('navAdminSuiteBtn');
    const drawerUserCard = document.getElementById('drawerUserCard');
    const drawerAvatar = document.getElementById('drawerAvatar');
    const drawerUserName = document.getElementById('drawerUserName');
    const drawerUserRole = document.getElementById('drawerUserRole');
    const drawerLogoutBtn = document.getElementById('drawerLogoutBtn');
    const drawerAdminBtn = document.getElementById('drawerAdminBtn');

    function syncUserSession() {
        const user = window.Store.getCurrentUser();

        if (user) {
            const initial = (user.name || 'U').charAt(0).toUpperCase();
            
            // Header Slot
            if (userNavSlot) {
                userNavSlot.innerHTML = `
                    <div class="flex items-center gap-2 p-1 pl-2 pr-3 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
                        <div class="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-[11px]">${initial}</div>
                        <span class="truncate max-w-[100px] text-slate-800 dark:text-slate-200">${user.name.split(' ')[0]}</span>
                        <button id="headerLogoutBtn" class="text-slate-400 hover:text-rose-500 transition-colors ml-1" title="Keluar">
                            <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
                        </button>
                    </div>
                `;

                document.getElementById('headerLogoutBtn')?.addEventListener('click', () => {
                    window.Store.logout();
                    showToast('Berhasil keluar dari akun.', 'info');
                    setTimeout(() => window.location.reload(), 300);
                });
            }

            // Mobile Drawer Card
            if (drawerUserCard) {
                drawerUserCard.classList.remove('hidden');
                if (drawerAvatar) drawerAvatar.textContent = initial;
                if (drawerUserName) drawerUserName.textContent = user.name;
                if (drawerUserRole) drawerUserRole.textContent = `${user.role.toUpperCase()} (${user.class || 'SMKN 1'})`;
                
                drawerLogoutBtn?.addEventListener('click', () => {
                    window.Store.logout();
                    showToast('Berhasil keluar dari akun.', 'info');
                    setTimeout(() => window.location.reload(), 300);
                });
            }

            // Admin / Guru Tabs
            if (user.role === 'admin' || user.role === 'guru') {
                if (navAdminSuiteBtn) navAdminSuiteBtn.classList.remove('hidden');
                if (drawerAdminBtn) drawerAdminBtn.classList.remove('hidden');
            }

            // Prefill wizard inputs
            const nameInp = document.getElementById('wzUserName');
            const roleInp = document.getElementById('wzUserRole');
            const classInp = document.getElementById('wzUserClass');
            const contactInp = document.getElementById('wzUserContact');

            if (nameInp) nameInp.value = user.name;
            if (roleInp && user.role) roleInp.value = user.role;
            if (classInp && user.class) classInp.value = user.class;
            if (contactInp && user.phone) contactInp.value = user.phone;
        } else {
            if (navAdminSuiteBtn) navAdminSuiteBtn.classList.add('hidden');
            if (drawerAdminBtn) drawerAdminBtn.classList.add('hidden');
            if (drawerUserCard) drawerUserCard.classList.add('hidden');
        }

        if (window.lucide) window.lucide.createIcons();
    }

    // 6. Hero Quick Interactive Tab Switcher
    window.setHeroTab = function(tabName) {
        const tabSearch = document.getElementById('tabHeroSearch');
        const tabTrack = document.getElementById('tabHeroTrack');
        const panelSearch = document.getElementById('panelHeroSearch');
        const panelTrack = document.getElementById('panelHeroTrack');

        if (tabName === 'search') {
            tabSearch.className = 'flex-1 py-2 text-xs font-bold rounded-lg bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm transition-all';
            tabTrack.className = 'flex-1 py-2 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 transition-all';
            panelSearch.classList.remove('hidden');
            panelTrack.classList.add('hidden');
        } else {
            tabTrack.className = 'flex-1 py-2 text-xs font-bold rounded-lg bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm transition-all';
            tabSearch.className = 'flex-1 py-2 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 transition-all';
            panelTrack.classList.remove('hidden');
            panelSearch.classList.add('hidden');
        }
        if (window.lucide) window.lucide.createIcons();
    };

    document.getElementById('btnHeroSearchExecute')?.addEventListener('click', () => {
        const query = document.getElementById('heroSearchInput')?.value || '';
        const cat = document.getElementById('heroCategorySelect')?.value || 'ALL';

        const catalogSearchInput = document.getElementById('catalogSearchInput');
        if (catalogSearchInput) catalogSearchInput.value = query;

        currentCatalogCat = cat;
        currentCatalogQuery = query;

        document.querySelectorAll('.cat-pill').forEach(p => {
            if (p.dataset.cat === cat) {
                p.className = 'cat-pill active px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-brand-600 text-white shadow-sm transition-all';
            } else {
                p.className = 'cat-pill px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 transition-all';
            }
        });

        renderRoomCatalog();

        const roomsEl = document.getElementById('rooms');
        if (roomsEl) roomsEl.scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('btnHeroTrackExecute')?.addEventListener('click', () => {
        const code = document.getElementById('heroTrackCode')?.value.trim();
        const resBox = document.getElementById('heroTrackResultBox');
        if (!code) {
            showToast('Ketikkan nomor tiket peminjaman.', 'warning');
            return;
        }

        const b = window.Store.getBookingById(code);
        if (resBox) {
            resBox.classList.remove('hidden');
            if (!b) {
                resBox.innerHTML = `<span class="text-rose-600 dark:text-rose-400 font-semibold"><i data-lucide="alert-circle" class="w-3.5 h-3.5 inline"></i> Nomor tiket "${code}" tidak ditemukan.</span>`;
            } else {
                const isApproved = b.status === 'approved';
                const isPending = b.status === 'pending';
                const stBadge = isApproved ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' : isPending ? 'bg-amber-500/10 text-amber-600 border-amber-500/30' : 'bg-rose-500/10 text-rose-600 border-rose-500/30';
                const stText = isApproved ? 'Disetujui' : isPending ? 'Menunggu Review' : 'Ditolak';

                resBox.innerHTML = `
                    <div class="space-y-2">
                        <div class="flex items-center justify-between">
                            <strong>${b.id}</strong>
                            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border ${stBadge}">${stText}</span>
                        </div>
                        <p class="font-medium text-slate-800 dark:text-slate-200">${b.roomName}</p>
                        <p class="text-slate-500 text-[11px]">Pemohon: ${b.userName} (${b.userClass || '-'})</p>
                        <button class="w-full mt-2 py-1.5 rounded-lg bg-brand-600 text-white font-semibold text-[11px] flex items-center justify-center gap-1" onclick="openSlipModal('${b.id}')">
                            <i data-lucide="file-text" class="w-3.5 h-3.5"></i> Lihat Surat Izin Resmi
                        </button>
                    </div>
                `;
            }
            if (window.lucide) window.lucide.createIcons();
        }
    });

    // 7. Room Catalog Renderer
    let currentCatalogCat = 'ALL';
    let currentCatalogQuery = '';
    const roomCardsContainer = document.getElementById('roomCardsContainer');
    const wzRoomSelect = document.getElementById('wzRoomSelect');

    function renderRoomCatalog() {
        const rooms = window.Store.getRooms();
        
        // Update Hero Stat Counter
        const statHeroRooms = document.getElementById('statHeroRooms');
        if (statHeroRooms) statHeroRooms.textContent = `${rooms.length}`;

        // Populate Wizard Room Dropdown
        if (wzRoomSelect) {
            const currentVal = wzRoomSelect.value;
            wzRoomSelect.innerHTML = '<option value="" disabled selected>-- Pilih Ruangan / Lab --</option>' +
                rooms.map(r => `<option value="${r.id}" ${r.id === currentVal ? 'selected' : ''}>${r.name} (${r.building})</option>`).join('');
        }

        const filtered = rooms.filter(r => {
            const matchCat = currentCatalogCat === 'ALL' ||
                r.category.toLowerCase().includes(currentCatalogCat.toLowerCase()) ||
                r.type.toLowerCase().includes(currentCatalogCat.toLowerCase());
            
            const matchQuery = r.name.toLowerCase().includes(currentCatalogQuery.toLowerCase()) ||
                r.building.toLowerCase().includes(currentCatalogQuery.toLowerCase()) ||
                r.pic.toLowerCase().includes(currentCatalogQuery.toLowerCase()) ||
                r.facilities.some(f => f.toLowerCase().includes(currentCatalogQuery.toLowerCase()));

            return matchCat && matchQuery;
        });

        if (!roomCardsContainer) return;

        if (filtered.length === 0) {
            roomCardsContainer.innerHTML = `
                <div class="col-span-full py-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <i data-lucide="door-closed" class="w-8 h-8 mx-auto text-slate-400 mb-2"></i>
                    <h4 class="font-heading font-bold text-sm text-slate-800 dark:text-slate-200">Tidak ada ruangan yang sesuai</h4>
                    <p class="text-xs text-slate-500">Coba ganti kata kunci pencarian atau pilih filter "Semua".</p>
                </div>
            `;
            if (window.lucide) window.lucide.createIcons();
            return;
        }

        roomCardsContainer.innerHTML = filtered.map(r => {
            const isAvail = r.status === 'available';
            const badgeBg = isAvail ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white';
            const badgeText = isAvail ? 'Tersedia' : 'Digunakan';

            const facPills = r.facilities.slice(0, 3).map(f => `<span class="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">${f}</span>`).join('');
            const moreFac = r.facilities.length > 3 ? `<span class="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">+${r.facilities.length - 3}</span>` : '';

            return `
                <div class="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-brand-500/50 transition-all duration-200 overflow-hidden flex flex-col">
                    <div class="relative h-44 w-full bg-slate-800 overflow-hidden">
                        <img src="${r.image}" alt="${r.name}" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                        <span class="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-900/80 backdrop-blur-md text-white border border-white/10">
                            ${r.type}
                        </span>
                        <span class="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-bold ${badgeBg} shadow-sm">
                            ● ${badgeText}
                        </span>
                    </div>

                    <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div class="space-y-2">
                            <div class="flex items-center gap-2 text-[11px] text-slate-500">
                                <span class="flex items-center gap-1"><i data-lucide="map-pin" class="w-3 h-3 text-brand-500"></i> ${r.building}</span>
                                <span>•</span>
                                <span class="flex items-center gap-1"><i data-lucide="users" class="w-3 h-3 text-brand-500"></i> ${r.capacity} Orang</span>
                            </div>

                            <h3 class="font-heading font-bold text-base text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors leading-snug">
                                ${r.name}
                            </h3>

                            <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                ${r.description}
                            </p>

                            <div class="flex flex-wrap gap-1.5 pt-1">
                                ${facPills}
                                ${moreFac}
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                            <button class="w-full py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-all flex items-center justify-center gap-1" onclick="openRoomDetailModal('${r.id}')">
                                <i data-lucide="info" class="w-3.5 h-3.5"></i> Detail
                            </button>
                            <button class="w-full py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white transition-all flex items-center justify-center gap-1 shadow-sm" onclick="selectRoomForBooking('${r.id}')">
                                <i data-lucide="calendar-plus" class="w-3.5 h-3.5"></i> Pinjam
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        if (window.lucide) window.lucide.createIcons();
    }

    // Category pills listener
    document.querySelectorAll('.cat-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            document.querySelectorAll('.cat-pill').forEach(p => {
                p.className = 'cat-pill px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 transition-all';
            });
            pill.className = 'cat-pill active px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-brand-600 text-white shadow-sm transition-all';
            currentCatalogCat = pill.dataset.cat;
            renderRoomCatalog();
        });
    });

    document.getElementById('catalogSearchInput')?.addEventListener('input', (e) => {
        currentCatalogQuery = e.target.value;
        renderRoomCatalog();
    });

    // 8. Visual Timetable Matrix
    const timetableDateInput = document.getElementById('timetableDateInput');
    const timetableTable = document.getElementById('timetableTable');
    const todayISO = new Date().toISOString().slice(0, 10);

    if (timetableDateInput) {
        timetableDateInput.value = todayISO;
        timetableDateInput.addEventListener('change', renderTimetable);
    }

    function renderTimetable() {
        if (!timetableTable) return;
        const selectedDate = timetableDateInput ? timetableDateInput.value : todayISO;
        const matrix = window.Store.getHourlyMatrix(selectedDate);
        const hours = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

        let html = `
            <thead>
                <tr class="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <th class="p-3 sticky left-0 z-20 bg-slate-50 dark:bg-slate-900 min-w-[180px] shadow-[2px_0_5px_rgba(0,0,0,0.05)]">Ruangan & Lab</th>
                    ${hours.map(h => `<th class="p-3 text-center min-w-[64px]">${String(h).padStart(2, '0')}:00</th>`).join('')}
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
        `;

        matrix.forEach(row => {
            html += `
                <tr class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td class="p-3 sticky left-0 z-10 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 shadow-[3px_0_6px_rgba(0,0,0,0.03)]">
                        <strong class="text-slate-900 dark:text-slate-100 font-bold block leading-snug text-xs">${row.room.name}</strong>
                        <span class="text-[10px] text-slate-500 font-medium">${row.room.building}</span>
                    </td>
                    ${row.slots.map(s => {
                        if (s.isBooked && s.booking) {
                            const isPending = s.booking.status === 'pending';
                            const cellBg = isPending ? 'bg-amber-100/90 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700/60' : 'bg-rose-100/90 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700/60';
                            const cellLabel = isPending ? 'Review' : 'Dipakai';
                            const titleInfo = `${s.booking.roomName}\nPemohon: ${s.booking.userName} (${s.booking.userClass})\nAgenda: ${s.booking.reason}`;
                            return `
                                <td class="p-1.5 text-center">
                                    <div class="py-1 px-1.5 rounded-lg text-[10px] font-bold border ${cellBg} cursor-help transition-transform hover:scale-105" title="${titleInfo}">
                                        ${cellLabel}
                                    </div>
                                </td>
                            `;
                        } else {
                            return `
                                <td class="p-1.5 text-center">
                                    <div class="py-1 px-1.5 rounded-lg text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100/60 transition-colors" title="Slot kosong siap dipinjam">
                                        Kosong
                                    </div>
                                </td>
                            `;
                        }
                    }).join('')}
                </tr>
            `;
        });

        html += `</tbody>`;
        timetableTable.innerHTML = html;
    }

    // 9. 4-Step Booking Wizard Controller
    let wzCurrentStep = 1;
    const wzEquipmentList = document.getElementById('wzEquipmentList');

    function populateEquipmentCheckboxes() {
        if (!wzEquipmentList) return;
        const options = window.Store.getEquipmentOptions();
        wzEquipmentList.innerHTML = options.map(eq => `
            <label class="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-brand-500 transition-colors">
                <input type="checkbox" name="wzEquipmentAddons" value="${eq.name}" class="rounded text-brand-600 focus:ring-brand-500">
                <span class="text-slate-700 dark:text-slate-300 font-medium">${eq.name}</span>
            </label>
        `).join('');
    }

    function setWizardStep(step) {
        wzCurrentStep = step;

        // Step Panes
        for (let i = 1; i <= 4; i++) {
            const pane = document.getElementById(`wizardStepPane${i}`);
            if (pane) {
                if (i === step) pane.classList.remove('hidden');
                else pane.classList.add('hidden');
            }
        }

        // Stepper Nodes
        document.querySelectorAll('#wizardStepperHeader .step-node').forEach(node => {
            const nodeStep = parseInt(node.dataset.step, 10);
            const circle = node.querySelector('div');
            const label = node.querySelector('span');

            if (nodeStep === step) {
                circle.className = 'w-8 h-8 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center shadow-md';
                label.className = 'text-[11px] font-bold text-brand-600 dark:text-brand-400';
            } else if (nodeStep < step) {
                circle.className = 'w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-sm';
                label.className = 'text-[11px] font-semibold text-emerald-600 dark:text-emerald-400';
            } else {
                circle.className = 'w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-xs flex items-center justify-center';
                label.className = 'text-[11px] font-semibold text-slate-500';
            }
        });

        if (window.lucide) window.lucide.createIcons();
    }

    // Step 1 -> 2
    document.getElementById('btnWzNext1')?.addEventListener('click', () => {
        const roomVal = wzRoomSelect?.value;
        if (!roomVal) {
            showToast('Silakan pilih ruangan sasaran terlebih dahulu.', 'warning');
            return;
        }
        setWizardStep(2);
    });

    // Step 2 -> 1
    document.getElementById('btnWzPrev2')?.addEventListener('click', () => setWizardStep(1));

    // Live Conflict Checker in Step 2
    const wzStartTime = document.getElementById('wzStartTime');
    const wzEndTime = document.getElementById('wzEndTime');
    const wzConflictBanner = document.getElementById('wzConflictBanner');

    function checkLiveConflict() {
        if (!wzStartTime || !wzEndTime || !wzConflictBanner) return;
        const sVal = wzStartTime.value;
        const eVal = wzEndTime.value;
        const roomId = wzRoomSelect?.value;

        if (!sVal || !eVal || !roomId) {
            wzConflictBanner.classList.add('hidden');
            return;
        }

        if (new Date(sVal) >= new Date(eVal)) {
            wzConflictBanner.classList.remove('hidden');
            wzConflictBanner.className = 'p-3 rounded-xl text-xs flex items-center gap-2 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800';
            wzConflictBanner.innerHTML = `<i data-lucide="alert-circle" class="w-4 h-4"></i> <span>Waktu selesai harus lebih akhir dari waktu mulai.</span>`;
            if (window.lucide) window.lucide.createIcons();
            return;
        }

        const isConflict = window.Store.checkConflict(roomId, sVal, eVal);
        wzConflictBanner.classList.remove('hidden');

        if (isConflict) {
            wzConflictBanner.className = 'p-3 rounded-xl text-xs flex items-center gap-2 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800';
            wzConflictBanner.innerHTML = `<i data-lucide="x-circle" class="w-4 h-4 text-rose-500"></i> <span>Jadwal bentrok dengan peminjaman lain. Silakan ubah jam atau ruangan.</span>`;
        } else {
            wzConflictBanner.className = 'p-3 rounded-xl text-xs flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800';
            wzConflictBanner.innerHTML = `<i data-lucide="check-circle" class="w-4 h-4 text-emerald-500"></i> <span>Jadwal tersedia & bebas dari bentrok permohonan lain.</span>`;
        }
        if (window.lucide) window.lucide.createIcons();
    }

    wzStartTime?.addEventListener('input', checkLiveConflict);
    wzEndTime?.addEventListener('input', checkLiveConflict);

    // Step 2 -> 3
    document.getElementById('btnWzNext2')?.addEventListener('click', () => {
        const sVal = wzStartTime?.value;
        const eVal = wzEndTime?.value;
        const roomId = wzRoomSelect?.value;

        if (!sVal || !eVal) {
            showToast('Lengkapi waktu mulai dan selesai.', 'warning');
            return;
        }

        if (new Date(sVal) >= new Date(eVal)) {
            showToast('Waktu selesai harus lebih akhir dari waktu mulai.', 'warning');
            return;
        }

        if (window.Store.checkConflict(roomId, sVal, eVal)) {
            showToast('Ruangan sudah terisi pada jam tersebut. Silakan ubah jadwal.', 'danger');
            return;
        }

        setWizardStep(3);
    });

    // Step 3 -> 2
    document.getElementById('btnWzPrev3')?.addEventListener('click', () => setWizardStep(2));

    // Step 3 -> 4 (Review)
    document.getElementById('btnWzNext3')?.addEventListener('click', () => {
        const name = document.getElementById('wzUserName')?.value.trim();
        const userClass = document.getElementById('wzUserClass')?.value.trim();
        const contact = document.getElementById('wzUserContact')?.value.trim();
        const supervisor = document.getElementById('wzSupervisor')?.value.trim();
        const reason = document.getElementById('wzReason')?.value.trim();

        if (!name || !userClass || !contact || !supervisor || !reason) {
            showToast('Lengkapi semua kolom formulir bertanda bintang (*).', 'warning');
            return;
        }

        const room = window.Store.getRoomById(wzRoomSelect.value);
        const selectedEquip = Array.from(document.querySelectorAll('input[name="wzEquipmentAddons"]:checked')).map(c => c.value);
        const sFmt = new Date(wzStartTime.value).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' });
        const eFmt = new Date(wzEndTime.value).toLocaleString('id-ID', { timeStyle: 'short' });

        const sumBox = document.getElementById('wzSummaryCard');
        if (sumBox) {
            sumBox.innerHTML = `
                <div class="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                    <span class="text-slate-500">Ruangan:</span>
                    <strong>${room?.name}</strong>
                </div>
                <div class="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                    <span class="text-slate-500">Waktu Pelaksanaan:</span>
                    <strong>${sFmt} s.d. ${eFmt} WIB</strong>
                </div>
                <div class="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                    <span class="text-slate-500">Pemohon:</span>
                    <strong>${name} (${userClass})</strong>
                </div>
                <div class="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                    <span class="text-slate-500">Guru Pendamping:</span>
                    <strong>${supervisor}</strong>
                </div>
                <div class="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                    <span class="text-slate-500">Peralatan Tambahan:</span>
                    <span>${selectedEquip.length > 0 ? selectedEquip.join(', ') : 'Standar Ruangan'}</span>
                </div>
                <div class="py-1">
                    <span class="text-slate-500 block mb-0.5">Keperluan:</span>
                    <em class="text-slate-700 dark:text-slate-300">"${reason}"</em>
                </div>
            `;
        }

        setWizardStep(4);
    });

    // Step 4 -> 3
    document.getElementById('btnWzPrev4')?.addEventListener('click', () => setWizardStep(3));

    // Submit Wizard
    const wizardBookingForm = document.getElementById('wizardBookingForm');
    if (wizardBookingForm) {
        wizardBookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const targetRoom = window.Store.getRoomById(wzRoomSelect.value);
            const userName = document.getElementById('wzUserName').value.trim();
            const userRole = document.getElementById('wzUserRole').value;
            const userClass = document.getElementById('wzUserClass').value.trim();
            const userContact = document.getElementById('wzUserContact').value.trim();
            const supervisor = document.getElementById('wzSupervisor').value.trim();
            const reason = document.getElementById('wzReason').value.trim();
            const startVal = wzStartTime.value;
            const endVal = wzEndTime.value;
            const selectedEquip = Array.from(document.querySelectorAll('input[name="wzEquipmentAddons"]:checked')).map(c => c.value);

            if (window.Store.checkConflict(targetRoom.id, startVal, endVal)) {
                showToast('Jadwal bentrok saat diproses. Silakan ubah jam.', 'danger');
                return;
            }

            const currentUser = window.Store.getCurrentUser();
            const isAutoApproved = currentUser && (currentUser.role === 'admin' || currentUser.role === 'guru');

            const newBooking = {
                id: `BK-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
                roomId: targetRoom.id,
                roomName: targetRoom.name,
                userName,
                userRole,
                userClass,
                userContact,
                supervisorName: supervisor,
                equipment: selectedEquip,
                reason,
                startDateTime: startVal,
                endDateTime: endVal,
                status: isAutoApproved ? 'approved' : 'pending',
                createdAt: new Date().toISOString(),
                approvedBy: isAutoApproved ? currentUser.name : '-',
                approvalDate: isAutoApproved ? new Date().toISOString() : '-',
                feedback: isAutoApproved ? 'Disetujui otomatis melalui wewenang guru/sarpras.' : 'Menunggu verifikasi dan paraf petugas Sarpras SMKN 1 Jakarta.'
            };

            window.Store.addBooking(newBooking);
            showToast(`Pengajuan ${newBooking.id} berhasil terkirim!`, 'success');

            // Reset
            wizardBookingForm.reset();
            setWizardStep(1);
            if (wzConflictBanner) wzConflictBanner.classList.add('hidden');
            syncUserSession();
        });
    }

    // Direct Booking Pre-select from Card
    window.selectRoomForBooking = function(roomId) {
        if (wzRoomSelect) {
            wzRoomSelect.value = roomId;
            setWizardStep(2);
            const bookingSec = document.getElementById('booking');
            if (bookingSec) bookingSec.scrollIntoView({ behavior: 'smooth' });
            showToast('Ruangan dipilih. Tentukan waktu peminjaman.', 'info');
        }
    };

    // 10. Active Booking Queue Renderer
    const queueListContainer = document.getElementById('queueListContainer');
    const queueBadgeCount = document.getElementById('queueBadgeCount');

    function renderActiveQueue() {
        const bookings = window.Store.getBookings();
        
        // Hero counter
        const statHeroBookings = document.getElementById('statHeroBookings');
        if (statHeroBookings) statHeroBookings.textContent = `${bookings.length}+`;

        if (queueBadgeCount) queueBadgeCount.textContent = `${bookings.length} Terdata`;

        if (!queueListContainer) return;

        if (bookings.length === 0) {
            queueListContainer.innerHTML = `<p class="text-xs text-slate-500 text-center py-8">Belum ada peminjaman terdata.</p>`;
            return;
        }

        queueListContainer.innerHTML = bookings.map(b => {
            const isApproved = b.status === 'approved';
            const isPending = b.status === 'pending';
            const badgeBg = isApproved ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800' : isPending ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800' : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800';
            const badgeText = isApproved ? 'Disetujui' : isPending ? 'Menunggu' : 'Ditolak';

            const sFmt = new Date(b.startDateTime).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' });
            const eFmt = new Date(b.endDateTime).toLocaleString('id-ID', { timeStyle: 'short' });

            return `
                <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-2 hover:border-brand-500/40 transition-colors">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-1.5">
                            <span class="font-mono text-[10px] font-bold text-slate-500 bg-slate-200/70 dark:bg-slate-700 px-1.5 py-0.5 rounded">${b.id}</span>
                            <strong class="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[140px] sm:max-w-[180px]">${b.roomName}</strong>
                        </div>
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeBg}">${badgeText}</span>
                    </div>

                    <div class="text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5">
                        <div><strong>${b.userName}</strong> (${b.userClass || b.userRole})</div>
                        <div class="flex items-center gap-1 text-slate-500"><i data-lucide="clock" class="w-3 h-3 text-brand-500"></i> ${sFmt} - ${eFmt} WIB</div>
                        <div class="text-slate-500 italic truncate">"${b.reason}"</div>
                    </div>

                    <div class="flex justify-end pt-1">
                        <button class="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 flex items-center gap-1 transition-all" onclick="openSlipModal('${b.id}')">
                            <i data-lucide="file-text" class="w-3 h-3 text-brand-500"></i> Surat Izin
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        if (window.lucide) window.lucide.createIcons();
    }

    // 11. Direct Ticket Tracking Section
    const directTrackInput = document.getElementById('directTrackInput');
    const directTrackResultCard = document.getElementById('directTrackResultCard');

    document.getElementById('btnDirectTrackExecute')?.addEventListener('click', () => {
        const code = directTrackInput?.value.trim();
        if (!code) {
            showToast('Ketikkan nomor ID tiket.', 'warning');
            return;
        }

        const b = window.Store.getBookingById(code);
        if (directTrackResultCard) {
            directTrackResultCard.classList.remove('hidden');

            if (!b) {
                directTrackResultCard.innerHTML = `
                    <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg text-center space-y-2">
                        <i data-lucide="alert-triangle" class="w-8 h-8 text-rose-500 mx-auto"></i>
                        <h4 class="font-heading font-bold text-sm text-slate-900 dark:text-white">Nomor Tiket Tidak Ditemukan</h4>
                        <p class="text-xs text-slate-500">Periksa kembali format nomor tiket Anda (contoh: BK-2026-001).</p>
                    </div>
                `;
            } else {
                const isApproved = b.status === 'approved';
                const isPending = b.status === 'pending';
                const badgeBg = isApproved ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800' : isPending ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800' : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800';
                const badgeText = isApproved ? 'Disetujui / Izin Terbit' : isPending ? 'Dalam Antrean Verifikasi' : 'Permohonan Ditolak';

                const sFmt = new Date(b.startDateTime).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' });
                const eFmt = new Date(b.endDateTime).toLocaleString('id-ID', { timeStyle: 'short' });

                directTrackResultCard.innerHTML = `
                    <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 text-xs">
                        <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                            <div>
                                <span class="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">Resi Peminjaman</span>
                                <h3 class="font-mono font-bold text-base text-slate-900 dark:text-white">${b.id}</h3>
                            </div>
                            <span class="px-3 py-1 rounded-full text-[11px] font-bold border ${badgeBg}">${badgeText}</span>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700 dark:text-slate-300">
                            <div><span class="text-slate-500 block">Pemohon:</span><strong>${b.userName} (${b.userClass || b.userRole})</strong></div>
                            <div><span class="text-slate-500 block">Ruangan:</span><strong>${b.roomName}</strong></div>
                            <div><span class="text-slate-500 block">Waktu:</span><strong>${sFmt} - ${eFmt} WIB</strong></div>
                            <div><span class="text-slate-500 block">Guru Pendamping:</span><strong>${b.supervisorName || '-'}</strong></div>
                            <div class="col-span-full"><span class="text-slate-500 block">Peralatan Tambahan:</span><span>${b.equipment && b.equipment.length > 0 ? b.equipment.join(', ') : 'Standar'}</span></div>
                        </div>

                        <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                            <span class="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">Catatan Petugas Sarpras:</span>
                            <p class="text-slate-600 dark:text-slate-400 text-[11px]">${b.feedback}</p>
                        </div>

                        <div class="flex justify-end pt-2">
                            <button class="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold flex items-center gap-1.5 shadow-sm transition-all" onclick="openSlipModal('${b.id}')">
                                <i data-lucide="file-text" class="w-4 h-4"></i> Buka Surat Izin Resmi
                            </button>
                        </div>
                    </div>
                `;
            }
            if (window.lucide) window.lucide.createIcons();
        }
    });

    // 12. Room Detail Modal Manager
    const roomDetailModal = document.getElementById('roomDetailModal');
    const modalRoomTitle = document.getElementById('modalRoomTitle');
    const modalRoomBody = document.getElementById('modalRoomBody');

    window.openRoomDetailModal = function(roomId) {
        const r = window.Store.getRoomById(roomId);
        if (!r || !roomDetailModal) return;

        modalRoomTitle.textContent = r.name;
        modalRoomBody.innerHTML = `
            <div class="h-48 rounded-xl overflow-hidden bg-slate-800">
                <img src="${r.image}" alt="${r.name}" class="w-full h-full object-cover">
            </div>

            <div class="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                <div><span class="text-slate-500 block">Gedung / Lokasi:</span><strong>${r.building}</strong></div>
                <div><span class="text-slate-500 block">Kapasitas:</span><strong>${r.capacity} Orang</strong></div>
                <div><span class="text-slate-500 block">Penanggung Jawab (PIC):</span><strong>${r.pic}</strong></div>
                <div><span class="text-slate-500 block">Jam Operasional:</span><strong>${r.operationalHours}</strong></div>
            </div>

            <div class="space-y-1">
                <h4 class="font-bold text-slate-900 dark:text-white">Deskripsi Ruangan:</h4>
                <p class="text-slate-500 leading-relaxed">${r.description}</p>
            </div>

            <div class="space-y-1">
                <h4 class="font-bold text-slate-900 dark:text-white">Fasilitas Terpasang:</h4>
                <ul class="list-disc pl-4 text-slate-500 space-y-0.5">
                    ${r.facilities.map(f => `<li>${f}</li>`).join('')}
                </ul>
            </div>

            <button class="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all" onclick="selectRoomForBooking('${r.id}'); roomDetailModal.classList.add('hidden');">
                <i data-lucide="calendar-plus" class="w-4 h-4"></i> Gunakan Ruangan Ini di Formulir
            </button>
        `;

        roomDetailModal.classList.remove('hidden');
        if (window.lucide) window.lucide.createIcons();
    };

    document.getElementById('closeDetailModalBtn')?.addEventListener('click', () => {
        roomDetailModal.classList.add('hidden');
    });

    if (roomDetailModal) {
        roomDetailModal.addEventListener('click', (e) => {
            if (e.target === roomDetailModal) roomDetailModal.classList.add('hidden');
        });
    }

    // 13. Official Surat Izin 2.0 (Modal & Printable)
    const slipPrintModal = document.getElementById('slipPrintModal');
    const printableSlipContainer = document.getElementById('printableSlipContainer');
    const closeSlipModalBtn = document.getElementById('closeSlipModalBtn');
    const btnPrintExecute = document.getElementById('btnPrintExecute');

    window.openSlipModal = function(bookingId) {
        const b = window.Store.getBookingById(bookingId);
        if (!b || !printableSlipContainer) return;

        const sFmt = new Date(b.startDateTime).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' });
        const eFmt = new Date(b.endDateTime).toLocaleString('id-ID', { timeStyle: 'short' });
        const isApproved = b.status === 'approved';

        printableSlipContainer.innerHTML = `
            <!-- KOP Surat Resmi -->
            <div class="flex items-center gap-4 pb-3 border-b-2 border-slate-950 mb-4 text-center">
                <img src="./img/logo.png" alt="Logo SMKN 1" class="w-16 h-16 object-contain flex-shrink-0">
                <div class="flex-1">
                    <h3 class="text-xs font-bold uppercase tracking-wider text-black">Pemerintah Provinsi Daerah Khusus Ibukota Jakarta</h3>
                    <h3 class="text-xs font-bold uppercase tracking-wider text-black">Dinas Pendidikan</h3>
                    <h2 class="text-base font-extrabold uppercase text-black font-serif">SMK NEGERI 1 JAKARTA</h2>
                    <p class="text-[10px] text-slate-700 font-sans">Jl. Budi Utomo No.7, Pasar Baru, Sawah Besar, Jakarta Pusat 10710 • Telp: (021) 3813630 • info@smkn1jakarta.sch.id</p>
                </div>
            </div>

            <!-- Judul Surat -->
            <div class="text-center mb-4">
                <h3 class="font-bold underline uppercase text-sm font-serif">SURAT IZIN PENGGUNAAN RUANGAN & FASILITAS</h3>
                <p class="text-xs font-sans text-slate-700">Nomor: ${b.id}/SMKN1/SARPRAS/${new Date().getFullYear()}</p>
            </div>

            <p class="mb-3 text-justify text-xs font-sans leading-relaxed">
                Berdasarkan permohonan reservasi sarana yang diajukan melalui sistem informasi <strong>Pemangan</strong>, Unit Pengelola Sarana & Prasarana SMK Negeri 1 Jakarta menerbitkan izin penggunaan fasilitas kepada:
            </p>

            <table class="w-full text-xs font-sans mb-4 border-collapse">
                <tr><td class="py-1 font-semibold w-1/3">Nama Pemohon</td><td class="w-4">:</td><td>${b.userName}</td></tr>
                <tr><td class="py-1 font-semibold">Kelas / Unit Kerja</td><td>:</td><td>${b.userClass || b.userRole}</td></tr>
                <tr><td class="py-1 font-semibold">Nomor Kontak WhatsApp</td><td>:</td><td>${b.userContact || '-'}</td></tr>
                <tr><td class="py-1 font-semibold">Guru Pembimbing / Pendamping</td><td>:</td><td>${b.supervisorName || '-'}</td></tr>
                <tr><td class="py-1 font-semibold">Ruangan / Fasilitas</td><td>:</td><td><strong>${b.roomName}</strong></td></tr>
                <tr><td class="py-1 font-semibold">Peralatan Tambahan</td><td>:</td><td>${b.equipment && b.equipment.length > 0 ? b.equipment.join(', ') : 'Standar'}</td></tr>
                <tr><td class="py-1 font-semibold">Keperluan / Agenda</td><td>:</td><td>${b.reason}</td></tr>
                <tr><td class="py-1 font-semibold">Waktu Pelaksanaan</td><td>:</td><td><strong>${sFmt} s.d. ${eFmt} WIB</strong></td></tr>
                <tr><td class="py-1 font-semibold">Status Persetujuan</td><td>:</td><td><strong class="${isApproved ? 'text-emerald-700' : 'text-amber-700'} uppercase">${isApproved ? 'DISETUJUI (RESMI)' : 'MENUNGGU VERIFIKASI'}</strong></td></tr>
                <tr><td class="py-1 font-semibold">Catatan Ketentuan</td><td>:</td><td>${b.feedback || 'Wajib menjaga ketertiban, kebersihan, dan mematikan AC setelah pemakaian.'}</td></tr>
            </table>

            <!-- Digital QR Code Box -->
            <div class="p-3 rounded-xl bg-slate-50 border border-slate-300 flex items-center gap-3 mb-6 font-sans">
                <div class="w-16 h-16 bg-slate-900 text-white rounded-lg flex items-center justify-center flex-shrink-0 font-bold">
                    <i data-lucide="qr-code" class="w-8 h-8"></i>
                </div>
                <div class="text-[11px] text-slate-700">
                    <strong class="text-slate-900 block font-bold">VERIFIKASI DOKUMEN DIGITAL RESMI SMKN 1 JAKARTA</strong>
                    ID Tiket: <code>${b.id}</code> | Diterbitkan: ${new Date(b.createdAt).toLocaleString('id-ID')}<br>
                    Dokumen ini sah dan diterbitkan secara elektronik oleh Sistem Sarpras Pemangan.
                </div>
            </div>

            <!-- Signature Columns -->
            <div class="grid grid-cols-3 gap-2 text-center text-xs font-sans pt-2">
                <div>
                    <p>Pemohon,</p>
                    <div class="h-12"></div>
                    <p class="font-bold underline">(${b.userName})</p>
                    <p class="text-[10px] text-slate-600">${b.userClass || '-'}</p>
                </div>
                <div>
                    <p>Guru Pendamping,</p>
                    <div class="h-12"></div>
                    <p class="font-bold underline">(${b.supervisorName || 'Pak Amrul Khairullah, S.Kom'})</p>
                    <p class="text-[10px] text-slate-600">NIP. 198001012005011002</p>
                </div>
                <div>
                    <p>Waka Bidang Sarpras,</p>
                    <div class="h-12"></div>
                    <p class="font-bold underline">(${b.approvedBy !== '-' ? b.approvedBy : 'Pak Amrul Khairullah, S.Kom'})</p>
                    <p class="text-[10px] text-slate-600">NIP. 197504042000031004</p>
                </div>
            </div>
        `;

        if (slipPrintModal) slipPrintModal.classList.remove('hidden');
        if (window.lucide) window.lucide.createIcons();
    };

    if (closeSlipModalBtn) {
        closeSlipModalBtn.addEventListener('click', () => slipPrintModal.classList.add('hidden'));
    }

    if (btnPrintExecute) {
        btnPrintExecute.addEventListener('click', () => window.print());
    }

    if (slipPrintModal) {
        slipPrintModal.addEventListener('click', (e) => {
            if (e.target === slipPrintModal) slipPrintModal.classList.add('hidden');
        });
    }

    // 14. Toast System
    window.showToast = function(msg, type = 'info') {
        const root = document.getElementById('toastRoot');
        if (!root) return;

        const toast = document.createElement('div');
        const iconName = type === 'success' ? 'check-circle' : type === 'danger' ? 'alert-octagon' : type === 'warning' ? 'alert-triangle' : 'info';
        const colorClass = type === 'success' ? 'border-emerald-500 text-emerald-950 dark:text-emerald-100 bg-emerald-50 dark:bg-emerald-950' : type === 'danger' ? 'border-rose-500 text-rose-950 dark:text-rose-100 bg-rose-50 dark:bg-rose-950' : type === 'warning' ? 'border-amber-500 text-amber-950 dark:text-amber-100 bg-amber-50 dark:bg-amber-950' : 'border-brand-500 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900';

        toast.className = `pointer-events-auto px-4 py-3 rounded-xl border shadow-xl flex items-center gap-2 text-xs font-semibold max-w-sm transition-all duration-300 ${colorClass}`;
        toast.innerHTML = `<i data-lucide="${iconName}" class="w-4 h-4 flex-shrink-0"></i> <span>${msg}</span>`;

        root.appendChild(toast);
        if (window.lucide) window.lucide.createIcons();

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(8px)';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    };

    // 15. Store Reactivity Subscriptions
    window.Store.subscribe('rooms_updated', () => {
        renderRoomCatalog();
        renderTimetable();
    });

    window.Store.subscribe('bookings_updated', () => {
        renderTimetable();
        renderActiveQueue();
        if (window.AdminSuite) window.AdminSuite.render();
    });

    window.Store.subscribe('auth_changed', () => {
        syncUserSession();
    });

    // Initial Execution
    syncUserSession();
    populateEquipmentCheckboxes();
    renderRoomCatalog();
    renderTimetable();
    renderActiveQueue();
});
