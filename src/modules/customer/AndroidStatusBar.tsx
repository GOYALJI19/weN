import React, { useState, useEffect } from 'react';
import { Wifi, Battery } from 'lucide-react';

interface AndroidStatusBarProps {
  className?: string;
  theme?: 'light' | 'dark';
}

export const AndroidStatusBar: React.FC<AndroidStatusBarProps> = ({ 
  className = '',
  theme = 'light' 
}) => {
  const [timeStr, setTimeStr] = useState<string>('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      hours = hours % 12 || 12;
      setTimeStr(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const isDark = theme === 'dark';

  return (
    <div 
      className={`w-full h-8 px-5 flex items-center justify-between text-xs select-none shrink-0 z-30 transition-colors ${
        isDark ? 'text-white' : 'text-[#14382E]'
      } ${className}`}
      aria-label="Android System Status Bar"
    >
      {/* Clock Left */}
      <div className="font-semibold tracking-tight text-[12px] font-sans">
        {timeStr}
      </div>

      {/* Android Punch Hole Camera Space Spacer in Phone Frame */}
      <div className="w-4 h-4 rounded-full bg-slate-900/10 hidden sm:block pointer-events-none" />

      {/* Android System Icons Right */}
      <div className="flex items-center gap-2 text-[11px] font-medium">
        {/* 5G Network Indicator */}
        <span className="font-bold text-[10px] tracking-tighter">5G</span>
        
        {/* Wi-Fi Icon */}
        <Wifi className="w-3.5 h-3.5 stroke-[2.2]" />

        {/* Battery with percentage */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-semibold tabular-nums">92%</span>
          <div className="relative flex items-center">
            <Battery className="w-4 h-4 stroke-[2]" />
            <div className="absolute left-[2px] top-[4px] bottom-[4px] right-[4px] bg-current rounded-[1px] opacity-90" />
          </div>
        </div>
      </div>
    </div>
  );
};
