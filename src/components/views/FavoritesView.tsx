import React from 'react';
import { Star, Sparkles, Layers, SearchX } from 'lucide-react';
import { SystemItem, SystemHeartbeatStatus } from '../../types';
import { SystemCard } from '../systems/SystemCard';

interface FavoritesViewProps {
  systems: SystemItem[];
  favoriteIds: string[];
  onToggleFavorite: (id: string) => void;
  onViewDetails: (system: SystemItem) => void;
  darkMode: boolean;
  onExploreAll: () => void;
  heartbeats?: Record<string, SystemHeartbeatStatus>;
  onRefreshHeartbeat?: (system: SystemItem) => Promise<void> | void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  systems,
  favoriteIds,
  onToggleFavorite,
  onViewDetails,
  darkMode,
  onExploreAll,
  heartbeats = {},
  onRefreshHeartbeat,
}) => {
  const favoriteSystems = systems.filter(sys => favoriteIds.includes(sys.id));

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className={`p-6 rounded-3xl border ${
        darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
              <Star className="w-6 h-6 fill-yellow-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">My Favorite Systems</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Quick-access collection of your pinned enterprise operational systems and workflows.
              </p>
            </div>
          </div>
          <span className="font-mono text-xs px-3 py-1.5 rounded-xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 font-bold">
            {favoriteSystems.length} Starred
          </span>
        </div>
      </div>

      {/* Grid */}
      {favoriteSystems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {favoriteSystems.map((system) => (
            <SystemCard
              key={system.id}
              system={system}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
              onViewDetails={onViewDetails}
              darkMode={darkMode}
              heartbeatStatus={heartbeats[system.id]}
              onRefreshHeartbeat={onRefreshHeartbeat}
            />
          ))}
        </div>
      ) : (
        <div className={`p-12 rounded-3xl border text-center ${
          darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <Star className="w-10 h-10 mx-auto text-slate-600 mb-3" />
          <h3 className={`text-base font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>No favorite systems yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Click the star icon on any system card across the portal to bookmark it for instant one-click access.
          </p>
          <button
            onClick={onExploreAll}
            className="mt-4 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors"
          >
            Explore All Systems
          </button>
        </div>
      )}

    </div>
  );
};
