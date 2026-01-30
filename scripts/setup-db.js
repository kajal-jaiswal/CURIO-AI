const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function setupDatabase() {
    console.log('🚀 Running database setup...');

    try {
        const sqlFile = path.join(__dirname, '../supabase/schema-roles.sql');
        const sql = fs.readFileSync(sqlFile, 'utf8');

        // Supabase doesn't support running raw SQL via the JS client for security reasons 
        // Usually, you'd run this in the SQL editor.
        // However, we can try to create the 'posts' table structure if it's missing or check it.

        console.log('------------------------------------------------');
        console.log('⚠️  IMPORTANT: MANUAL ACTION REQUIRED');
        console.log('Supabase does not allow running full schema scripts via API.');
        console.log('Please copy and paste the content of:');
        console.log('   ./supabase/schema-roles.sql');
        console.log('Into your Supabase "SQL Editor" on the dashboard.');
        console.log('------------------------------------------------');

        // We can at least try a simple insert to see if tables exist
        const { error } = await supabase.from('posts').select('id').limit(1);

        if (error && error.code === '42P01') {
            console.log('❌ Tables do not exist yet. Please run the SQL script in Supabase first!');
        } else {
            console.log('✅ Tables seem to be ready.');
        }

    } catch (err) {
        console.error('Error during setup:', err.message);
    }
}

setupDatabase();
