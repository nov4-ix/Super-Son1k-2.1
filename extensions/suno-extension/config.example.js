/**
 * Configuration file for Son1kVerse AI Music Engine Extension
 * 
 * IMPORTANT: Rename this file to config.js and update with your actual URLs
 */

// Generator URL - Get from Vercel Dashboard
// Steps:
// 1. Go to https://vercel.com/dashboard
// 2. Find your "the-generator" or "the-generator-nextjs" project
// 3. Go to Overview → Copy the deployment URL
// 4. Paste it here (example: https://the-generator-abc123.vercel.app)
const GENERATOR_URL = 'https://YOUR-VERCEL-URL.vercel.app'

// To set this in the extension:
// 1. Install extension
// 2. Open chrome://extensions/ → Background page (service worker)
// 3. In console, run:
//    chrome.storage.local.set({ generatorUrl: 'https://TU-URL-REAL.vercel.app' })

export default {
  GENERATOR_URL
}

