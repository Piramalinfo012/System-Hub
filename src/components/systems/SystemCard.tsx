import React from 'react';
import { 
  ExternalLink, 
  FileSpreadsheet, 
  BarChart3, 
  Star, 
  ArrowRight, 
  Monitor, 
  Layers, 
  User, 
  Workflow,
  Sparkles,
  Lock,
  Building
} from 'lucide-react';
import { SystemItem } from '../../types';
import { GoogleSheetService } from '../../services/googleSheetService';

interface SystemCardProps {
  system: SystemItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onViewDetails: (system: SystemItem) => void;
  darkMode: boolean;
}

export const SystemCard: React.FC<SystemCardProps> = ({
  system,
  isFavorite,
  onToggleFavorite,
  onViewDetails,
  darkMode,
}) => {
  const hasSoftwareUrl = GoogleSheetService.isValidUrl(system.softwareUrl);
  const hasSheetUrl = GoogleSheetService.isValidUrl(system.sheetUrl);
  const hasDashboardUrl = GoogleSheetService.isValidUrl(system.dashboardUrl);

  const handleOpenSoftware = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleOpenSheet = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleOpenDashboard = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  // Department Badge Colors
  const getDeptColor = (dept: string) => {
    const d = dept.toUpperCase();
    if (d.includes('CRM') || d.includes('SALES')) return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    if (d.includes('HR')) return 'bg-pink-500/10 text-pink-400 border-pink-500/30';
    if (d.includes('PURCHASE') || d.includes('PROCURE')) return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
    if (d.includes('STORE') || d.includes('INVENTORY')) return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    if (d.includes('TRANSPORT') || d.includes('FLEET')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (d.includes('ADMIN') || d.includes('FINANCE')) return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    if (d.includes('SECURITY')) return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
  };

  // System Type Icon
  const getTypeIcon = (type: string) => {
    const t = type.toUpperCase();
    if (t.includes('DASHBOARD')) return <BarChart3 className="w-4 h-4 text-amber-400" />;
    if (t.includes('SHEET')) return <FileSpreadsheet className="w-4 h-4 text-emerald-400" />;
    return <Monitor className="w-4 h-4 text-cyan-400" />;
  };

  return (
    <div
      id={`system-card-${system.id}`}
      onClick={() => onViewDetails(system)}
      className={`group relative rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer ${
        darkMode
          ? 'bg-slate-900/80 border-slate-800/90 hover:border-cyan-500/40 hover:bg-slate-850 hover:shadow-xl hover:shadow-cyan-500/5'
          : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-md'
      }`}
    >
      {/* Top Header Row */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-xs ${
              darkMode ? 'bg-slate-800/80 border-slate-700/60' : 'bg-slate-100 border-slate-200'
            }`}>
              {getTypeIcon(system.systemType)}
            </div>
            <div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getDeptColor(system.department)}`}>
                {system.department}
              </span>
              <span className={`ml-1.5 text-[10px] font-mono ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                {system.systemType}
              </span>
            </div>
          </div>

          {/* Favorite Button */}
          <button
            id={`fav-btn-${system.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(system.id);
            }}
            className={`p-1.5 rounded-lg border transition-all ${
              isFavorite
                ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400'
                : darkMode
                ? 'bg-slate-800/40 border-slate-700/40 text-slate-500 hover:text-slate-300'
                : 'bg-slate-100 border-slate-200 text-slate-400 hover:text-slate-600'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-yellow-400' : ''}`} />
          </button>
        </div>

        {/* System Title */}
        <h3 className={`text-base font-bold tracking-tight line-clamp-1 group-hover:text-cyan-400 transition-colors ${
          darkMode ? 'text-slate-100' : 'text-slate-900'
        }`}>
          {system.systemName}
        </h3>

        {/* Doer / Person in charge */}
        {system.doer && (
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-400">
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span className="truncate">{system.doer}</span>
          </div>
        )}

        {/* Description or excerpt */}
        <p className={`text-xs mt-2.5 line-clamp-2 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          {system.description}
        </p>

        {/* Steps Preview Pill Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800/60">
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-1.5 font-medium text-slate-400">
              <Workflow className="w-3.5 h-3.5 text-cyan-400" />
              <span>Workflow Steps</span>
            </div>
            <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {system.steps.length} Steps
            </span>
          </div>

          {/* First few step badges */}
          <div className="flex flex-wrap gap-1.5">
            {system.steps.slice(0, 3).map((st, idx) => (
              <span
                key={idx}
                className={`text-[10px] font-medium px-2 py-0.5 rounded-md truncate max-w-[130px] border ${
                  darkMode ? 'bg-slate-800/70 border-slate-700/50 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
                title={st.name}
              >
                {st.header}: {st.name}
              </span>
            ))}
            {system.steps.length > 3 && (
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${darkMode ? 'text-cyan-400 bg-cyan-500/10' : 'text-blue-600 bg-blue-50'}`}>
                +{system.steps.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer Toolbar */}
      <div className={`px-4 py-3 border-t flex flex-wrap items-center justify-between gap-2 ${
        darkMode ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-1.5">
          {/* Main Software Launch Button */}
          <button
            id={`open-system-btn-${system.id}`}
            onClick={handleOpenSoftware}
            disabled={!hasSoftwareUrl}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-xs ${
              hasSoftwareUrl
                ? 'bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white hover:shadow-cyan-500/25 active:scale-95'
                : 'bg-slate-800/60 text-slate-500 border border-slate-700/50 cursor-not-allowed'
            }`}
            title={hasSoftwareUrl ? 'Open Software in new tab' : 'Software URL Not Available in Google Sheet'}
          >
            <span>OPEN SYSTEM</span>
            <ExternalLink className="w-3 h-3" />
          </button>

          {/* Sheet Button */}
          {hasSheetUrl ? (
            <button
              onClick={handleOpenSheet}
              className={`p-1.5 rounded-xl border transition-colors ${
                darkMode ? 'bg-slate-900 border-slate-800 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/30' : 'bg-white border-slate-300 text-emerald-600 hover:bg-emerald-50'
              }`}
              title="Open Google Sheet"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span
              className="p-1.5 rounded-xl border border-transparent text-slate-600 opacity-40 cursor-not-allowed"
              title="Sheet Not Available"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
            </span>
          )}

          {/* Dashboard Button */}
          {hasDashboardUrl ? (
            <button
              onClick={handleOpenDashboard}
              className={`p-1.5 rounded-xl border transition-colors ${
                darkMode ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/30' : 'bg-white border-slate-300 text-amber-600 hover:bg-amber-50'
              }`}
              title="Open BI Dashboard"
            >
              <BarChart3 className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span
              className="p-1.5 rounded-xl border border-transparent text-slate-600 opacity-40 cursor-not-allowed"
              title="Dashboard Not Available"
            >
              <BarChart3 className="w-3.5 h-3.5" />
            </span>
          )}
        </div>

        {/* View Details CTA */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(system);
          }}
          className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${
            darkMode ? 'text-slate-300 hover:text-cyan-300 hover:bg-slate-800' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-200'
          }`}
        >
          <span>Details</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
