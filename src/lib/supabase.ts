import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Create Supabase client only if configured
export const supabase = isSupabaseConfigured 
  ? createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

// Helper function to get the current rotation state (singleton)
export const getRotationState = async () => {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please set up your environment variables.');
  }

  const { data, error } = await supabase
    .from('rotation_state')
    .select('*')
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
    throw error;
  }

  return data;
};

// Helper function to create initial rotation state if it doesn't exist
export const createInitialRotationState = async () => {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please set up your environment variables.');
  }

  const { data, error } = await supabase
    .from('rotation_state')
    .insert({
      wet_food_current_index: 0,
      dry_food_current_index: 0,
      wet_food_days_between: 7,
      dry_food_days_between: 7,
      is_setup_complete: false,
    } as any)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};
