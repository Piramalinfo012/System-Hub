import React from 'react';
import { ExternalLink, CheckCircle, AlertCircle, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import { StepItem } from '../../types';
import { GoogleSheetService } from '../../services/googleSheetService';

interface SystemWorkflowTimelineProps {
  steps: StepItem[];
  systemName: string;
  systemId: string;
  department: string;
  darkMode: boolean;
}

export const SystemWorkflowTimeline: React.FC<SystemWorkflowTimelineProps> = ({
  steps,
  systemName,
  systemId,
  department,
  darkMode,
}) => {
  const handleStepClick = (step: StepItem) => {
    if (!step.isAvailable || !step.url) {
      return;
    }
    GoogleSheetService.openExternalUrl(
      step.url,
      `${systemName} - ${step.name}`,
      systemId,
      'step',
      department,
      step.header
    );
  };

  if (!steps || steps.length === 0) {
    return (
      <div className={`p-6 rounded-2xl border text-center ${darkMode ? 'bg-slate-900/50 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
        <p className="text-sm">No workflow steps defined in Google Sheet for this system.</p>
        <p className="text-xs text-slate-500 mt-1">
          Add columns starting with STEP (e.g. STEP-1, STEP-2) in Google Sheet to define operational steps.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            System Workflow & Operational Steps ({steps.length})
          </h4>
        </div>
        <span className="text-[11px] text-cyan-400 font-mono">
          Click any step to launch workflow ↗
        </span>
      </div>

      <div className="relative pl-6 sm:pl-8 space-y-3.5 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-linear-to-b before:from-cyan-500 before:via-blue-500 before:to-indigo-500">
        {steps.map((step, index) => {
          const stepNumber = String(step.order || index + 1).padStart(2, '0');
          const isClickable = step.isAvailable && Boolean(step.url);

          return (
            <div
              key={`${step.header}-${index}`}
              id={`step-item-${step.order}`}
              onClick={() => isClickable && handleStepClick(step)}
              className={`group relative p-3.5 sm:p-4 rounded-xl border transition-all duration-200 ${
                isClickable
                  ? darkMode
                    ? 'bg-slate-900/90 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/10 cursor-pointer'
                    : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
                  : darkMode
                  ? 'bg-slate-900/40 border-slate-800/50 opacity-60 cursor-not-allowed'
                  : 'bg-slate-100/70 border-slate-200 opacity-60 cursor-not-allowed'
              }`}
            >
              {/* Timeline Connector Dot */}
              <div
                className={`absolute -left-6 sm:-left-8 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-transform group-hover:scale-125 ${
                  isClickable
                    ? 'border-cyan-400 bg-slate-950 text-cyan-400 shadow-sm shadow-cyan-500/50'
                    : 'border-slate-600 bg-slate-900 text-slate-600'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${isClickable ? 'bg-cyan-400' : 'bg-slate-600'}`} />
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Step Order Pill */}
                  <span
                    className={`shrink-0 text-xs font-mono font-bold px-2 py-1 rounded-lg border ${
                      isClickable
                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors'
                        : 'bg-slate-800 text-slate-500 border-slate-700'
                    }`}
                  >
                    {step.header || `STEP-${stepNumber}`}
                  </span>

                  {/* Step Name */}
                  <div className="min-w-0">
                    <p className={`text-xs sm:text-sm font-semibold truncate ${
                      isClickable 
                        ? darkMode ? 'text-slate-100 group-hover:text-cyan-300' : 'text-slate-900 group-hover:text-blue-600' 
                        : 'text-slate-400'
                    }`}>
                      {step.name}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono truncate">
                      {isClickable ? 'Action Workflow Ready' : 'URL not provided in Google Sheet'}
                    </p>
                  </div>
                </div>

                {/* Launch Action */}
                <div className="shrink-0 flex items-center gap-2">
                  {isClickable ? (
                    <div className="flex items-center gap-1 text-xs font-medium text-cyan-400 group-hover:translate-x-0.5 transition-transform">
                      <span className="hidden sm:inline text-[11px] font-semibold">Launch</span>
                      <ExternalLink className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
                    </div>
                  ) : (
                    <span className="text-[10px] font-medium text-slate-500 px-2 py-0.5 rounded bg-slate-800/80">
                      Unavailable
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
