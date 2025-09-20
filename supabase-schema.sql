-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create family_members table
CREATE TABLE IF NOT EXISTS family_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(20) NOT NULL DEFAULT 'bg-blue-500',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create purchases table
CREATE TABLE IF NOT EXISTS purchases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    family_member_id UUID NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
    food_type VARCHAR(10) NOT NULL CHECK (food_type IN ('wet', 'dry')),
    purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    amount DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create rotation_state table (singleton table for app state)
CREATE TABLE IF NOT EXISTS rotation_state (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wet_food_current_index INTEGER NOT NULL DEFAULT 0,
    dry_food_current_index INTEGER NOT NULL DEFAULT 0,
    wet_food_days_between INTEGER NOT NULL DEFAULT 7,
    dry_food_days_between INTEGER NOT NULL DEFAULT 7,
    wet_food_last_purchased TIMESTAMP WITH TIME ZONE,
    dry_food_last_purchased TIMESTAMP WITH TIME ZONE,
    wet_food_last_purchased_by UUID REFERENCES family_members(id),
    dry_food_last_purchased_by UUID REFERENCES family_members(id),
    is_setup_complete BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_purchases_family_member_id ON purchases(family_member_id);
CREATE INDEX IF NOT EXISTS idx_purchases_food_type ON purchases(food_type);
CREATE INDEX IF NOT EXISTS idx_purchases_purchase_date ON purchases(purchase_date);
CREATE INDEX IF NOT EXISTS idx_family_members_created_at ON family_members(created_at);

-- Enable Row Level Security
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE rotation_state ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (you may want to restrict this based on your needs)
CREATE POLICY "Allow all operations on family_members" ON family_members
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on purchases" ON purchases
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on rotation_state" ON rotation_state
    FOR ALL USING (true) WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_family_members_updated_at 
    BEFORE UPDATE ON family_members 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rotation_state_updated_at 
    BEFORE UPDATE ON rotation_state 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial rotation state
INSERT INTO rotation_state (id) VALUES (gen_random_uuid()) 
ON CONFLICT DO NOTHING;

-- Enable real-time subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE family_members;
ALTER PUBLICATION supabase_realtime ADD TABLE purchases;
ALTER PUBLICATION supabase_realtime ADD TABLE rotation_state;
