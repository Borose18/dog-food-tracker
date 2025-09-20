-- COMPLETE RESET - Delete ALL data and start fresh
-- Run this in your Supabase SQL Editor

-- First, clear the foreign key references in rotation_state
UPDATE rotation_state SET
  wet_food_last_purchased_by = NULL,
  dry_food_last_purchased_by = NULL,
  wet_food_last_purchased = NULL,
  dry_food_last_purchased = NULL,
  wet_food_current_index = 0,
  dry_food_current_index = 0,
  is_setup_complete = false,
  updated_at = NOW();

-- Delete all purchases (due to foreign key constraints)
DELETE FROM purchases;

-- Now delete all family members (foreign keys are cleared)
DELETE FROM family_members;

-- Verify everything is clean
SELECT 'purchases' as table_name, COUNT(*) as count FROM purchases
UNION ALL
SELECT 'family_members' as table_name, COUNT(*) as count FROM family_members
UNION ALL
SELECT 'rotation_state' as table_name, COUNT(*) as count FROM rotation_state;
