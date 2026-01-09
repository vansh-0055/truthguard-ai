const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const newsApiKey = '4b098418476545868075dc4c730ab642';

// Read existing .env file or create template
let envContent = '';
try {
    envContent = fs.readFileSync(envPath, 'utf8');
} catch (error) {
    console.log('.env file not found, creating new one from .env.example...');
    try {
        envContent = fs.readFileSync(path.join(__dirname, '.env.example'), 'utf8');
    } catch (err) {
        console.log('Creating new .env file...');
    }
}

// Check if NewsAPI key already exists and update it
if (envContent.includes('VITE_NEWS_API_KEY')) {
    // Replace existing key
    envContent = envContent.replace(
        /VITE_NEWS_API_KEY=.*/,
        `VITE_NEWS_API_KEY=${newsApiKey}`
    );
    console.log('✅ Updated existing VITE_NEWS_API_KEY');
} else {
    // Add new key
    envContent += `\n# NewsAPI.org API Key (For news source verification)\nVITE_NEWS_API_KEY=${newsApiKey}\n`;
    console.log('✅ Added VITE_NEWS_API_KEY to .env file');
}

// Write back to .env
fs.writeFileSync(envPath, envContent);
console.log('✅ NewsAPI key successfully added to .env file!');
console.log('\n🔄 Please restart your dev server if running (Ctrl+C then npm run dev)');
console.log('\n📝 API Key added: VITE_NEWS_API_KEY=' + newsApiKey);
