'use client';

import { useState, useEffect, useCallback } from 'react';
import { familyMembersAPI, purchasesAPI, rotationStateAPI } from '@/lib/database';
import { realtimeManager } from '@/lib/realtime';
import { AppState, FamilyMember, Purchase, dbToAppTypes } from '@/types';
import { PurchaseDB } from '@/types/database';

export const useSupabaseAppState = () => {
  const [state, setState] = useState<AppState>({
    familyMembers: [],
    currentTurnIndex: 0,
    wetFoodCurrentIndex: 0,
    dryFoodCurrentIndex: 0,
    purchases: [],
    wetFoodStatus: {
      type: 'wet',
      lastPurchased: null,
      lastPurchasedBy: null,
      nextDue: null,
      isOverdue: false,
    },
    dryFoodStatus: {
      type: 'dry',
      lastPurchased: null,
      lastPurchasedBy: null,
      nextDue: null,
      isOverdue: false,
    },
    isSetupComplete: false,
    turnsLocked: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [familyMembersData, purchasesData, rotationStateData] = await Promise.all([
        familyMembersAPI.getAll(),
        purchasesAPI.getAll(),
        rotationStateAPI.get(),
      ]);

      const familyMembers: FamilyMember[] = familyMembersData.map(dbToAppTypes.familyMember);
      const purchases: Purchase[] = purchasesData.map(dbToAppTypes.purchase);

      const wetFoodStatus = dbToAppTypes.foodStatus('wet', rotationStateData, familyMembers);
      const dryFoodStatus = dbToAppTypes.foodStatus('dry', rotationStateData, familyMembers);

      setState({
        familyMembers,
        currentTurnIndex: rotationStateData.wet_food_current_index, // Keep for backward compatibility
        wetFoodCurrentIndex: rotationStateData.wet_food_current_index,
        dryFoodCurrentIndex: rotationStateData.dry_food_current_index,
        purchases,
        wetFoodStatus,
        dryFoodStatus,
        isSetupComplete: rotationStateData.is_setup_complete,
        // turnsLocked should be based on whether there are any purchases (once locked, can't easily unlock)
        turnsLocked: purchases.length > 0, // Lock turns if there are any purchases
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Set up real-time subscriptions
  useEffect(() => {
    loadData();

    // Subscribe to real-time updates
    realtimeManager.subscribeToAll(
      // Family members callback
      (familyMembers) => {
        setState(prev => ({
          ...prev,
          familyMembers: familyMembers.map(dbToAppTypes.familyMember),
        }));
      },
      // Purchases callback
      (purchases) => {
        setState(prev => ({
          ...prev,
          purchases: purchases.map(p => dbToAppTypes.purchase(p as PurchaseDB & { family_members?: { name: string } })),
        }));
      },
      // Rotation state callback
      (rotationState) => {
        setState(prev => ({
          ...prev,
          currentTurnIndex: rotationState.wet_food_current_index,
          wetFoodCurrentIndex: rotationState.wet_food_current_index,
          dryFoodCurrentIndex: rotationState.dry_food_current_index,
          isSetupComplete: rotationState.is_setup_complete,
          // Keep existing turnsLocked state - don't reset it
          wetFoodStatus: dbToAppTypes.foodStatus('wet', rotationState, prev.familyMembers),
          dryFoodStatus: dbToAppTypes.foodStatus('dry', rotationState, prev.familyMembers),
        }));
      }
    );

    return () => {
      realtimeManager.unsubscribeAll();
    };
  }, [loadData]);

  const addFamilyMember = useCallback(async (name: string, color: string) => {
    try {
      setError(null);
      await familyMembersAPI.create({ name, color });
      // Real-time subscription will handle the state update
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add family member');
      throw err;
    }
  }, []);

  const removeFamilyMember = useCallback(async (id: string) => {
    try {
      setError(null);
      await familyMembersAPI.delete(id);
      // Real-time subscription will handle the state update
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove family member');
      throw err;
    }
  }, []);

  const completeSetup = useCallback(async () => {
    try {
      setError(null);
      await rotationStateAPI.completeSetup();
      // Real-time subscription will handle the state update
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete setup');
      throw err;
    }
  }, []);

  const recordPurchase = useCallback(async (foodType: 'wet' | 'dry') => {
    try {
      setError(null);
      const currentIndex = foodType === 'wet' ? state.wetFoodCurrentIndex : state.dryFoodCurrentIndex;
      const currentMember = state.familyMembers[currentIndex];
      
      if (!currentMember) {
        throw new Error('No current member found');
      }

      await rotationStateAPI.recordPurchase(currentMember.id, foodType);
      // Real-time subscription will handle the state update
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record purchase');
      throw err;
    }
  }, [state.familyMembers, state.wetFoodCurrentIndex, state.dryFoodCurrentIndex]);

  const resetApp = useCallback(async () => {
    try {
      setError(null);
      await rotationStateAPI.reset();
      // Real-time subscription will handle the state update
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset app');
      throw err;
    }
  }, []);

  const setInitialState = useCallback(async (
    wetLastBoughtBy: string,
    dryLastBoughtBy: string,
    wetCurrentTurn: string,
    dryCurrentTurn: string
  ) => {
    try {
      setError(null);
      await rotationStateAPI.setInitialState(
        wetLastBoughtBy,
        dryLastBoughtBy,
        wetCurrentTurn,
        dryCurrentTurn
      );
      // Real-time subscription will handle the state update
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set initial state');
      throw err;
    }
  }, []);

  const updateTurn = useCallback(async (foodType: 'wet' | 'dry', memberIndex: number) => {
    try {
      setError(null);
      await rotationStateAPI.updateTurnIndex(foodType, memberIndex);
      // Real-time subscription will handle the state update
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update turn');
      throw err;
    }
  }, []);

  const lockTurns = useCallback(() => {
    setState(prev => ({
      ...prev,
      turnsLocked: true,
    }));
  }, []);

  const resetTurns = useCallback(async () => {
    try {
      setError(null);
      await rotationStateAPI.resetTurns();
      // Real-time subscription will handle the state update
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset turns');
      throw err;
    }
  }, []);

  return {
    state,
    loading,
    error,
    addFamilyMember,
    removeFamilyMember,
    completeSetup,
    recordPurchase,
    resetApp,
    setInitialState,
    updateTurn,
    resetTurns,
    lockTurns,
  };
};