import React, { useState } from 'react';
import { 
  Search, 
  TestTube2, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  AlertCircle, 
  Check, 
  ChevronRight,
  Sparkles,
  Info,
  Truck
} from 'lucide-react';
import { DiagnosticTest, HealthcarePerson } from '../../core/types/domain';
import { assets } from '../../core/theme/assets';
import { DiagnosticBookingModal } from './DiagnosticBookingModal';
import { PackageDetailModal } from './PackageDetailModal';

interface DiagnosticsViewProps {
  tests: DiagnosticTest[];
  familyMembers: HealthcarePerson[];
  activePerson: HealthcarePerson;
  onBookTest: (params: {
    testId: string;
    personId: string;
    collectionMode: 'Home Sample Collection' | 'Diagnostic Centre Visit';
    address: string;
    date: string;
    timeSlot: string;
  }) => void;
}

export const DiagnosticsView: React.FC<DiagnosticsViewProps> = ({
  tests,
  familyMembers,
  activePerson,
  onBookTest,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [fastingFilter, setFastingFilter] = useState<'all' | 'fasting' | 'non_fasting'>('all');
  const [selectedTestForModal, setSelectedTestForModal] = useState<DiagnosticTest | null>(null);
  const [inspectingPackage, setInspectingPackage] = useState<DiagnosticTest | null>(null);

  const categories = ['All', 'Cardiac & Lipid', 'Diabetes & Metabolic', 'Joint & Bone', 'Senior Care', 'Women Health'];

  const filteredTests = tests.filter((test) => {
    const matchesSearch = 
      test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.sampleType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = 
      selectedCategory === 'All' || 
      test.category.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesFasting = 
      fastingFilter === 'all' ||
      (fastingFilter === 'fasting' ? test.fastingRequiredHours > 0 : test.fastingRequiredHours === 0);

    return matchesSearch && matchesCategory && matchesFasting;
  });

  return (
    <div className="space-y-6 pb-20 max-w-2xl mx-auto text-[#14382E]">
      {/* 1. EDITORIAL HEADER & IMAGE HERO */}
      <div className="space-y-2">
        <h1 
          className="text-2xl sm:text-3xl text-[#14382E] tracking-tight leading-tight"
          style={{ fontFamily: "'Newsreader', Georgia, serif" }}
        >
          Diagnostics & Lab Services
        </h1>
        <p className="text-xs sm:text-sm text-[#71827A]">
          NABL partner laboratories with certified cold-chain doorstep sample pickup.
        </p>
      </div>

      {/* Hero Strip with Cold-Chain Assurance */}
      <div className="relative rounded-3xl overflow-hidden bg-[#14382E] text-white p-5 border border-[#E2DCD0] shadow-2xs">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A9B9A0]">
              Cold-Chain Phlebotomy Protocol
            </span>
            <h3 
              className="text-lg text-white font-normal"
              style={{ fontFamily: "'Newsreader', Georgia, serif" }}
            >
              Exact Morning Fasting Collection Slots
            </h3>
            <p className="text-xs text-[#F6F1E7]/80 max-w-md">
              Samples vacuum-sealed at your doorstep, preserved at 2–8°C, and tracked live into your visual records.
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 text-xs font-semibold text-[#F0CDB5] shrink-0">
            ✓ Home pickup included
          </div>
        </div>
      </div>

      {/* 2. SEARCH & FILTER BAR */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-[#14382E]/60 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tests, lipid profile, metabolic panel..."
            className="w-full h-12 pl-11 pr-4 bg-white rounded-full border border-[#E2DCD0] text-sm text-[#14382E] placeholder-[#71827A] focus:outline-none focus:border-[#14382E] shadow-2xs"
          />
        </div>

        {/* Category & Fasting Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer shrink-0 ${
                selectedCategory === cat 
                  ? 'bg-[#14382E] text-white' 
                  : 'bg-white text-[#14382E] border border-[#E2DCD0] hover:bg-[#FAF7F2]'
              }`}
            >
              {cat}
            </button>
          ))}

          <div className="h-4 w-[1px] bg-[#E2DCD0] mx-1 shrink-0" />

          <button
            onClick={() => setFastingFilter(fastingFilter === 'fasting' ? 'all' : 'fasting')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer shrink-0 ${
              fastingFilter === 'fasting'
                ? 'bg-[#A94B2F] text-white'
                : 'bg-white text-[#71827A] border border-[#E2DCD0]'
            }`}
          >
            Fasting Required
          </button>
        </div>
      </div>

      {/* 3. TEST CATALOG (Matching Botanica Page 5 Aesthetics) */}
      <div className="space-y-4">
        {filteredTests.map((test) => (
          <div 
            key={test.id}
            className="p-5 rounded-3xl bg-white border border-[#E2DCD0] shadow-2xs hover:shadow-xs transition-all space-y-4"
          >
            {/* Top row: Category, Name, Price */}
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A9B9A0]">
                    {test.category}
                  </span>
                  <span className="text-[#E2DCD0]">·</span>
                  <span className="text-[11px] text-[#71827A]">
                    {test.sampleType} Test
                  </span>
                </div>

                <h3 
                  className="text-lg sm:text-xl text-[#14382E] font-medium leading-snug"
                  style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                >
                  {test.name}
                </h3>

                <p className="text-xs text-[#71827A] leading-relaxed">
                  {test.tagline}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-lg font-bold text-[#14382E] tabular-nums block">
                  ₹{test.price}
                </span>
                <span className="text-[10px] text-[#A94B2F] font-medium">
                  Home pickup included
                </span>
              </div>
            </div>

            {/* Inclusions & Turnaround */}
            <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#E2DCD0] grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 text-[#14382E]">
                <Clock className="w-3.5 h-3.5 text-[#71827A] shrink-0" />
                <span>Report in <strong>{test.turnaroundTime}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-[#14382E]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#A9B9A0] shrink-0" />
                <span>{test.accreditedLabPartner}</span>
              </div>
            </div>

            {/* Pre-Test Preparation Note */}
            {test.preTestInstructions && test.preTestInstructions.length > 0 && (
              <div className="text-xs text-[#71827A] space-y-1">
                <span className="font-semibold text-[#14382E] block">Before the test:</span>
                <p className="text-[11px] leading-relaxed">
                  {test.preTestInstructions[0]}
                </p>
              </div>
            )}

            {/* Inclusions pills & CTA */}
            <div className="pt-2 border-t border-[#E2DCD0]/60 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 flex-wrap">
                {test.biomarkersCovered.slice(0, 3).map((bio, idx) => (
                  <span 
                    key={idx}
                    className="px-2.5 py-0.5 rounded-full bg-[#EFE9DD] text-[#14382E] text-[11px]"
                  >
                    {bio}
                  </span>
                ))}
                {test.biomarkersCovered.length > 3 && (
                  <button
                    type="button"
                    onClick={() => setInspectingPackage(test)}
                    className="text-[11px] text-[#A94B2F] font-semibold hover:underline cursor-pointer"
                  >
                    +{test.biomarkersCovered.length - 3} more parameters
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInspectingPackage(test)}
                  className="px-3.5 py-2 rounded-full bg-white hover:bg-[#FAF7F2] border border-[#E2DCD0] text-[#14382E] text-xs font-semibold transition cursor-pointer"
                >
                  Inspect Tests
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTestForModal(test)}
                  className="px-5 py-2 rounded-full bg-[#14382E] hover:bg-[#14382E]/90 text-white text-xs font-semibold transition cursor-pointer shadow-2xs active:scale-95"
                >
                  Book collection
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredTests.length === 0 && (
          <div className="p-8 text-center bg-white rounded-3xl border border-[#E2DCD0] space-y-2">
            <p className="text-sm text-[#71827A]">No diagnostic tests found.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setFastingFilter('all'); }}
              className="text-xs text-[#14382E] font-semibold underline"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* Package Detail Modal */}
      <PackageDetailModal
        pkg={inspectingPackage}
        isOpen={!!inspectingPackage}
        onClose={() => setInspectingPackage(null)}
        onProceedToBooking={(test) => {
          setInspectingPackage(null);
          setSelectedTestForModal(test);
        }}
      />

      {/* Booking Modal */}
      <DiagnosticBookingModal
        test={selectedTestForModal}
        isOpen={!!selectedTestForModal}
        onClose={() => setSelectedTestForModal(null)}
        familyMembers={familyMembers}
        activePerson={activePerson}
        onConfirmBooking={(params) => {
          onBookTest(params);
          setSelectedTestForModal(null);
        }}
      />
    </div>
  );
};
