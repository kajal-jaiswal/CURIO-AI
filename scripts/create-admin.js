const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
const envPath = path.resolve(process.cwd(), '.env.local');
const result = dotenv.config({ path: envPath });

if (result.error) {
    console.error('❌ Error: Could not find .env.local file.');
    console.log('   Please copy .env.example to .env.local and add your keys.');
    process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Checking configuration...');

if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
    console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL is not set or is still a placeholder.');
    console.log(`   Current value: ${supabaseUrl}`);
    console.log('   Please update .env.local with your real Supabase URL.');
    process.exit(1);
}

if (!serviceRoleKey || serviceRoleKey.includes('placeholder')) {
    console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY is not set or is still a placeholder.');
    console.log('   Please update .env.local with your real Supabase Service Role Key.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function createAdmin() {
    const email = 'admin@curioai.com';
    const password = 'admin-password-123';

    console.log(`\nAttempting to create admin user:`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);

    try {
        // Check if user exists first to avoid error
        // Note: listUsers is the safest way if we don't accidentally want to trigger rate limits by failing Logins
        // But create user usually handles "User already registered" gracefully.

        const { data, error } = await supabase.auth.admin.createUser({
            email: email,
            password: password,
            email_confirm: true // Auto confirm email
        });

        if (error) {
            console.error('\n❌ Failed to create user:', error.message);
            return;
        }

        console.log('\n✅ Success! Admin user created.');
        console.log('------------------------------------------------');
        console.log('You can now login at: http://localhost:3000/admin/login');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log('------------------------------------------------');

    } catch (err) {
        console.error('\n❌ Unexpected error:', err.message);
    }
}

createAdmin();
