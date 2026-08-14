import React, { useEffect, useState } from 'react';
import { LucideIcon, ArrowUpRight } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: LucideIcon;
  colorScheme: 'cyan' | 'blue' | 'indigo' | 'emerald' | 'amber';
  darkMode: boolean;
  trendText?: string;
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  colorScheme,
  darkMode,
  trendText,
  onClick,
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  // Counter animation
  useEffect(() => {
    let start = 0;
    const end = value;
    if (end === 0) {
      setDisplayValue(0);
      return;
    }
    const duration = 700;
    const stepTime = Math.abs(Math.floor(duration / end)) || 25;
    const timer = setInterval(() => {
      start += 1;
      setDisplayValue(start);
      if (start >= end) {
        clearInterval(timer);
        setDisplayValue(end);
      }
    }, Math.min(stepTime, 40));

    return () => clearInterval(timer);
  }, [value]);

  const colorStyles = {
    cyan: {
      border: darkMode ? 'border-cyan-500/30' : 'border-cyan-200',
      iconBg: 'bg-cyan-500/15 text-cyan-400',
      glow: 'hover:shadow-cyan-500/10',
      accent: 'text-cyan-400'
    },
    blue: {
      border: darkMode ? 'border-blue-500/30' : 'border-blue-200',
      iconBg: 'bg-blue-500/15 text-blue-400',
      glow: 'hover:shadow-blue-500/10',
      accent: 'text-blue-400'
    },
    indigo: {
      border: darkMode ? 'border-indigo-500/30' : 'border-indigo-200',
      iconBg: 'bg-indigo-500/15 text-indigo-400',
      glow: 'hover:shadow-indigo-500/10',
      accent: 'text-indigo-400'
    },
    emerald: {
      border: darkMode ? 'border-emerald-500/30' : 'border-emerald-200',
      iconBg: 'bg-emerald-500/15 text-emerald-400',
      glow: 'hover:shadow-emerald-500/10',
      accent: 'text-emerald-400'
    },
    amber: {
      border: darkMode ? 'border-amber-500/30' : 'border-amber-200',
      iconBg: 'bg-amber-500/15 text-amber-400',
      glow: 'hover:shadow-amber-500/10',
      accent: 'text-amber-400'
    }
  }[colorScheme];

  return (
    <div
      onClick={onClick}
      className={`relative p-4 sm:p-5 rounded-2xl border transition-all duration-200 group ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      } ${
        darkMode
          ? 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 shadow-lg'
          : 'bg-white border-slate-200/90 shadow-sm hover:shadow-md'
      } ${colorStyles.glow}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-[11px] font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {title}
          </p>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono">
              {displayValue}
            </span>
            {trendText && (
              <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                {trendText}
              </span>
            )}
          </div>
          <p className={`text-xs mt-1 truncate ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
            {subtitle}
          </p>
        </div>

        <div className={`p-2.5 rounded-xl transition-transform duration-200 group-hover:scale-110 ${colorStyles.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {onClick && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/50 flex items-center justify-between text-[11px] text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
          <span>View category</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      )}
    </div>
  );
};
