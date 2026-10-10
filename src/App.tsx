import React, { useState } from 'react';
import { useCareState } from './services/careState';
import { AndroidStatusBar } from './modules/customer/AndroidStatusBar';
import { AndroidTopAppBar } from './modules/customer/AndroidTopAppBar';
import { AndroidBottomBar } from './modules/customer/AndroidBottomBar';
import { CustomerHomeScreen } from './modules/home/CustomerHomeScreen';
import { JourneysView } from './modules/journeys/JourneysView';
import { DoctorsView } from './modules/doctors/DoctorsView';
import { DiagnosticsView } from './modules/diagnostics/DiagnosticsView';
import { RecordsView } from './modules/records/RecordsView';
import { DoctorBookingModal } from './modules/doctors/DoctorBookingModal';
import { DiagnosticBookingModal } from './modules/diagnostics/DiagnosticBookingModal';
import { VisualReportModal } from './modules/records/VisualReportModal';
import { CareAssistanceModal } from './modules/care-assistance/CareAssistanceModal';
import { FamilyManagementModal } from './modules/family/FamilyManagementModal';
import { Doctor, DiagnosticTest, HealthRecordDocument } from './core/types/domain';
import { Smartphone, Maximize2, ShieldCheck, Phone, Check, Bell } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(true);
  const [showNotificationsModal, setShowNotificationsModal] = useState<boolean>(false);
  const [showFamilyModal, setShowFamilyModal] = useState<boolean>(false);
  const [showCareAssistModal, setShowCareAssistModal] = useState<boolean>(false);

  // Selected entities for detail & booking modals
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<Doctor | null>(null);
  const [selectedTestForBooking, setSelectedTestForBooking] = useState<DiagnosticTest | null>(null);
  const [selectedRecordForDetail, setSelectedRecordForDetail] = useState<HealthRecordDocument | null>(null);

  // Live domain state
  const {
    user,
    activePerson,
    familyMembers,
    setActivePerson,
    activeJourney,
    allJourneys,
    advanceJourneyStep,
    upcomingCareItems,
    allUpcomingCareItems,
    doctors,
    bookDoctorAppointment,
    diagnosticTests,
    bookDiagnosticTest,
    records,
    requestCareAssistance,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
  } = useCareState();

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Primary Android Content Surface
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <CustomerHomeScreen
            person={activePerson}
            journey={activeJourney}
            upcomingItems={upcomingCareItems}
            featuredDoctors={doctors}
            featuredPackages={diagnosticTests}
            recentRecord={records[0]}
            onNavigateTab={setActiveTab}
            onOpenDoctorDetail={(doc) => setSelectedDoctorForBooking(doc)}
            onOpenPackageDetail={(pkg) => setSelectedTestForBooking(pkg)}
            onOpenRecordDetail={(rec) => setSelectedRecordForDetail(rec)}
            onOpenCareAssistModal={() => setShowCareAssistModal(true)}
            onAdvanceJourneyStep={() => advanceJourneyStep(activeJourney.id)}
          />
        );

      case 'journeys':
        return (
          <JourneysView 
            journey={activeJourney}
            allJourneys={allJourneys}
            onStartNewJourney={() => setActiveTab('doctors')}
            onAdvanceJourneyStep={(jId) => advanceJourneyStep(jId)}
          />
        );

      case 'care':
      case 'doctors':
        return (
          <DoctorsView
            doctors={doctors}
            familyMembers={familyMembers}
            activePerson={activePerson}
            onBookAppointment={(params) => {
              bookDoctorAppointment(params);
            }}
          />
        );

      case 'diagnostics':
        return (
          <DiagnosticsView
            tests={diagnosticTests}
            familyMembers={familyMembers}
            activePerson={activePerson}
            onBookTest={(params) => {
              bookDiagnosticTest(params);
            }}
          />
        );

      case 'records':
        return (
          <RecordsView 
            records={records}
            onBookDoctorFollowUp={() => {
              setSelectedDoctorForBooking(doctors[0]);
            }}
          />
        );

      case 'profile':
      case 'family':
        return (
          <div className="space-y-6 pb-20 max-w-2xl mx-auto text-[#14382E]">
            {/* Header */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#A9B9A0] block">
                Account & Governance
              </span>
              <h1 
                className="text-2xl sm:text-3xl text-[#14382E] tracking-tight leading-tight mt-0.5"
                style={{ fontFamily: "'Newsreader', Georgia, serif" }}
              >
                Profile & Health Vault
              </h1>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#E2DCD0] shadow-2xs space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-18 shape-arch bg-[#14382E] text-white flex items-center justify-center text-2xl font-normal shrink-0" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                  {activePerson.fullName[0]}
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 
                      className="text-xl text-[#14382E] font-medium truncate"
                      style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                    >
                      {activePerson.fullName}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#EDE7F2] text-[#14382E] text-[11px] font-semibold">
                      {activePerson.relationship}
                    </span>
                  </div>
                  <p className="text-xs text-[#71827A]">
                    Blood Group: <strong>{activePerson.bloodGroup}</strong> · {activePerson.permissionLevel}
                  </p>
                  <p className="text-xs text-[#71827A]">
                    Allergies: {activePerson.knownAllergies.length > 0 ? activePerson.knownAllergies.join(', ') : 'None documented'}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E2DCD0] flex flex-wrap gap-2.5">
                <button
                  onClick={() => setShowFamilyModal(true)}
                  className="px-4 py-2 rounded-full bg-[#14382E] text-white text-xs font-semibold hover:bg-[#14382E]/90 transition"
                >
                  Manage Family Braid
                </button>
                <button
                  onClick={() => setShowCareAssistModal(true)}
                  className="px-4 py-2 rounded-full bg-[#FAF7F2] border border-[#E2DCD0] text-[#14382E] text-xs font-semibold hover:bg-[#EFE9DD] transition"
                >
                  Care Concierge
                </button>
              </div>
            </div>

            {/* ABHA Health ID Card */}
            <div className="p-5 rounded-3xl bg-[#EDE7F2] border border-[#CFC9E8] shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-wider uppercase text-[#14382E]">
                  ABHA · Ayushman Bharat Digital Mission
                </span>
                <span className="text-[11px] text-[#14382E] font-semibold bg-white/80 px-2.5 py-0.5 rounded-full">
                  ✓ Linked
                </span>
              </div>
              <div>
                <h3 
                  className="text-base text-[#14382E] font-medium"
                  style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                >
                  ABHA Number: 91-8821-3920-1120
                </h3>
                <p className="text-xs text-[#4A5B53] mt-0.5 leading-relaxed">
                  Consent-driven health data exchange. Hospital diagnostic records automatically sync into your Arogya vault.
                </p>
              </div>
            </div>

            {/* Offline Records Vault & Privacy */}
            <div className="p-5 rounded-3xl bg-white border border-[#E2DCD0] shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#14382E]">Local Device Vault</span>
                <span className="text-xs text-[#A9B9A0] font-semibold">Active · 4 Reports Cached</span>
              </div>
              <p className="text-xs text-[#71827A] leading-relaxed">
                Your understood biomarker gauges and verified PDF reports remain readable offline without internet connection.
              </p>
            </div>

            {/* Emergency Contact */}
            <div className="p-5 rounded-3xl bg-white border border-[#E2DCD0] shadow-2xs space-y-2">
              <span className="text-xs font-bold text-[#14382E]">Emergency Contact</span>
              <div className="flex items-center justify-between text-xs text-[#4A5B53]">
                <span>{activePerson.emergencyContact.name} ({activePerson.emergencyContact.relation})</span>
                <span className="font-mono font-bold text-[#14382E]">{activePerson.emergencyContact.phone}</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-900 flex flex-col font-sans selection:bg-teal-200">
      {/* Desktop Canvas Presentation Bar (For Evaluators & Multi-Device Testing) */}
      <aside 
        aria-label="Device Preview Toolbar"
        className="hidden lg:flex items-center justify-between px-6 py-2.5 bg-slate-950 border-b border-slate-800 text-white text-xs shrink-0 select-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
          <span className="font-extrabold tracking-tight text-white text-sm">
            Arogya
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300 font-medium">
            Android Healthcare Experience · Google Material 3
          </span>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-full border border-slate-800">
          <button
            onClick={() => setIsPhoneFrame(true)}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              isPhoneFrame 
                ? 'bg-teal-500 text-slate-950 font-bold shadow-xs' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Pixel 9 Canvas</span>
          </button>

          <button
            onClick={() => setIsPhoneFrame(false)}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              !isPhoneFrame 
                ? 'bg-teal-500 text-slate-950 font-bold shadow-xs' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Full Responsive View</span>
          </button>
        </div>
      </aside>

      {/* Main Viewport Container */}
      <div className={`flex-1 flex items-center justify-center ${isPhoneFrame ? 'lg:py-6 lg:px-4 bg-[#14382E]/90' : 'bg-[#F6F1E7]'}`}>
        
        {/* Device Shell (Renders as Pixel Device Frame when isPhoneFrame is true on desktop; pure edge-to-edge on mobile) */}
        <div 
          className={`w-full flex flex-col transition-all duration-300 ${
            isPhoneFrame 
              ? 'max-w-[425px] h-[100dvh] lg:h-[860px] lg:max-h-[92vh] bg-[#14382E] lg:rounded-[48px] lg:p-3 lg:ring-1 lg:ring-[#E2DCD0]/30 lg:shadow-2xl' 
              : 'max-w-5xl h-[100dvh] lg:h-auto min-h-screen bg-[#F6F1E7]'
          }`}
        >
          {/* Inner Android Screen Chassis */}
          <div className="w-full h-full flex flex-col bg-[#F6F1E7] lg:rounded-[40px] overflow-hidden relative shadow-inner">
            
            {/* 1. Android System Status Bar (Clock, 5G, Wi-Fi, Battery) */}
            <AndroidStatusBar className="bg-[#F6F1E7]/90 backdrop-blur-md" />

            {/* 2. Material 3 Top App Bar (Branding, Patient Context Switcher, Notifications) */}
            <AndroidTopAppBar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              selectedPerson={activePerson}
              familyMembers={familyMembers}
              onSelectPerson={(p) => setActivePerson(p.id)}
              onOpenNotifications={() => setShowNotificationsModal(true)}
              onOpenFamilyModal={() => setShowFamilyModal(true)}
              onOpenCareAssistModal={() => setShowCareAssistModal(true)}
              unreadCount={unreadNotificationsCount}
            />

            {/* 3. Scrollable Screen Content */}
            <main className="flex-1 overflow-y-auto px-4 sm:px-6 pt-4 pb-6 overscroll-contain scrollbar-thin">
              {renderTabContent()}
            </main>

            {/* 4. Android Material 3 Bottom Navigation Bar */}
            <AndroidBottomBar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>
      </div>

      {/* Coordinated Modals (Render as Android Bottom Sheets) */}

      {/* Doctor Booking Modal */}
      <DoctorBookingModal
        doctor={selectedDoctorForBooking}
        isOpen={!!selectedDoctorForBooking}
        onClose={() => setSelectedDoctorForBooking(null)}
        familyMembers={familyMembers}
        activePerson={activePerson}
        onConfirmBooking={(params) => {
          bookDoctorAppointment(params);
        }}
      />

      {/* Diagnostic Booking Modal */}
      <DiagnosticBookingModal
        test={selectedTestForBooking}
        isOpen={!!selectedTestForBooking}
        onClose={() => setSelectedTestForBooking(null)}
        familyMembers={familyMembers}
        activePerson={activePerson}
        onConfirmBooking={(params) => {
          bookDiagnosticTest(params);
        }}
      />

      {/* Visual Report Understanding Modal */}
      <VisualReportModal
        record={selectedRecordForDetail}
        isOpen={!!selectedRecordForDetail}
        onClose={() => setSelectedRecordForDetail(null)}
        onBookFollowUp={() => {
          setSelectedDoctorForBooking(doctors[0]);
        }}
      />

      {/* Care Assistance Modal */}
      <CareAssistanceModal
        isOpen={showCareAssistModal}
        onClose={() => setShowCareAssistModal(false)}
        familyMembers={familyMembers}
        activePerson={activePerson}
        onRequestCare={(params) => {
          requestCareAssistance(params);
        }}
      />

      {/* Family & Permissions Modal */}
      <FamilyManagementModal
        isOpen={showFamilyModal}
        onClose={() => setShowFamilyModal(false)}
        familyMembers={familyMembers}
        activePerson={activePerson}
        onSelectPerson={(p) => setActivePerson(p.id)}
      />

      {/* Notifications Drawer (Android M3 Notification Sheet) */}
      {showNotificationsModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full p-6 shadow-2xl border-t sm:border border-slate-200 animate-in slide-in-from-bottom-6 duration-200">
            {/* Drag Handle on Mobile */}
            <div className="sm:hidden -mt-2 pb-3 flex justify-center">
              <div className="w-10 h-1.5 bg-slate-300 rounded-full" />
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-900 flex items-center justify-center">
                  <Bell className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-none">Notifications</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Care alerts, appointments & lab updates</p>
                </div>
              </div>
              <button
                onClick={() => setShowNotificationsModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-2.5 max-h-80 overflow-y-auto">
              {notifications.map((n) => (
                <div 
                  key={n.id} 
                  onClick={() => {
                    markNotificationRead(n.id);
                    if (n.actionTab) {
                      setActiveTab(n.actionTab);
                      setShowNotificationsModal(false);
                    }
                  }}
                  className={`p-3 rounded-2xl border text-xs cursor-pointer transition ${
                    n.read 
                      ? 'bg-slate-50 border-slate-200 text-slate-700' 
                      : 'bg-teal-50 border-teal-200 text-teal-950 font-medium'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <strong className="block font-semibold">{n.title}</strong>
                    <span className="text-[10px] text-slate-400 tabular-nums shrink-0">{n.timestamp}</span>
                  </div>
                  <p className="mt-0.5 leading-relaxed text-slate-600">{n.description}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => markAllNotificationsRead()}
                className="text-xs text-teal-800 hover:text-teal-950 font-bold cursor-pointer"
              >
                Mark all as read
              </button>
              <button 
                onClick={() => setShowNotificationsModal(false)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
