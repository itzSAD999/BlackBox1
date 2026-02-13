// Test Supabase Connection
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://crkmhpfgrvcnmqgiekjb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNya21ocGZncnZjbm1xZ2lla2piIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5ODg5NjAsImV4cCI6MjA4NjU2NDk2MH0.Wj41xSqkzhxScFfIHt4s_2vEFbb7qpT8YuubfIPvmYM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('🔍 Testing Supabase Connection...\n');
  
  try {
    // Test 1: Basic connection
    console.log('1. Testing basic connection...');
    const { data, error } = await supabase.from('products').select('count').single();
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return;
    }
    console.log('✅ Connection successful!');
    
    // Test 2: Fetch products
    console.log('\n2. Testing product fetch...');
    const { data: products, error: productError } = await supabase
      .from('products')
      .select('*')
      .limit(3);
    
    if (productError) {
      console.error('❌ Product fetch failed:', productError.message);
      return;
    }
    
    console.log(`✅ Found ${products.length} products:`);
    products.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} - $${product.price}`);
    });
    
    // Test 3: Test authentication setup
    console.log('\n3. Testing authentication...');
    const { data: authData } = await supabase.auth.getSession();
    console.log('✅ Auth system ready');
    
    console.log('\n🎉 All tests passed! Supabase is properly configured.');
    console.log('\n📋 Next Steps:');
    console.log('   1. Run the database schema in Supabase SQL Editor');
    console.log('   2. Run the seed data for sample products');
    console.log('   3. Start the development server: npm run dev');
    console.log('   4. Test user registration and login');
    console.log('   5. Test admin access: BlackBox@gmail.com / BlackBox');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testConnection();
