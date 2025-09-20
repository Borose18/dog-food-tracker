'use client';

import { History, Calendar, User } from 'lucide-react';
import { Purchase } from '@/types';

interface PurchaseHistoryProps {
  purchases: Purchase[];
}

export default function PurchaseHistory({ purchases }: PurchaseHistoryProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFoodTypeColor = (foodType: 'wet' | 'dry') => {
    return foodType === 'wet' ? 'bg-blue-500' : 'bg-green-500';
  };

  const recentPurchases = purchases
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 10);

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <div className="flex items-center gap-3 mb-4">
        <History className="w-6 h-6 text-white" />
        <h2 className="text-2xl font-bold text-white">Recent Purchases</h2>
      </div>

      {recentPurchases.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-white/30 mx-auto mb-3" />
          <p className="text-white/70">No purchases recorded yet</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {recentPurchases.map((purchase) => (
            <div
              key={purchase.id}
              className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getFoodTypeColor(purchase.foodType)}`} />
                  <span className="text-white font-medium capitalize">
                    {purchase.foodType} Food
                  </span>
                </div>
                <span className="text-white/50 text-sm">
                  {formatDate(purchase.date)}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-white/70">
                <User className="w-4 h-4" />
                <span className="text-sm">{purchase.familyMemberName}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {purchases.length > 10 && (
        <div className="mt-4 text-center">
          <p className="text-white/50 text-sm">
            Showing 10 of {purchases.length} purchases
          </p>
        </div>
      )}
    </div>
  );
}
