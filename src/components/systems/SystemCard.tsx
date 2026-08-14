import React, { useState, useEffect } from 'react';
import { 
  Star, 
  ArrowRight, 
  Monitor, 
  Layers, 
  FileSpreadsheet, 
  BarChart3,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { SystemItem, SystemHeartbeatStatus } from '../../types';
import { GoogleSheetService } from '../../services/googleSheetService';
import { HeartbeatIndicator } from '../common/HeartbeatIndicator';

interface SystemCardProps {
  system: SystemItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onViewDetails: (system: SystemItem) => void;
  darkMode: boolean;
  heartbeatStatus?: SystemHeartbeatStatus;
  onRefreshHeartbeat?: (system: SystemItem) => Promise<void> | void;
}

export const SystemCard: React.FC<SystemCardProps> = ({
  system,
  isFavorite,
  onToggleFavorite,
  onViewDetails,
  darkMode,
  heartbeatStatus: propHeartbeat,
  onRefreshHeartbeat,
}) => {
  const [localHeartbeat, setLocalHeartbeat] = useState<SystemHeartbeatStatus | undefined>(propHeartbeat);

  useEffect(() => {
    if (propHeartbeat) {
      setLocalHeartbeat(propHeartbeat);
    } else {
      const cached = GoogleSheetService.getCachedHeartbeats()[system.id];
      if (cached) {
        setLocalHeartbeat(cached);
      } else {
        GoogleSheetService.checkSystemHeartbeat(system).then(res => {
          setLocalHeartbeat(res);
        });
      }
    }
  }, [propHeartbeat, system]);

  const handleRefreshPulse = async (sys: SystemItem) => {
    if (onRefreshHeartbeat) {
      await onRefreshHeartbeat(sys);
    } else {
      const updated = await GoogleSheetService.checkSystemHeartbeat(sys, true);
      setLocalHeartbeat(updated);
    }
  };

  // Department Badge Colors
  const getDeptColor = (dept: string) => {
    const d = dept.toUpperCase();
    if (d.includes('CRM') || d.includes('SALES')) return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 shadow-xs shadow-cyan-500/10';
    if (d.includes('HR')) return 'bg-pink-500/15 text-pink-300 border-pink-500/40 shadow-xs shadow-pink-500/10';
    if (d.includes('PURCHASE') || d.includes('PROCURE')) return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/40 shadow-xs shadow-indigo-500/10';
    if (d.includes('STORE') || d.includes('INVENTORY')) return 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-xs shadow-amber-500/10';
    if (d.includes('TRANSPORT') || d.includes('FLEET')) return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-xs shadow-emerald-500/10';
    if (d.includes('ADMIN') || d.includes('FINANCE')) return 'bg-purple-500/15 text-purple-300 border-purple-500/40 shadow-xs shadow-purple-500/10';
    if (d.includes('SECURITY')) return 'bg-rose-500/15 text-rose-300 border-rose-500/40 shadow-xs shadow-rose-500/10';
    return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 shadow-xs';
  };

  // System Type Icon
  const getTypeIcon = (type: string) => {
    const t = type.toUpperCase();
    if (t.includes('DASHBOARD')) return <BarChart3 className="w-4 h-4 text-amber-400" />;
    if (t.includes('SHEET')) return <FileSpreadsheet className="w-4 h-4 text-emerald-400" />;
    return <Monitor className="w-4 h-4 text-cyan-400" />;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 350, damping: 20 }}
      id={`system-card-${system.id}`}
      onClick={() => onViewDetails(system)}
      className={`group relative rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer ${
        darkMode
          ? 'bg-slate-900/90 backdrop-blur-md border-slate-800/90 hover:border-cyan-500/70 hover:bg-slate-850 hover:shadow-2xl hover:shadow-cyan-500/20'
          : 'bg-white border-slate-200 hover:border-cyan-400 hover:shadow-xl'
      }`}
    >
      {/* Ambient background glow matching Cyber theme */}
      <div className="absolute top-0 right-0 w-36 h-36 rounded-full bg-cyan-500/5 blur-2xl pointer-events-none group-hover:bg-cyan-500/15 transition-all duration-500"></div>

      {/* Cyber Corner HUD Brackets */}
      <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400/70 rounded-tl-sm opacity-60 group-hover:opacity-100 group-hover:border-cyan-300 transition-all"></span>
      <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400/70 rounded-br-sm opacity-60 group-hover:opacity-100 group-hover:border-cyan-300 transition-all"></span>

      {/* Cyber Top Scanline Glow on Hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Main Card Content */}
      <div className="p-6 relative z-10 flex flex-col justify-between flex-1">
        
        {/* Top Header Row: Type Icon, Dept Badge & Favorite Button */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-xs transition-transform group-hover:scale-110 ${
              darkMode ? 'bg-slate-950/90 border-cyan-500/30' : 'bg-slate-100 border-slate-200'
            }`}>
              {getTypeIcon(system.systemType)}
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border uppercase tracking-wider ${getDeptColor(system.department)}`}>
                {system.department}
              </span>
              <span className={`text-[10px] font-mono font-semibold ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                #{system.sr}
              </span>
            </div>
          </div>

          {/* Favorite Star Button */}
          <button
            id={`fav-btn-${system.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(system.id);
            }}
            className={`p-2 rounded-xl border transition-all ${
              isFavorite
                ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400 shadow-xs shadow-yellow-500/20'
                : darkMode
                ? 'bg-slate-950/60 border-slate-800 text-slate-500 hover:text-slate-200 hover:border-slate-700'
                : 'bg-slate-100 border-slate-200 text-slate-400 hover:text-slate-600'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-yellow-400' : ''}`} />
          </button>
        </div>

        {/* Hero Section: Prominent System Name */}
        <div className="my-2">
          <h3 className={`text-lg sm:text-xl font-bold tracking-tight leading-snug group-hover:text-cyan-300 transition-colors ${
            darkMode ? 'text-slate-100' : 'text-slate-900'
          }`}>
            {system.systemName}
          </h3>
        </div>

        {/* Status Telemetry & Live Heartbeat */}
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <HeartbeatIndicator
              status={localHeartbeat}
              system={system}
              onRefreshPing={handleRefreshPulse}
              darkMode={darkMode}
              showLatency={true}
            />
          </div>

          {/* Clean View Details Indicator */}
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg transition-all ${
            darkMode 
              ? 'text-cyan-400 group-hover:text-cyan-300 group-hover:translate-x-1' 
              : 'text-blue-600 group-hover:text-blue-700 group-hover:translate-x-1'
          }`}>
            <span className="font-mono text-[11px]">DETAILS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

      </div>
    </motion.div>
  );
};


