'use client';

import { useState } from 'react';
import { Plus, X, Users } from 'lucide-react';
import { FamilyMember } from '@/types';

interface FamilySetupProps {
  familyMembers: FamilyMember[];
  onAddMember: (name: string, color: string) => void;
  onRemoveMember: (id: string) => void;
  onCompleteSetup: () => void;
}

const MEMBER_COLORS = [
  'bg-blue-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-red-500',
  'bg-indigo-500',
  'bg-teal-500',
];

export default function FamilySetup({ 
  familyMembers, 
  onAddMember, 
  onRemoveMember, 
  onCompleteSetup 
}: FamilySetupProps) {
  const [newMemberName, setNewMemberName] = useState('');
  const [selectedColor, setSelectedColor] = useState(MEMBER_COLORS[0]);

  const handleAddMember = () => {
    if (newMemberName.trim() && familyMembers.length < 8) {
      onAddMember(newMemberName.trim(), selectedColor);
      setNewMemberName('');
      setSelectedColor(MEMBER_COLORS[familyMembers.length % MEMBER_COLORS.length]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddMember();
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-6 h-6 text-white" />
        <h2 className="text-2xl font-bold text-white">Family Setup</h2>
      </div>

      <div className="space-y-4">
        {/* Add new member form */}
        <div className="flex gap-3">
          <input
            type="text"
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter family member name"
            className="flex-1 px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
            maxLength={20}
          />
          <button
            onClick={handleAddMember}
            disabled={!newMemberName.trim() || familyMembers.length >= 8}
            className="px-4 py-3 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl border border-white/30 transition-colors"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Color selection */}
        <div className="flex gap-2 flex-wrap">
          {MEMBER_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-8 h-8 rounded-full ${color} border-2 ${
                selectedColor === color ? 'border-white' : 'border-white/30'
              } transition-all hover:scale-110`}
            />
          ))}
        </div>

        {/* Family members list */}
        <div className="space-y-2">
          {familyMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-3 bg-white/10 rounded-xl border border-white/20"
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${member.color}`} />
                <span className="text-white font-medium">{member.name}</span>
              </div>
              <button
                onClick={() => onRemoveMember(member.id)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-white/70" />
              </button>
            </div>
          ))}
        </div>

        {/* Complete setup button */}
        {familyMembers.length >= 2 && (
          <button
            onClick={onCompleteSetup}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg"
          >
            Complete Setup ({familyMembers.length} members)
          </button>
        )}

        {familyMembers.length < 2 && (
          <p className="text-white/70 text-center py-4">
            Add at least 2 family members to continue
          </p>
        )}
      </div>
    </div>
  );
}
