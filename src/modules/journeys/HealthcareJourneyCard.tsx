import React, { useState } from 'react';
import { HealthcareJourney, JourneyStep } from '../../core/types/domain';
import { ArrowRight, AlertTriangle, Check, Clock, ShieldCheck } from 'lucide-react';

interface HealthcareJourneyCardProps {
  journey: HealthcareJourney;
  onAdvanceStep?: () => void;
}

export const HealthcareJourneyCard: React.FC<HealthcareJourneyCardProps> = ({
  journey,
  onAdvanceStep,
}) => {
  const [showPrepModal, setShowPrepModal] = useState<boolean>(false);

  // Active step index
  const activeStepIndex = journey.currentStepIndex || 2;
  const personFirstName = journey.personName.split(' ')[0] || 'Anita';

  return (
    <div className="space-y-5 text-[#14382E]">
      {/* 1. JOURNEY HEADER & CIRCLE BADGE (Matching Botanica Page 6) */}
      <div className="p-6 rounded-3xl bg-white border border-[#E2DCD0] shadow-2xs space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs text-[#71827A] font-medium block">
              Healthcare journey · {personFirstName}
            </span>
            <h2 
              className="text-2xl sm:text-3xl text-[#14382E] tracking-tight font-normal"
              style={{ fontFamily: "'Newsreader', Georgia, serif" }}
            >
              {journey.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#71827A]">
              Dr. Ravi Menon · Orthopaedics
            </p>
          </div>

          {/* Circle Journey Badge with The Care Thread Motif */}
          <div className="w-16 h-16 rounded-full bg-[#EDE7F2] border border-[#CFC9E8] flex items-center justify-center shrink-0 shadow-2xs">
            <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
              <path 
                d="M6 34 C14 34, 18 16, 26 16 C34 16, 38 28, 44 24" 
                stroke="#14382E" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
              <circle cx="14" cy="27" r="3" fill="#A9B9A0" />
              <circle cx="28" cy="18" r="4" fill="#A94B2F" stroke="#FFFFFF" strokeWidth="1.5" />
              <circle cx="40" cy="25" r="2.5" fill="#FFFFFF" stroke="#14382E" strokeWidth="1" strokeDasharray="2 2" />
            </svg>
          </div>
        </div>

        {/* 2. DELAY ALERT CALLOUT BANNER (Matching Page 6 ▲ Delayed 45 min) */}
        <div className="p-3.5 rounded-2xl bg-[#FBF0EB] border border-[#ECC9BD] text-xs text-[#A94B2F] flex items-start gap-2.5">
          <span className="font-bold text-sm shrink-0">▲</span>
          <div className="leading-relaxed">
            <strong>Delayed 45 min.</strong> Sagar Labs moved your slot from 7:30 to 8:15 am.
          </div>
        </div>

        {/* 3. THE VERTICAL CARE THREAD (3dp continuous line with beads) */}
        <div className="pt-4 relative">
          {/* Continuous vertical 3dp line down the screen */}
          <div className="absolute left-[15px] top-6 bottom-8 w-[3px] bg-[#A9B9A0] rounded-full" />

          <div className="space-y-6 relative">
            {journey.steps.map((step, idx) => {
              const isCompleted = step.status === 'completed' || idx < activeStepIndex;
              const isActive = idx === activeStepIndex || step.status === 'action_required';
              const isUpcoming = !isCompleted && !isActive;

              return (
                <div key={step.id || idx} className="flex items-start gap-4">
                  {/* Bead Node */}
                  <div className="shrink-0 pt-0.5 z-10 bg-white">
                    {isCompleted ? (
                      /* Sage Completed Bead */
                      <div className="w-8 h-8 rounded-full bg-[#A9B9A0] text-white flex items-center justify-center shadow-xs">
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    ) : isActive ? (
                      /* Terracotta Active Bead ("You Are Here") */
                      <div className="w-8 h-8 rounded-full border-[3px] border-[#A94B2F] bg-white flex items-center justify-center ring-4 ring-[#A94B2F]/20 shadow-sm">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#A94B2F]" />
                      </div>
                    ) : (
                      /* Dashed Upcoming Bead */
                      <div className="w-8 h-8 rounded-full border-2 border-dashed border-[#A9B9A0] bg-white flex items-center justify-center text-xs text-[#71827A]">
                        {idx + 1}
                      </div>
                    )}
                  </div>

                  {/* Content Column */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    {isActive ? (
                      /* Active "You Are Here" Hero Card (Matching Page 6) */
                      <div className="p-4 sm:p-5 rounded-3xl bg-white border-2 border-[#14382E] shadow-sm space-y-3">
                        <span className="inline-block px-3 py-1 rounded-full bg-[#A94B2F] text-white text-[11px] font-semibold tracking-wide">
                          You are here
                        </span>

                        <div>
                          <h3 
                            className="text-lg sm:text-xl text-[#14382E] font-medium leading-snug"
                            style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                          >
                            {step.title}
                          </h3>
                          <p className="text-xs text-[#71827A] mt-0.5">
                            {step.scheduledTime || 'Tomorrow 8:15 am'} · Fast 10–12 h
                          </p>
                          <p className="text-xs text-[#14382E] font-medium mt-1">
                            Responsible: <strong>{step.responsibleEntity || 'Sagar Labs'}</strong>
                          </p>
                        </div>

                        <div className="pt-2 flex items-center gap-3">
                          <button
                            onClick={() => setShowPrepModal(true)}
                            className="px-5 py-2.5 rounded-full bg-[#14382E] hover:bg-[#14382E]/90 text-white text-xs font-semibold transition cursor-pointer shadow-2xs"
                          >
                            View preparation
                          </button>

                          {onAdvanceStep && (
                            <button
                              onClick={onAdvanceStep}
                              className="px-4 py-2.5 rounded-full bg-[#FAF7F2] hover:bg-[#EFE9DD] border border-[#E2DCD0] text-[#14382E] text-xs font-semibold transition cursor-pointer"
                            >
                              Advance step →
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Standard Timeline Row (Completed or Upcoming) */
                      <div className="py-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <h4 className={`text-sm font-medium ${isCompleted ? 'text-[#14382E]' : 'text-[#71827A]'}`}>
                            {step.title}
                          </h4>
                          <span className="text-[11px] text-[#71827A] shrink-0">
                            {step.statusLabel || (isCompleted ? 'Done' : 'Upcoming')}
                          </span>
                        </div>
                        <p className="text-xs text-[#71827A] mt-0.5">
                          {isCompleted ? 'Done · 3 Oct · Dr. Menon' : `Later · book with Dr. Menon · You`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Preparation Instructions Modal */}
      {showPrepModal && (
        <div className="fixed inset-0 z-50 bg-[#14382E]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#E2DCD0] shadow-xl space-y-4">
            <h3 
              className="text-xl text-[#14382E] font-medium"
              style={{ fontFamily: "'Newsreader', Georgia, serif" }}
            >
              Fasting & Collection Preparation
            </h3>

            <div className="space-y-2 text-xs text-[#4A5B53] leading-relaxed">
              <p>• <strong>Fasting Window:</strong> 10 to 12 hours overnight fasting is strictly recommended.</p>
              <p>• <strong>Water is fine:</strong> You may drink plain water in normal quantities.</p>
              <p>• <strong>Medications:</strong> Continue regular morning medications unless specifically advised by your doctor.</p>
              <p>• <strong>Arrival Window:</strong> Phlebotomist from Sagar Labs will arrive between 8:15 AM and 8:45 AM with a cold-chain vacutainer kit.</p>
            </div>

            <button
              onClick={() => setShowPrepModal(false)}
              className="w-full py-2.5 rounded-full bg-[#14382E] text-white text-xs font-semibold"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
