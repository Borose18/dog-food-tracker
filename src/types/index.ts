import { FamilyMemberDB, PurchaseDB, RotationStateDB } from './database';

export interface FamilyMember {
  id: string;
  name: string;
  color: string;
}

export interface Purchase {
  id: string;
  familyMemberId: string;
  familyMemberName: string;
  foodType: 'wet' | 'dry';
  date: Date;
  amount?: number;
}

export interface FoodStatus {
  type: 'wet' | 'dry';
  lastPurchased: Date | null;
  lastPurchasedBy: string | null;
  nextDue: Date | null;
  isOverdue: boolean;
}

export interface AppState {
  familyMembers: FamilyMember[];
  currentTurnIndex: number; // Keep for backward compatibility
  wetFoodCurrentIndex: number;
  dryFoodCurrentIndex: number;
  purchases: Purchase[];
  wetFoodStatus: FoodStatus;
  dryFoodStatus: FoodStatus;
  isSetupComplete: boolean;
  turnsLocked: boolean;
}

// Helper functions to convert between database and app types
export const dbToAppTypes = {
  familyMember: (db: FamilyMemberDB): FamilyMember => ({
    id: db.id,
    name: db.name,
    color: db.color,
  }),

  purchase: (db: PurchaseDB & { family_members?: { name: string } }): Purchase => ({
    id: db.id,
    familyMemberId: db.family_member_id,
    familyMemberName: db.family_members?.name || 'Unknown',
    foodType: db.food_type,
    date: new Date(db.purchase_date),
    amount: db.amount || undefined,
  }),

  foodStatus: (
    type: 'wet' | 'dry',
    rotationState: RotationStateDB,
    familyMembers: FamilyMember[]
  ): FoodStatus => {
    const lastPurchased = type === 'wet' 
      ? rotationState.wet_food_last_purchased 
      : rotationState.dry_food_last_purchased;
    
    const lastPurchasedBy = type === 'wet'
      ? rotationState.wet_food_last_purchased_by
      : rotationState.dry_food_last_purchased_by;

    const daysBetween = type === 'wet'
      ? rotationState.wet_food_days_between
      : rotationState.dry_food_days_between;

    const lastPurchasedDate = lastPurchased ? new Date(lastPurchased) : null;
    const nextDue = lastPurchasedDate 
      ? new Date(lastPurchasedDate.getTime() + daysBetween * 24 * 60 * 60 * 1000)
      : null;
    
    const isOverdue = nextDue ? nextDue < new Date() : false;

    return {
      type,
      lastPurchased: lastPurchasedDate,
      lastPurchasedBy: lastPurchasedBy 
        ? familyMembers.find(m => m.id === lastPurchasedBy)?.name || null
        : null,
      nextDue,
      isOverdue,
    };
  },
};
