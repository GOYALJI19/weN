import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Download, 
  Calendar, 
  ExternalLink,
  ChevronRight,
  Filter,
  Eye,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';
import { HealthRecordDocument } from '../../core/types/domain';
import { VisualReportModal } from './VisualReportModal';

interface RecordsViewProps {
  records: HealthRecordDocument[];
  onBookDoctorFollowUp?: () => void;
}

export const RecordsView: React.FC<RecordsViewProps> = ({
  records,
  onBookDoctorFollowUp,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedRecordForModal, setSelectedRecordForModal] = useState<HealthRecordDocument | null>(null);

  const filteredRecords = records.filter((rec) => {
    const matchesSearch = 
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.doctorOrLabName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rec.overallImpression && rec.overallImpression.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = filterCategory === 'all' || rec.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-20 max-w-2xl mx-auto text-[#14382E]">
      {/* 1. EDITORIAL HEADER */}
      <div className="space-y-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#A9B9A0] block">
          Records & Reports Vault
        </span>
        <h1 
          className="text-2xl sm:text-3xl text-[#14382E] tracking-tight leading-tight"
          style={{ fontFamily: "'Newsreader', Georgia, serif" }}
        >
          Visual Health Records
        </h1>
        <p className="text-xs sm:text-sm text-[#71827A]">
          Original hospital PDFs preserved alongside non-diagnostic visual biomarker indicators.
        </p>
      </div>

      {/* 2. SEARCH BAR */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#14382E]/60 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search reports, lipid panel, doctor summaries..."
          className="w-full h-12 pl-11 pr-4 bg-white rounded-full border border-[#E2DCD0] text-sm text-[#14382E] placeholder-[#71827A] focus:outline-none focus:border-[#14382E] shadow-2xs"
        />
      </div>

      {/* 3. RECORDS LIST WITH FOLDED CORNER MASK */}
      <div className="space-y-3">
        {filteredRecords.map((rec) => (
          <div 
            key={rec.id}
            onClick={() => setSelectedRecordForModal(rec)}
            className="p-5 rounded-3xl bg-white border border-[#E2DCD0] shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3.5">
                {/* Folded Corner Mask Document Icon with Terracotta Wax Bead */}
                <div className="w-12 h-14 bg-[#FAF7F2] rounded-xl flex items-center justify-center shrink-0 border border-[#E2DCD0] group-hover:scale-105 transition-transform relative">
                  <svg className="w-6 h-7" viewBox="0 0 28 32" fill="none">
                    <path d="M4 2 H18 L24 8 V28 C24 29.1 23.1 30 22 30 H4 C2.9 30 2 29.1 2 28 V4 C2 2.9 2.9 2 4 2 Z" fill="#FFFFFF" stroke="#14382E" strokeWidth="1.5" />
                    <path d="M18 2 V8 H24" fill="#E2DCD0" stroke="#14382E" strokeWidth="1.5" />
                    <line x1="6" y1="12" x2="16" y2="12" stroke="#A9B9A0" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="6" y1="16" x2="20" y2="16" stroke="#A9B9A0" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="19" cy="23" r="3" fill="#A94B2F" />
                  </svg>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[11px] text-[#A9B9A0] font-semibold uppercase tracking-wider block">
                    {rec.category}
                  </span>
                  <h3 
                    className="text-lg text-[#14382E] font-medium leading-snug"
                    style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                  >
                    {rec.title}
                  </h3>
                  <p className="text-xs text-[#71827A]">
                    {rec.doctorOrLabName} · {rec.date} · {rec.personName}
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-[#EDE7F2] text-[#14382E] text-[11px] font-semibold shrink-0">
                Understood
              </span>
            </div>

            {/* Biomarker highlights if available */}
            {rec.keyBiomarkers && rec.keyBiomarkers.length > 0 && (
              <div className="pt-2 border-t border-[#E2DCD0]/60 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {rec.keyBiomarkers.slice(0, 4).map((marker, idx) => (
                  <div key={idx} className="p-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E2DCD0]/60 text-xs">
                    <span className="text-[11px] text-[#71827A] truncate block">{marker.name}</span>
                    <span className="font-bold text-[#14382E] tabular-nums block mt-0.5">{marker.value} {marker.unit}</span>
                    <span className={`text-[10px] font-medium ${marker.status === 'high' ? 'text-[#A94B2F]' : 'text-[#14382E]'}`}>
                      {marker.status === 'high' ? '▲ Above range' : '✓ Normal'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 border-t border-[#E2DCD0]/60 flex items-center justify-between text-xs">
              <span className="text-[#71827A]">Click to open visual report</span>
              <span className="font-semibold text-[#14382E] group-hover:underline flex items-center gap-1">
                <span>View Analysis</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Visual Report Modal (Matching Page 7) */}
      <VisualReportModal
        record={selectedRecordForModal}
        isOpen={!!selectedRecordForModal}
        onClose={() => setSelectedRecordForModal(null)}
        onBookFollowUp={onBookDoctorFollowUp}
      />
    </div>
  );
};
