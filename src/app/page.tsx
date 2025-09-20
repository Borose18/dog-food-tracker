'use client';

import { useSupabaseAppState } from '@/hooks/useSupabaseAppState';
import { useAppState } from '@/hooks/useAppState';
import { isSupabaseConfigured } from '@/lib/supabase';
import Header from '@/components/Header';
import FamilySetup from '@/components/FamilySetup';
import CurrentTurn from '@/components/CurrentTurn';
import FoodSection from '@/components/FoodSection';
import PurchaseHistory from '@/components/PurchaseHistory';
import TurnAdjuster from '@/components/TurnAdjuster';

export default function Home() {
  // Use Supabase if configured, otherwise fall back to localStorage
  const supabaseHook = useSupabaseAppState();
  const localStorageHook = useAppState();
  
  const { state, loading, error, addFamilyMember, removeFamilyMember, completeSetup, recordPurchase, resetApp, updateTurn, resetTurns, lockTurns } = 
    isSupabaseConfigured ? supabaseHook : localStorageHook;

  // Get current members for wet and dry food separately
  const wetFoodCurrentMember = state.familyMembers[state.wetFoodCurrentIndex];
  const dryFoodCurrentMember = state.familyMembers[state.dryFoodCurrentIndex];
  const wetFoodNextMember = state.familyMembers[(state.wetFoodCurrentIndex + 1) % state.familyMembers.length];
  
  // Keep backward compatibility for CurrentTurn component
  const currentMember = wetFoodCurrentMember; // Default to wet food for main display
  const nextMember = wetFoodNextMember;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-2">Connection Error</h2>
            <p className="text-white/70 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Header onReset={resetApp} />
        
        {!isSupabaseConfigured && (
          <div className="mb-6 bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div>
                <h3 className="text-white font-semibold">Running in Local Mode</h3>
                <p className="text-white/70 text-sm">
                  Data is stored locally. Set up Supabase for real-time collaboration and cloud storage.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {!state.isSetupComplete ? (
          <FamilySetup
            familyMembers={state.familyMembers}
            onAddMember={addFamilyMember}
            onRemoveMember={removeFamilyMember}
            onCompleteSetup={completeSetup}
          />
        ) : (
          <div className="space-y-6">
            {/* Turn Adjuster - Full width at top */}
            <TurnAdjuster
              familyMembers={state.familyMembers}
              wetFoodCurrentIndex={state.wetFoodCurrentIndex}
              dryFoodCurrentIndex={state.dryFoodCurrentIndex}
              turnsLocked={state.turnsLocked}
              onUpdateTurn={updateTurn}
              onResetTurns={resetTurns}
              onLockTurns={lockTurns}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left column */}
              <div className="space-y-6">
                <CurrentTurn
                  currentMember={currentMember}
                  nextMember={nextMember}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FoodSection
                    foodType="wet"
                    foodStatus={state.wetFoodStatus}
                    currentMember={wetFoodCurrentMember}
                    onPurchase={recordPurchase}
                  />
                  <FoodSection
                    foodType="dry"
                    foodStatus={state.dryFoodStatus}
                    currentMember={dryFoodCurrentMember}
                    onPurchase={recordPurchase}
                  />
                </div>
              </div>

              {/* Right column */}
              <div>
                <PurchaseHistory purchases={state.purchases} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}