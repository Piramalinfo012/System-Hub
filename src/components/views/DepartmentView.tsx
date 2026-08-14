import React from 'react';
import { Building2, Layers, ArrowRight, ExternalLink } from 'lucide-react';
import { SystemItem } from '../../types';

interface DepartmentViewProps {
  systems: SystemItem[];
  onSelectDepartmentFilter: (dept: string) => void;
  onViewDetails: (system: SystemItem) => void;
  darkMode: boolean;
}

export const DepartmentView: React.FC<DepartmentViewProps> = ({
  systems,
  onSelectDepartmentFilter,
  onViewDetails,
  darkMode,
}) => {
  // Group systems by department
  const deptMap = systems.reduce((acc, sys) => {
    const d = sys.department || 'GENERAL';
    if (!acc[d]) acc[d] = [];
    acc[d].push(sys);
    return acc;
  }, {} as Record<string, SystemItem[]>);

  const departments = Object.keys(deptMap).sort();

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className={`p-6 rounded-3xl border ${
        darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Department System Directory</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Enterprise software and workflows organized by corporate division.
            </p>
          </div>
        </div>
      </div>

      {/* Department Sections */}
      <div className="space-y-6">
        {departments.map((dept) => {
          const deptSystems = deptMap[dept];
          return (
            <div
              key={dept}
              className={`p-6 rounded-3xl border ${
                darkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/60">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-bold text-sm">
                    {dept.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-bold tracking-tight">{dept} DEPARTMENT</h3>
                    <p className="text-xs text-slate-400">
                      {deptSystems.length} systems • {deptSystems.reduce((s, x) => s + x.steps.length, 0)} workflow steps
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onSelectDepartmentFilter(dept)}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <span>Filter Grid</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Department System Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {deptSystems.map((system) => (
                  <div
                    key={system.id}
                    onClick={() => onViewDetails(system)}
                    className={`p-4 rounded-2xl border transition-all hover:-translate-y-0.5 cursor-pointer ${
                      darkMode
                        ? 'bg-slate-950/60 border-slate-800 hover:border-cyan-500/40 hover:bg-slate-850'
                        : 'bg-slate-50 border-slate-200 hover:border-blue-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {system.systemType}
                      </span>
                      <span className="text-xs font-mono text-cyan-400 font-bold">
                        {system.steps.length} Steps
                      </span>
                    </div>
                    <h4 className="text-sm font-bold truncate text-slate-100 dark:text-slate-100">
                      {system.systemName}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                      {system.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
