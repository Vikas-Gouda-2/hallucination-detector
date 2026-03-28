from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class SentenceVerdict(BaseModel):
    sentence: str
    verdict: str = Field(..., pattern="^(Red|Yellow|Green)$")
    confidence: int = Field(..., ge=0, le=100)


class VerdictSchema(BaseModel):
    status: str = Field(..., pattern="^(Red|Yellow|Green)$")
    confidence: int = Field(..., ge=0, le=100)
    consistency_score: int = Field(..., ge=0, le=100)
    reasoning: str
    suspicious_claims: List[str] = []
    sentence_verdicts: List[SentenceVerdict] = []


class ScanRequest(BaseModel):
    text: str = Field(..., min_length=10, max_length=5000)
    source_url: Optional[str] = None
    user_id: Optional[str] = None


class ScanResult(BaseModel):
    scan_id: str
    user_id: Optional[str]
    source_url: Optional[str]
    original_text: str
    claims: List[str]
    interrogations: dict = Field(default_factory=dict)
    verdict: VerdictSchema
    user_feedback: Optional[str] = None
    created_at: datetime
    processing_time_ms: int


class UserStats(BaseModel):
    uid: str
    email: Optional[str]
    display_name: Optional[str]
    total_scans: int = 0
    red_count: int = 0
    yellow_count: int = 0
    green_count: int = 0
    avg_confidence: float = 0.0
    created_at: datetime
    last_active: datetime


class FeedbackRequest(BaseModel):
    scan_id: str
    user_id: str
    feedback: str = Field(..., pattern="^(agree|disagree)$")
