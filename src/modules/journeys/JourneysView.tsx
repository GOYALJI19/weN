import React, { useState } from 'react';
import { HealthcareJourney } from '../../core/types/domain';
import { HealthcareJourneyCard } from './HealthcareJourneyCard';
import { Plus, ArrowRight } from 'lucide-react';

interface JourneysViewProps {
  journey: HealthcareJourney;
  allJourneys: HealthcareJourney[];
  onStartNewJourney?: () => void;
  onAdvanceJourneyStep?: (journeyId: string) => void;
}

export const JourneysView: React.FC<JourneysViewProps> = ({ 
  journey, 
  allJourneys,
  onStartNewJourney,
  onAdvanceJourneyStep,
}) => {
  const [selectedJourneyId, setSelectedJourneyId] = useState<string>(journey?.id || allJourneys[0]?.id);

  const activeJourney = allJourneys.find(j => j.id === selectedJourneyId) || journey || allJourneys[0];

  return (
    <div className="space-y-6 pb-20 max-w-2xl mx-auto text-[#14382E]">
      {/* 1. EDITORIAL HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#A9B9A0] block">
            The Care Thread
          </span>
          <h1 
            className="text-2xl sm:text-3xl text-[#14382E] tracking-tight leading-tight mt-0.5"
            style={{ fontFamily: "'Newsreader', Georgia, serif" }}
          >
            Connected Healthcare Journeys
          </h1>
          <p className="text-xs sm:text-sm text-[#71827A] mt-1 max-w-lg leading-relaxed">
            One continuous line carries you from consultation to lab sample, report and follow-up.
          </p>
        </div>

        {onStartNewJourney && (
          <button
            onClick={onStartNewJourney}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#14382E] hover:bg-[#14382E]/90 rounded-full transition-all cursor-pointer shrink-0 shadow-2xs"
          >
            + Start Care Episode
          </button>
        )}
      </div>

      {/* Episode Switcher (if multiple exist) */}
      {allJourneys.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {allJourneys.map((j) => (
            <button
              key={j.id}
              onClick={() => setSelectedJourneyId(j.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition cursor-pointer shrink-0 ${
                activeJourney.id === j.id
                  ? 'bg-[#14382E] text-white shadow-2xs'
                  : 'bg-white text-[#14382E] border border-[#E2DCD0] hover:bg-[#FAF7F2]'
              }`}
            >
              {j.title}
            </button>
          ))}
        </div>
      )}

      {/* Primary Journey Card (Recreates Page 6 Vertical Care Thread) */}
      {activeJourney && (
        <HealthcareJourneyCard
          journey={activeJourney}
          onAdvanceStep={() => onAdvanceJourneyStep && onAdvanceJourneyStep(activeJourney.id)}
        />
      )}
    </div>
  );
};
