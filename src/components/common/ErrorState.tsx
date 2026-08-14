import React from 'react';
import { AlertTriangle, RotateCw, Settings } from 'lucide-react';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
  onOpenSettings: () => void;
  darkMode: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  onRetry,
  onOpenSettings,
  darkMode,
}) => {
  return (
    <div className={`p-12 rounded-3xl border text-center my-8 max-w-xl mx-auto ${
      darkMode ? 'bg-slate-900/90 border-rose-500/30 text-slate-100' : 'bg-white border-rose-200 text-slate-900'
    }`}>
      <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold">Unable to Load System Data</h3>
      <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
        We encountered an issue connecting to the Google Apps Script Web App. Please verify your script deployment or check connection settings.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors shadow-md"
        >
          <RotateCw className="w-4 h-4" />
          <span>TRY AGAIN</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-200 font-semibold text-xs hover:bg-slate-700 transition-colors border border-slate-700"
        >
          <Settings className="w-4 h-4" />
          <span>API SETTINGS</span>
        </button>
      </div>
    </div>
  );
};
