import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  darkMode: boolean;
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ darkMode, onToggle }) => {
  return (
    <button
      id="theme-toggle-button"
      onClick={onToggle}
      className={`relative p-2 rounded-xl transition-all duration-200 flex items-center justify-center ${
        darkMode
          ? 'bg-slate-800/80 text-amber-400 hover:bg-slate-700/80 border border-slate-700/50'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300/80 shadow-sm'
      }`}
      title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle theme"
    >
      {darkMode ? (
        <Sun className="w-4.5 h-4.5 transition-transform duration-300 rotate-0 hover:rotate-45 text-amber-400" />
      ) : (
        <Moon className="w-4.5 h-4.5 transition-transform duration-300 -rotate-12 hover:rotate-0 text-slate-700" />
      )}
    </button>
  );
};
