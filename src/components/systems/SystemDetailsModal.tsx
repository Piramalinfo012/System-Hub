import React from 'react';
import { 
  X, 
  ExternalLink, 
  FileSpreadsheet, 
  BarChart3, 
  Star, 
  Building2, 
  User, 
  Activity, 
  ShieldCheck, 
  Layers,
  Sparkles,
  Link2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { SystemItem } from '../../types';
import { GoogleSheetService } from '../../services/googleSheetService';
import { SystemWorkflowTimeline } from './SystemWorkflowTimeline';

interface SystemDetailsModalProps {
  system: SystemItem | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  darkMode: boolean;
}

export const SystemDetailsModal: React.FC<SystemDetailsModalProps> = ({
  system,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  darkMode,
}) => {
  if (!isOpen || !system) return null;

  const hasSoftwareUrl = GoogleSheetService.isValidUrl(system.softwareUrl);
  const hasSheetUrl = GoogleSheetService.isValidUrl(system.sheetUrl);
  const hasDashboardUrl = GoogleSheetService.isValidUrl(system.dashboardUrl);

  const handleOpenSoftware = () => {
    if (hasSoftwareUrl) {
      GoogleSheetService.openExternalUrl(
        system.softwareUrl,
        system.systemName,
        system.id,
        'system',
        system.department
      );
    }
  };

  const handleOpenSheet = () => {
    if (hasSheetUrl) {
      GoogleSheetService.openExternalUrl(
        system.sheetUrl,
        `${system.systemName} (Google Sheet)`,
        system.id,
        'sheet',
        system.department
      );
    }
  };

  const handleOpenDashboard = () => {
    if (hasDashboardUrl) {
      GoogleSheetService.openExternalUrl(
        system.dashboardUrl,
        `${system.systemName} (Dashboard)`,
        system.id,
        'dashboard',
        system.department
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        id="system-details-modal"
        className={`relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl border shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${
          darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal Top Header */}
        <div className={`p-5 sm:p-6 border-b flex items-start justify-between gap-4 ${
          darkMode ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 ring-1 ring-white/20 shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  {system.department}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  {system.systemType}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {system.status}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{system.systemName}</h2>
              <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {system.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onToggleFavorite(system.id)}
              className={`p-2.5 rounded-xl border transition-all ${
                isFavorite
                  ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle Favorite"
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-yellow-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* SECTION 1: QUICK ACCESS BAR */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Link2 className="w-4 h-4 text-cyan-400" />
              Quick Access Hub
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Main Software Launch */}
              <button
                onClick={handleOpenSoftware}
                disabled={!hasSoftwareUrl}
                className={`p-4 rounded-2xl border flex flex-col justify-between text-left transition-all ${
                  hasSoftwareUrl
                    ? 'bg-linear-to-br from-cyan-600/20 via-blue-600/10 to-indigo-600/20 border-cyan-500/40 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/10'
                    : 'bg-slate-800/30 border-slate-800 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-cyan-400">Main Application</span>
                  <ExternalLink className="w-4 h-4 text-cyan-400" />
                </div>
                <p className="text-sm font-bold truncate">{system.systemName}</p>
                <span className="text-[11px] text-slate-400 mt-1">
                  {hasSoftwareUrl ? 'Open Software ↗' : 'URL Not Available'}
                </span>
              </button>

              {/* Sheet Launch */}
              <button
                onClick={handleOpenSheet}
                disabled={!hasSheetUrl}
                className={`p-4 rounded-2xl border flex flex-col justify-between text-left transition-all ${
                  hasSheetUrl
                    ? 'bg-emerald-500/10 border-emerald-500/40 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10'
                    : 'bg-slate-800/30 border-slate-800 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-emerald-400">Google Sheet</span>
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-sm font-bold truncate">Database Sheet</p>
                <span className="text-[11px] text-slate-400 mt-1">
                  {hasSheetUrl ? 'Open Sheet ↗' : 'Sheet Not Available'}
                </span>
              </button>

              {/* Dashboard Launch */}
              <button
                onClick={handleOpenDashboard}
                disabled={!hasDashboardUrl}
                className={`p-4 rounded-2xl border flex flex-col justify-between text-left transition-all ${
                  hasDashboardUrl
                    ? 'bg-amber-500/10 border-amber-500/40 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/10'
                    : 'bg-slate-800/30 border-slate-800 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-amber-400">BI Dashboard</span>
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-sm font-bold truncate">Executive Report</p>
                <span className="text-[11px] text-slate-400 mt-1">
                  {hasDashboardUrl ? 'Open Dashboard ↗' : 'Dashboard Not Available'}
                </span>
              </button>

            </div>
          </div>

          {/* SECTION 2: SYSTEM INFORMATION */}
          <div className={`p-4 sm:p-5 rounded-2xl border ${
            darkMode ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              System Metadata
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <p className="text-slate-500 font-medium">Department</p>
                <p className="font-semibold text-sm mt-0.5">{system.department}</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium">Assigned Doer</p>
                <p className="font-semibold text-sm mt-0.5">{system.doer || 'Unassigned'}</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium">System Type</p>
                <p className="font-semibold text-sm mt-0.5">{system.systemType}</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium">Index Reference (SR)</p>
                <p className="font-semibold text-sm font-mono mt-0.5">#{system.sr}</p>
              </div>
            </div>
          </div>

          {/* SECTION 3: SYSTEM WORKFLOW (STEP TIMELINE) */}
          <div className="pt-2">
            <SystemWorkflowTimeline
              steps={system.steps}
              systemName={system.systemName}
              systemId={system.id}
              department={system.department}
              darkMode={darkMode}
            />
          </div>

        </div>

        {/* Footer Bar */}
        <div className={`p-4 border-t flex items-center justify-between text-xs ${
          darkMode ? 'bg-slate-950/80 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
        }`}>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Connected to Master Google Sheet</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
