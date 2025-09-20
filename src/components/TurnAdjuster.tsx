'use client';

import { Settings, RotateCcw } from 'lucide-react';
import { FamilyMember } from '@/types';

interface TurnAdjusterProps {
  familyMembers: FamilyMember[];
  wetFoodCurrentIndex: number;
  dryFoodCurrentIndex: number;
  turnsLocked: boolean;
  onUpdateTurn: (foodType: 'wet' | 'dry', memberIndex: number) => void;
  onResetTurns: () => void;
  onLockTurns: () => void;
}

export default function TurnAdjuster({ 
  familyMembers, 
  wetFoodCurrentIndex, 
  dryFoodCurrentIndex, 
  turnsLocked,
  onUpdateTurn,
  onResetTurns,
  onLockTurns
}: TurnAdjusterProps) {
  const wetFoodCurrentMember = familyMembers[wetFoodCurrentIndex];
  const dryFoodCurrentMember = familyMembers[dryFoodCurrentIndex];

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-white" />
          <h2 className="text-2xl font-bold text-white">
            {turnsLocked ? 'Turns Locked' : 'Adjust Current Turns'}
          </h2>
        </div>
        <div className="flex gap-2">
          {!turnsLocked && (
            <button
              onClick={onLockTurns}
              className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg border border-green-500/30 transition-colors"
              title="Lock turns to prevent changes"
            >
              Lock Turns
            </button>
          )}
          <button
            onClick={onResetTurns}
            disabled={turnsLocked}
            className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg border border-white/20 transition-colors"
            title={turnsLocked ? "Unlock turns first" : "Reset both turns to first member"}
          >
            <RotateCcw className="w-4 h-4 text-white/70" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Wet Food Turn */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Wet Food Turn</h3>
          
          <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl p-4 border border-blue-500/30">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-6 h-6 rounded-full ${wetFoodCurrentMember?.color || 'bg-gray-500'}`} />
              <span className="text-white font-medium">
                {wetFoodCurrentMember?.name || 'No member selected'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-white/70 text-sm">Change to:</label>
            <div className="grid grid-cols-1 gap-2">
              {familyMembers.map((member, index) => (
                <button
                  key={member.id}
                  onClick={() => onUpdateTurn('wet', index)}
                  disabled={turnsLocked}
                  className={`p-3 rounded-lg border transition-all ${
                    wetFoodCurrentIndex === index
                      ? 'bg-blue-500/30 border-blue-500 text-white'
                      : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                  } ${turnsLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${member.color}`} />
                    <span className="font-medium">{member.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dry Food Turn */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Dry Food Turn</h3>
          
          <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-xl p-4 border border-green-500/30">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-6 h-6 rounded-full ${dryFoodCurrentMember?.color || 'bg-gray-500'}`} />
              <span className="text-white font-medium">
                {dryFoodCurrentMember?.name || 'No member selected'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-white/70 text-sm">Change to:</label>
            <div className="grid grid-cols-1 gap-2">
              {familyMembers.map((member, index) => (
                <button
                  key={member.id}
                  onClick={() => onUpdateTurn('dry', index)}
                  disabled={turnsLocked}
                  className={`p-3 rounded-lg border transition-all ${
                    dryFoodCurrentIndex === index
                      ? 'bg-green-500/30 border-green-500 text-white'
                      : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                  } ${turnsLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${member.color}`} />
                    <span className="font-medium">{member.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
        <div className="flex items-center gap-2 text-white/70 text-sm">
          <Settings className="w-4 h-4" />
          <span>Wet and dry food can have different turn orders</span>
        </div>
      </div>
    </div>
  );
}
