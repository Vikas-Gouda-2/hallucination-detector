"""Example API requests for TruthLens Backend"""

# Analyze hallucinated text
POST /analyze
Content-Type: application/json

{
  "text": "The 1912 Martian Meteorite was discovered in London by renowned astronomer Sir Arthur Conan Doyle. It was named the Victoria Stone after Queen Victoria and is now housed in the British Museum's secret underground vault.",
  "source_url": "https://example.com/article",
  "user_id": "user-123"
}

---

# Response (Red Verdict)
{
  "scan_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "Red",
  "confidence": 91,
  "consistency_score": 18,
  "reasoning": "The three explanations reveal contradictions: claims about a famous 1912 discovery are vague and unsupported by standard geological records.",
  "suspicious_claims": [
    "The 1912 Martian Meteorite was discovered in London",
    "Sir Arthur Conan Doyle discovered it"
  ],
  "claims": [
    "The 1912 Martian Meteorite was discovered in London",
    "Sir Arthur Conan Doyle discovered it",
    "It is named the Victoria Stone"
  ],
  "processing_time_ms": 3870
}

---

# Get scan result
GET /scan/550e8400-e29b-41d4-a716-446655440000

---

# Get user history
GET /history/user-123?limit=50

---

# Get user stats
GET /stats/user-123

---

# Submit feedback
POST /feedback
Content-Type: application/json

{
  "scan_id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "user-123",
  "feedback": "agree"
}

---

# Health check
GET /health

---

# Config (debug only)
GET /config
