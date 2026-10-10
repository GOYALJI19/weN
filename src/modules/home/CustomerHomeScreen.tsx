import React, { useState } from 'react';
import { 
  Search, 
  Stethoscope, 
  TestTube2, 
  FileText, 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  Clock, 
  Users, 
  Headphones, 
  Heart, 
  Activity, 
  Sparkles,
  Truck,
  ChevronRight
} from 'lucide-react';
import { 
  HealthcarePerson, 
  HealthcareJourney, 
  UpcomingCareItem, 
  Doctor, 
  DiagnosticTest, 
  HealthRecordDocument,
  HealthPackageCategory
} from '../../core/types/domain';
import { assets } from '../../core/theme/assets';
import { healthPackageCategories } from '../../core/data/mockDomainData';
import { AndroidSearchModal } from '../customer/AndroidSearchModal';
import { PackageDetailModal } from '../diagnostics/PackageDetailModal';
import { PackageCatalogueModal } from '../diagnostics/PackageCatalogueModal';

interface CustomerHomeScreenProps {
  person: HealthcarePerson;
  journey: HealthcareJourney;
  upcomingItems?: UpcomingCareItem[];
  featuredDoctors?: Doctor[];
  featuredPackages?: DiagnosticTest[];
  recentRecord?: HealthRecordDocument;
  onNavigateTab: (tab: string) => void;
  onOpenDoctorDetail?: (doctor: Doctor) => void;
  onOpenPackageDetail?: (pkg: DiagnosticTest) => void;
  onOpenRecordDetail?: (record: HealthRecordDocument) => void;
  onOpenCareAssistModal?: () => void;
  onAdvanceJourneyStep?: () => void;
}

export const CustomerHomeScreen: React.FC<CustomerHomeScreenProps> = ({
  person,
  journey,
  upcomingItems = [],
  featuredDoctors = [],
  featuredPackages = [],
  recentRecord,
  onNavigateTab,
  onOpenDoctorDetail,
  onOpenPackageDetail,
  onOpenRecordDetail,
  onOpenCareAssistModal,
  onAdvanceJourneyStep,
}) => {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [isJourneyUnspooled, setIsJourneyUnspooled] = useState<boolean>(false);
  const [selectedCategoryForCatalogue, setSelectedCategoryForCatalogue] = useState<HealthPackageCategory | null>(null);
  const [inspectingPackage, setInspectingPackage] = useState<DiagnosticTest | null>(null);

  // Active step in the user's personal journey
  const activeStep = journey?.steps?.find(s => s.status === 'action_required' || s.status === 'in_progress') || journey?.steps?.[2] || journey?.steps?.[0];
  const stepNumber = activeStep?.stepNumber || 3;
  const totalSteps = journey?.steps?.length || 5;

  return (
    <div className="space-y-7 pb-24 max-w-2xl mx-auto text-[#14382E] px-1 sm:px-2">
      
      {/* 1. EDITORIAL GREETING (LARGE SERIF + BOTANICAL LEAF ACCENT) */}
      <section className="pt-2">
        <div className="flex items-center gap-2">
          <h1 
            className="text-3xl sm:text-4xl text-[#14382E] tracking-tight leading-tight font-normal"
            style={{ fontFamily: "'Newsreader', Georgia, serif" }}
          >
            Good morning, {person.fullName.split(' ')[0]}
          </h1>
          {/* Subtle Botanical Leaf Accent */}
          <svg className="w-5 h-5 text-[#A9B9A0] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22C12 22 20 18 20 10C20 4 12 2 12 2C12 2 4 4 4 10C4 18 12 22 12 22Z" fill="#A9B9A0" fillOpacity="0.25" />
            <path d="M12 22V2" />
          </svg>
        </div>
      </section>

      {/* 2. OMNI-SEARCH BAR (WIDE ROUNDED + QUICK FIND PILL) */}
      <section className="space-y-2">
        <button
          type="button"
          onClick={() => setShowSearchModal(true)}
          className="w-full h-12 px-4 bg-white hover:bg-[#FAF7F2] rounded-full border border-[#E2DCD0] shadow-2xs flex items-center justify-between text-left transition-all cursor-pointer group"
          aria-label="Search doctors, tests, records"
        >
          <div className="flex items-center gap-3 min-w-0">
            <Search className="w-4 h-4 text-[#14382E]/70 group-hover:text-[#14382E] transition-colors shrink-0" />
            <span className="text-[14px] sm:text-[15px] text-[#71827A] font-normal truncate">
              Search tests, doctors, specialists or records...
            </span>
          </div>

          <div className="px-2.5 py-0.5 rounded-full bg-[#F6F1E7] text-[11px] font-medium text-[#14382E] border border-[#E2DCD0] shrink-0">
            Quick Find
          </div>
        </button>

        {/* Quick Assist Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none px-0.5">
          {['Lipid Profile', 'Knee Review', 'Dr. Ravi Menon', 'Blood Sugar', 'Thyroid Panel'].map((tag, idx) => (
            <button
              key={idx}
              onClick={() => setShowSearchModal(true)}
              className="px-3 py-1 rounded-full bg-[#FAF7F2] hover:bg-[#EFE9DD] border border-[#E2DCD0] text-[#14382E] text-[11px] font-normal whitespace-nowrap transition cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* 3. IMAGE-LED DIAGNOSTICS HERO CAMPAIGN BANNER */}
      <section>
        <div className="relative rounded-[28px] overflow-hidden border border-[#E2DCD0] bg-[#14382E] text-white shadow-2xs">
          <div className="relative h-60 sm:h-68 w-full">
            <img 
              src={assets.images.diagnosticHero} 
              alt="Arogya Certified Laboratory Testing"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            {/* Measured Scrim Gradient for WCAG AA 4.5:1 text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#14382E] via-[#14382E]/85 to-transparent" />
            <div className="absolute inset-0 bg-[#14382E]/35" />
            
            {/* Banner Marketing Copy & CTAs */}
            <div className="absolute inset-0 p-5 sm:p-7 flex flex-col justify-end">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-[#A9B9A0]/30 backdrop-blur-md border border-[#A9B9A0]/50 text-white text-[11px] font-medium tracking-wide">
                  ACCURATE · RELIABLE · TRUSTED
                </span>
              </div>

              <h2 
                className="text-2xl sm:text-3xl text-white font-normal leading-tight tracking-tight max-w-lg"
                style={{ fontFamily: "'Newsreader', Georgia, serif" }}
              >
                Know more. Care better.
              </h2>

              <p className="text-xs sm:text-sm text-[#F6F1E7]/90 mt-1 max-w-md font-normal leading-relaxed">
                Explore diagnostic tests and health packages
              </p>

              <div className="mt-3.5 flex items-center gap-3">
                <button
                  onClick={() => onNavigateTab('diagnostics')}
                  className="px-5 py-2.5 rounded-full bg-[#F6F1E7] hover:bg-white text-[#14382E] text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5"
                >
                  <span>Explore tests</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <span className="text-xs text-[#F0CDB5] hidden sm:inline font-medium">
                  ✓ Home collection included
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. EXPLORE SERVICES (EXACT 2 LARGER + 3 COMPACT IMAGE-LED TILES) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-0.5">
          <h2 
            className="text-xl sm:text-2xl text-[#14382E] tracking-tight font-normal"
            style={{ fontFamily: "'Newsreader', Georgia, serif" }}
          >
            Explore services
          </h2>
          <span className="text-xs text-[#71827A]">
            One connected continuum
          </span>
        </div>

        <div className="space-y-2.5">
          {/* Row 1: Two Larger Image-Led Tiles (Diagnostics & Doctor Care) */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Tile 1: DIAGNOSTICS (Leaf Shape Mask + Photography) */}
            <div
              onClick={() => onNavigateTab('diagnostics')}
              className="p-4 rounded-3xl bg-[#14382E] text-white shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between h-52 group relative overflow-hidden"
              role="button"
              tabIndex={0}
              aria-label="Diagnostics: Tests, home collection"
            >
              {/* Leaf Shape Aperture with Lab Phlebotomy Kit Photo */}
              <div className="w-full h-28 shape-leaf overflow-hidden bg-[#1B463A] border border-[#A9B9A0]/30 relative group-hover:scale-[1.02] transition-transform duration-300">
                <img 
                  src={assets.images.phlebotomyKit} 
                  alt="Diagnostic Blood Collection Kit"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14382E]/80 via-transparent to-transparent" />
                <span className="absolute bottom-1.5 left-2.5 text-[10px] font-semibold uppercase tracking-wider text-[#F0CDB5]">
                  NABL Certified
                </span>
              </div>

              <div className="pt-2">
                <h3 
                  className="text-[17px] text-white font-normal leading-snug group-hover:text-[#F0CDB5] transition-colors"
                  style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                >
                  Diagnostics
                </h3>
                <p className="text-[12px] text-[#A9B9A0] mt-0.5 truncate">
                  Tests, home collection
                </p>
              </div>
            </div>

            {/* Tile 2: DOCTOR CARE (Arch Shape Mask + Specialist Portrait) */}
            <div
              onClick={() => onNavigateTab('doctors')}
              className="p-4 rounded-3xl bg-white border border-[#E2DCD0] hover:border-[#14382E]/40 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between h-52 group relative overflow-hidden"
              role="button"
              tabIndex={0}
              aria-label="Doctor Care: Video & clinic"
            >
              {/* Arch Shape Aperture with Doctor Portrait */}
              <div className="w-full h-28 shape-arch overflow-hidden bg-[#EDE8F4] border border-[#E2DCD0] relative group-hover:scale-[1.02] transition-transform duration-300">
                <img 
                  src={assets.images.drSiddharth} 
                  alt="Doctor Consultations"
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14382E]/60 via-transparent to-transparent" />
                <span className="absolute bottom-1.5 left-2.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                  Clinic & Video
                </span>
              </div>

              <div className="pt-2">
                <h3 
                  className="text-[17px] text-[#14382E] font-normal leading-snug group-hover:text-[#14382E]"
                  style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                >
                  Doctor Care
                </h3>
                <p className="text-[12px] text-[#71827A] mt-0.5 truncate">
                  Doctor consultations
                </p>
              </div>
            </div>
          </div>

          {/* Row 2: Three Balanced Compact Image-Led Tiles (Health Records, Journeys, Family & Care Assistance) */}
          <div className="grid grid-cols-3 gap-2.5">
            {/* Tile 3: HEALTH RECORDS (Soft Asymmetric Aperture with Diagnostic Vault Image) */}
            <div
              onClick={() => onNavigateTab('records')}
              className="p-3 sm:p-3.5 rounded-3xl bg-white border border-[#E2DCD0] hover:border-[#14382E]/40 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col items-center text-center group overflow-hidden"
              role="button"
              tabIndex={0}
              aria-label="Health Records"
            >
              <div className="w-full h-16 sm:h-18 rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#E2DCD0] mb-2 shrink-0 relative group-hover:scale-[1.02] transition-transform duration-300">
                <img 
                  src={assets.images.diagnosticHero} 
                  alt="Health Records and Lab Reports"
                  className="w-full h-full object-cover object-center filter saturate-75"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-[#14382E]/25" />
                <span className="absolute bottom-1 left-1.5 px-1.5 py-0.2 rounded-full bg-white/90 text-[9px] font-semibold text-[#14382E] backdrop-blur-xs">
                  PDF & Trends
                </span>
              </div>
              <h3 
                className="text-[13px] sm:text-[14px] text-[#14382E] font-normal leading-tight group-hover:text-[#14382E]"
                style={{ fontFamily: "'Newsreader', Georgia, serif" }}
              >
                Health Records
              </h3>
              <span className="text-[10px] text-[#71827A] mt-0.5 truncate max-w-full">
                Visual reports
              </span>
            </div>

            {/* Tile 4: JOURNEYS (Circular Aperture with Care Journey Photography) */}
            <div
              onClick={() => onNavigateTab('journeys')}
              className="p-3 sm:p-3.5 rounded-3xl bg-white border border-[#E2DCD0] hover:border-[#14382E]/40 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col items-center text-center group overflow-hidden"
              role="button"
              tabIndex={0}
              aria-label="Care Journeys"
            >
              <div className="w-full h-16 sm:h-18 rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#E2DCD0] mb-2 shrink-0 relative group-hover:scale-[1.02] transition-transform duration-300">
                <img 
                  src={assets.images.homeCollection} 
                  alt="Arogya Care Journeys"
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-[#14382E]/20" />
                <span className="absolute bottom-1 left-1.5 px-1.5 py-0.2 rounded-full bg-white/90 text-[9px] font-semibold text-[#14382E] backdrop-blur-xs">
                  Active Care
                </span>
              </div>
              <h3 
                className="text-[13px] sm:text-[14px] text-[#14382E] font-normal leading-tight group-hover:text-[#14382E]"
                style={{ fontFamily: "'Newsreader', Georgia, serif" }}
              >
                Journeys
              </h3>
              <span className="text-[10px] text-[#71827A] mt-0.5 truncate max-w-full">
                Care timelines
              </span>
            </div>

            {/* Tile 5: FAMILY & CARE ASSISTANCE (Arch Doorway Aperture with Family Wellness Photography) */}
            <div
              onClick={() => onNavigateTab('profile')}
              className="p-3 sm:p-3.5 rounded-3xl bg-white border border-[#E2DCD0] hover:border-[#14382E]/40 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col items-center text-center group overflow-hidden"
              role="button"
              tabIndex={0}
              aria-label="Family & Care Assistance"
            >
              <div className="w-full h-16 sm:h-18 rounded-2xl overflow-hidden bg-[#FAF0E8] border border-[#F2DACB] mb-2 shrink-0 relative group-hover:scale-[1.02] transition-transform duration-300">
                <img 
                  src={assets.images.familyWellness} 
                  alt="Family Care and Companion Assistance"
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-[#A94B2F]/15" />
                <span className="absolute bottom-1 left-1.5 px-1.5 py-0.2 rounded-full bg-white/90 text-[9px] font-semibold text-[#A94B2F] backdrop-blur-xs">
                  Assistance
                </span>
              </div>
              <h3 
                className="text-[12px] sm:text-[13px] text-[#14382E] font-normal leading-tight line-clamp-1 group-hover:text-[#A94B2F] transition-colors"
                style={{ fontFamily: "'Newsreader', Georgia, serif" }}
              >
                Family & Care Assistance
              </h3>
              <span className="text-[10px] text-[#71827A] mt-0.5 truncate max-w-full">
                Parents & elders
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HEALTH PACKAGES — COMPACT IMAGE-LED CATEGORIES (ESSENTIAL, WOMEN'S, HEALTHY AGEING, FAMILY) */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between px-0.5">
          <div>
            <h2 
              className="text-xl sm:text-2xl text-[#14382E] tracking-tight"
              style={{ fontFamily: "'Newsreader', Georgia, serif" }}
            >
              Health Packages
            </h2>
            <p className="text-xs text-[#71827A] mt-0.5">
              Verified clinical investigations · Tap a category to view packages
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('diagnostics')}
            className="text-xs font-semibold text-[#14382E] hover:underline cursor-pointer"
          >
            All Diagnostics
          </button>
        </div>

        {/* 2-Column Compact Photographic Category Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {healthPackageCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setSelectedCategoryForCatalogue(cat)}
              className="p-3.5 sm:p-4 rounded-3xl bg-white border border-[#E2DCD0] shadow-2xs hover:shadow-xs hover:border-[#14382E]/40 transition-all cursor-pointer flex flex-col justify-between group overflow-hidden"
              role="button"
              tabIndex={0}
              aria-label={`View ${cat.name} packages`}
            >
              <div>
                {/* Organic Rounded Aperture with Authentic Healthcare Photography */}
                <div className="w-full h-28 sm:h-36 rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#E2DCD0]/70 relative group-hover:scale-[1.02] transition-transform duration-300">
                  <img 
                    src={cat.imageUrl} 
                    alt={cat.name}
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14382E]/55 via-transparent to-transparent" />
                  
                  <span className="absolute bottom-1.5 left-2 px-2 py-0.5 rounded-full bg-white/95 text-[10px] font-semibold text-[#14382E] backdrop-blur-xs shadow-2xs">
                    {cat.badge}
                  </span>
                </div>

                <div className="pt-3 space-y-1">
                  <h3 
                    className="text-[16px] sm:text-[18px] text-[#14382E] font-medium leading-snug group-hover:text-[#A94B2F] transition-colors"
                    style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                  >
                    {cat.name}
                  </h3>
                  
                  <p className="text-[11px] sm:text-xs text-[#71827A] line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="pt-2.5 mt-2 border-t border-[#E2DCD0]/60 flex items-center justify-between text-xs text-[#14382E] font-medium">
                <span className="text-[11px] text-[#A94B2F] font-semibold">
                  View packages
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#14382E] group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. DEDICATED HOME SAMPLE COLLECTION PROMOTIONAL SECTION */}
      <section>
        <div className="rounded-[28px] bg-[#EDE7F2] border border-[#CFC9E8] overflow-hidden p-5 sm:p-6 shadow-2xs">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
            <div className="sm:col-span-7 space-y-3">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#A94B2F]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#A94B2F]">
                  Doorstep Phlebotomy Protocol
                </span>
              </div>

              <h2 
                className="text-xl sm:text-2xl text-[#14382E] tracking-tight leading-snug"
                style={{ fontFamily: "'Newsreader', Georgia, serif" }}
              >
                Painless, Timed Home Blood Collection
              </h2>

              <ul className="space-y-1.5 text-xs text-[#4A5B53] leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-[#A94B2F] font-bold">·</span>
                  <span><strong>Zero clinic queue:</strong> Select your exact 30-minute morning fasting window.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#A94B2F] font-bold">·</span>
                  <span><strong>Cold-chain integrity:</strong> Samples vacuum-sealed at 2–8°C for laboratory accuracy.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#A94B2F] font-bold">·</span>
                  <span><strong>Visual indicators:</strong> Direct PDF archival plus translated reference intervals.</span>
                </li>
              </ul>

              <div className="pt-1">
                <button
                  onClick={() => onNavigateTab('diagnostics')}
                  className="px-4 py-2 rounded-full bg-[#14382E] hover:bg-[#14382E]/90 text-white text-xs font-semibold transition cursor-pointer shadow-2xs"
                >
                  Schedule Home Collection
                </button>
              </div>
            </div>

            <div className="sm:col-span-5">
              <div className="h-44 rounded-2xl overflow-hidden shadow-xs border border-[#E2DCD0]">
                <img 
                  src={assets.images.homeCollection} 
                  alt="Arogya Doorstep Phlebotomy Kit"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. "WHY AROGYA" — CONNECTED HEALTHCARE PILLARS (EDITORIAL NEWSREADER) */}
      <section className="p-5 sm:p-6 rounded-3xl bg-[#FAF7F2] border border-[#E2DCD0] shadow-2xs space-y-4">
        <div>
          <h2 
            className="text-xl sm:text-2xl text-[#14382E] tracking-tight"
            style={{ fontFamily: "'Newsreader', Georgia, serif" }}
          >
            Why Arogya Connected Care?
          </h2>
          <p className="text-xs text-[#71827A] mt-0.5">
            Healthcare services usually exist in separate silos. Arogya strings every moment into one thread.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-full bg-[#14382E] text-white flex items-center justify-center text-xs font-bold">
              1
            </div>
            <h4 className="text-sm font-semibold text-[#14382E]">
              The Care Thread
            </h4>
            <p className="text-xs text-[#71827A] leading-relaxed">
              When a doctor recommends a test, doorstep collection is booked immediately; when the lab uploads the report, your follow-up is already queued.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-full bg-[#A94B2F] text-white flex items-center justify-center text-xs font-bold">
              2
            </div>
            <h4 className="text-sm font-semibold text-[#14382E]">
              Transparent Pricing
            </h4>
            <p className="text-xs text-[#71827A] leading-relaxed">
              No surprise charges at your door. Sample pickup, cold-chain transport, and visual analysis are always included in the published fee.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-full bg-[#A9B9A0] text-[#14382E] flex items-center justify-center text-xs font-bold">
              3
            </div>
            <h4 className="text-sm font-semibold text-[#14382E]">
              Visual Reports
            </h4>
            <p className="text-xs text-[#71827A] leading-relaxed">
              We preserve original NABL laboratory PDF files while mapping numbers against standard reference intervals for non-alarmist clarity.
            </p>
          </div>
        </div>
      </section>

      {/* 8. ACTIVE PERSONAL CARE JOURNEY (PLACED LOWER DOWN AS PERSONAL STATUS) */}
      <section className="space-y-3 pt-1">
        <div className="flex items-center justify-between px-0.5">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A94B2F] block">
              Your Personal Health Continuum
            </span>
            <h2 
              className="text-xl text-[#14382E] tracking-tight mt-0.5"
              style={{ fontFamily: "'Newsreader', Georgia, serif" }}
            >
              Active Journey & Upcoming Care
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('journeys')}
            className="text-xs text-[#14382E] hover:underline font-medium"
          >
            All Journeys
          </button>
        </div>

        {/* Active Journey Card with The Care Thread */}
        {journey && (
          <div 
            onClick={() => setIsJourneyUnspooled(!isJourneyUnspooled)}
            className="relative bg-[#14382E] text-white rounded-[28px] p-5 sm:p-6 shadow-sm overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#A94B2F]/40 transition-all"
            role="region"
            aria-label="Active Journey Milestone"
          >
            {/* Subtle Tulsi-leaf watermark */}
            <svg 
              className="absolute -right-6 -bottom-8 w-52 h-52 text-[#A9B9A0] opacity-[0.09] pointer-events-none" 
              viewBox="0 0 200 200" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
            >
              <path d="M100 10 C60 50, 40 100, 100 190 C160 100, 140 50, 100 10 Z" />
              <path d="M100 20 L100 180" />
            </svg>

            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between text-xs text-[#A9B9A0] font-semibold tracking-wider uppercase">
                <span>{journey.title} · Step {stepNumber} of {totalSteps}</span>
                <span className="text-[11px] text-[#F6F1E7]/80 lowercase">tap to expand notice</span>
              </div>

              <h3 
                className="text-xl text-white font-normal leading-snug"
                style={{ fontFamily: "'Newsreader', Georgia, serif" }}
              >
                Sample collection tomorrow, 8:15 am
              </h3>

              {/* 5-Bead Care Thread */}
              <div className="py-1.5">
                <div className="flex items-center w-full">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#A9B9A0] shrink-0" title="Consultation (Done)" />
                  <div className="flex-1 h-[2.5px] bg-[#A9B9A0]" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#A9B9A0] shrink-0" title="Lipid profile ordered (Done)" />
                  <div className="flex-1 h-[2.5px] bg-[#A9B9A0]" />
                  <div className="w-5 h-5 rounded-full border-[3px] border-[#A94B2F] bg-white flex items-center justify-center shrink-0 ring-4 ring-[#A94B2F]/30" title="You are here">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#A94B2F]" />
                  </div>
                  <div className="flex-1 border-t-2 border-dashed border-[#A9B9A0]/50 h-0" />
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-dashed border-[#A9B9A0]/60 shrink-0" title="Report" />
                  <div className="flex-1 border-t-2 border-dashed border-[#A9B9A0]/50 h-0" />
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-dashed border-[#A9B9A0]/60 shrink-0" title="Follow-up" />
                </div>
              </div>

              {isJourneyUnspooled && (
                <div className="p-3 rounded-2xl bg-white/10 border border-[#A94B2F]/60 text-xs text-[#F0CDB5] space-y-1 animate-in fade-in duration-200">
                  <div className="font-semibold flex items-center gap-1.5">
                    <span>▲</span>
                    <span>Delayed 45 min · Sagar Labs moved your slot from 7:30 to 8:15 am.</span>
                  </div>
                  <p className="text-[11px] text-white/80">
                    Overnight fasting of 10–12 hours required. Plain water is permitted. Phlebotomist equipped with cold-chain kit.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[#F6F1E7]/80">
                  Fast from 9 pm tonight
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateTab('journeys');
                  }}
                  className="text-white hover:text-[#F0CDB5] font-semibold underline underline-offset-2 cursor-pointer"
                >
                  Open journey timeline
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upcoming appointments list */}
        {upcomingItems.length > 0 && (
          <div className="space-y-2 pt-1">
            {upcomingItems.map((item) => (
              <div 
                key={item.id}
                className="p-3.5 rounded-2xl bg-white border border-[#E2DCD0] flex items-center justify-between gap-3 text-xs shadow-2xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#E2DCD0] flex items-center justify-center shrink-0">
                    {item.type.includes('Doctor') ? (
                      <Stethoscope className="w-4 h-4 text-[#14382E]" />
                    ) : (
                      <TestTube2 className="w-4 h-4 text-[#A94B2F]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-[#14382E] text-xs truncate">
                      {item.serviceName}
                    </h4>
                    <p className="text-[#71827A] text-[11px] mt-0.5 truncate">
                      {item.date} · {item.time} · {item.providerName}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (item.type.includes('Doctor')) onNavigateTab('doctors');
                    else onNavigateTab('diagnostics');
                  }}
                  className="px-3 py-1 rounded-full bg-[#FAF7F2] text-[#14382E] hover:bg-[#EFE9DD] font-medium text-[11px] shrink-0 border border-[#E2DCD0] cursor-pointer"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Instant Search Modal */}
      <AndroidSearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        doctors={featuredDoctors}
        tests={featuredPackages}
        records={recentRecord ? [recentRecord] : []}
        onSelectDoctor={(doc) => {
          if (onOpenDoctorDetail) onOpenDoctorDetail(doc);
          else onNavigateTab('doctors');
        }}
        onSelectTest={(t) => {
          if (onOpenPackageDetail) onOpenPackageDetail(t);
          else onNavigateTab('diagnostics');
        }}
        onSelectRecord={(rec) => {
          if (onOpenRecordDetail) onOpenRecordDetail(rec);
          else onNavigateTab('records');
        }}
      />

      {/* Package Category Catalogue Modal */}
      <PackageCatalogueModal
        category={selectedCategoryForCatalogue}
        allPackages={featuredPackages}
        isOpen={!!selectedCategoryForCatalogue}
        onClose={() => setSelectedCategoryForCatalogue(null)}
        onSelectPackageForDetail={(pkg) => {
          setInspectingPackage(pkg);
        }}
        onSelectPackageForBooking={(pkg) => {
          setSelectedCategoryForCatalogue(null);
          if (onOpenPackageDetail) onOpenPackageDetail(pkg);
          else onNavigateTab('diagnostics');
        }}
      />

      {/* Package Detail & Investigation Inspection Modal */}
      <PackageDetailModal
        pkg={inspectingPackage}
        isOpen={!!inspectingPackage}
        onClose={() => setInspectingPackage(null)}
        onBack={selectedCategoryForCatalogue ? () => setInspectingPackage(null) : undefined}
        onProceedToBooking={(pkg) => {
          setInspectingPackage(null);
          setSelectedCategoryForCatalogue(null);
          if (onOpenPackageDetail) onOpenPackageDetail(pkg);
          else onNavigateTab('diagnostics');
        }}
        onConsultDoctor={() => {
          setInspectingPackage(null);
          setSelectedCategoryForCatalogue(null);
          onNavigateTab('doctors');
        }}
      />
    </div>
  );
};
