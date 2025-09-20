import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './supabase';
import { 
  FamilyMemberDB, 
  PurchaseDB, 
  RotationStateDB 
} from '@/types/database';

export type RealtimeCallback<T> = (payload: T) => void;

export class RealtimeManager {
  private channels: Map<string, RealtimeChannel> = new Map();

  // Subscribe to family members changes
  subscribeToFamilyMembers(callback: RealtimeCallback<FamilyMemberDB[]>) {
    if (!isSupabaseConfigured || !supabase) {
      console.warn('Supabase is not configured. Real-time features are disabled.');
      return null;
    }

    const channelName = 'family_members_changes';
    
    if (this.channels.has(channelName)) {
      this.unsubscribe(channelName);
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'family_members'
        },
        async () => {
          // Fetch updated data when changes occur
          const { data, error } = await supabase
            .from('family_members')
            .select('*')
            .order('created_at', { ascending: true });

          if (!error && data) {
            callback(data);
          }
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);
    return channel;
  }

  // Subscribe to purchases changes
  subscribeToPurchases(callback: RealtimeCallback<PurchaseDB[]>) {
    if (!isSupabaseConfigured || !supabase) {
      console.warn('Supabase is not configured. Real-time features are disabled.');
      return null;
    }

    const channelName = 'purchases_changes';
    
    if (this.channels.has(channelName)) {
      this.unsubscribe(channelName);
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'purchases'
        },
        async () => {
          // Fetch updated data when changes occur
          const { data, error } = await supabase
            .from('purchases')
            .select(`
              *,
              family_members!inner(name)
            `)
            .order('purchase_date', { ascending: false });

          if (!error && data) {
            callback(data);
          }
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);
    return channel;
  }

  // Subscribe to rotation state changes
  subscribeToRotationState(callback: RealtimeCallback<RotationStateDB>) {
    if (!isSupabaseConfigured || !supabase) {
      console.warn('Supabase is not configured. Real-time features are disabled.');
      return null;
    }

    const channelName = 'rotation_state_changes';
    
    if (this.channels.has(channelName)) {
      this.unsubscribe(channelName);
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rotation_state'
        },
        async () => {
          // Fetch updated data when changes occur
          const { data, error } = await supabase
            .from('rotation_state')
            .select('*')
            .single();

          if (!error && data) {
            callback(data);
          }
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);
    return channel;
  }

  // Subscribe to all changes (convenience method)
  subscribeToAll(
    familyMembersCallback: RealtimeCallback<FamilyMemberDB[]>,
    purchasesCallback: RealtimeCallback<PurchaseDB[]>,
    rotationStateCallback: RealtimeCallback<RotationStateDB>
  ) {
    this.subscribeToFamilyMembers(familyMembersCallback);
    this.subscribeToPurchases(purchasesCallback);
    this.subscribeToRotationState(rotationStateCallback);
  }

  // Unsubscribe from a specific channel
  unsubscribe(channelName: string) {
    const channel = this.channels.get(channelName);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(channelName);
    }
  }

  // Unsubscribe from all channels
  unsubscribeAll() {
    this.channels.forEach((channel) => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
  }

  // Get active channels
  getActiveChannels(): string[] {
    return Array.from(this.channels.keys());
  }
}

// Create a singleton instance
export const realtimeManager = new RealtimeManager();
