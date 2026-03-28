const fs = require('fs');

const file = '/Users/viswa/Documents/hallucination/extension_frontend/background.js';
let content = fs.readFileSync(file, 'utf-8');

// replace recentScans memory with chrome.storage.session
if (!content.includes('chrome.storage.session.set')) {
  // modify to use storage.session
}
