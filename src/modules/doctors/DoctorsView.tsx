import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Video, 
  Calendar, 
  Clock, 
  Check, 
  ChevronRight,
  Filter,
  ArrowRight,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';
import { Doctor, HealthcarePerson } from '../../core/types/domain';
import { assets } from '../../core/theme/assets';
import { DoctorBookingModal } from './DoctorBookingModal';

interface DoctorsViewProps {
  doctors: Doctor[];
  familyMembers: HealthcarePerson[];
  activePerson: HealthcarePerson;
  onBookAppointment: (params: {
    doctorId: string;
    personId: string;
    mode: 'In-Person Clinic' | 'Telehealth Video';
    date: string;
    slot: string;
    chiefComplaint: string;
  }) => void;
}

export const DoctorsView: React.FC<DoctorsViewProps> = ({
  doctors,
  familyMembers,
  activePerson,
  onBookAppointment,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedMode, setSelectedMode] = useState<'all' | 'Today' | 'Video' | 'Clinic'>('all');
  const [selectedDoctorForModal, setSelectedDoctorForModal] = useState<Doctor | null>(null);

  const specialties = [
    { id: 'all', label: 'All Specialties' },
    { id: 'Cardiologist', label: 'Cardiology' },
    { id: 'General Physician', label: 'Primary Care' },
    { id: 'Orthopedic Specialist', label: 'Orthopedics' },
  ];

  const filterChips = [
    { id: 'all', label: 'All Modes' },
    { id: 'Today', label: 'Today Available' },
    { id: 'Video', label: 'Video Telehealth' },
    { id: 'Clinic', label: 'In-Person Clinic' },
  ];

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = 
      doctor.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.clinicHospitalAffiliation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpecialty = 
      selectedSpecialty === 'all' || 
      doctor.specialty.toLowerCase() === selectedSpecialty.toLowerCase();

    const matchesMode = 
      selectedMode === 'all' ||
      (selectedMode === 'Today' && doctor.nextAvailableSlot.toLowerCase().includes('today')) ||
      (selectedMode === 'Video' && doctor.availableModes.some(m => m.includes('Video'))) ||
      (selectedMode === 'Clinic' && doctor.availableModes.some(m => m.includes('Clinic')));

    return matchesSearch && matchesSpecialty && matchesMode;
  });

  return (
    <div className="space-y-6 pb-20 max-w-2xl mx-auto text-[#14382E] px-1 sm:px-2">
      
      {/* 1. DOCTOR CARE EDITORIAL HEADER */}
      <div className="space-y-1">
        <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#A9B9A0] block">
          Clinical Consultations
        </span>
        <h1 
          className="text-2xl sm:text-3xl text-[#14382E] tracking-tight leading-tight"
          style={{ fontFamily: "'Newsreader', Georgia, serif" }}
        >
          Doctor Care
        </h1>
        <p className="text-xs sm:text-sm text-[#71827A]">
          Verified specialist consultations · Clinic visits and secure telehealth video
        </p>
      </div>

      {/* 2. HIGH-CONTRAST CONSULTATION EDITORIAL HERO BANNER */}
      <div className="relative rounded-3xl overflow-hidden border border-[#E2DCD0] bg-[#14382E] text-white shadow-2xs">
        <div className="relative h-44 sm:h-52 w-full">
          <img 
            src={assets.images.womensHealth} 
            alt="Doctor Consultation"
            className="w-full h-full object-cover object-top filter brightness-95"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#14382E] via-[#14382E]/85 to-transparent" />
          <div className="absolute inset-0 bg-[#14382E]/25" />

          <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#14382E] text-[10px] font-bold tracking-wide uppercase">
                Verified Clinicians
              </span>
              <span className="text-xs text-[#F0CDB5] font-medium hidden sm:inline">
                Direct hospital & clinic slots
              </span>
            </div>

            <h2 
              className="text-xl sm:text-2xl text-white font-normal leading-tight max-w-md"
              style={{ fontFamily: "'Newsreader', Georgia, serif" }}
            >
              Expert Specialists Who Listen & Follow Up
            </h2>

            <p className="text-xs text-[#F6F1E7]/90 mt-1 max-w-md leading-relaxed">
              Prescriptions automatically schedule needed doorstep tests, and lab results queue your follow-up discussion.
            </p>
          </div>
        </div>
      </div>

      {/* 3. SEARCH & SPECIALTY FILTERS (HIGH CONTRAST) */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-[#14382E]/70 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by doctor name, specialty, hospital or condition..."
            className="w-full h-12 pl-11 pr-4 bg-white rounded-full border border-[#E2DCD0] text-sm text-[#14382E] placeholder-[#71827A] focus:outline-none focus:border-[#14382E] focus:ring-1 focus:ring-[#14382E] shadow-2xs transition"
          />
        </div>

        {/* Specialty Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {specialties.map((spec) => {
            const isSelected = selectedSpecialty === spec.id;
            return (
              <button
                key={spec.id}
                onClick={() => setSelectedSpecialty(spec.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs transition cursor-pointer shrink-0 font-medium ${
                  isSelected 
                    ? 'bg-[#14382E] text-white shadow-2xs' 
                    : 'bg-white hover:bg-[#FAF7F2] text-[#14382E] border border-[#E2DCD0]'
                }`}
              >
                {spec.label}
              </button>
            );
          })}
        </div>

        {/* Mode Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {filterChips.map((chip) => {
            const isSelected = selectedMode === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setSelectedMode(chip.id as any)}
                className={`px-3 py-1 rounded-full text-[11px] font-normal transition cursor-pointer shrink-0 ${
                  isSelected 
                    ? 'bg-[#FAF0E8] text-[#A94B2F] border border-[#F2DACB] font-semibold' 
                    : 'bg-[#FAF7F2] text-[#71827A] border border-[#E2DCD0] hover:text-[#14382E]'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. DOCTORS LIST (HIGH CONTRAST BOTANICA CARDS) */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-0.5">
          <span className="text-xs text-[#71827A] font-medium">
            Showing {filteredDoctors.length} available {filteredDoctors.length === 1 ? 'specialist' : 'specialists'}
          </span>
          <span className="text-[11px] text-[#A94B2F] font-semibold">
            Zero booking surcharge
          </span>
        </div>

        {filteredDoctors.map((doc) => (
          <div 
            key={doc.id}
            className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E2DCD0] shadow-2xs hover:shadow-xs hover:border-[#14382E]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
          >
            <div className="flex items-start gap-4">
              {/* Arch Mask Portrait with Border */}
              <div className="w-18 h-22 sm:w-20 sm:h-24 shape-arch overflow-hidden bg-[#EDE8F4] shrink-0 border border-[#E2DCD0] relative group-hover:scale-[1.02] transition-transform duration-300">
                <img 
                  src={doc.avatarUrl} 
                  alt={doc.fullName} 
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-[#14382E]/5" />
              </div>

              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-[#14382E] text-white text-[10px] font-semibold tracking-wide">
                    {doc.specialty}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E2DCD0] text-[#71827A] text-[10px] font-medium">
                    {doc.experienceYears} yrs experience
                  </span>
                </div>

                <h3 
                  className="text-lg sm:text-xl text-[#14382E] font-medium leading-snug group-hover:text-[#A94B2F] transition-colors"
                  style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                >
                  {doc.fullName}
                </h3>

                <p className="text-xs text-[#4A5B53] line-clamp-1">
                  {doc.degrees.join(' · ')}
                </p>

                {/* Slot availability tag with terracotta pill */}
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#A94B2F] animate-pulse" />
                  <span className="text-xs font-semibold text-[#14382E]">{doc.nextAvailableSlot}</span>
                </div>

                <p className="text-[11px] text-[#71827A] flex items-center gap-1 truncate max-w-sm pt-0.5">
                  <MapPin className="w-3 h-3 text-[#71827A] shrink-0" />
                  <span className="truncate">{doc.clinicHospitalAffiliation}</span>
                </p>
              </div>
            </div>

            {/* Price & Primary Action with Strong Contrast */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E2DCD0]/60 shrink-0">
              <div className="sm:text-right">
                <span className="text-lg sm:text-xl font-bold text-[#14382E] tabular-nums block">
                  ₹{doc.consultationFee}
                </span>
                <span className="text-[10px] text-[#71827A] block">
                  Consultation fee
                </span>
              </div>

              <button
                onClick={() => setSelectedDoctorForModal(doc)}
                className="px-6 py-2.5 rounded-full bg-[#14382E] hover:bg-[#14382E]/90 text-white text-xs font-semibold transition cursor-pointer shadow-2xs active:scale-95 flex items-center gap-1.5"
              >
                <span>Book Consult</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {filteredDoctors.length === 0 && (
          <div className="p-8 text-center bg-white rounded-3xl border border-[#E2DCD0] space-y-2">
            <p className="text-sm text-[#71827A]">No specialists match your search criteria.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedSpecialty('all'); setSelectedMode('all'); }}
              className="text-xs text-[#14382E] font-semibold underline cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* 5. AROGYA CARE CONTINUUM FOOTER (MUTED LILAC & TERRACOTTA) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#EDE7F2] border border-[#CFC9E8] space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#14382E] block">
            After you book, it all stays in one journey
          </span>
          <span className="text-[11px] font-semibold text-[#A94B2F]">
            The Care Thread
          </span>
        </div>

        {/* 4-Step Inline Thread Preview: Visit -> Tests -> Report -> Follow-up */}
        <div className="flex items-center justify-between text-xs text-[#14382E] pt-2">
          <div className="flex flex-col items-center gap-1">
            <div className="w-4 h-4 rounded-full border-2 border-[#A94B2F] bg-white flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#A94B2F]" />
            </div>
            <span className="font-semibold text-[11px] text-[#14382E]">Visit</span>
          </div>

          <div className="flex-1 h-[2px] bg-[#A9B9A0] mx-2" />

          <div className="flex flex-col items-center gap-1">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-dashed border-[#A9B9A0] bg-white" />
            <span className="text-[11px] text-[#71827A]">Tests</span>
          </div>

          <div className="flex-1 border-t-2 border-dashed border-[#A9B9A0]/60 mx-2" />

          <div className="flex flex-col items-center gap-1">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-dashed border-[#A9B9A0] bg-white" />
            <span className="text-[11px] text-[#71827A]">Report</span>
          </div>

          <div className="flex-1 border-t-2 border-dashed border-[#A9B9A0]/60 mx-2" />

          <div className="flex flex-col items-center gap-1">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-dashed border-[#A9B9A0] bg-white" />
            <span className="text-[11px] text-[#71827A]">Follow-up</span>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <DoctorBookingModal
        doctor={selectedDoctorForModal}
        isOpen={!!selectedDoctorForModal}
        onClose={() => setSelectedDoctorForModal(null)}
        familyMembers={familyMembers}
        activePerson={activePerson}
        onConfirmBooking={(params) => {
          onBookAppointment(params);
          setSelectedDoctorForModal(null);
        }}
      />
    </div>
  );
};
