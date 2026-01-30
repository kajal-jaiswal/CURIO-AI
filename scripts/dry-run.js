
const { fetchTrendingNews } = require('./lib/news-service');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function dryRun() {
    console.log('🚀 Starting Automated Blog Dry Run...');
    console.log('------------------------------------');

    console.log('📡 Step 1: Fetching News from RSS...');
    const articles = await fetchTrendingNews(5);

    if (articles.length > 0) {
        console.log(`✅ Success! Found ${articles.length} trending articles:`);
        articles.forEach((a, i) => {
            console.log(`${i + 1}. [${a.source}] ${a.title}`);
        });
    } else {
        console.log('❌ Failed to fetch news. Check your internet connection.');
        return;
    }

    console.log('------------------------------------');
    console.log('🤖 Step 2: Checking AI Status...');
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_KEY_HERE') {
        console.log('✅ AI Key found! The bot is ready to write.');
    } else {
        console.log('⚠️ AI Key is missing or default. I cannot generate the actual blog text yet.');
    }

    console.log('------------------------------------');
    console.log('📦 Step 3: Checking Database Status...');
    if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY !== 'placeholder') {
        console.log('✅ Supabase Key found! The bot is ready to post.');
    } else {
        console.log('⚠️ Supabase Key is missing. I cannot save to your dashboard yet.');
    }

    console.log('------------------------------------');
    console.log('🏁 Dry Run Complete. Add your keys to .env.local to activate the "Auto-Posting" logic.');
}

dryRun();
