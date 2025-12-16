const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const apiKey = 'AIzaSyCVNzi5YY5CpSx_Ab3Az1n4pKPakGAizj8';

// Read existing .env file
let envContent = '';
try {
    envContent = fs.readFileSync(envPath, 'utf8');
} catch (error) {
    console.log('.env file not found, creating new one...');
}

// Check if key already exists
if (envContent.includes('VITE_GEMINI_API_KEY')) {
    // Replace existing key
    envContent = envContent.replace(
        /VITE_GEMINI_API_KEY=.*/,
        `VITE_GEMINI_API_KEY=${apiKey}`
    );
    console.log('✅ Updated existing VITE_GEMINI_API_KEY');
} else {
    // Add new key
    envContent += `\n# Google Gemini AI API Key\nVITE_GEMINI_API_KEY=${apiKey}\n`;
    console.log('✅ Added VITE_GEMINI_API_KEY to .env file');
}

// Write back to .env
fs.writeFileSync(envPath, envContent);
console.log('✅ API key successfully added to .env file!');
console.log('\n🔄 Please restart your dev server (Ctrl+C then npm run dev)');
