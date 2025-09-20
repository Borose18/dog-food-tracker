import { supabase, isSupabaseConfigured, getRotationState, createInitialRotationState } from './supabase';
import { 
  FamilyMemberDB, 
  PurchaseDB, 
  RotationStateDB,
  FamilyMemberInsert,
  PurchaseInsert,
  RotationStateUpdate
} from '@/types/database';

// Helper function to check Supabase configuration
const checkSupabaseConfig = () => {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured. Please set up your environment variables.');
  }
};

// Family Members CRUD operations
export const familyMembersAPI = {
  // Get all family members
  getAll: async (): Promise<FamilyMemberDB[]> => {
    checkSupabaseConfig();

    const { data, error } = await supabase
      .from('family_members')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Add a new family member
  create: async (member: FamilyMemberInsert): Promise<FamilyMemberDB> => {
    checkSupabaseConfig();

    const { data, error } = await supabase
      .from('family_members')
      .insert(member)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a family member
  update: async (id: string, updates: Partial<FamilyMemberInsert>): Promise<FamilyMemberDB> => {
    checkSupabaseConfig();

    const { data, error } = await supabase
      .from('family_members')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a family member
  delete: async (id: string): Promise<void> => {
    checkSupabaseConfig();

    const { error } = await supabase
      .from('family_members')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// Purchases CRUD operations
export const purchasesAPI = {
  // Get all purchases
  getAll: async (): Promise<PurchaseDB[]> => {
    checkSupabaseConfig();

    const { data, error } = await supabase
      .from('purchases')
      .select(`
        *,
        family_members!inner(name)
      `)
      .order('purchase_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get purchases by family member
  getByFamilyMember: async (familyMemberId: string): Promise<PurchaseDB[]> => {
    checkSupabaseConfig();

    const { data, error } = await supabase
      .from('purchases')
      .select(`
        *,
        family_members!inner(name)
      `)
      .eq('family_member_id', familyMemberId)
      .order('purchase_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Create a new purchase
  create: async (purchase: PurchaseInsert): Promise<PurchaseDB> => {
    checkSupabaseConfig();

    const { data, error } = await supabase
      .from('purchases')
      .insert(purchase)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a purchase
  delete: async (id: string): Promise<void> => {
    checkSupabaseConfig();

    const { error } = await supabase
      .from('purchases')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// Rotation State operations
export const rotationStateAPI = {
  // Get current rotation state
  get: async (): Promise<RotationStateDB> => {
    checkSupabaseConfig();

    let state = await getRotationState();
    
    if (!state) {
      state = await createInitialRotationState();
    }
    
    return state;
  },

  // Update rotation state
  update: async (updates: RotationStateUpdate): Promise<RotationStateDB> => {
    checkSupabaseConfig();

    // First get the existing rotation state to get its ID
    const { data: existingState, error: fetchError } = await supabase
      .from('rotation_state')
      .select('id')
      .single();

    if (fetchError) throw fetchError;
    if (!existingState) throw new Error('No rotation state found');

    // Update the rotation state by ID
    const { data, error } = await supabase
      .from('rotation_state')
      .update(updates)
      .eq('id', existingState.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Complete setup
  completeSetup: async (): Promise<RotationStateDB> => {
    return rotationStateAPI.update({ is_setup_complete: true });
  },

  // Record a purchase and update rotation for the specific food type only
  recordPurchase: async (
    familyMemberId: string, 
    foodType: 'wet' | 'dry'
  ): Promise<{ purchase: PurchaseDB; rotationState: RotationStateDB }> => {
    checkSupabaseConfig();

    // Get current state
    const currentState = await rotationStateAPI.get();
    const familyMembers = await familyMembersAPI.getAll();
    
    if (familyMembers.length === 0) {
      throw new Error('No family members found');
    }

    // Create the purchase record
    const purchase = await purchasesAPI.create({
      family_member_id: familyMemberId,
      food_type: foodType,
      purchase_date: new Date().toISOString(),
    });

    // Calculate next turn index for the specific food type only
    const currentIndex = foodType === 'wet' 
      ? currentState.wet_food_current_index 
      : currentState.dry_food_current_index;
    
    const nextIndex = (currentIndex + 1) % familyMembers.length;

    // Update only the specific food type's rotation state
    const updateData: RotationStateUpdate = {
      [`${foodType}_food_current_index`]: nextIndex,
      [`${foodType}_food_last_purchased`]: new Date().toISOString(),
      [`${foodType}_food_last_purchased_by`]: familyMemberId,
    };

    const rotationState = await rotationStateAPI.update(updateData);

    return { purchase, rotationState };
  },

  // Reset all data
  reset: async (): Promise<void> => {
    checkSupabaseConfig();

    // Delete all purchases
    const { error: purchasesError } = await supabase
      .from('purchases')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (purchasesError) throw purchasesError;

    // Delete all family members
    const { error: membersError } = await supabase
      .from('family_members')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (membersError) throw membersError;

    // Reset rotation state
    await rotationStateAPI.update({
      wet_food_current_index: 0,
      dry_food_current_index: 0,
      wet_food_last_purchased: null,
      dry_food_last_purchased: null,
      wet_food_last_purchased_by: null,
      dry_food_last_purchased_by: null,
      is_setup_complete: false,
    });
  },

  // Set initial state - who bought last and whose turn it is now
  setInitialState: async (
    wetLastBoughtBy: string, // family member ID
    dryLastBoughtBy: string, // family member ID
    wetCurrentTurn: string,  // family member ID
    dryCurrentTurn: string   // family member ID
  ): Promise<RotationStateDB> => {
    checkSupabaseConfig();
    
    const { data: existingState, error: fetchError } = await supabase
      .from('rotation_state')
      .select('id')
      .single();

    if (fetchError) throw fetchError;
    if (!existingState) throw new Error('No rotation state found');

    // Get family member indices
    const familyMembers = await familyMembersAPI.getAll();
    const wetLastIndex = familyMembers.findIndex(m => m.id === wetLastBoughtBy);
    const dryLastIndex = familyMembers.findIndex(m => m.id === dryLastBoughtBy);
    const wetCurrentIndex = familyMembers.findIndex(m => m.id === wetCurrentTurn);
    const dryCurrentIndex = familyMembers.findIndex(m => m.id === dryCurrentTurn);

    if (wetLastIndex === -1 || dryLastIndex === -1 || wetCurrentIndex === -1 || dryCurrentIndex === -1) {
      throw new Error('Invalid family member IDs');
    }

    const updateData: RotationStateUpdate = {
      wet_food_current_index: wetCurrentIndex,
      dry_food_current_index: dryCurrentIndex,
      wet_food_last_purchased: new Date().toISOString(),
      dry_food_last_purchased: new Date().toISOString(),
      wet_food_last_purchased_by: wetLastBoughtBy,
      dry_food_last_purchased_by: dryLastBoughtBy,
    };

    const { data, error } = await supabase
      .from('rotation_state')
      .update(updateData)
      .eq('id', existingState.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update just the current turn index for a specific food type
  updateTurnIndex: async (foodType: 'wet' | 'dry', memberIndex: number): Promise<RotationStateDB> => {
    checkSupabaseConfig();
    
    const { data: existingState, error: fetchError } = await supabase
      .from('rotation_state')
      .select('id')
      .single();

    if (fetchError) throw fetchError;
    if (!existingState) throw new Error('No rotation state found');

    const updateData: RotationStateUpdate = {
      [`${foodType}_food_current_index`]: memberIndex,
    };

    const { data, error } = await supabase
      .from('rotation_state')
      .update(updateData)
      .eq('id', existingState.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Reset both turns to first member
  resetTurns: async (): Promise<RotationStateDB> => {
    return rotationStateAPI.update({
      wet_food_current_index: 0,
      dry_food_current_index: 0,
    });
  },
};