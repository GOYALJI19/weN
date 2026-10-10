import React from 'react';
import { DiagnosticTest, HealthPackageCategory } from '../../core/types/domain';
import { Modal } from '../../core/components/Modal';
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Info,
  Check
} from 'lucide-react';

interface PackageCatalogueModalProps {
  category: HealthPackageCategory | null;
  allPackages: DiagnosticTest[];
  isOpen: boolean;
  onClose: () => void;
  onSelectPackageForDetail: (pkg: DiagnosticTest) => void;
  onSelectPackageForBooking: (pkg: DiagnosticTest) => void;
}

export const PackageCatalogueModal: React.FC<PackageCatalogueModalProps> = ({
  category,
  allPackages,
  isOpen,
  onClose,
  onSelectPackageForDetail,
  onSelectPackageForBooking,
}) => {
  if (!category) return null;

  const categoryPackages = allPackages.filter(
    (pkg) => pkg.packageCategory === category.name
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={category.name}
      subtitle={category.tagline}
      maxWidth="xl"
    >
      <div className="space-y-5 text-[#14382E]">
        
        {/* 1. CATEGORY HERO STRIP */}
        <div className="relative rounded-3xl overflow-hidden border border-[#E2DCD0] bg-[#14382E] text-white">
          <div className="relative h-44 sm:h-52 w-full">
            <img 
              src={category.imageUrl} 
              alt={category.name}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#14382E] via-[#14382E]/80 to-transparent" />
            
            <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-end">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-[#A9B9A0]/30 backdrop-blur-md border border-[#A9B9A0]/50 text-white text-[11px] font-medium tracking-wide">
                  {category.badge}
                </span>
                <span className="text-xs text-[#F0CDB5] font-medium">
                  NABL Partner Labs · Home Collection
                </span>
              </div>

              <h2 
                className="text-xl sm:text-2xl text-white font-normal leading-tight"
                style={{ fontFamily: "'Newsreader', Georgia, serif" }}
              >
                {category.name}
              </h2>

              <p className="text-xs sm:text-sm text-[#F6F1E7]/90 mt-1 max-w-xl font-normal leading-relaxed">
                {category.description}
              </p>
            </div>
          </div>
        </div>

        {/* 2. DEMO DATA INTEGRITY NOTICE */}
        <div className="px-3.5 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E2DCD0] flex items-center justify-between text-xs text-[#71827A]">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#14382E] shrink-0" />
            <span>All listed test panels are genuine healthcare product concepts with verified investigation lists.</span>
          </div>
          <span className="text-[11px] font-medium text-[#14382E] shrink-0 hidden sm:inline">
            Illustrative demo pricing
          </span>
        </div>

        {/* 3. DISTINCT INTERNAL PACKAGE CARDS */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between px-0.5">
            <h3 
              className="text-lg text-[#14382E] font-medium tracking-tight"
              style={{ fontFamily: "'Newsreader', Georgia, serif" }}
            >
              Included Packages ({categoryPackages.length})
            </h3>
            <span className="text-xs text-[#71827A]">
              Select a package to review all parameters
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {categoryPackages.map((pkg) => {
              const testsCount = pkg.includedTestsCount || 3;
              const paramsCount = pkg.totalParametersCount || pkg.biomarkersCovered.length;

              return (
                <div 
                  key={pkg.id}
                  className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E2DCD0] shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row gap-4 justify-between group"
                >
                  {/* Left: Thumbnail & Clinical Information */}
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#E2DCD0] shrink-0 relative group-hover:scale-[1.02] transition-transform duration-300">
                      <img 
                        src={pkg.imageUrl || category.imageUrl} 
                        alt={pkg.name}
                        className="w-full h-full object-cover object-center"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-[#14382E]/10" />
                    </div>

                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-[#14382E] text-white text-[10px] font-semibold tracking-wide">
                          {testsCount} {testsCount === 1 ? 'Test' : 'Tests'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E2DCD0] text-[#14382E] text-[10px] font-medium">
                          {paramsCount} Parameters
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#FAF0E8] border border-[#F2DACB] text-[#A94B2F] text-[10px] font-medium">
                          {pkg.fastingRequiredHours > 0 ? `${pkg.fastingRequiredHours}h Fasting` : 'No Fasting'}
                        </span>
                      </div>

                      <h4 
                        className="text-base sm:text-lg text-[#14382E] font-medium leading-snug group-hover:text-[#A94B2F] transition-colors"
                        style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                      >
                        {pkg.name}
                      </h4>

                      <p className="text-xs text-[#71827A] line-clamp-2 leading-relaxed">
                        {pkg.description}
                      </p>

                      {/* Included Tests Preview */}
                      <div className="pt-1 flex items-center gap-1.5 flex-wrap text-[11px] text-[#4A5B53]">
                        <span className="font-semibold text-[#14382E]">Includes:</span>
                        {pkg.biomarkersCovered.slice(0, 3).map((bio, idx) => (
                          <span key={idx} className="bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#E2DCD0]/60">
                            {bio}
                          </span>
                        ))}
                        {pkg.biomarkersCovered.length > 3 && (
                          <span className="text-[10px] text-[#71827A]">
                            +{pkg.biomarkersCovered.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Pricing, Assurance & Dual CTAs */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E2DCD0]/60 shrink-0">
                    <div className="sm:text-right">
                      <div className="flex items-baseline sm:justify-end gap-1.5">
                        <span className="text-lg sm:text-xl font-bold text-[#14382E] tabular-nums">
                          ₹{pkg.price}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#71827A] block">
                        Illustrative demo price
                      </span>
                      <span className="text-[10px] text-[#A94B2F] font-medium block">
                        ✓ Home collection included
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectPackageForDetail(pkg)}
                        className="px-3.5 py-2 rounded-full bg-white hover:bg-[#FAF7F2] border border-[#E2DCD0] text-[#14382E] text-xs font-semibold transition cursor-pointer"
                      >
                        View details
                      </button>

                      <button
                        type="button"
                        onClick={() => onSelectPackageForBooking(pkg)}
                        className="px-4 py-2 rounded-full bg-[#14382E] hover:bg-[#14382E]/90 text-white text-xs font-semibold transition cursor-pointer shadow-2xs active:scale-95 flex items-center gap-1"
                      >
                        <span>Book</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. FOOTER BACK NAVIGATION */}
        <div className="pt-3 border-t border-[#E2DCD0] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#FAF7F2] border border-[#E2DCD0] text-xs font-medium text-[#14382E] transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>

          <span className="text-xs text-[#71827A]">
            Doorstep phlebotomy with cold-chain vacutainers
          </span>
        </div>

      </div>
    </Modal>
  );
};
