import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  PlusCircle, 
  FileText, 
  ShieldCheck, 
  Search,
  CheckCircle2,
  Copy,
  ExternalLink,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { useStorage } from '../context/StorageContext';
import { useAuth } from '../context/AuthContext';
import { UserRole, Booking } from '../types';
import { StepRoomEquipment } from '../components/booking/StepRoomEquipment';
import { StepDateTime } from '../components/booking/StepDateTime';
import { StepIdentity } from '../components/booking/StepIdentity';
import { StepSummary } from '../components/booking/StepSummary';
import { OfficialSlipModal } from '../components/slip/OfficialSlipModal';

export const BookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { rooms, equipment, getRoomById, createBooking, checkConflict } = useStorage();
  const { currentUser } = useAuth();

  // Wizard Step State (1 to 4)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [selectedRoomId, setSelectedRoomId] = useState<string>(() => {
    return searchParams.get('roomId') || rooms[0]?.id || 'r-401';
  });
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [equipmentQuantities, setEquipmentQuantities] = useState<Record<string, number>>({});
  
  const [bookingDate, setBookingDate] = useState<string>(() => {
    return searchParams.get('date') || new Date().toISOString().split('T')[0];
  });

  const [startTime, setStartTime] = useState<string>(() => {
    const h = searchParams.get('hour');
    return h ? `${String(h).padStart(2, '0')}:00` : '07:30';
  });

  const [endTime, setEndTime] = useState<string>(() => {
    const h = searchParams.get('hour');
    return h ? `${String(Number(h) + 2).padStart(2, '0')}:00` : '11:30';
  });

  const [userName, setUserName] = useState<string>(currentUser?.name || 'Arrofi Zein');
  const [userRole, setUserRole] = useState<UserRole>(currentUser?.role || 'siswa');
  const [userClass, setUserClass] = useState<string>(currentUser?.class || 'XI SIJA 1');
  const [userContact, setUserContact] = useState<string>(currentUser?.phone || '081299887766');
  const [supervisorName, setSupervisorName] = useState<string>('Pak Amrul Khairullah, S.Kom');
  const [reason, setReason] = useState<string>('Praktikum & simulasi UKK kejuruan SIJA SMKN 1 Jakarta');
  const [agreedSOP, setAgreedSOP] = useState<boolean>(true);

  // Success & Modal State
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [isSlipModalOpen, setIsSlipModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [copiedTicket, setCopiedTicket] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser) {
      setUserName(currentUser.name || 'Arrofi Zein');
      setUserRole(currentUser.role || 'siswa');
      setUserClass(currentUser.class || 'XI SIJA 1');
      setUserContact(currentUser.phone || '081299887766');
    }
  }, [currentUser]);

  const selectedRoom = getRoomById(selectedRoomId);

  const startISO = `${bookingDate}T${startTime}`;
  const endISO = `${bookingDate}T${endTime}`;
  const hasConflict = checkConflict(selectedRoomId, startISO, endISO);

  const handleToggleEquipment = (eqName: string) => {
    setSelectedEquipment(prev => {
      const exists = prev.includes(eqName);
      if (exists) {
        return prev.filter(e => e !== eqName);
      } else {
        setEquipmentQuantities(q => ({ ...q, [eqName]: q[eqName] || 1 }));
        return [...prev, eqName];
      }
    });
  };

  const handleUpdateEquipmentQuantity = (eqName: string, delta: number) => {
    setEquipmentQuantities(prev => {
      const current = prev[eqName] || 1;
      const next = Math.max(1, Math.min(10, current + delta));
      return { ...prev, [eqName]: next };
    });
  };

  const validateStep = (step: number): boolean => {
    setErrorMessage('');

    if (step === 1) {
      if (!selectedRoomId) {
        setErrorMessage('Silakan pilih salah satu ruangan terlebih dahulu.');
        return false;
      }
    }

    if (step === 2) {
      if (!bookingDate || !startTime || !endTime) {
        setErrorMessage('Silakan lengkapi tanggal, jam mulai, dan jam selesai.');
        return false;
      }
      if (startTime >= endTime) {
        setErrorMessage('Jam selesai harus lebih akhir daripada jam mulai.');
        return false;
      }
      if (hasConflict) {
        setErrorMessage('Ruangan sudah dipesan pada jam tersebut. Silakan pilih waktu lain.');
        return false;
      }
    }

    if (step === 3) {
      const uName = (userName || '').trim();
      const uClass = (userClass || '').trim();
      const uContact = (userContact || '').trim();
      const rsn = (reason || '').trim();

      if (!uName || !uClass || !uContact || !rsn) {
        setErrorMessage('Harap lengkapi semua kolom identitas dan agenda peminjaman.');
        return false;
      }
    }

    if (step === 4) {
      if (!agreedSOP) {
        setErrorMessage('Anda wajib menyetujui ketentuan SOP Sarpras sebelum mengajukan.');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setErrorMessage('');
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fireGrandConfetti = () => {
    try {
      const end = Date.now() + 1.5 * 1000;
      const colors = ['#1e40af', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    } catch (e) {
      console.log('Confetti effect triggered');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    // Build equipment with quantity strings for receipt
    const formattedEquipment = selectedEquipment.map(eq => {
      const qty = equipmentQuantities[eq] || 1;
      return qty > 1 ? `${eq} (${qty} Unit)` : eq;
    });

    const newBooking = createBooking({
      roomId: selectedRoomId,
      roomName: selectedRoom?.name || 'Ruangan SMKN 1',
      userName: userName || 'Arrofi Zein',
      userRole: userRole || 'siswa',
      userClass: userClass || 'XI SIJA 1',
      userContact: userContact || '081299887766',
      supervisorName: supervisorName || 'Pak Amrul Khairullah, S.Kom',
      equipment: formattedEquipment,
      reason: reason || 'Praktikum kejuruan',
      startDateTime: startISO,
      endDateTime: endISO,
    });

    setCreatedBooking(newBooking);
    fireGrandConfetti();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyTicket = (ticketId: string) => {
    navigator.clipboard.writeText(ticketId);
    setCopiedTicket(true);
    setTimeout(() => setCopiedTicket(false), 2000);
  };

  const steps = [
    { num: 1, label: 'Ruangan & Alat' },
    { num: 2, label: 'Waktu & Bentrok' },
    { num: 3, label: 'Identitas & PJ' },
    { num: 4, label: 'Review & SOP' },
  ];

  return (
    <div className="py-6 sm:py-10 space-y-8 animate-fadeIn max-w-4xl mx-auto">
      
      {/* Wizard Header */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
          <PlusCircle className="w-4 h-4" />
          <span>Layanan Sarpras Terpadu SMKN 1 Jakarta</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
          Formulir Reservasi Ruangan 4-Langkah
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Ajukan permohonan resmi peminjaman fasilitas sekolah dengan sistem validasi anti-bentrok jadwal otomatis.
        </p>
      </div>

      {/* Success View after Submission */}
      {createdBooking ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-emerald-200 dark:border-emerald-800/80 p-6 sm:p-10 text-center shadow-xl space-y-6 animate-fadeIn">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md ring-4 ring-emerald-50 dark:ring-emerald-900/30">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <Sparkles className="w-3.5 h-3.5" />
              Tersimpan Resmi di Database Sarpras
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
              Permohonan Berhasil Diajukan!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Nomor tiket resmi peminjaman Anda telah diterbitkan. Simpan nomor resi berikut untuk memantau status persetujuan dari petugas Sarpras:
            </p>

            {/* Ticket Code Display */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 max-w-sm mx-auto shadow-inner mt-4">
              <span className="font-mono font-black text-xl text-blue-900 dark:text-blue-300 tracking-wider">
                {createdBooking.id}
              </span>
              <button
                type="button"
                onClick={() => handleCopyTicket(createdBooking.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors shadow-xs"
              >
                {copiedTicket ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTicket ? 'Disalin' : 'Salin'}</span>
              </button>
            </div>
          </div>

          {/* Booking Summary Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto text-left text-xs bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Ruangan</span>
              <span className="font-bold text-slate-900 dark:text-white line-clamp-1">{createdBooking.roomName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Jadwal</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {new Date(createdBooking.startDateTime).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}, {new Date(createdBooking.startDateTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Pemohon</span>
              <span className="font-bold text-slate-900 dark:text-white line-clamp-1">{createdBooking.userName}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={() => setIsSlipModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-900/20 flex items-center gap-2 transition-transform active:scale-95"
            >
              <FileText className="w-4 h-4" />
              <span>Buka & Cetak Surat Izin Resmi</span>
            </button>

            <button
              onClick={() => navigate(`/tracking?ticketId=${createdBooking.id}`)}
              className="px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 shadow-xs transition-transform active:scale-95"
            >
              <Search className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Pantau di Tracking Center</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => {
                setCreatedBooking(null);
                setCurrentStep(1);
                setSelectedEquipment([]);
                setEquipmentQuantities({});
              }}
              className="px-5 py-3 rounded-2xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Buat Reservasi Baru</span>
            </button>
          </div>

          {/* Official Slip Modal */}
          <OfficialSlipModal
            booking={createdBooking}
            isOpen={isSlipModalOpen}
            onClose={() => setIsSlipModalOpen(false)}
          />
        </div>
      ) : (
        /* Multi-Step Wizard Container */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          
          {/* Step Progress Indicators */}
          <div className="grid grid-cols-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 p-3 sm:p-4 text-xs font-semibold">
            {steps.map((s) => {
              const isActive = currentStep === s.num;
              const isPassed = currentStep > s.num;
              return (
                <div
                  key={s.num}
                  className={`flex items-center justify-center gap-2 text-center py-2 px-1 rounded-xl transition-all ${
                    isActive
                      ? 'bg-blue-900 text-white dark:bg-blue-600 shadow-xs'
                      : isPassed
                      ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                      : 'text-slate-400'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center ${
                    isActive
                      ? 'bg-white text-blue-900'
                      : isPassed
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {isPassed ? '✓' : s.num}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
              );
            })}
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
            
            {currentStep === 1 && (
              <StepRoomEquipment
                rooms={rooms}
                equipmentList={equipment}
                selectedRoomId={selectedRoomId}
                onSelectRoom={setSelectedRoomId}
                selectedEquipment={selectedEquipment}
                equipmentQuantities={equipmentQuantities}
                onUpdateEquipmentQuantity={handleUpdateEquipmentQuantity}
                onToggleEquipment={handleToggleEquipment}
              />
            )}

            {currentStep === 2 && (
              <StepDateTime
                selectedRoom={selectedRoom}
                bookingDate={bookingDate}
                onDateChange={setBookingDate}
                startTime={startTime}
                onStartTimeChange={setStartTime}
                endTime={endTime}
                onEndTimeChange={setEndTime}
                hasConflict={hasConflict}
              />
            )}

            {currentStep === 3 && (
              <StepIdentity
                userName={userName}
                onUserNameChange={setUserName}
                userRole={userRole}
                onUserRoleChange={setUserRole}
                userClass={userClass}
                onUserClassChange={setUserClass}
                userContact={userContact}
                onUserContactChange={setUserContact}
                supervisorName={supervisorName}
                onSupervisorNameChange={setSupervisorName}
                reason={reason}
                onReasonChange={setReason}
              />
            )}

            {currentStep === 4 && (
              <StepSummary
                selectedRoom={selectedRoom}
                selectedEquipment={selectedEquipment}
                equipmentQuantities={equipmentQuantities}
                bookingDate={bookingDate}
                startTime={startTime}
                endTime={endTime}
                userName={userName}
                userRole={userRole}
                userClass={userClass}
                userContact={userContact}
                supervisorName={supervisorName}
                reason={reason}
                agreedSOP={agreedSOP}
                onAgreeSOPChange={setAgreedSOP}
              />
            )}

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs font-semibold animate-shake">
                {errorMessage}
              </div>
            )}

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>
              ) : (
                <div />
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-colors"
                >
                  <span>Lanjutkan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-transform active:scale-95"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Kirim Permohonan Resmi</span>
                </button>
              )}
            </div>

          </form>
        </div>
      )}
    </div>
  );
};

