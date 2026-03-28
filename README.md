# 🧠 TruthLens - AI Hallucination Detector

A full-stack application that detects AI-generated hallucinations, inconsistencies, and false claims in text using advanced NLP and fact-checking techniques.

## 🎯 Features

- **Real-time Hallucination Detection**: Analyze text and identify potentially false or hallucinated claims
- **Multi-stage Pipeline**: Extract claims → Interrogate → Verify consistency
- **Green/Yellow/Red Verdicts**: 
  - 🟢 **Green (Verified)**: All claims are factually accurate
  - 🟡 **Yellow (Uncertain)**: Mixed content or unverifiable claims
  - 🔴 **Red (Hallucinated)**: Contains false or contradictory information
- **Confidence Scoring**: Get detailed confidence levels and reasoning for each analysis
- **NLI Model Integration**: Support for Entailment/Neutral/Contradiction classification
- **Chrome Extension**: Browser-based scanning for web content
- **Beautiful Dashboard**: React-based UI with real-time analytics

## 🏗️ Architecture

```
hallucination/
├── python_backend/          # FastAPI backend server
│   ├── main.py
│   ├── routers/
│   │   ├── analyze.py       # Main analysis endpoint
│   │   ├── scans.py
│   │   └── feedback.py
│   ├── services/
│   │   ├── llm_service.py   # Gemini API integration
│   │   ├── firebase_service.py
│   │   └── mock_data.py
│   └── models/
│       └── schemas.py
├── hallucination-detector/  # React Vite frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Demo.jsx
│   │   │   └── Analytics.jsx
│   │   ├── components/
│   │   └── lib/
│   │       └── api.js       # Axios client
│   └── vite.config.js
└── extension_frontend/      # Chrome extension
    ├── manifest.json
    ├── background.js
    └── content.js
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+
- Google Gemini API key

### Backend Setup

```bash
cd python_backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Add your GEMINI_API_KEY to .env

# Start server
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`

### Frontend Setup

```bash
cd hallucination-detector

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

## 📡 API Endpoints

### Analysis
- **POST** `/analyze` - Analyze text for hallucinations
  ```json
  {
    "text": "The Earth orbits around the Sun",
    "source_url": "optional_url",
    "user_id": "optional_user_id"
  }
  ```

### Health Check
- **GET** `/health` - Server health status
- **GET** `/config` - Configuration info (debug mode)

### Scans
- **GET** `/history/{user_id}` - Get user's scan history
- **GET** `/scan/{scan_id}` - Get specific scan details

### Feedback
- **POST** `/feedback` - Submit feedback on analyses

## 🔍 Detection Pipeline

### 1. Claim Extraction
Breaks down input text into individual claims/assertions

### 2. Interrogation
For each claim:
- Checks against built-in fact database
- Queries Google Gemini API for verification
- Classifies as: **TRUE** / **FALSE** / **HALF-TRUTH** / **UNCERTAIN**

### 3. Consistency Analysis
- Aggregates all claim verdicts
- Scores overall consistency
- Generates human-readable reasoning

## 📊 Verdict Mapping

| NLI Result | Status | Color | Meaning |
|---|---|---|---|
| Entailment | Green | 🟢 | Supported by evidence |
| Neutral | Yellow | 🟡 | Insufficient evidence |
| Contradiction | Red | 🔴 | Contradicts facts |

## 🔄 API Timeout

Frontend waits **120 seconds** for responses to accommodate:
- Gemini API rate limiting (free tier)
- Exponential backoff retries (up to 3 attempts)
- Sequential claim interrogation

## 📦 Tech Stack

### Backend
- **FastAPI** - Web framework
- **Uvicorn** - ASGI server
- **Google Gemini 2.5 Flash** - LLM inference
- **httpx** - Async HTTP client with retry logic
- **Firebase** - Optional data persistence

### Frontend
- **React 19** - UI framework
- **Vite 8** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Axios** - HTTP client

### Extension
- **Manifest V3** - Chrome standard
- **Content Script** - Text selection overlay

## 🛠️ Development

### Running Both Servers

```bash
# Terminal 1: Backend
cd python_backend
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000

# Terminal 2: Frontend
cd hallucination-detector
npm run dev < /dev/null > /tmp/vite.log 2>&1 &
```

### Testing

```bash
# Test backend health
curl http://localhost:8000/health

# Test analysis endpoint
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"text":"The Earth is flat","source_url":"test","user_id":"test"}'
```

### Building

```bash
# Frontend production build
cd hallucination-detector
npm run build

# Output in dist/
```

## 🔐 Environment Variables

Create `.env` in `python_backend/`:

```env
GEMINI_API_KEY=your_api_key_here
FIREBASE_PROJECT_ID=optional_firebase_project
USE_MOCK=false  # Set to true to use mock data instead of Gemini
```

## 📝 Sample Response

```json
{
  "scan_id": "uuid-here",
  "status": "Yellow",
  "confidence": 70,
  "consistency_score": 40,
  "reasoning": "Mixed content: 1 verifiable fact detected, but 1 statement was flagged as inaccurate.",
  "suspicious_claims": ["He is the lead fast bowler"],
  "claims": [
    "Virat Kohli is an Indian international cricketer",
    "He is the lead fast bowler for the team"
  ],
  "sentence_verdicts": [
    {
      "sentence": "Virat Kohli is an Indian international cricketer",
      "verdict": "Green",
      "confidence": 95
    },
    {
      "sentence": "He is the lead fast bowler",
      "verdict": "Red",
      "confidence": 92
    }
  ],
  "processing_time_ms": 28427
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit changes (`git commit -am 'Add improvement'`)
4. Push to branch (`git push origin feature/improvement`)
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🙋 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Built with ⚡ for detecting AI hallucinations in real-time**
