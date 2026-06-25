const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

// Load environment variables from .env.local
const envPath = path.resolve(__dirname, '../.env.local');
const envConfig = require('dotenv').parse(fs.readFileSync(envPath));

const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL;
// Use Service Role Key to bypass RLS and see all data
const supabaseKey = envConfig.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: valid Supabase credentials not found in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUsers() {
    console.log('Checking for existing users...');

    // 1. Check user_profiles table
    const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*');

    if (profilesError) {
        console.error('Error fetching user profiles:', profilesError.message);
    } else {
        console.log(`\nFound ${profiles.length} user profiles:`);
        profiles.forEach(p => {
            console.log(`- ${p.email} (Role: ${p.role}, Name: ${p.full_name})`);
        });
    }

    // 2. Check Auth Users (Admin API)
    // This requires the service role key
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
        console.error('Error fetching auth users:', authError.message);
    } else {
        console.log(`\nFound ${users.length} auth users:`);
        users.forEach(u => {
            console.log(`- ${u.email} (ID: ${u.id}, Confirmed: ${!!u.email_confirmed_at})`);
        });
    }

    if (profiles && profiles.length === 0 && users && users.length === 0) {
        console.log('\nNo users found. You need to REGISTER distinct users for each role.');
    }
}

checkUsers();
