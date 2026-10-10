import React, { useState } from 'react';
import { 
  Bell, 
  ChevronDown, 
  Users, 
  Check, 
  Headphones, 
  HeartHandshake
} from 'lucide-react';
import { HealthcarePerson } from '../../core/types/domain';

interface AndroidTopAppBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedPerson: HealthcarePerson;
  familyMembers: HealthcarePerson[];
  onSelectPerson: (person: HealthcarePerson) => void;
  onOpenNotifications: () => void;
  onOpenFamilyModal: () => void;
  onOpenCareAssistModal?: () => void;
  unreadCount: number;
}

export const AndroidTopAppBar: React.FC<AndroidTopAppBarProps> = ({
  activeTab,
  setActiveTab,
  selectedPerson,
  familyMembers,
  onSelectPerson,
  onOpenNotifications,
  onOpenFamilyModal,
  onOpenCareAssistModal,
  unreadCount,
}) => {
  const [showPersonDropdown, setShowPersonDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#F6F1E7]/95 backdrop-blur-md border-b border-[#E2DCD0]/60 transition-all">
      <div className="w-full px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        {/* Botanica Brand Mark: arogya serif wordmark with leaf accent */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-1.5 group cursor-pointer text-left focus:outline-none"
            aria-label="Arogya Home"
          >
            {/* Botanica Botanical Leaf Icon */}
            <svg className="w-5 h-6 text-[#14382E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22C12 22 20 18 20 10C20 4 12 2 12 2C12 2 4 4 4 10C4 18 12 22 12 22Z" fill="#14382E" fillOpacity="0.15" />
              <path d="M12 22V2" strokeWidth="2" />
              <path d="M12 8C14.5 9.5 17 9 17 9" />
              <path d="M12 14C9.5 15.5 7 15 7 15" />
            </svg>
            <span className="text-2xl font-normal font-heading tracking-tight text-[#14382E] block leading-none lowercase" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
              arogya
            </span>
          </button>
        </div>

        {/* Right: Patient Profile Chip matching Reference (Anita · Self ▾) */}
        <div className="flex items-center gap-2">
          {/* Active Patient Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowPersonDropdown(!showPersonDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFFFFF] hover:bg-[#FAF7F2] text-[#14382E] transition cursor-pointer text-xs font-medium border border-[#E2DCD0] shadow-2xs"
              title="Change active patient context"
            >
              <span className="font-medium text-[#14382E] truncate max-w-[100px] sm:max-w-[140px]">
                {selectedPerson.fullName.split(' ')[0]}
              </span>
              <span className="text-[#71827A] text-[11px]">
                · {selectedPerson.relationship}
              </span>
              <ChevronDown className="w-3 h-3 text-[#14382E] opacity-70 shrink-0 ml-0.5" />
            </button>

            {showPersonDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Family Member
                </div>
                <div className="space-y-1">
                  {familyMembers.map((member) => {
                    const isCurrent = member.id === selectedPerson.id;
                    return (
                      <button
                        key={member.id}
                        onClick={() => {
                          onSelectPerson(member);
                          setShowPersonDropdown(false);
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl transition cursor-pointer text-left ${
                          isCurrent
                            ? 'bg-teal-50 text-teal-950 font-semibold border border-teal-200/60'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="font-semibold text-slate-900 truncate">
                            {member.fullName}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {member.relationship} · {member.bloodGroup} · {member.chronicConditions.length > 0 ? member.chronicConditions.join(', ') : 'Healthy'}
                          </div>
                        </div>
                        {isCurrent && <Check className="w-4 h-4 text-teal-700 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 mt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setShowPersonDropdown(false);
                      onOpenFamilyModal();
                    }}
                    className="w-full text-left px-2.5 py-2 text-xs font-semibold text-teal-800 hover:bg-teal-50 rounded-lg transition flex items-center gap-2 cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5 text-teal-700" />
                    <span>Manage Family Profiles</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-1.5 rounded-full text-[#14382E]/70 hover:text-[#14382E] hover:bg-[#FAF7F2] transition cursor-pointer"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 stroke-[2]" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#A94B2F] ring-2 ring-white" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
