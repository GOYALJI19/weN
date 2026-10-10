import React, { useState } from 'react';
import { Doctor, HealthcarePerson } from '../../core/types/domain';
import { Modal } from '../../core/components/Modal';
import { Video, MapPin, Calendar, Clock, Check, ShieldCheck, User } from 'lucide-react';

interface DoctorBookingModalProps {
  doctor: Doctor | null;
  isOpen: boolean;
  onClose: () => void;
  familyMembers: HealthcarePerson[];
  activePerson: HealthcarePerson;
  onConfirmBooking: (params: {
    doctorId: string;
    personId: string;
    mode: 'In-Person Clinic' | 'Telehealth Video';
    date: string;
    slot: string;
    chiefComplaint: string;
  }) => void;
}

export const DoctorBookingModal: React.FC<DoctorBookingModalProps> = ({
  doctor,
  isOpen,
  onClose,
  familyMembers,
  activePerson,
  onConfirmBooking,
}) => {
  if (!doctor) return null;

  const [step, setStep] = useState<'configure' | 'confirmed'>('configure');
  const [selectedMode, setSelectedMode] = useState<'In-Person Clinic' | 'Telehealth Video'>('In-Person Clinic');
  const [selectedDate, setSelectedDate] = useState('Today, Oct 9');
  const [selectedSlot, setSelectedSlot] = useState('05:30 PM');
  const [selectedPersonId, setSelectedPersonId] = useState(activePerson.id);
  const [chiefComplaint, setChiefComplaint] = useState('Knee pain and joint stiffness during stairs');

  const slotOptions = ['04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM'];

  const handleBooking = () => {
    onConfirmBooking({
      doctorId: doctor.id,
      personId: selectedPersonId,
      mode: selectedMode,
      date: selectedDate,
      slot: selectedSlot,
      chiefComplaint,
    });
    setStep('confirmed');
  };

  const handleDone = () => {
    setStep('configure');
    onClose();
  };

  const chosenPerson = familyMembers.find(p => p.id === selectedPersonId) || activePerson;

  return (
    <Modal
      isOpen={isOpen}
      onClose={step === 'confirmed' ? handleDone : onClose}
      title={step === 'configure' ? "Book Consultation" : "Appointment Confirmed"}
      subtitle={step === 'configure' ? doctor.fullName : "Added to your active Care Journey"}
      maxWidth="md"
    >
      {step === 'configure' ? (
        <div className="space-y-5 text-[#14382E]">
          {/* Doctor Brief with Arch Mask */}
          <div className="p-4 rounded-2xl bg-[#EDE7F2] border border-[#CFC9E8] flex items-center gap-3.5">
            <div className="w-14 h-16 shape-arch overflow-hidden bg-white shrink-0 border border-[#E2DCD0]">
              <img 
                src={doctor.avatarUrl} 
                alt={doctor.fullName} 
                className="w-full h-full object-cover object-top" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 
                className="text-base text-[#14382E] font-medium truncate"
                style={{ fontFamily: "'Newsreader', Georgia, serif" }}
              >
                {doctor.fullName}
              </h3>
              <p className="text-xs text-[#71827A]">
                {doctor.specialty} · {doctor.clinicHospitalAffiliation}
              </p>
              <div className="mt-1 text-xs font-bold text-[#14382E]">
                ₹{doctor.consultationFee} <span className="text-[11px] font-normal text-[#71827A]">· Consultation Fee</span>
              </div>
            </div>
          </div>

          {/* Consultation Mode Toggle */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#14382E]">Consultation Mode</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedMode('In-Person Clinic')}
                className={`p-3 rounded-2xl border text-xs font-medium transition cursor-pointer flex items-center justify-center gap-2 ${
                  selectedMode === 'In-Person Clinic'
                    ? 'bg-[#14382E] text-white border-[#14382E]'
                    : 'bg-white text-[#14382E] border-[#E2DCD0] hover:bg-[#FAF7F2]'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>In-Person Clinic</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMode('Telehealth Video')}
                className={`p-3 rounded-2xl border text-xs font-medium transition cursor-pointer flex items-center justify-center gap-2 ${
                  selectedMode === 'Telehealth Video'
                    ? 'bg-[#14382E] text-white border-[#14382E]'
                    : 'bg-white text-[#14382E] border-[#E2DCD0] hover:bg-[#FAF7F2]'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Video Telehealth</span>
              </button>
            </div>
          </div>

          {/* Time Slot Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#14382E]">Available Time Slots (Today)</label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {slotOptions.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer shrink-0 ${
                    selectedSlot === slot
                      ? 'bg-[#14382E] text-white'
                      : 'bg-white text-[#14382E] border border-[#E2DCD0] hover:bg-[#FAF7F2]'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Patient Context */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#14382E]">Consultation For</label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {familyMembers.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => setSelectedPersonId(member.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer shrink-0 ${
                    selectedPersonId === member.id
                      ? 'bg-[#A94B2F] text-white'
                      : 'bg-white text-[#14382E] border border-[#E2DCD0]'
                  }`}
                >
                  {member.fullName.split(' ')[0]} ({member.relationship})
                </button>
              ))}
            </div>
          </div>

          {/* Reason / Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#14382E]">Chief Complaint</label>
            <input
              type="text"
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              placeholder="e.g. Knee pain, review past lab tests..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2DCD0] text-xs text-[#14382E] bg-white focus:outline-none focus:border-[#14382E]"
            />
          </div>

          {/* Confirm Button */}
          <div className="pt-2 border-t border-[#E2DCD0] flex items-center justify-between">
            <div>
              <span className="text-xs text-[#71827A] block">Total to Pay</span>
              <span className="text-base font-bold text-[#14382E]">₹{doctor.consultationFee}</span>
            </div>

            <button
              type="button"
              onClick={handleBooking}
              className="px-6 py-2.5 rounded-full bg-[#14382E] hover:bg-[#14382E]/90 text-white text-xs font-semibold transition cursor-pointer shadow-2xs"
            >
              Confirm Appointment
            </button>
          </div>
        </div>
      ) : (
        /* Confirmed State */
        <div className="text-center py-6 space-y-4 text-[#14382E]">
          <div className="w-12 h-12 rounded-full bg-[#EDF5EB] border border-[#C4DDBF] text-[#14382E] flex items-center justify-center mx-auto text-xl font-bold">
            ✓
          </div>

          <div className="space-y-1">
            <h3 
              className="text-xl text-[#14382E] font-medium"
              style={{ fontFamily: "'Newsreader', Georgia, serif" }}
            >
              Consultation Scheduled
            </h3>
            <p className="text-xs text-[#71827A] max-w-sm mx-auto">
              {doctor.fullName} on <strong>{selectedDate} at {selectedSlot}</strong> for <strong>{chosenPerson.fullName}</strong>.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#EDE7F2] border border-[#CFC9E8] text-xs text-[#14382E] max-w-sm mx-auto">
            A care thread bead has been created. Prescribed lab tests will link automatically.
          </div>

          <button
            type="button"
            onClick={handleDone}
            className="px-6 py-2.5 rounded-full bg-[#14382E] text-white text-xs font-semibold hover:bg-[#14382E]/90 transition"
          >
            Done
          </button>
        </div>
      )}
    </Modal>
  );
};
