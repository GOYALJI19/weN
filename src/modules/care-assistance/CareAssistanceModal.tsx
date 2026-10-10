import React, { useState } from 'react';
import { HealthcarePerson, CareAssistanceRequest } from '../../core/types/domain';
import { Modal } from '../../core/components/Modal';
import { Headphones, MapPin, Calendar, Clock, Check, ShieldCheck, Heart } from 'lucide-react';

interface CareAssistanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  familyMembers: HealthcarePerson[];
  activePerson: HealthcarePerson;
  onRequestCare: (params: {
    personId: string;
    serviceType: CareAssistanceRequest['serviceType'];
    destination: string;
    date: string;
    time: string;
    specialNeeds: string[];
    notes: string;
  }) => void;
}

export const CareAssistanceModal: React.FC<CareAssistanceModalProps> = ({
  isOpen,
  onClose,
  familyMembers,
  activePerson,
  onRequestCare,
}) => {
  const [step, setStep] = useState<'configure' | 'confirmed'>('configure');
  const [selectedPersonId, setSelectedPersonId] = useState(activePerson.id);
  const [serviceType, setServiceType] = useState<CareAssistanceRequest['serviceType']>('Accompanied Doctor Visit');
  const [destination, setDestination] = useState('Apollo Clinic, Delhi NCR');
  const [date, setDate] = useState('Tomorrow, Oct 10');
  const [time, setTime] = useState('10:00 AM');
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>(['Wheelchair assistance', 'Doctor notes summary']);
  const [notes, setNotes] = useState('');

  const specialNeedOptions = [
    'Wheelchair assistance & mobility aid',
    'Doctor consultation notes summary',
    'Diagnostic centre queue guidance',
    'Prescription medicine collection support',
  ];

  const toggleNeed = (need: string) => {
    setSelectedNeeds(prev =>
      prev.includes(need) ? prev.filter(n => n !== need) : [...prev, need]
    );
  };

  const handleRequest = () => {
    onRequestCare({
      personId: selectedPersonId,
      serviceType,
      destination,
      date,
      time,
      specialNeeds: selectedNeeds,
      notes: notes || 'Elderly clinic accompaniment required',
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
      title={step === 'configure' ? "Care Assistance Concierge" : "Care Companion Assigned"}
      subtitle={step === 'configure' ? "Non-clinical accompaniment for hospital visits & mobility support" : "Verified companion ready for coordination"}
      maxWidth="md"
    >
      {step === 'configure' ? (
        <div className="space-y-5 text-[#14382E]">
          {/* Mission Note */}
          <div className="p-4 rounded-2xl bg-[#F0CDB5]/40 border border-[#F0CDB5] flex items-start gap-3 text-xs text-[#4A5B53] leading-relaxed">
            <Headphones className="w-5 h-5 text-[#14382E] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#14382E] block font-semibold">Human Support for Every Clinic Visit</strong>
              Trained Arogya companions escort parents and dependents from door to consultation desk, taking notes and ensuring seamless comfort.
            </div>
          </div>

          {/* Service Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#14382E]">Support Type</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                'Accompanied Doctor Visit',
                'Diagnostic Centre Support',
                'Elderly Mobility Assistance',
              ].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setServiceType(type as any)}
                  className={`p-3 rounded-2xl border text-xs text-left transition cursor-pointer flex flex-col justify-between h-20 ${
                    serviceType === type
                      ? 'bg-[#14382E] text-white border-[#14382E] shadow-2xs'
                      : 'bg-white text-[#14382E] border-[#E2DCD0] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <span className="font-medium leading-snug">{type}</span>
                  <span className={`text-[10px] ${serviceType === type ? 'text-[#A9B9A0]' : 'text-[#71827A]'}`}>
                    2–3 hrs visit
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Special Needs Checklist */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#14382E]">Support Requirements</label>
            <div className="space-y-2">
              {specialNeedOptions.map((need) => {
                const isChecked = selectedNeeds.includes(need);
                return (
                  <button
                    key={need}
                    type="button"
                    onClick={() => toggleNeed(need)}
                    className={`w-full p-2.5 rounded-2xl border text-xs text-left transition cursor-pointer flex items-center justify-between ${
                      isChecked
                        ? 'bg-[#EDE7F2] border-[#CFC9E8] text-[#14382E] font-medium'
                        : 'bg-white border-[#E2DCD0] text-[#71827A] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <span>{need}</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      isChecked ? 'bg-[#14382E] border-[#14382E] text-white' : 'border-[#E2DCD0]'
                    }`}>
                      {isChecked && <Check className="w-2.5 h-2.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Person Context */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#14382E]">Accompaniment For</label>
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

          {/* Hospital / Clinic Destination */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#14382E]">Destination Center</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2DCD0] text-xs text-[#14382E] bg-white focus:outline-none focus:border-[#14382E]"
            />
          </div>

          {/* Action */}
          <div className="pt-2 border-t border-[#E2DCD0] flex justify-end">
            <button
              type="button"
              onClick={handleRequest}
              className="px-6 py-2.5 rounded-full bg-[#14382E] hover:bg-[#14382E]/90 text-white text-xs font-semibold transition cursor-pointer shadow-2xs"
            >
              Request Care Companion
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
              Care Coordinator Assigned
            </h3>
            <p className="text-xs text-[#71827A] max-w-sm mx-auto">
              Our care coordinator will arrive at {destination} on {date} at {time} to escort <strong>{chosenPerson.fullName}</strong>.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#EDE7F2] border border-[#CFC9E8] text-xs text-[#14382E] max-w-sm mx-auto">
            You will receive live WhatsApp and in-app status updates throughout the appointment.
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
