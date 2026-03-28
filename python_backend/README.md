# TruthLens Backend - AI Hallucination Detector

FastAPI backend for detecting AI-generated hallucinations using the "self-interrogation" technique.

## Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your settings
```

### 3. Run Backend
```bash
python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Server will be available at `http://localhost:8000`

## API Endpoints

### Core Analysis
- **POST `/analyze`** - Analyze text for hallucinations
  ```json
  {
    "text": "Full text to analyze...",
    "source_url": "https://example.com",
    "user_id": "user123"
  }
  ```
  Returns: Verdict with Red/Yellow/Green status, confidence, and reasoning

### Query/History
- **GET `/scan/{scan_id}`** - Get a specific scan result
- **GET `/history/{user_id}`** - Get user's scan history (max 500 results)
- **GET `/stats/{user_id}`** - Get user's aggregate statistics

### Feedback
- **POST `/feedback`** - Submit user feedback on verdict
  ```json
  {
    "scan_id": "scan-id",
    "user_id": "user-id",
    "feedback": "agree" | "disagree"
  }
  ```

### System
- **GET `/`** - API info
- **GET `/health`** - Health check status
- **GET `/config`** - Current configuration (debug mode only)

## Configuration

### Environment Variables
```bash
# Mock mode (uses pre-generated verdicts, no API calls)
USE_MOCK_DATA=true

# Claude API key (only needed if USE_MOCK_DATA=false)
CLAUDE_API_KEY=sk-...

# Firebase credentials (optional, for data persistence)
FIREBASE_CREDENTIALS_JSON={"type": "service_account", ...}

# CORS origins
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Server
PORT=8000
DEBUG=true
```

## Detection Algorithm

### Step A: Claim Extraction
Extracts 3 distinct factual claims from the input text using an LLM.

### Step B: Parallel Interrogation
Sends 3 parallel API calls asking the LLM to explain each claim
using only internal training data (no external sources).

### Step C: Consistency Verdict
Analyzes the 3 explanations for:
- Contradictions between explanations
- Vague or evasive language
- Unsupported claims
- Circular reasoning

**Verdict:**
- 🟢 **Green**: Claims are internally consistent → Safe to use
- 🟡 **Yellow**: Minor inconsistencies detected → Proceed with caution
- 🔴 **Red**: Strong contradictions detected → Do not trust

## Mock Data

For hackathon development, the backend includes pre-generated verdicts:

1. **Red Verdict** - `1912 Martian Meteorite` hallucinated article
2. **Yellow Verdict** - Mixed accurate + uncertain claims
3. **Green Verdict** - Factual Wikipedia excerpt

Test with mock data:
```bash
USE_MOCK_DATA=true python3 -m uvicorn main:app --reload
```

## Testing

### Run Pipeline Test
```bash
python3 test_pipeline.py
```

### Manual Testing with cURL
```bash
# Analyze text
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your text here...",
    "source_url": "https://example.com",
    "user_id": "test-user"
  }'

# Get scan result
curl http://localhost:8000/scan/{scan_id}

# Get user stats
curl http://localhost:8000/stats/test-user
```

## Firebase Setup (Optional)

For data persistence and real-time sync:

1. Create Firebase project: https://console.firebase.google.com
2. Enable Google Authentication
3. Create Firestore database (test mode)
4. Download service account JSON from Project Settings → Service Accounts
5. Set `FIREBASE_CREDENTIALS_JSON` in `.env`

## Performance Targets

- **Latency**: < 8 seconds (highlight → verdict)
  - Mock mode: ~100ms
  - Real API mode: ~3-5s
- **Accuracy**: > 80% on known hallucinations
- **Rate limit**: 10 requests/min per user

## Architecture

```
POST /analyze (text)
        ↓
    LLM Service
        ↓
    [Step A] Extract Claims
    [Step B] Parallel Interrogation (3x calls)
    [Step C] Consistency Verdict
        ↓
    Return: Verdict (Red/Yellow/Green)
        ↓
    [Background] Save to Firestore
```

## Error Handling

- **Timeout**: 30s max per analysis (returns partial results)
- **API failure**: Gracefully falls back to mock verdict
- **Invalid input**: Returns 422 with validation error
- **Firebase unavailable**: Works in mock mode

## Development

### Project Structure
```
python_backend/
├── main.py                    # FastAPI app entrypoint
├── routers/
│   ├── analyze.py            # POST /analyze endpoint
│   ├── scans.py              # GET /scan, /history, /stats
│   └── feedback.py           # POST /feedback
├── services/
│   ├── llm_service.py        # Detection algorithm (Steps A-C)
│   ├── firebase_service.py   # Firestore integration
│   └── mock_data.py          # Pre-generated verdicts for testing
├── models/
│   └── schemas.py            # Pydantic data models
└── requirements.txt           # Dependencies
```

### Adding a New Endpoint

1. Create route in `routers/`
2. Import and include in `main.py`
3. Test with cURL or Postman

## Deployment

### Local Development
```bash
python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Production (Railway/Render)
```bash
python3 -m uvicorn main:app --host 0.0.0.0 --port $PORT
```

Set env vars in platform settings.

## Known Limitations

- Mock mode returns the same verdict structure for all tests (predictable for demo)
- Real API mode depends on Claude API availability
- Rate limiting is in-memory (not distributed across processes)
- No user authentication (relies on extension/frontend for auth)

## Future Improvements

- Real Claude API integration with streaming
- Redis for rate limiting and caching
- Database-backed audit logs
- Batch analysis endpoint
- Webhook callbacks for long-running analyses

---

**Built for 20-hour hackathon sprint** ⚡
