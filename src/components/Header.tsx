'use client';

import { Dog, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
}

export default function Header({ onReset }: HeaderProps) {
  return (
    <header className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-white/20 rounded-xl">
          <Dog className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Dog Food Tracker</h1>
          <p className="text-white/70">Family purchase rotation system</p>
        </div>
      </div>
      
      <button
        onClick={onReset}
        className="p-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-colors group"
        title="Reset all data"
      >
        <RotateCcw className="w-5 h-5 text-white/70 group-hover:text-white" />
      </button>
    </header>
  );
}
