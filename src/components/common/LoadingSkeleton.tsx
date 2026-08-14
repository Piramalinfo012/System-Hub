import React from 'react';

interface LoadingSkeletonProps {
  darkMode: boolean;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ darkMode }) => {
  const skeletonBg = darkMode ? 'bg-slate-850' : 'bg-slate-200';

  return (
    <div className="space-y-6 animate-pulse">
      {/* KPI Skeletons */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`h-28 rounded-2xl border p-4 ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className={`h-3 w-16 rounded ${skeletonBg} mb-2`}></div>
            <div className={`h-8 w-20 rounded ${skeletonBg} mb-2`}></div>
            <div className={`h-2.5 w-24 rounded ${skeletonBg}`}></div>
          </div>
        ))}
      </div>

      {/* Filter Bar Skeleton */}
      <div className={`h-12 rounded-2xl border p-3 flex gap-2 ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className={`h-6 w-24 rounded-xl ${skeletonBg}`}></div>
        <div className={`h-6 w-20 rounded-xl ${skeletonBg}`}></div>
        <div className={`h-6 w-20 rounded-xl ${skeletonBg}`}></div>
        <div className={`h-6 w-20 rounded-xl ${skeletonBg}`}></div>
      </div>

      {/* Grid Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className={`h-72 rounded-2xl border p-5 flex flex-col justify-between ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div>
              <div className="flex justify-between mb-3">
                <div className={`h-8 w-8 rounded-xl ${skeletonBg}`}></div>
                <div className={`h-5 w-16 rounded-md ${skeletonBg}`}></div>
              </div>
              <div className={`h-5 w-3/4 rounded ${skeletonBg} mb-2`}></div>
              <div className={`h-3 w-1/2 rounded ${skeletonBg} mb-4`}></div>
              <div className={`h-3 w-full rounded ${skeletonBg} mb-1.5`}></div>
              <div className={`h-3 w-4/5 rounded ${skeletonBg}`}></div>
            </div>
            <div className="pt-3 border-t border-slate-800/40 flex justify-between">
              <div className={`h-7 w-24 rounded-xl ${skeletonBg}`}></div>
              <div className={`h-7 w-16 rounded-xl ${skeletonBg}`}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
