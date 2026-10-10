import React from 'react';
import { HealthcarePerson } from '../../core/types/domain';
import { Modal } from '../../core/components/Modal';
import { Users, ShieldCheck, Check, Phone, Plus, Lock } from 'lucide-react';

interface FamilyManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  familyMembers: HealthcarePerson[];
  activePerson: HealthcarePerson;
  onSelectPerson: (person: HealthcarePerson) => void;
}

export const FamilyManagementModal: React.FC<FamilyManagementModalProps> = ({
  isOpen,
  onClose,
  familyMembers,
  activePerson,
  onSelectPerson,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Family Care Braid"
      subtitle="One strand per person · Delegated care management and permissions"
      maxWidth="md"
    >
      <div className="space-y-4 text-xs sm:text-sm text-[#14382E]">
        {/* The Family Braid Principle Card */}
        <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#E2DCD0] text-xs text-[#4A5B53] flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#A9B9A0] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="block font-semibold text-[#14382E]">Connected Family Strands</strong>
            Each family member maintains an independent care thread. You can book tests, view records, or authorize companions according to delegated permissions.
          </div>
        </div>

        {/* Member cards */}
        <div className="space-y-2.5">
          {familyMembers.map((member) => {
            const isActive = member.id === activePerson.id;
            const hasRestrictedAccess = member.permissionLevel.includes('View Records');

            return (
              <div
                key={member.id}
                onClick={() => {
                  onSelectPerson(member);
                  onClose();
                }}
                className={`p-4 rounded-3xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                  isActive
                    ? 'border-[#14382E] bg-[#EDE7F2] shadow-2xs ring-1 ring-[#14382E]'
                    : 'border-[#E2DCD0] bg-white hover:border-[#14382E]/40'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Arch Avatar */}
                  <div className={`w-10 h-12 shape-arch flex items-center justify-center font-bold text-xs text-white shrink-0 ${
                    isActive ? 'bg-[#14382E]' : 'bg-[#A94B2F]'
                  }`}>
                    {member.fullName.charAt(0)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 
                        className="font-medium text-sm text-[#14382E] truncate"
                        style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                      >
                        {member.fullName}
                      </h4>
                      <span className="text-[11px] text-[#71827A]">
                        ({member.relationship})
                      </span>
                    </div>

                    <p className="text-[11px] text-[#71827A] mt-0.5">
                      Blood: <strong>{member.bloodGroup}</strong> · {member.permissionLevel}
                    </p>

                    {hasRestrictedAccess && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-[#A94B2F] mt-1 font-medium">
                        <Lock className="w-3 h-3" />
                        <span>Permission clasp · Ramesh can grant full care</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="shrink-0">
                  {isActive ? (
                    <span className="px-3 py-1 rounded-full bg-[#14382E] text-white text-[11px] font-semibold">
                      Active
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="px-3 py-1 rounded-full bg-white hover:bg-[#FAF7F2] border border-[#E2DCD0] text-[11px] font-medium text-[#14382E]"
                    >
                      Switch
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Dependent Action */}
        <div className="pt-2 border-t border-[#E2DCD0] flex justify-end">
          <button
            onClick={() => {
              alert('Add family member sheet: Name, Relationship, Blood Group, ABHA ID linkage.');
            }}
            className="px-4 py-2 rounded-full bg-white hover:bg-[#FAF7F2] border border-[#E2DCD0] text-xs font-semibold text-[#14382E] transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-[#14382E]" />
            <span>Add Family Member</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
