/**
 * DEDICATED SARPRAS ADMIN SUITE — PEMANGAN SMKN 1 JAKARTA
 * Standard: Clean Management Controls, Error-Free Action Handlers
 */

class SarprasAdminController {
    constructor() {
        this.filterStatus = 'all';
        this.searchQuery = '';
        this.activeTab = 'bookings';
        this.init();
    }

    init() {
        // Tab Switchers
        document.querySelectorAll('.adm-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.adm-tab-btn').forEach(b => {
                    b.className = 'adm-tab-btn px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800';
                });
                btn.className = 'adm-tab-btn active px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white shadow-sm';
                
                const tab = btn.dataset.tab;
                this.activeTab = tab;

                const paneBookings = document.getElementById('admTabPaneBookings');
                const paneRooms = document.getElementById('admTabPaneRooms');

                if (tab === 'bookings') {
                    paneBookings?.classList.remove('hidden');
                    paneRooms?.classList.add('hidden');
                } else {
                    paneRooms?.classList.remove('hidden');
                    paneBookings?.classList.add('hidden');
                    this.renderRoomsGrid();
                }

                if (window.lucide) window.lucide.createIcons();
            });
        });

        // Filter Pills
        document.querySelectorAll('.adm-filter-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                document.querySelectorAll('.adm-filter-pill').forEach(p => {
                    p.className = 'adm-filter-pill px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800';
                });
                pill.className = 'adm-filter-pill active px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900';
                this.filterStatus = pill.dataset.filter;
                this.renderBookingsTable();
            });
        });

        // Search Input
        document.getElementById('admSearchInput')?.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            this.renderBookingsTable();
        });

        // Export CSV
        document.getElementById('btnAdminExportCSV')?.addEventListener('click', () => {
            const csv = window.Store.exportCSV();
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Laporan_Sarpras_SMKN1_${new Date().toISOString().slice(0,10)}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showToast('Laporan CSV berhasil diunduh.', 'success');
        });

        // Reset Demo Data
        document.getElementById('btnAdminResetDemo')?.addEventListener('click', () => {
            if (confirm('Kembalikan seluruh data peminjaman ke data awal sekolah?')) {
                window.Store.resetDefaults();
                showToast('Data demo berhasil direset.', 'info');
                this.render();
            }
        });
    }

    render() {
        const currentUser = window.Store.getCurrentUser();
        if (currentUser) {
            const headerTitle = document.getElementById('adminHeaderTitle');
            const headerSub = document.getElementById('adminHeaderSub');
            if (headerTitle) headerTitle.textContent = `Akses: ${currentUser.name}`;
            if (headerSub) headerSub.textContent = `Wewenang: ${currentUser.role === 'admin' ? 'Unit Pengelola Sarpras' : 'Guru Pembimbing Kejuruan'}`;
        }

        this.renderKPIs();
        if (this.activeTab === 'bookings') {
            this.renderBookingsTable();
        } else {
            this.renderRoomsGrid();
        }
    }

    renderKPIs() {
        const an = window.Store.getAnalytics();
        const kpiTotal = document.getElementById('admKpiTotal');
        const kpiPending = document.getElementById('admKpiPending');
        const kpiApproved = document.getElementById('admKpiApproved');
        const kpiTopRoom = document.getElementById('admKpiTopRoom');

        if (kpiTotal) kpiTotal.textContent = `${an.total}`;
        if (kpiPending) kpiPending.textContent = `${an.pending}`;
        if (kpiApproved) kpiApproved.textContent = `${an.approved}`;
        if (kpiTopRoom) kpiTopRoom.textContent = an.topRoomName;
    }

    renderBookingsTable() {
        const tbody = document.getElementById('admBookingsTableBody');
        if (!tbody) return;

        const bookings = window.Store.getBookings();
        let list = bookings;

        if (this.filterStatus !== 'all') {
            list = list.filter(b => b.status === this.filterStatus);
        }

        if (this.searchQuery) {
            list = list.filter(b => 
                b.id.toLowerCase().includes(this.searchQuery) ||
                b.userName.toLowerCase().includes(this.searchQuery) ||
                b.roomName.toLowerCase().includes(this.searchQuery) ||
                (b.userClass && b.userClass.toLowerCase().includes(this.searchQuery))
            );
        }

        if (list.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="p-8 text-center text-xs text-slate-500">
                        Tidak ada permohonan dalam kategori ini.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = list.map(b => {
            const isApproved = b.status === 'approved';
            const isPending = b.status === 'pending';
            const badgeBg = isApproved ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800' : isPending ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800' : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800';
            const badgeText = isApproved ? 'Disetujui' : isPending ? 'Perlu Review' : 'Ditolak';

            const sFmt = new Date(b.startDateTime).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' });
            const eFmt = new Date(b.endDateTime).toLocaleString('id-ID', { timeStyle: 'short' });

            return `
                <tr class="hover:bg-slate-50/75 dark:hover:bg-slate-800/40 transition-colors">
                    <td class="p-3.5 font-mono text-xs font-bold text-slate-900 dark:text-white">${b.id}</td>
                    <td class="p-3.5">
                        <strong class="block text-slate-800 dark:text-slate-200">${b.userName}</strong>
                        <span class="text-[11px] text-slate-500">${b.userClass || b.userRole} • ${b.userContact || '-'}</span>
                    </td>
                    <td class="p-3.5">
                        <strong class="block text-slate-800 dark:text-slate-200">${b.roomName}</strong>
                        <span class="text-[11px] text-slate-500">Alat: ${b.equipment && b.equipment.length > 0 ? b.equipment.slice(0, 2).join(', ') : 'Standar'}</span>
                    </td>
                    <td class="p-3.5 text-slate-600 dark:text-slate-400">
                        ${sFmt} - ${eFmt} WIB
                    </td>
                    <td class="p-3.5">
                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badgeBg}">${badgeText}</span>
                    </td>
                    <td class="p-3.5 text-right">
                        <div class="flex items-center justify-end gap-1">
                            ${isPending ? `
                                <button class="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 shadow-sm transition-all" onclick="window.AdminSuite.approveBooking('${b.id}')">
                                    <i data-lucide="check" class="w-3 h-3"></i> Setujui
                                </button>
                                <button class="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1 shadow-sm transition-all" onclick="window.AdminSuite.rejectBooking('${b.id}')">
                                    <i data-lucide="x" class="w-3 h-3"></i> Tolak
                                </button>
                            ` : ''}
                            <button class="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors" title="Lihat Surat Izin" onclick="openSlipModal('${b.id}')">
                                <i data-lucide="file-text" class="w-3.5 h-3.5"></i>
                            </button>
                            <button class="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-rose-200 dark:border-rose-800/50 transition-colors" title="Hapus" onclick="window.AdminSuite.deleteBooking('${b.id}')">
                                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        if (window.lucide) window.lucide.createIcons();
    }

    renderRoomsGrid() {
        const grid = document.getElementById('admRoomsGrid');
        if (!grid) return;

        const rooms = window.Store.getRooms();
        grid.innerHTML = rooms.map(r => {
            const isAvail = r.status === 'available';

            return `
                <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                    <div class="flex items-start justify-between gap-2">
                        <div>
                            <h4 class="font-heading font-bold text-xs text-slate-900 dark:text-white">${r.name}</h4>
                            <p class="text-[11px] text-slate-500">${r.building} • Kapasitas ${r.capacity} Orang</p>
                        </div>
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${isAvail ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-600 border border-rose-500/30'}">
                            ${isAvail ? 'Tersedia' : 'Pemeliharaan'}
                        </span>
                    </div>

                    <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span class="text-[11px] text-slate-500">PIC: ${r.pic}</span>
                        <button class="px-3 py-1 rounded-lg text-[11px] font-semibold ${isAvail ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800' : 'bg-emerald-600 text-white'} transition-all" onclick="window.AdminSuite.toggleRoom('${r.id}', '${isAvail ? 'booked' : 'available'}')">
                            ${isAvail ? 'Nonaktifkan' : 'Aktifkan'}
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        if (window.lucide) window.lucide.createIcons();
    }

    approveBooking(bookingId) {
        const user = window.Store.getCurrentUser();
        const approver = user ? user.name : 'Sarpras SMKN 1';
        window.Store.updateBookingStatus(bookingId, 'approved', 'Disetujui resmi oleh Sarpras / Guru Pendamping SMKN 1 Jakarta.', approver);
        showToast(`Permohonan ${bookingId} telah disetujui.`, 'success');
        this.render();
    }

    rejectBooking(bookingId) {
        const reason = prompt('Masukkan alasan penolakan: ') || 'Jadwal ruangan dialihkan untuk agenda kedinasan sekolah.';
        const user = window.Store.getCurrentUser();
        const approver = user ? user.name : 'Sarpras SMKN 1';
        window.Store.updateBookingStatus(bookingId, 'rejected', reason, approver);
        showToast(`Permohonan ${bookingId} telah ditolak.`, 'danger');
        this.render();
    }

    deleteBooking(bookingId) {
        if (confirm(`Hapus permohonan ${bookingId} secara permanen?`)) {
            window.Store.deleteBooking(bookingId);
            showToast(`Permohonan ${bookingId} dihapus.`, 'info');
            this.render();
        }
    }

    toggleRoom(roomId, newStatus) {
        window.Store.updateRoomStatus(roomId, newStatus);
        showToast('Status ketersediaan ruangan diperbarui.', 'info');
        this.renderRoomsGrid();
    }
}

window.AdminSuite = new SarprasAdminController();
