'use client';

import { Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { FoodStatus, FamilyMember } from '@/types';

interface FoodSectionProps {
  foodType: 'wet' | 'dry';
  foodStatus: FoodStatus;
  currentMember: FamilyMember;
  onPurchase: (foodType: 'wet' | 'dry') => void;
}

export default function FoodSection({ 
  foodType, 
  foodStatus, 
  currentMember, 
  onPurchase 
}: FoodSectionProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return 'Never';
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilDue = (date: Date | null) => {
    if (!date) return null;
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = getDaysUntilDue(foodStatus.nextDue);
  const isOverdue = daysUntilDue !== null && daysUntilDue < 0;

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white capitalize">
          {foodType} Food
        </h3>
        <div className={`w-3 h-3 rounded-full ${
          isOverdue ? 'bg-red-500' : 
          daysUntilDue !== null && daysUntilDue <= 2 ? 'bg-yellow-500' : 
          'bg-green-500'
        }`} />
      </div>

      <div className="space-y-4">
        {/* Status info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-white/70">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">
              Last purchased: {formatDate(foodStatus.lastPurchased)}
            </span>
          </div>
          
          {foodStatus.lastPurchasedBy && (
            <div className="text-white/70 text-sm">
              By: {foodStatus.lastPurchasedBy}
            </div>
          )}

          {foodStatus.nextDue && (
            <div className={`flex items-center gap-2 text-sm ${
              isOverdue ? 'text-red-400' : 
              daysUntilDue !== null && daysUntilDue <= 2 ? 'text-yellow-400' : 
              'text-green-400'
            }`}>
              {isOverdue ? (
                <>
                  <AlertCircle className="w-4 h-4" />
                  <span>Overdue by {Math.abs(daysUntilDue)} days</span>
                </>
              ) : daysUntilDue !== null && daysUntilDue <= 2 ? (
                <>
                  <AlertCircle className="w-4 h-4" />
                  <span>Due in {daysUntilDue} days</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Due in {daysUntilDue} days</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Purchase button */}
        <button
          onClick={() => onPurchase(foodType)}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-5 h-5" />
          Mark as Purchased by {currentMember.name}
        </button>
      </div>
    </div>
  );
}
