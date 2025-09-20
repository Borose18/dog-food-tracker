'use client';

import { Clock, User } from 'lucide-react';
import { FamilyMember } from '@/types';

interface CurrentTurnProps {
  currentMember?: FamilyMember;
  nextMember?: FamilyMember;
}

export default function CurrentTurn({ currentMember, nextMember }: CurrentTurnProps) {
  // Don't render if no current member
  if (!currentMember) {
    return null;
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <div className="flex items-center gap-3 mb-4">
        <Clock className="w-6 h-6 text-white" />
        <h2 className="text-2xl font-bold text-white">Current Turn</h2>
      </div>

      <div className="space-y-4">
        {/* Current turn */}
        <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-4 border border-white/20">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-6 h-6 rounded-full ${currentMember.color}`} />
            <span className="text-white/70 text-sm">It's your turn to buy</span>
          </div>
          <h3 className="text-xl font-bold text-white">{currentMember.name}</h3>
        </div>

        {/* Next turn */}
        {nextMember && (
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <User className="w-4 h-4 text-white/50" />
              <span className="text-white/50 text-sm">Next up</span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${nextMember.color}`} />
              <span className="text-white/70">{nextMember.name}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
