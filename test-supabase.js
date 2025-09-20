const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ypcfpgiqkagefwjtufin.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwY2ZwZ2lxa2FnZWZ3anR1ZmluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNDEyOTcsImV4cCI6MjA3MzkxNzI5N30.SgvISh89WYHltzBOe2c8NuuoL2ft6GmC_5Trc4cGUwk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('Testing Supabase connection...');
  console.log('URL:', supabaseUrl);
  console.log('Key (first 20 chars):', supabaseAnonKey.substring(0, 20) + '...');
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('family_members').select('count', { count: 'exact' });
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Connection successful!');
    console.log('Family members table accessible');
    
    // Test rotation_state table
    const { data: rotationData, error: rotationError } = await supabase
      .from('rotation_state')
      .select('*')
      .limit(1);
    
    if (rotationError) {
      console.warn('⚠️  Rotation state table issue:', rotationError.message);
    } else {
      console.log('✅ Rotation state table accessible');
      console.log('Current rotation state:', rotationData);
    }
    
    return true;
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    return false;
  }
}

testConnection().then(success => {
  process.exit(success ? 0 : 1);
});
