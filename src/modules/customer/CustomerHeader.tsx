import React, { useState } from 'react';
import { 
  Bell, 
  ChevronDown, 
  Users, 
  Check, 
  HelpCircle,
  Menu,
  X
} from 'lucide-react';
import { HealthcarePerson } from '../../core/types/domain';

interface CustomerHeaderProps {
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

export const CustomerHeader: React.FC<CustomerHeaderProps> = ({
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Overview' },
    { id: 'journeys', label: 'Care Journeys' },
    { id: 'doctors', label: 'Doctor Consults' },
    { id: 'diagnostics', label: 'Diagnostics & Labs' },
    { id: 'records', label: 'Health Records' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      {/* Strict One-Row Three-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Single text element Brand Wordmark */}
        <div className="flex items-center gap-6">
          <a
            href="#overview"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('home');
            }}
            className="text-xl font-bold tracking-tight text-slate-900 select-none cursor-pointer whitespace-nowrap"
          >
            Arogya
          </a>

          {/* Zone 2 (Desktop): 4-5 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap rounded-md ${
                    isActive
                      ? 'text-slate-950 font-semibold bg-slate-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Zone 3: 1-2 Primary Actions (Family Switcher + Care Support) */}
        <div className="flex items-center gap-2.5">
          {/* Family Patient Selector */}
          <div className="relative">
            <button
              onClick={() => setShowPersonDropdown(!showPersonDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition cursor-pointer text-xs whitespace-nowrap"
              title="Change active patient context"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="font-semibold text-slate-900 truncate max-w-[120px] sm:max-w-[160px]">
                {selectedPerson.fullName}
              </span>
              <span className="text-slate-400 hidden sm:inline">· {selectedPerson.relationship}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {showPersonDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-slate-200 p-2 z-50 text-xs animate-in fade-in duration-100">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Care Managed For
                </div>
                {familyMembers.map((member) => {
                  const isCurrent = member.id === selectedPerson.id;
                  return (
                    <button
                      key={member.id}
                      onClick={() => {
                        onSelectPerson(member);
                        setShowPersonDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg transition cursor-pointer text-left ${
                        isCurrent
                          ? 'bg-slate-100 text-slate-900 font-semibold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-slate-900">{member.fullName}</div>
                        <div className="text-[11px] text-slate-500">
                          {member.relationship} · {member.bloodGroup} · {member.chronicConditions.length > 0 ? member.chronicConditions.join(', ') : 'Healthy'}
                        </div>
                      </div>
                      {isCurrent && <Check className="w-4 h-4 text-slate-900 shrink-0" />}
                    </button>
                  );
                })}

                <div className="pt-2 mt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setShowPersonDropdown(false);
                      onOpenFamilyModal();
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs font-semibold text-slate-800 hover:text-slate-950 hover:bg-slate-50 rounded-md transition flex items-center gap-2 cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span>Manage Family Profiles</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-600" />
            )}
          </button>

          {/* Primary Action Button */}
          {onOpenCareAssistModal && (
            <button
              onClick={onOpenCareAssistModal}
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-300" />
              <span>Care Navigator</span>
            </button>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                  isActive ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-600'
                }`}
              >
                {link.label}
              </button>
            );
          })}
          {onOpenCareAssistModal && (
            <button
              onClick={() => {
                onOpenCareAssistModal();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-900 bg-slate-50 mt-2 flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4 text-slate-500" />
              <span>Care Navigator Support</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
