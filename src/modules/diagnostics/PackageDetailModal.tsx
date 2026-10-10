import React, { useState } from 'react';
import { DiagnosticTest, HealthcarePerson } from '../../core/types/domain';
import { Modal } from '../../core/components/Modal';
import { 
  ShieldCheck, 
  Clock, 
  AlertCircle, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Truck, 
  FileText, 
  Info,
  Calendar,
  Sparkles,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface PackageDetailModalProps {
  pkg: DiagnosticTest | null;
  isOpen: boolean;
  onClose: () => void;
  onProceedToBooking: (pkg: DiagnosticTest) => void;
  onConsultDoctor?: () => void;
  onBack?: () => void;
}

export const PackageDetailModal: React.FC<PackageDetailModalProps> = ({
  pkg,
  isOpen,
  onClose,
  onProceedToBooking,
  onConsultDoctor,
  onBack,
}) => {
  const [expandedGroupIdx, setExpandedGroupIdx] = useState<number | null>(0);

  if (!pkg) return null;

  const totalParams = pkg.totalParametersCount || pkg.biomarkersCovered.length;
  const testsCount = pkg.includedTestsCount || 3;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={pkg.name}
      subtitle={`${pkg.packageCategory || pkg.category} · ${testsCount} Tests · ${totalParams} Clinical Parameters`}
      maxWidth="lg"
    >
      <div className="space-y-6 text-[#14382E]">
        
        {/* 1. EDITORIAL HERO STRIP & SUMMARY WITH PHOTOGRAPHIC THUMBNAIL */}
        <div className="p-4 sm:p-5 rounded-3xl bg-[#FAF7F2] border border-[#E2DCD0] space-y-3.5">
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            {pkg.imageUrl && (
              <div className="w-full sm:w-32 h-28 sm:h-32 rounded-2xl overflow-hidden bg-white border border-[#E2DCD0] shrink-0 relative">
                <img 
                  src={pkg.imageUrl} 
                  alt={pkg.name}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-[#14382E]/10" />
                <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-full bg-white/95 text-[10px] font-semibold text-[#14382E] shadow-2xs">
                  {testsCount} {testsCount === 1 ? 'Test' : 'Tests'}
                </span>
              </div>
            )}

            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#14382E] text-white text-[11px] font-medium tracking-wide">
                  {pkg.packageCategory || pkg.category}
                </span>

                {pkg.recommendedFor && (
                  <span className="text-[11px] font-medium text-[#A94B2F] bg-[#FAF0E8] px-2.5 py-0.5 rounded-full border border-[#F2DACB]">
                    {pkg.recommendedFor}
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-[#4A5B53] leading-relaxed">
                {pkg.description}
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#E2DCD0]/60">
            <div className="p-2.5 rounded-2xl bg-white border border-[#E2DCD0] text-center">
              <span className="text-[10px] uppercase font-semibold text-[#71827A] block">Included Tests</span>
              <span className="text-base font-bold text-[#14382E] tabular-nums">{testsCount} Tests</span>
            </div>

            <div className="p-2.5 rounded-2xl bg-white border border-[#E2DCD0] text-center">
              <span className="text-[10px] uppercase font-semibold text-[#71827A] block">Parameters</span>
              <span className="text-base font-bold text-[#14382E] tabular-nums">{totalParams}</span>
            </div>

            <div className="p-2.5 rounded-2xl bg-white border border-[#E2DCD0] text-center">
              <span className="text-[10px] uppercase font-semibold text-[#71827A] block">Fasting</span>
              <span className="text-base font-bold text-[#14382E]">
                {pkg.fastingRequiredHours > 0 ? `${pkg.fastingRequiredHours} hrs` : 'None'}
              </span>
            </div>

            <div className="p-2.5 rounded-2xl bg-white border border-[#E2DCD0] text-center">
              <span className="text-[10px] uppercase font-semibold text-[#71827A] block">Report Time</span>
              <span className="text-xs font-bold text-[#14382E] leading-tight block mt-0.5">{pkg.turnaroundTime}</span>
            </div>
          </div>
        </div>

        {/* 2. ACCREDITED LAB & COLD CHAIN ASSURANCE */}
        <div className="p-4 rounded-2xl bg-[#EDE7F2] border border-[#CFC9E8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white border border-[#CFC9E8] flex items-center justify-center text-[#14382E] shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#14382E]" />
            </div>
            <div>
              <h4 className="font-bold text-[#14382E] text-sm leading-tight">
                {pkg.accreditedLabPartner}
              </h4>
              <p className="text-[#4A5B53] text-[11px] mt-0.5">
                {pkg.partnerLabAccreditation || 'NABL Accredited · ISO 15189 Certified Laboratory'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-medium text-[#14382E] bg-white/70 px-3 py-1 rounded-full shrink-0">
            <Truck className="w-3.5 h-3.5 text-[#A94B2F]" />
            <span>2–8°C Cold Chain Transport</span>
          </div>
        </div>

        {/* 3. CLINICAL INDICATIONS: WHY IS THIS RECOMMENDED? */}
        {pkg.clinicalIndications && pkg.clinicalIndications.length > 0 && (
          <div className="space-y-2">
            <h3 
              className="text-base text-[#14382E] font-medium"
              style={{ fontFamily: "'Newsreader', Georgia, serif" }}
            >
              Clinical Indications & Use Cases
            </h3>

            <div className="p-3.5 rounded-2xl bg-white border border-[#E2DCD0] space-y-2">
              {pkg.clinicalIndications.map((ind, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-[#4A5B53] leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#A94B2F] mt-1.5 shrink-0" />
                  <span>{ind}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. COMPLETE INVESTIGATION BREAKDOWN (ORGANIZED PARAMETER GROUPS) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 
              className="text-base text-[#14382E] font-medium"
              style={{ fontFamily: "'Newsreader', Georgia, serif" }}
            >
              Investigation Breakdown ({totalParams} Parameters)
            </h3>
            <span className="text-[11px] text-[#71827A]">
              Tap any section to inspect clinical purpose
            </span>
          </div>

          {pkg.investigationGroups && pkg.investigationGroups.length > 0 ? (
            <div className="space-y-2.5">
              {pkg.investigationGroups.map((grp, gIdx) => {
                const isExpanded = expandedGroupIdx === gIdx;
                return (
                  <div 
                    key={gIdx}
                    className="rounded-2xl border border-[#E2DCD0] bg-white overflow-hidden transition-all shadow-2xs"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedGroupIdx(isExpanded ? null : gIdx)}
                      className="w-full p-3.5 flex items-center justify-between gap-3 text-left bg-white hover:bg-[#FAF7F2] transition cursor-pointer"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-[#14382E]">
                            {grp.groupName}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#71827A] text-[10px] font-medium border border-[#E2DCD0]">
                            {grp.parameters.length} tests
                          </span>
                        </div>
                        {grp.description && (
                          <p className="text-[11px] text-[#71827A] mt-0.5 truncate">
                            {grp.description}
                          </p>
                        )}
                      </div>

                      <div className="text-[#14382E] shrink-0">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="p-3.5 pt-1 border-t border-[#E2DCD0]/60 bg-[#FAF7F2]/50 space-y-2 animate-in fade-in duration-150">
                        <div className="grid grid-cols-1 gap-2">
                          {grp.parameters.map((p, pIdx) => (
                            <div 
                              key={pIdx}
                              className="p-2.5 rounded-xl bg-white border border-[#E2DCD0]/70 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-xs"
                            >
                              <span className="font-medium text-[#14382E]">
                                {p.name}
                              </span>
                              {p.clinicalRelevance && (
                                <span className="text-[11px] text-[#71827A] sm:max-w-xs sm:text-right">
                                  {p.clinicalRelevance}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* Fallback to Biomarkers pills */
            <div className="p-4 rounded-2xl bg-white border border-[#E2DCD0] flex flex-wrap gap-2">
              {pkg.biomarkersCovered.map((bio, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1 rounded-full bg-[#EFE9DD] text-[#14382E] text-xs font-medium"
                >
                  {bio}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 5. PHLEBOTOMY SPECIFICATIONS & SAMPLE CONTAINERS */}
        {pkg.sampleContainer && (
          <div className="p-3.5 rounded-2xl bg-white border border-[#E2DCD0] text-xs flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#14382E] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#14382E] block">Phlebotomy Specifications:</strong>
              <p className="text-[#71827A] mt-0.5">
                Collection tube: <span className="text-[#14382E] font-medium">{pkg.sampleContainer}</span>. Certified vacuum-sealed vacutainers prevent hemolysis and ensure stability during cold-chain courier transfer.
              </p>
            </div>
          </div>
        )}

        {/* 6. BEFORE THE TEST (PREPARATION GUIDELINES) */}
        <div className="space-y-2">
          <h3 
            className="text-base text-[#14382E] font-medium"
            style={{ fontFamily: "'Newsreader', Georgia, serif" }}
          >
            Preparation & Fasting Guidelines
          </h3>

          <div className="p-4 rounded-2xl bg-white border border-[#E2DCD0] space-y-2 text-xs text-[#4A5B53]">
            {pkg.preTestInstructions.map((inst, idx) => (
              <div key={idx} className="flex items-start gap-2 leading-relaxed">
                <Check className="w-3.5 h-3.5 text-[#14382E] shrink-0 mt-0.5" />
                <span>{inst}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 7. TRANSPARENT PRICING & COMMERCIAL BREAKDOWN */}
        <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E2DCD0] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#14382E]">
              Published All-Inclusive Fee
            </span>
            <span className="text-[10px] font-medium text-[#71827A] px-2 py-0.5 rounded-full bg-white border border-[#E2DCD0]">
              Illustrative Demo Price
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-[#71827A]">
            <div className="flex justify-between text-[#14382E]">
              <span>Clinical laboratory analysis fee:</span>
              <span className="font-medium tabular-nums">₹{pkg.price}</span>
            </div>
            <div className="flex justify-between text-[#14382E]">
              <span>Doorstep cold-chain phlebotomy visit:</span>
              <span className="font-medium text-[#14382E]">Included (₹0)</span>
            </div>
            <div className="flex justify-between text-[#14382E]">
              <span>NABL verified digital report & visual archival:</span>
              <span className="font-medium text-[#14382E]">Included (₹0)</span>
            </div>
            <div className="pt-2 border-t border-[#E2DCD0] flex justify-between items-baseline font-bold text-sm text-[#14382E]">
              <span>Total Payable at Booking:</span>
              <span className="text-lg tabular-nums">₹{pkg.price}</span>
            </div>
          </div>
        </div>

        {/* 8. ACTIONS */}
        <div className="pt-3 border-t border-[#E2DCD0] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-left w-full sm:w-auto">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-[#14382E] tabular-nums">
                ₹{pkg.price}
              </span>
              <span className="text-[11px] text-[#71827A]">
                (Illustrative demo price)
              </span>
            </div>
            <span className="text-[11px] text-[#A94B2F] font-medium block">
              ✓ Doorstep collection included · Zero hidden charges
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white hover:bg-[#FAF7F2] border border-[#E2DCD0] text-xs font-semibold text-[#14382E] transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Packages</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-full bg-white hover:bg-[#FAF7F2] border border-[#E2DCD0] text-xs font-semibold text-[#14382E] transition cursor-pointer"
              >
                Close
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onClose();
                onProceedToBooking(pkg);
              }}
              className="px-6 py-2.5 rounded-full bg-[#14382E] hover:bg-[#14382E]/90 text-white text-xs font-semibold transition cursor-pointer shadow-2xs active:scale-95 flex items-center gap-1.5"
            >
              <span>Schedule Home Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </Modal>
  );
};
