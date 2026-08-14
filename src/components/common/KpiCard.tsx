import React, { useEffect, useState } from 'react';
import { LucideIcon, ArrowUpRight, Activity } from 'lucide-react';
import { motion } from 'motion/react';

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
    const duration = 650;
    const stepTime = Math.abs(Math.floor(duration / end)) || 20;
    const timer = setInterval(() => {
      start += 1;
      setDisplayValue(start);
      if (start >= end) {
        clearInterval(timer);
        setDisplayValue(end);
      }
    }, Math.min(stepTime, 35));

    return () => clearInterval(timer);
  }, [value]);

  const colorStyles = {
    cyan: {
      border: darkMode ? 'border-cyan-500/30 hover:border-cyan-400' : 'border-cyan-200',
      iconBg: darkMode ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' : 'bg-cyan-100 text-cyan-700 border border-cyan-200',
      glow: 'hover:shadow-cyan-500/20',
      accent: darkMode ? 'text-cyan-400' : 'text-cyan-700',
      tag: darkMode ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' : 'bg-cyan-100 text-cyan-700 border-cyan-300',
      corner: '#00f0ff'
    },
    blue: {
      border: darkMode ? 'border-blue-500/30 hover:border-blue-400' : 'border-blue-200',
      iconBg: darkMode ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30' : 'bg-blue-100 text-blue-700 border border-blue-200',
      glow: 'hover:shadow-blue-500/20',
      accent: darkMode ? 'text-blue-400' : 'text-blue-700',
      tag: darkMode ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' : 'bg-blue-100 text-blue-700 border-blue-300',
      corner: '#38bdf8'
    },
    indigo: {
      border: darkMode ? 'border-indigo-500/30 hover:border-indigo-400' : 'border-indigo-200',
      iconBg: darkMode ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30' : 'bg-indigo-100 text-indigo-700 border border-indigo-200',
      glow: 'hover:shadow-indigo-500/20',
      accent: darkMode ? 'text-indigo-400' : 'text-indigo-700',
      tag: darkMode ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' : 'bg-indigo-100 text-indigo-700 border-indigo-300',
      corner: '#818cf8'
    },
    emerald: {
      border: darkMode ? 'border-emerald-500/30 hover:border-emerald-400' : 'border-emerald-200',
      iconBg: darkMode ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-100 text-emerald-700 border border-emerald-200',
      glow: 'hover:shadow-emerald-500/20',
      accent: darkMode ? 'text-emerald-400' : 'text-emerald-700',
      tag: darkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-emerald-100 text-emerald-700 border-emerald-300',
      corner: '#00ff9d'
    },
    amber: {
      border: darkMode ? 'border-amber-500/30 hover:border-amber-400' : 'border-amber-200',
      iconBg: darkMode ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'bg-amber-100 text-amber-700 border border-amber-200',
      glow: 'hover:shadow-amber-500/20',
      accent: darkMode ? 'text-amber-400' : 'text-amber-700',
      tag: darkMode ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-amber-100 text-amber-700 border-amber-300',
      corner: '#ffb703'
    }
  }[colorScheme];

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.015 }}
      whileTap={onClick ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`relative p-4 sm:p-5 rounded-2xl border transition-all duration-200 group overflow-hidden ${
        onClick ? 'cursor-pointer' : ''
      } ${
        darkMode
          ? 'bg-slate-900/80 backdrop-blur-md border-slate-800 hover:border-cyan-500/40 shadow-xl'
          : 'bg-white border-slate-200/90 shadow-sm hover:shadow-md'
      } ${colorStyles.border} ${colorStyles.glow}`}
    >
      {/* Cyber Corner HUD Notches */}
      <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400/60 rounded-tl-sm"></span>
      <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400/60 rounded-br-sm"></span>

      {/* Cyber Scan Glow Highlight on Hover */}
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-cyan-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>

      <div className="flex items-start justify-between relative z-10">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <p className={`text-[10px] font-mono uppercase tracking-widest font-bold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {title}
            </p>
          </div>

          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono cyber-gradient-text">
              {displayValue}
            </span>
            {trendText && (
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${colorStyles.tag}`}>
                {trendText}
              </span>
            )}
          </div>

          {/* Mini Real-time Telemetry Bars */}
          <div className="flex items-center gap-1 mt-2">
            <span className="w-1 h-2 rounded-full bg-cyan-400/80 animate-wave-1"></span>
            <span className="w-1 h-3 rounded-full bg-cyan-400/60 animate-wave-2"></span>
            <span className="w-1 h-1.5 rounded-full bg-cyan-400/90 animate-wave-3"></span>
            <span className="w-1 h-2.5 rounded-full bg-cyan-400/50 animate-wave-4"></span>
            <p className={`text-xs ml-1.5 truncate font-medium ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>
              {subtitle}
            </p>
          </div>
        </div>

        <motion.div 
          whileHover={{ rotate: 12, scale: 1.15 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className={`p-2.5 rounded-xl transition-all shadow-md ${colorStyles.iconBg}`}
        >
          <Icon className="w-5 h-5" />
        </motion.div>
      </div>

      {onClick && (
        <div className={`mt-3 pt-2 border-t flex items-center justify-between text-[10px] font-mono opacity-80 group-hover:opacity-100 transition-opacity ${darkMode ? 'border-slate-800/60 text-cyan-400' : 'border-slate-200 text-cyan-700'}`}>
          <span className="flex items-center gap-1">
            <Activity className={`w-3 h-3 ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
            <span>ACCESS_HUD</span>
          </span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      )}
    </motion.div>
  );
};

