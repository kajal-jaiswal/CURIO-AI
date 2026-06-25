const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function fixAdmin() {
    console.log('Fixing admin role...');
    // 1. Update Profile
    const { error: dbError } = await supabase
        .from('user_profiles')
        .update({ role: 'admin' })
        .eq('email', 'admin@curioai.com');

    if (dbError) console.error('DB Error:', dbError);
    else console.log('✅ Admin role updated in database.');

    // 2. Update Auth Metadata (optional but good for consistency)
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const adminUser = users.find(u => u.email === 'admin@curioai.com');

    if (adminUser) {
        const { error: authError } = await supabase.auth.admin.updateUserById(
            adminUser.id,
            { user_metadata: { role: 'admin' } }
        );
        if (authError) console.error('Auth Error:', authError);
        else console.log('✅ Admin metadata updated in Auth.');
    }
}

fixAdmin();
