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
  Search
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
  
  const [bookingDate, setBookingDate] = useState<string>(() => {
    return searchParams.get('date') || new Date().toISOString().split('T')[0];
  });

  const [startTime, setStartTime] = useState<string>(() => {
    const h = searchParams.get('hour');
    return h ? `${String(h).padStart(2, '0')}:00` : '08:00';
  });

  const [endTime, setEndTime] = useState<string>(() => {
    const h = searchParams.get('hour');
    return h ? `${String(Number(h) + 2).padStart(2, '0')}:00` : '11:00';
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
    setSelectedEquipment(prev =>
      prev.includes(eqName) ? prev.filter(e => e !== eqName) : [...prev, eqName]
    );
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
    }
  };

  const handlePrev = () => {
    setErrorMessage('');
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    const newBooking = createBooking({
      roomId: selectedRoomId,
      roomName: selectedRoom?.name || 'Ruangan SMKN 1',
      userName: userName || 'Arrofi Zein',
      userRole: userRole || 'siswa',
      userClass: userClass || 'XI SIJA 1',
      userContact: userContact || '081299887766',
      supervisorName: supervisorName || 'Pak Amrul Khairullah, S.Kom',
      equipment: selectedEquipment,
      reason: reason || 'Praktikum kejuruan',
      startDateTime: startISO,
      endDateTime: endISO,
    });

    setCreatedBooking(newBooking);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti effect triggered');
    }
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
          <span>Layanan Sarpras Terpadu</span>
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
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-emerald-200 dark:border-emerald-800 p-8 sm:p-12 text-center shadow-xl space-y-6 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
            <Check className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
              Permohonan Berhasil Diajukan!
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Nomor tiket resmi permohonan Anda telah dicatat ke dalam database Sarpras SMKN 1 Jakarta:
            </p>
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-lg text-blue-900 dark:text-blue-300">
              {createdBooking.id}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <button
              onClick={() => setIsSlipModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-md flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Buka & Cetak Surat Izin Resmi</span>
            </button>

            <button
              onClick={() => navigate(`/tracking?ticketId=${createdBooking.id}`)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Pantau di Tracking Center</span>
            </button>

            <button
              onClick={() => {
                setCreatedBooking(null);
                setCurrentStep(1);
              }}
              className="px-5 py-2.5 rounded-xl text-slate-500 hover:text-slate-700 text-xs font-semibold"
            >
              Buat Reservasi Baru
            </button>
          </div>

          {/* Render Official Slip Modal */}
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
                      ? 'bg-blue-900 text-white shadow-xs'
                      : isPassed
                      ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                      : 'text-slate-400'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center ${
                    isActive ? 'bg-white text-blue-900' : isPassed ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
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
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
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
                  className="px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                >
                  <span>Lanjutkan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/25 flex items-center gap-2"
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
