# 🧠 TruthLens - AI Hallucination Detector

Detects AI hallucinations and false claims in text using NLP + Gemini API.

## 🎯 What It Does

- 🟢 **Green**: Verified claim
- 🟡 **Yellow**: Uncertain content  
- 🔴 **Red**: Hallucinated/false

## ⚡ Setup

### Backend
```bash
cd python_backend
pip install -r requirements.txt
python3 -m uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd hallucination-detector
npm install
npm run dev  # Runs on port 5173
```

## 📡 API

```bash
POST http://localhost:8000/analyze
Content-Type: application/json

{
  "text": "Your claim here",
  "source_url": "http://example.com",
  "user_id": "user123"
}
```

## 🛠️ Tech Stack

- **Backend**: FastAPI, Python, Gemini API
- **Frontend**: React, Vite, Tailwind CSS
- **Extension**: Chrome Extension manifest v3
- **NLP**: NLI model for claim verification

## 📝 Quick Start

### Prerequisites
1. Clone repo
2. Add `GEMINI_API_KEY` to `.env` in python_backend
3. Run both servers
4. Visit http://localhost:5173
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

## � Team

Made for the Hackathon 🚀

## 📝 License

MIT
