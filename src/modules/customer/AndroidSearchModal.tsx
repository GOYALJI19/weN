import React, { useState, useMemo } from 'react';
import { Search, X, Mic, Stethoscope, TestTube2, FileText, ArrowRight, MapPin } from 'lucide-react';
import { Doctor, DiagnosticTest, HealthRecordDocument } from '../../core/types/domain';

interface AndroidSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctors: Doctor[];
  tests: DiagnosticTest[];
  records: HealthRecordDocument[];
  onSelectDoctor: (doctor: Doctor) => void;
  onSelectTest: (test: DiagnosticTest) => void;
  onSelectRecord: (record: HealthRecordDocument) => void;
}

export const AndroidSearchModal: React.FC<AndroidSearchModalProps> = ({
  isOpen,
  onClose,
  doctors,
  tests,
  records,
  onSelectDoctor,
  onSelectTest,
  onSelectRecord,
}) => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'doctors' | 'tests' | 'records'>('all');

  const filteredDoctors = useMemo(() => {
    if (!query.trim()) return doctors.slice(0, 3);
    const q = query.toLowerCase();
    return doctors.filter(
      d => d.fullName.toLowerCase().includes(q) || 
           d.specialty.toLowerCase().includes(q) ||
           d.clinicHospitalAffiliation.toLowerCase().includes(q)
    );
  }, [doctors, query]);

  const filteredTests = useMemo(() => {
    if (!query.trim()) return tests.slice(0, 3);
    const q = query.toLowerCase();
    return tests.filter(
      t => t.name.toLowerCase().includes(q) || 
           t.category.toLowerCase().includes(q) ||
           t.biomarkersCovered.some((p: string) => p.toLowerCase().includes(q))
    );
  }, [tests, query]);

  const filteredRecords = useMemo(() => {
    if (!query.trim()) return records.slice(0, 2);
    const q = query.toLowerCase();
    return records.filter(
      r => r.title.toLowerCase().includes(q) || 
           r.category.toLowerCase().includes(q) ||
           r.doctorOrLabName.toLowerCase().includes(q)
    );
  }, [records, query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex flex-col justify-start sm:p-4 animate-in fade-in duration-150">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      <div className="relative w-full max-w-xl mx-auto bg-white sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-screen sm:max-h-[85vh] z-10 animate-in slide-in-from-top-4 duration-200">
        {/* Search Input Bar (M3 Search Surface) */}
        <div className="p-3 sm:p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 bg-white rounded-full border border-slate-200 shadow-xs focus-within:ring-2 focus-within:ring-teal-600 focus-within:border-transparent transition-all">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search doctors, lab tests, or health records..."
              className="w-full text-xs sm:text-sm bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <Mic className="w-4 h-4 text-teal-700 shrink-0" />
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Cancel
          </button>
        </div>

        {/* Filter Chips (Material 3 Filter Chips) */}
        <div className="px-4 py-2 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none bg-white">
          {[
            { id: 'all', label: 'All Results' },
            { id: 'doctors', label: 'Doctors' },
            { id: 'tests', label: 'Lab Tests' },
            { id: 'records', label: 'Records' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition cursor-pointer whitespace-nowrap ${
                activeFilter === f.id
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="p-4 overflow-y-auto space-y-5 flex-1">
          {/* Doctors Section */}
          {(activeFilter === 'all' || activeFilter === 'doctors') && filteredDoctors.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-teal-700" />
                <span>Verified Doctors</span>
              </div>
              <div className="space-y-1.5">
                {filteredDoctors.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => {
                      onSelectDoctor(doc);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50/40 transition cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={doc.avatarUrl}
                        alt={doc.fullName}
                        className="w-10 h-10 rounded-full object-cover shrink-0 bg-slate-100"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-900 truncate">
                          {doc.fullName}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate">
                          {doc.specialty} · {doc.clinicHospitalAffiliation}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-slate-900">₹{doc.consultationFee}</span>
                      <span className="block text-[10px] text-teal-700 font-medium">Book Slot</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Diagnostic Tests Section */}
          {(activeFilter === 'all' || activeFilter === 'tests') && filteredTests.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <TestTube2 className="w-3.5 h-3.5 text-teal-700" />
                <span>NABL Lab Diagnostics</span>
              </div>
              <div className="space-y-1.5">
                {filteredTests.map((test) => (
                  <div
                    key={test.id}
                    onClick={() => {
                      onSelectTest(test);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50/40 transition cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-900 truncate">
                        {test.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        {test.biomarkersCovered.length} Biomarkers · Doorstep Sample Pickup
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-slate-900">₹{test.price}</span>
                      <span className="block text-[10px] text-teal-700 font-medium">Book Pickup</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Health Records Section */}
          {(activeFilter === 'all' || activeFilter === 'records') && filteredRecords.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-teal-700" />
                <span>Health Records & Lab Reports</span>
              </div>
              <div className="space-y-1.5">
                {filteredRecords.map((rec) => (
                  <div
                    key={rec.id}
                    onClick={() => {
                      onSelectRecord(rec);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50/40 transition cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-900 truncate">
                        {rec.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        {rec.date} · {rec.doctorOrLabName}
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold text-teal-700 shrink-0">
                      View Report →
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredDoctors.length === 0 && filteredTests.length === 0 && filteredRecords.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-xs">
              No matching healthcare services found for "{query}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
