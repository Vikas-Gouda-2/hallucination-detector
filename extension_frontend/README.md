# TruthLens Chrome Extension

Real-time AI hallucination detection directly in your browser.

## Installation (Development)

1. Open Chrome: `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Select this directory: `/extension_frontend/`

The extension will appear in your Chrome toolbar.

## Features

### ✨ Highlight & Analyze

- **Select text** on any webpage
- **Right-click** → "Analyze with TruthLens"
- **Or press:** `Ctrl+Shift+T` keyboard shortcut

### 🎨 Real-Time Overlay

Text is highlighted with color-coded verdict:
- 🔴 **Red** - Strong hallucinations detected
- 🟡 **Yellow** - Minor inconsistencies
- 🟢 **Green** - Likely factual

### 💬 Hover Tooltip

Shows:
- Verdict status & confidence percentage
- Reasoning summary
- Flagged claims

### 📊 Popup Dashboard

View:
- Recent scans (last 5)
- Backend connection status
- Links to full dashboard & API docs

## Architecture

### Files

```
extension_frontend/
├── manifest.json      # Extension config
├── background.js      # Service worker, API calls
├── content.js         # Page injection, DOM overlay
└── popup/
    ├── popup.html     # Popup UI
    ├── popup.js       # Popup logic
    └── popup.css      # Popup styling
```

### Message Flow

```
User selects text on webpage
        ↓
content.js detects (right-click, keyboard shortcut)
        ↓
Sends to background.js
        ↓
background.js → POST /analyze
        ↓
FastAPI Backend processes
        ↓
Returns verdict (Red/Yellow/Green)
        ↓
content.js applies DOM overlay
        ↓
Shows tooltip on hover
```

## Configuration

### API Endpoint

Default: `http://localhost:8000`

Change in `background.js` at top:
```javascript
const API_BASE = "http://localhost:8000";
```

### Storage

Recent scans stored in `chrome.storage.local`:
- Max 5 recent scans
- Persists across browser sessions
- Includes: scan_id, text, verdict, confidence, timestamp

## Permissions

```json
{
  "permissions": ["activeTab", "scripting", "storage", "tabs"],
  "host_permissions": ["<all_urls>"]
}
```

- **activeTab**: Access current tab
- **scripting**: Inject content scripts
- **storage**: Store recent scans locally
- **tabs**: Manage browser tabs
- **host_permissions**: Run on any website

## Testing

### 1. Load Extension

```
chrome://extensions → Load unpacked → Select folder
```

### 2. Test on Demo Page

Open: `http://localhost:3000/demo` (React dashboard demo page)

Select hallucinated text, right-click → "Analyze with TruthLens"

### 3. Check Backend

Verify backend is running:
```bash
curl http://localhost:8000/health
```

### 4. View Recent Scans

Click extension icon → see recent scans popup

## Keyboard Shortcut

**Ctrl+Shift+T** - Analyze currently selected text

(Can be customized in Chrome: `chrome://extensions/shortcuts`)

## Debugging

### View Extension Logs

1. Go to `chrome://extensions`
2. Find TruthLens
3. Click "Inspect views" → "background page"
4. Console shows all logs

### Test Content Script

Open any webpage, open DevTools console:
```javascript
// Check if extension detected
window.location.href  // Should be current page
```

### API Debugging

Monitor requests in Network tab with backend logs:
```bash
# Watch backend logs
tail -f backend.log

# Make test request
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"text":"Test text here","source_url":"http://example.com"}'
```

## Known Issues

- **CORS errors**: If backend not on localhost:8000, update `API_BASE`
- **Content Security Policy**: Some websites block script injection
- **Rate limiting**: Backend limits to 10 requests/min per user
- **Offline mode**: Falls back to cached/mock results if backend unreachable

## Future Improvements

- ✅ Add to Chrome Web Store
- ✅ Right-click context menu
- ✅ Configurable keyboard shortcut
- ✅ Batch analysis (multiple selections)
- ✅ Dark mode for popup
- ✅ History export

## Development

### Add New Feature

1. Edit `content.js` for page logic
2. Or `background.js` for API/storage logic
3. Reload extension: `chrome://extensions` (refresh button)
4. Open DevTools to debug

### Change API Endpoint

Update `API_BASE` in `background.js`:
```javascript
const API_BASE = "https://your-production-api.com";
```

## Deployment

For production deployment:

1. Remove localhost hardcoding
2. Add icon files (16x16, 48x48, 128x128 PNG)
3. Submit to Chrome Web Store
4. Users can install directly

---

**Built for 20-hour hackathon sprint** ⚡
