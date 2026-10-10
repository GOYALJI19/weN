import React from 'react';
import { 
  Home, 
  Route, 
  Stethoscope, 
  TestTube2, 
  FileText 
} from 'lucide-react';

interface AndroidBottomBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  className?: string;
}

export const AndroidBottomBar: React.FC<AndroidBottomBarProps> = ({
  activeTab,
  setActiveTab,
  className = '',
}) => {
  const tabs = [
    { 
      id: 'home', 
      label: 'Home', 
      match: ['home'],
      renderIcon: (isActive: boolean) => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill={isActive ? '#14382E' : 'none'} stroke="#14382E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 21V11C4 6.58172 7.58172 3 12 3C16.4183 3 20 6.58172 20 11V21" />
          <path d="M9 21V15C9 13.3431 10.3431 12 12 12C13.6569 12 15 13.3431 15 15V21" />
        </svg>
      )
    },
    { 
      id: 'care', 
      label: 'Care', 
      match: ['care', 'doctors', 'diagnostics'],
      renderIcon: (isActive: boolean) => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill={isActive ? '#14382E' : 'none'} stroke="#14382E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          {!isActive && <path d="M12 8V16M8 12H16" />}
        </svg>
      )
    },
    { 
      id: 'journeys', 
      label: 'Journeys', 
      match: ['journeys'],
      renderIcon: (isActive: boolean) => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#14382E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="6" cy="12" r="3" fill={isActive ? '#14382E' : 'none'} />
          <circle cx="18" cy="12" r="3" fill={isActive ? '#14382E' : 'none'} />
          <path d="M9 12C11 10 13 14 15 12" strokeDasharray={isActive ? 'none' : '2 2'} />
        </svg>
      )
    },
    { 
      id: 'records', 
      label: 'Records', 
      match: ['records'],
      renderIcon: (isActive: boolean) => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill={isActive ? '#14382E' : 'none'} stroke="#14382E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" fill={isActive ? '#14382E' : 'none'} />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      )
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      match: ['profile', 'family'],
      renderIcon: (isActive: boolean) => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#14382E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 21V17C6 14.7909 7.7909 13 10 13H14C16.2091 13 18 14.7909 18 17V21" />
          <circle cx="12" cy="7" r="4" fill={isActive ? '#14382E' : 'none'} />
        </svg>
      )
    },
  ];

  return (
    <nav 
      className={`bg-[#F6F1E7]/95 backdrop-blur-md border-t border-[#E2DCD0] shrink-0 z-40 select-none pb-safe transition-all ${className}`}
      aria-label="Android Bottom Navigation"
    >
      <div className="max-w-md mx-auto px-3 pt-2 pb-1.5 grid grid-cols-5 gap-1">
        {tabs.map((tab) => {
          const isActive = tab.match.includes(activeTab);

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center justify-center py-1 group cursor-pointer focus:outline-none transition-all active:scale-95"
              aria-selected={isActive}
            >
              {/* Botanica Active Indicator */}
              <div 
                className={`relative px-3.5 py-1 rounded-full transition-all duration-200 flex items-center justify-center ${
                  isActive 
                    ? 'bg-[#14382E] text-white shadow-2xs' 
                    : 'text-[#14382E]/70 hover:text-[#14382E] hover:bg-[#EFE9DD]/50'
                }`}
              >
                {isActive ? (
                  <div className="text-white brightness-200 contrast-200 [&_svg]:stroke-white [&_path]:fill-white [&_circle]:fill-white">
                    {tab.renderIcon(true)}
                  </div>
                ) : (
                  tab.renderIcon(false)
                )}
              </div>

              {/* Botanica Label */}
              <span 
                className={`text-[11px] mt-0.5 tracking-tight transition-colors ${
                  isActive 
                    ? 'font-semibold text-[#14382E]' 
                    : 'font-normal text-[#71827A] group-hover:text-[#14382E]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Android System Gesture Navigation Bar */}
      <div className="py-1 flex justify-center">
        <div className="w-32 h-1 bg-[#14382E]/20 rounded-full" />
      </div>
    </nav>
  );
};

