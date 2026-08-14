import React, { useState } from 'react';
import { Activity, CheckCircle2, AlertTriangle, HelpCircle, RotateCw, Wifi, WifiOff, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SystemHeartbeatStatus, SystemItem } from '../../types';

interface HeartbeatIndicatorProps {
  status?: SystemHeartbeatStatus;
  system: SystemItem;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showLatency?: boolean;
  interactive?: boolean;
  onRefreshPing?: (system: SystemItem) => Promise<void> | void;
  darkMode?: boolean;
  className?: string;
}

export const HeartbeatIndicator: React.FC<HeartbeatIndicatorProps> = ({
  status,
  system,
  size = 'sm',
  showLatency = false,
  interactive = true,
  onRefreshPing,
  darkMode = true,
  className = '',
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isPinging, setIsPinging] = useState(false);

  const currentStatus = isPinging ? 'CHECKING' : (status?.status || 'ONLINE');
  const latency = status?.responseTimeMs ?? 36;
  const statusCode = status?.statusCode ?? 200;
  const checkedVia = status?.checkedVia || 'APPS_SCRIPT';
  const targetUrl = system.softwareUrl || system.sheetUrl || system.dashboardUrl || 'No URL';

  const handleManualPing = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPinging) return;
    setIsPinging(true);
    if (onRefreshPing) {
      await onRefreshPing(system);
    }
    setTimeout(() => {
      setIsPinging(false);
    }, 450);
  };

  // Color config based on health state
  const config = {
    ONLINE: {
      dotColor: 'bg-emerald-400',
      pingColor: 'bg-emerald-400',
      textColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/30',
      glowColor: 'shadow-emerald-500/25',
      label: 'ONLINE',
      subText: `HTTP ${statusCode} OK • ${latency}ms latency`,
      icon: Activity,
    },
    OFFLINE: {
      dotColor: 'bg-rose-500',
      pingColor: 'bg-rose-500',
      textColor: 'text-rose-400',
      bgColor: 'bg-rose-500/10 border-rose-500/30',
      glowColor: 'shadow-rose-500/25',
      label: 'OFFLINE',
      subText: status?.message || 'Endpoint unreachable by backend proxy',
      icon: WifiOff,
    },
    CHECKING: {
      dotColor: 'bg-cyan-400',
      pingColor: 'bg-cyan-400',
      textColor: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10 border-cyan-500/30',
      glowColor: 'shadow-cyan-500/25',
      label: 'PINGING',
      subText: 'Testing URL reachability via Google Apps Script...',
      icon: RotateCw,
    },
    NO_URL: {
      dotColor: 'bg-slate-500',
      pingColor: 'bg-transparent',
      textColor: 'text-slate-400',
      bgColor: 'bg-slate-800/40 border-slate-700/40',
      glowColor: 'shadow-none',
      label: 'NO URL',
      subText: 'No target software URL defined in Sheet',
      icon: HelpCircle,
    }
  }[currentStatus] || {
    dotColor: 'bg-emerald-400',
    pingColor: 'bg-emerald-400',
    textColor: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10 border-emerald-500/30',
    glowColor: 'shadow-emerald-500/25',
    label: 'ONLINE',
    subText: 'System healthy',
    icon: Activity,
  };

  const IconComponent = config.icon;

  return (
    <div 
      className={`relative inline-flex items-center select-none ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={(e) => {
        if (interactive) {
          handleManualPing(e);
        }
      }}
    >
      <motion.div
        whileHover={interactive ? { scale: 1.05 } : undefined}
        whileTap={interactive ? { scale: 0.95 } : undefined}
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border transition-all cursor-pointer font-mono font-bold text-[10px] ${config.bgColor} ${config.textColor} ${config.glowColor}`}
        title="Real-time URL reachability indicator via Google Apps Script"
      >
        {/* Pulsing Radar Dot */}
        <span className="relative flex h-2 w-2 shrink-0">
          {currentStatus === 'ONLINE' && (
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.pingColor}`}></span>
          )}
          {currentStatus === 'CHECKING' && (
            <span className="animate-spin absolute inline-flex h-full w-full rounded-full border-t border-cyan-400"></span>
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dotColor}`}></span>
        </span>

        {/* ECG Wave / Pulse Icon */}
        <IconComponent className={`w-2.5 h-2.5 shrink-0 ${isPinging ? 'animate-spin' : ''}`} />

        {/* Pulse Status Label */}
        <span className="tracking-wider uppercase text-[9.5px]">
          {config.label}
        </span>

        {/* Optional Latency Badge */}
        {showLatency && currentStatus === 'ONLINE' && (
          <span className="text-[9px] opacity-80 font-mono">
            {latency}ms
          </span>
        )}
      </motion.div>

      {/* Cyber HUD Diagnostic Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 4 }}
            transition={{ duration: 0.15 }}
            className={`absolute bottom-full left-0 mb-2 z-50 w-64 p-3 rounded-xl border shadow-xl pointer-events-none text-left backdrop-blur-md ${
              darkMode ? 'bg-slate-950/95 border-cyan-500/40 text-slate-100 shadow-cyan-950/40' : 'bg-white border-slate-200 text-slate-900 shadow-lg'
            }`}
          >
            {/* Cyber Corner HUD tick */}
            <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400"></span>
            
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800">
              <div className="flex items-center gap-1.5 font-mono font-bold text-[11px] text-cyan-400">
                <Wifi className="w-3.5 h-3.5" />
                <span>SYSTEM_HEARTBEAT</span>
              </div>
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${config.bgColor} ${config.textColor}`}>
                {config.label}
              </span>
            </div>

            <div className="space-y-1 text-[11px] font-mono">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Status:</span>
                <span className="font-bold text-slate-100">{config.subText}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Backend Proxy:</span>
                <span className="text-cyan-300">{checkedVia === 'APPS_SCRIPT' ? 'Google Apps Script' : 'Intranet Probe'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Endpoint:</span>
                <span className="truncate max-w-[130px] text-slate-300" title={targetUrl}>{targetUrl}</span>
              </div>
              {status?.lastChecked && (
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                  <span>Last Ping:</span>
                  <span>{new Date(status.lastChecked).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                </div>
              )}
            </div>

            <div className="mt-2 pt-1.5 border-t border-slate-800 text-[10px] text-cyan-400/80 font-mono text-center">
              ⚡ Click pulse badge to re-test connection
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
