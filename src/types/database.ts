export interface Database {
  public: {
    Tables: {
      family_members: {
        Row: {
          id: string;
          name: string;
          color: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          color?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          color?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      purchases: {
        Row: {
          id: string;
          family_member_id: string;
          food_type: 'wet' | 'dry';
          purchase_date: string;
          amount: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          family_member_id: string;
          food_type: 'wet' | 'dry';
          purchase_date?: string;
          amount?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          family_member_id?: string;
          food_type?: 'wet' | 'dry';
          purchase_date?: string;
          amount?: number | null;
          created_at?: string;
        };
      };
      rotation_state: {
        Row: {
          id: string;
          wet_food_current_index: number;
          dry_food_current_index: number;
          wet_food_days_between: number;
          dry_food_days_between: number;
          wet_food_last_purchased: string | null;
          dry_food_last_purchased: string | null;
          wet_food_last_purchased_by: string | null;
          dry_food_last_purchased_by: string | null;
          is_setup_complete: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wet_food_current_index?: number;
          dry_food_current_index?: number;
          wet_food_days_between?: number;
          dry_food_days_between?: number;
          wet_food_last_purchased?: string | null;
          dry_food_last_purchased?: string | null;
          wet_food_last_purchased_by?: string | null;
          dry_food_last_purchased_by?: string | null;
          is_setup_complete?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          wet_food_current_index?: number;
          dry_food_current_index?: number;
          wet_food_days_between?: number;
          dry_food_days_between?: number;
          wet_food_last_purchased?: string | null;
          dry_food_last_purchased?: string | null;
          wet_food_last_purchased_by?: string | null;
          dry_food_last_purchased_by?: string | null;
          is_setup_complete?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Convenience types for easier usage
export type FamilyMemberDB = Database['public']['Tables']['family_members']['Row'];
export type PurchaseDB = Database['public']['Tables']['purchases']['Row'];
export type RotationStateDB = Database['public']['Tables']['rotation_state']['Row'];

export type FamilyMemberInsert = Database['public']['Tables']['family_members']['Insert'];
export type PurchaseInsert = Database['public']['Tables']['purchases']['Insert'];
export type RotationStateInsert = Database['public']['Tables']['rotation_state']['Insert'];

export type FamilyMemberUpdate = Database['public']['Tables']['family_members']['Update'];
export type PurchaseUpdate = Database['public']['Tables']['purchases']['Update'];
export type RotationStateUpdate = Database['public']['Tables']['rotation_state']['Update'];
