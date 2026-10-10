import React, { useState } from 'react';
import { DiagnosticTest, HealthcarePerson } from '../../core/types/domain';
import { Modal } from '../../core/components/Modal';
import { Home, MapPin, Clock, AlertCircle, Check, ShieldCheck } from 'lucide-react';

interface DiagnosticBookingModalProps {
  test: DiagnosticTest | null;
  isOpen: boolean;
  onClose: () => void;
  familyMembers: HealthcarePerson[];
  activePerson: HealthcarePerson;
  onConfirmBooking: (params: {
    testId: string;
    personId: string;
    collectionMode: 'Home Sample Collection' | 'Diagnostic Centre Visit';
    address: string;
    date: string;
    timeSlot: string;
  }) => void;
}

export const DiagnosticBookingModal: React.FC<DiagnosticBookingModalProps> = ({
  test,
  isOpen,
  onClose,
  familyMembers,
  activePerson,
  onConfirmBooking,
}) => {
  if (!test) return null;

  const [step, setStep] = useState<'configure' | 'confirmed'>('configure');
  const [selectedMode, setSelectedMode] = useState<'Home Sample Collection' | 'Diagnostic Centre Visit'>('Home Sample Collection');
  const [selectedDate, setSelectedDate] = useState('Tomorrow');
  const [selectedSlot, setSelectedSlot] = useState('8:15');
  const [selectedPersonId, setSelectedPersonId] = useState(activePerson.id);
  const [address, setAddress] = useState('Flat 402, Green Glen Layout, Bengaluru');
  const [acknowledgedFasting, setAcknowledgedFasting] = useState(true);

  const slotOptions = ['Tomorrow 7:30', '8:15', '9:00', '9:30'];

  const handleBooking = () => {
    onConfirmBooking({
      testId: test.id,
      personId: selectedPersonId,
      collectionMode: selectedMode,
      address,
      date: selectedDate,
      timeSlot: selectedSlot,
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
      title={step === 'configure' ? test.name : "Collection Reserved"}
      subtitle={step === 'configure' ? `${test.sampleType} test · Report in ${test.turnaroundTime.toLowerCase()}` : "Dispatched to accredited laboratory partner"}
      maxWidth="md"
    >
      {step === 'configure' ? (
        <div className="space-y-5 text-[#14382E]">
          {/* 1. HOW THIS GETS DONE — 4-STEP THREAD (Matching Botanica Page 5) */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#71827A] block">
              How this gets done
            </span>
            <div className="flex items-center justify-between text-xs text-[#14382E]">
              {/* Node 1: Book */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-4 h-4 rounded-full border-2 border-[#A94B2F] bg-white flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#A94B2F]" />
                </div>
                <span className="font-semibold text-[11px]">Book</span>
              </div>

              <div className="flex-1 h-[2px] bg-[#A9B9A0] mx-1" />

              {/* Node 2: Collect */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-3.5 h-3.5 rounded-full border-2 border-dashed border-[#A9B9A0] bg-white" />
                <span className="text-[11px] text-[#71827A]">Collect</span>
              </div>

              <div className="flex-1 border-t-2 border-dashed border-[#A9B9A0]/60 mx-1" />

              {/* Node 3: Sample */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-3.5 h-3.5 rounded-full border-2 border-dashed border-[#A9B9A0] bg-white" />
                <span className="text-[11px] text-[#71827A]">Sample</span>
              </div>

              <div className="flex-1 border-t-2 border-dashed border-[#A9B9A0]/60 mx-1" />

              {/* Node 4: Report */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-3.5 h-3.5 rounded-full border-2 border-dashed border-[#A9B9A0] bg-white" />
                <span className="text-[11px] text-[#71827A]">Report</span>
              </div>
            </div>
          </div>

          {/* 2. BEFORE THE TEST (Fasting Card) */}
          <div className="p-4 rounded-2xl bg-white border border-[#E2DCD0] shadow-2xs space-y-1.5">
            <h4 className="text-xs font-semibold text-[#14382E]">Before the test</h4>
            <p className="text-xs text-[#71827A] leading-relaxed">
              {test.preTestInstructions && test.preTestInstructions.length > 0 
                ? test.preTestInstructions[0]
                : "Fast 10–12 hours. Water is fine. Keep regular medicines unless told otherwise."}
            </p>
          </div>

          {/* 3. ACCREDITED LAB PARTNER */}
          <div className="p-3.5 rounded-2xl bg-[#EDE7F2] border border-[#CFC9E8] flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-[#14382E] block">{test.accreditedLabPartner}</span>
              <span className="text-[#71827A] text-[11px]">Report arrives directly in your Records</span>
            </div>
            <ShieldCheck className="w-4 h-4 text-[#14382E]" />
          </div>

          {/* 4. MODE SELECTOR (Home Collection vs Visit Lab) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#14382E]">Collection Mode</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedMode('Home Sample Collection')}
                className={`p-3 rounded-2xl border text-xs font-medium transition cursor-pointer flex items-center justify-center gap-2 ${
                  selectedMode === 'Home Sample Collection'
                    ? 'bg-[#14382E] text-white border-[#14382E]'
                    : 'bg-white text-[#14382E] border-[#E2DCD0] hover:bg-[#FAF7F2]'
                }`}
              >
                <Check className={`w-3.5 h-3.5 ${selectedMode === 'Home Sample Collection' ? 'text-white' : 'opacity-0'}`} />
                <span>Home collection</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMode('Diagnostic Centre Visit')}
                className={`p-3 rounded-2xl border text-xs font-medium transition cursor-pointer flex items-center justify-center gap-2 ${
                  selectedMode === 'Diagnostic Centre Visit'
                    ? 'bg-[#14382E] text-white border-[#14382E]'
                    : 'bg-white text-[#14382E] border-[#E2DCD0] hover:bg-[#FAF7F2]'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Visit lab</span>
              </button>
            </div>
          </div>

          {/* 5. TIME SLOT PILLS (Matching Page 5 Tomorrow 7:30 · 8:15 · 9:00) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#14382E]">Fasting Pickup Time</label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {slotOptions.map((slot) => {
                const isSelected = selectedSlot === slot || (slot === '8:15' && selectedSlot === '8:15');
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`px-3.5 py-2 rounded-full text-xs font-medium transition cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-[#14382E] text-white shadow-2xs'
                        : 'bg-white text-[#14382E] border border-[#E2DCD0] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. PATIENT CONTEXT */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#14382E]">Sample For</label>
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

          {/* Address input if Home Collection */}
          {selectedMode === 'Home Sample Collection' && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#14382E]">Pickup Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E2DCD0] text-xs text-[#14382E] bg-white focus:outline-none focus:border-[#14382E]"
              />
            </div>
          )}

          {/* 7. BOTTOM STICKY BAR (Matching Page 5 ₹649 Home collection included Book collection) */}
          <div className="pt-3 border-t border-[#E2DCD0] flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-[#14382E] tabular-nums">
                  ₹{test.price}
                </span>
                {test.originalPrice && (
                  <span className="text-xs text-[#71827A] line-through tabular-nums">
                    ₹{test.originalPrice}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-[#A94B2F] font-medium block">
                Home collection included · No hidden visit charge
              </span>
            </div>

            <button
              type="button"
              onClick={handleBooking}
              className="px-6 py-2.5 rounded-full bg-[#14382E] hover:bg-[#14382E]/90 text-white text-xs font-semibold transition cursor-pointer shadow-2xs active:scale-95"
            >
              Book collection
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
              Sample Collection Booked
            </h3>
            <p className="text-xs text-[#71827A] max-w-sm mx-auto">
              {test.name} for <strong>{chosenPerson.fullName}</strong>. Phlebotomist will arrive on <strong>{selectedDate} around {selectedSlot}</strong>.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#EDE7F2] border border-[#CFC9E8] text-xs text-[#14382E] max-w-sm mx-auto">
            Remember: Fast 10–12 hours prior to collection. Plain water is permitted.
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
