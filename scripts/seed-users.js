const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
const envPath = path.resolve(process.cwd(), '.env.local');
const result = dotenv.config({ path: envPath });

if (result.error) {
    console.error('❌ Error: Could not find .env.local file.');
    process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Error: Missing Supabase credentials.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

const users = [
    {
        email: 'admin@curioai.com',
        password: 'admin-password-123',
        role: 'admin',
        full_name: 'Admin User'
    },
    {
        email: 'author@demo.com',
        password: 'password', // As per docs
        role: 'author',
        full_name: 'Demo Author'
    },
    {
        email: 'user@demo.com',
        password: 'password', // As per docs
        role: 'user',
        full_name: 'Demo User'
    }
];

async function seedUsers() {
    console.log('🌱 Seeding users...');

    for (const user of users) {
        console.log(`\nProcessing ${user.email} (${user.role})...`);

        // 1. Create Identity (Auth)
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: user.email,
            password: user.password,
            email_confirm: true,
            user_metadata: {
                full_name: user.full_name,
                role: user.role // Trigger uses this
            }
        });

        if (authError) {
            if (authError.message.includes('already registered')) {
                console.log('  ℹ️ User already exists in Auth.');
            } else {
                console.error(`  ❌ Failed to create auth user: ${authError.message}`);
                continue;
            }
        } else {
            console.log('  ✅ Created new Auth user.');
        }

        // 2. Ensure Correct Role in Database (user_profiles)
        // Even if user existed, we force the role to be correct.
        // We wait a moment for trigger to fire if it was just created
        if (!authError) await new Promise(r => setTimeout(r, 1000));

        const { error: dbError } = await supabase
            .from('user_profiles')
            .update({
                role: user.role,
                full_name: user.full_name
            })
            .eq('email', user.email);

        if (dbError) {
            // If update failed, maybe row doesn't exist (trigger failed?), try insert?
            // But usually trigger handles it.
            console.error(`  ❌ Failed to update profile role: ${dbError.message}`);
        } else {
            console.log(`  ✅ Verified/Updated role to '${user.role}' in database.`);
        }
    }

    console.log('\n✨ Done! Credentials:');
    users.forEach(u => {
        console.log(`- ${u.role.toUpperCase()}: ${u.email} / ${u.password}`);
    });
}

seedUsers();
