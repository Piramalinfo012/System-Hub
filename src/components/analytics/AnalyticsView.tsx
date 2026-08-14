import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  Layers, 
  Activity, 
  ShieldCheck, 
  FileSpreadsheet, 
  Monitor,
  Workflow
} from 'lucide-react';
import { SystemItem } from '../../types';

interface AnalyticsViewProps {
  systems: SystemItem[];
  darkMode: boolean;
}

const COLORS = ['#06b6d4', '#3b82f6', '#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#14b8a6'];

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ systems, darkMode }) => {
  
  // 1. Systems By Department
  const deptCounts = systems.reduce((acc, sys) => {
    const d = sys.department || 'GENERAL';
    acc[d] = (acc[d] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const deptData = Object.keys(deptCounts).map(d => ({
    name: d,
    count: deptCounts[d]
  }));

  // 2. Systems By Type
  const typeCounts = systems.reduce((acc, sys) => {
    const t = sys.systemType || 'SOFTWARE';
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const typeData = Object.keys(typeCounts).map(t => ({
    name: t,
    value: typeCounts[t]
  }));

  // 3. Workflow Steps Distribution (Top Systems with most steps)
  const stepsPerSystemData = [...systems]
    .sort((a, b) => b.steps.length - a.steps.length)
    .slice(0, 7)
    .map(sys => ({
      name: sys.systemName.length > 18 ? sys.systemName.substring(0, 16) + '...' : sys.systemName,
      steps: sys.steps.length,
      department: sys.department
    }));

  // 4. Resource Coverage KPI
  const totalSystems = systems.length;
  const withSoftware = systems.filter(s => s.softwareUrl).length;
  const withSheet = systems.filter(s => s.sheetUrl).length;
  const withDashboard = systems.filter(s => s.dashboardUrl).length;
  const totalSteps = systems.reduce((sum, s) => sum + s.steps.length, 0);

  const coverageData = [
    { name: 'Software URL', value: withSoftware, color: '#06b6d4' },
    { name: 'Google Sheet Link', value: withSheet, color: '#10b981' },
    { name: 'BI Dashboard Link', value: withDashboard, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className={`p-6 rounded-3xl border ${
        darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">System Infrastructure Analytics</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live operational metrics, department system allocations, and workflow coverage derived directly from Google Sheet.
            </p>
          </div>
        </div>

        {/* Quick Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-800/60">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Systems</span>
            <p className="text-2xl font-bold font-mono text-cyan-400 mt-1">{totalSystems}</p>
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Workflow Steps</span>
            <p className="text-2xl font-bold font-mono text-blue-400 mt-1">{totalSteps}</p>
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Connected Sheets</span>
            <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">{withSheet}</p>
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Live BI Dashboards</span>
            <p className="text-2xl font-bold font-mono text-amber-400 mt-1">{withDashboard}</p>
          </div>
        </div>
      </div>

      {/* Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CHART 1: Systems by Department */}
        <div className={`p-5 rounded-3xl border ${
          darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold">Systems by Department</h3>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Live Google Sheet</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 10 }} 
                  angle={-25} 
                  textAnchor="end" 
                />
                <YAxis tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                    borderColor: darkMode ? '#1e293b' : '#e2e8f0',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: darkMode ? '#f8fafc' : '#0f172a'
                  }}
                />
                <Bar dataKey="count" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: System Types Breakdown */}
        <div className={`p-5 rounded-3xl border ${
          darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold">System Types Distribution</h3>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Type Index</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                    borderColor: darkMode ? '#1e293b' : '#e2e8f0',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '11px', color: darkMode ? '#94a3b8' : '#64748b' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 3: Workflow Complexity (Steps per system) */}
        <div className={`p-5 rounded-3xl border lg:col-span-2 ${
          darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Workflow className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold">Workflow Step Complexity (Top Systems)</h3>
            </div>
            <span className="text-[11px] text-cyan-400 font-mono">Step Timeline Count</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stepsPerSystemData} margin={{ top: 10, right: 20, left: -20, bottom: 25 }}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 11 }} 
                  angle={-15} 
                  textAnchor="end"
                />
                <YAxis tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                    borderColor: darkMode ? '#1e293b' : '#e2e8f0',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="steps" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
