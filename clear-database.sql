-- Clear all data from the dog food tracker database
-- Run this in your Supabase SQL Editor to start fresh

-- Delete all purchases first (due to foreign key constraints)
DELETE FROM purchases;

-- Delete all family members
DELETE FROM family_members;

-- Reset rotation state to initial values
UPDATE rotation_state SET
  wet_food_current_index = 0,
  dry_food_current_index = 0,
  wet_food_last_purchased = NULL,
  dry_food_last_purchased = NULL,
  wet_food_last_purchased_by = NULL,
  dry_food_last_purchased_by = NULL,
  is_setup_complete = false,
  updated_at = NOW();

-- Verify the tables are empty
SELECT 'purchases' as table_name, COUNT(*) as count FROM purchases
UNION ALL
SELECT 'family_members' as table_name, COUNT(*) as count FROM family_members
UNION ALL
SELECT 'rotation_state' as table_name, COUNT(*) as count FROM rotation_state;
