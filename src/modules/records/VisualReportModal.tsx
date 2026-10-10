import React, { useState } from 'react';
import { HealthRecordDocument } from '../../core/types/domain';
import { Modal } from '../../core/components/Modal';
import { Download, Share2, FileText, ExternalLink, AlertTriangle, Check, ArrowRight } from 'lucide-react';

interface VisualReportModalProps {
  record: HealthRecordDocument | null;
  isOpen: boolean;
  onClose: () => void;
  onBookFollowUp?: () => void;
}

export const VisualReportModal: React.FC<VisualReportModalProps> = ({
  record,
  isOpen,
  onClose,
  onBookFollowUp,
}) => {
  if (!record) return null;

  const [activeTab, setActiveTab] = useState<'understood' | 'pdf'>('understood');

  // Biomarkers to display (fallback to approved Lipid Profile if none attached)
  const defaultBiomarkers = [
    {
      name: 'Total cholesterol',
      value: '212',
      unit: 'mg/dL',
      numericValue: 212,
      referenceLow: 0,
      referenceHigh: 200,
      status: 'high' as const,
      statusLabel: '▲ Above supplied range (<200)',
      trend: 'Jun 198 → Oct 212',
      percentage: 75,
    },
    {
      name: 'LDL',
      value: '148',
      unit: 'mg/dL',
      numericValue: 148,
      referenceLow: 0,
      referenceHigh: 100,
      status: 'high' as const,
      statusLabel: '▲ Above supplied range (<100)',
      trend: 'Jun 131 → Oct 148',
      percentage: 82,
    },
    {
      name: 'HDL',
      value: '52',
      unit: 'mg/dL',
      numericValue: 52,
      referenceLow: 40,
      referenceHigh: 100,
      status: 'normal' as const,
      statusLabel: '✓ Within supplied range (>40)',
      trend: 'First result',
      percentage: 55,
    },
    {
      name: 'Triglycerides',
      value: '130',
      unit: 'mg/dL',
      numericValue: 130,
      referenceLow: 0,
      referenceHigh: 150,
      status: 'normal' as const,
      statusLabel: '✓ Within supplied range (<150)',
      trend: 'First result',
      percentage: 60,
    },
  ];

  const markers = record.keyBiomarkers && record.keyBiomarkers.length > 0
    ? record.keyBiomarkers.map(m => ({
        name: m.name,
        value: m.value,
        unit: m.unit,
        numericValue: m.numericValue,
        referenceLow: m.referenceLow,
        referenceHigh: m.referenceHigh,
        status: m.status,
        statusLabel: m.status === 'high' 
          ? `▲ Above supplied range (<${m.referenceHigh})` 
          : `✓ Within supplied range (>${m.referenceLow || 0})`,
        trend: m.previousValue ? `${m.previousValue} → ${m.value}` : 'First result',
        percentage: m.status === 'high' ? 80 : 50,
      }))
    : defaultBiomarkers;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      maxWidth="lg"
    >
      <div className="space-y-6 text-[#14382E] -mt-3">
        {/* 1. HEADER (Matching Botanica Page 7: Records · Reports | Lipid profile | Sagar Labs · 9 Oct 2026 · Anita) */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs text-[#71827A] font-medium block">
              Records · Reports
            </span>
            <h2 
              className="text-2xl sm:text-3xl text-[#14382E] tracking-tight font-normal"
              style={{ fontFamily: "'Newsreader', Georgia, serif" }}
            >
              {record.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#71827A]">
              {record.doctorOrLabName} · {record.date} · {record.personName}
            </p>
          </div>

          {/* Folded Corner Badge Icon with Terracotta Wax Bead */}
          <div className="w-14 h-16 bg-[#FAF7F2] rounded-2xl flex items-center justify-center shrink-0 border border-[#E2DCD0] relative">
            <svg className="w-8 h-9" viewBox="0 0 28 32" fill="none">
              <path d="M4 2 H18 L24 8 V28 C24 29.1 23.1 30 22 30 H4 C2.9 30 2 29.1 2 28 V4 C2 2.9 2.9 2 4 2 Z" fill="#FFFFFF" stroke="#14382E" strokeWidth="1.5" />
              <path d="M18 2 V8 H24" fill="#E2DCD0" stroke="#14382E" strokeWidth="1.5" />
              <line x1="6" y1="12" x2="16" y2="12" stroke="#A9B9A0" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="6" y1="16" x2="20" y2="16" stroke="#A9B9A0" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="19" cy="23" r="3.5" fill="#A94B2F" />
            </svg>
          </div>
        </div>

        {/* 2. SEGMENTED CONTROL (Understood vs Original PDF) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('understood')}
            className={`flex-1 py-2.5 rounded-full text-xs font-semibold transition cursor-pointer border ${
              activeTab === 'understood'
                ? 'bg-[#14382E] text-white border-[#14382E] shadow-2xs'
                : 'bg-white text-[#14382E] border-[#E2DCD0] hover:bg-[#FAF7F2]'
            }`}
          >
            Understood
          </button>

          <button
            onClick={() => setActiveTab('pdf')}
            className={`flex-1 py-2.5 rounded-full text-xs font-semibold transition cursor-pointer border ${
              activeTab === 'pdf'
                ? 'bg-[#14382E] text-white border-[#14382E] shadow-2xs'
                : 'bg-white text-[#14382E] border-[#E2DCD0] hover:bg-[#FAF7F2]'
            }`}
          >
            Original PDF
          </button>
        </div>

        {/* 3. UNDERSTOOD BIOMARKER METERS VIEW */}
        {activeTab === 'understood' ? (
          <div className="space-y-4">
            <div className="space-y-3">
              {markers.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-3xl bg-white border border-[#E2DCD0] shadow-2xs space-y-2.5"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-semibold text-sm text-[#14382E]">
                      {item.name}
                    </span>
                    <div className="text-right">
                      <span className="text-xl font-bold text-[#14382E] tabular-nums">
                        {item.value}
                      </span>
                      <span className="text-xs text-[#71827A] ml-1">
                        {item.unit}
                      </span>
                    </div>
                  </div>

                  {/* Range Gauge Bar */}
                  <div className="relative pt-1 pb-1">
                    <div className="w-full h-2 rounded-full bg-[#EFE9DD] overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          item.status === 'high' ? 'bg-[#A94B2F]' : 'bg-[#A9B9A0]'
                        }`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Status & Delta Trend */}
                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <span className={`font-medium ${
                      item.status === 'high' ? 'text-[#A94B2F]' : 'text-[#14382E]'
                    }`}>
                      {item.statusLabel}
                    </span>
                    <span className="text-[#71827A] text-[11px]">
                      {item.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* 4. MANDATORY CLINICAL DISCLAIMER (Matching Botanica Page 7) */}
            <div className="p-4 rounded-3xl bg-[#FAF7F2] border border-[#E2DCD0] text-xs text-[#4A5B53] leading-relaxed">
              Status compares your values with the range printed on the report. It is not a diagnosis. Share it with Dr. Menon at follow-up.
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  if (onBookFollowUp) onBookFollowUp();
                  onClose();
                }}
                className="px-5 py-2.5 rounded-full bg-[#14382E] hover:bg-[#14382E]/90 text-white text-xs font-semibold transition cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <span>Book Follow-up with Dr. Menon</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('pdf')}
                className="px-4 py-2.5 rounded-full bg-white hover:bg-[#FAF7F2] border border-[#E2DCD0] text-[#14382E] text-xs font-medium transition cursor-pointer"
              >
                View Hospital Scan
              </button>
            </div>
          </div>
        ) : (
          /* 5. ORIGINAL PDF VIEW */
          <div className="space-y-4">
            <div className="p-6 rounded-3xl bg-[#FAF7F2] border border-[#E2DCD0] text-center space-y-4">
              <div className="w-16 h-20 bg-white border border-[#E2DCD0] rounded-xl mx-auto flex items-center justify-center shadow-xs">
                <FileText className="w-8 h-8 text-[#14382E]" />
              </div>

              <div>
                <h4 className="font-semibold text-sm text-[#14382E]">
                  Official Laboratory Document Scan
                </h4>
                <p className="text-xs text-[#71827A] mt-0.5">
                  NABL reference number: SAGAR-LAB-DEL-9842 · Authenticated by Chief Biochemist
                </p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-[#E2DCD0] text-left text-xs text-[#4A5B53] space-y-1 font-mono">
                <div>PATIENT: ANITA DESAI · AGE: 34 · GENDER: F</div>
                <div>ACCESSION DATE: 09-OCT-2026 08:15 AM</div>
                <div>LABORATORY: SAGAR LABS (DELHI NCR)</div>
                <div className="border-t border-[#E2DCD0] my-2 pt-2">
                  <div>TOTAL CHOLESTEROL: 212 mg/dL [REF: &lt;200] *HIGH*</div>
                  <div>LDL CHOLESTEROL: 148 mg/dL [REF: &lt;100] *HIGH*</div>
                  <div>HDL CHOLESTEROL: 52 mg/dL [REF: &gt;40] NORMAL</div>
                  <div>TRIGLYCERIDES: 130 mg/dL [REF: &lt;150] NORMAL</div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => alert('Download initiated: Lab_Report_Lipid_Profile_Anita.pdf')}
                  className="px-5 py-2.5 rounded-full bg-[#14382E] text-white text-xs font-semibold hover:bg-[#14382E]/90 transition flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Verified PDF</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
