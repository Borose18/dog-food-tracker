'use client';

import { useState, useEffect, useCallback } from 'react';
import { AppState, FamilyMember, Purchase, FoodStatus } from '@/types';

const STORAGE_KEY = 'dog-food-tracker-state';

const defaultState: AppState = {
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
};

export const useAppState = () => {
  const [state, setState] = useState<AppState>(defaultState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        // Convert date strings back to Date objects
        parsed.purchases = parsed.purchases.map((p: Purchase) => ({
          ...p,
          date: new Date(p.date),
        }));
        if (parsed.wetFoodStatus.lastPurchased) {
          parsed.wetFoodStatus.lastPurchased = new Date(parsed.wetFoodStatus.lastPurchased);
        }
        if (parsed.dryFoodStatus.lastPurchased) {
          parsed.dryFoodStatus.lastPurchased = new Date(parsed.dryFoodStatus.lastPurchased);
        }
        if (parsed.wetFoodStatus.nextDue) {
          parsed.wetFoodStatus.nextDue = new Date(parsed.wetFoodStatus.nextDue);
        }
        if (parsed.dryFoodStatus.nextDue) {
          parsed.dryFoodStatus.nextDue = new Date(parsed.dryFoodStatus.nextDue);
        }
        setState(parsed);
      } catch (error) {
        console.error('Failed to load saved state:', error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addFamilyMember = useCallback((name: string, color: string) => {
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name,
      color,
    };
    setState(prev => ({
      ...prev,
      familyMembers: [...prev.familyMembers, newMember],
    }));
  }, []);

  const removeFamilyMember = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      familyMembers: prev.familyMembers.filter(member => member.id !== id),
      currentTurnIndex: prev.familyMembers.length > 1 ? 
        Math.min(prev.currentTurnIndex, prev.familyMembers.length - 2) : 0,
    }));
  }, []);

  const completeSetup = useCallback(() => {
    if (state.familyMembers.length >= 2) {
      setState(prev => ({
        ...prev,
        isSetupComplete: true,
        currentTurnIndex: 0,
      }));
    }
  }, [state.familyMembers.length]);

  const recordPurchase = useCallback((foodType: 'wet' | 'dry', amount?: number) => {
    if (state.familyMembers.length === 0) return;

    // Get the current member for the specific food type
    const currentIndex = foodType === 'wet' ? state.wetFoodCurrentIndex : state.dryFoodCurrentIndex;
    const currentMember = state.familyMembers[currentIndex];
    
    const newPurchase: Purchase = {
      id: Date.now().toString(),
      familyMemberId: currentMember.id,
      familyMemberName: currentMember.name,
      foodType,
      date: new Date(),
      amount,
    };

    // Calculate next due date (7 days from now)
    const nextDue = new Date();
    nextDue.setDate(nextDue.getDate() + 7);

    setState(prev => {
      const newPurchases = [...prev.purchases, newPurchase];
      
      // Calculate next turn index for the specific food type only
      const nextTurnIndex = (currentIndex + 1) % prev.familyMembers.length;
      
      const updateFoodStatus = (status: FoodStatus): FoodStatus => ({
        ...status,
        lastPurchased: new Date(),
        lastPurchasedBy: currentMember.name,
        nextDue,
        isOverdue: false,
      });

      return {
        ...prev,
        purchases: newPurchases,
        // Update only the specific food type's turn index
        wetFoodCurrentIndex: foodType === 'wet' ? nextTurnIndex : prev.wetFoodCurrentIndex,
        dryFoodCurrentIndex: foodType === 'dry' ? nextTurnIndex : prev.dryFoodCurrentIndex,
        // Keep backward compatibility
        currentTurnIndex: foodType === 'wet' ? nextTurnIndex : prev.currentTurnIndex,
        wetFoodStatus: foodType === 'wet' ? updateFoodStatus(prev.wetFoodStatus) : prev.wetFoodStatus,
        dryFoodStatus: foodType === 'dry' ? updateFoodStatus(prev.dryFoodStatus) : prev.dryFoodStatus,
      };
    });
  }, [state.familyMembers, state.wetFoodCurrentIndex, state.dryFoodCurrentIndex]);

  const resetApp = useCallback(() => {
    setState(defaultState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    state,
    loading: false,
    error: null,
    addFamilyMember,
    removeFamilyMember,
    completeSetup,
    recordPurchase,
    resetApp,
  };
};