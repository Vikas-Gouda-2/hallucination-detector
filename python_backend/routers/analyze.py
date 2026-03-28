"""POST /analyze endpoint - Main hallucination detection API"""
from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import ValidationError
import time
import uuid
from datetime import datetime
from typing import Optional

from models.schemas import ScanRequest, ScanResult, VerdictSchema
from services.llm_service import LLMService
from services.firebase_service import FirebaseService
from services.mock_data import get_mock_scan
from services.llm_service import analyze_text_offline

router = APIRouter()

# Initialize services (will be injected via app state)
llm_service: Optional[LLMService] = None
firebase_service: Optional[FirebaseService] = None


def set_services(llm: LLMService, firebase: FirebaseService):
    """Set service instances"""
    global llm_service, firebase_service
    llm_service = llm
    firebase_service = firebase


@router.post("/analyze", response_model=dict)
async def analyze_text(request: ScanRequest, background_tasks: BackgroundTasks):
    """
    Main hallucination detection endpoint.

    Receives text, runs 3-step detection loop:
    1. Extract claims
    2. Parallel interrogation
    3. Consistency verdict

    Returns: ScanResult with Red/Yellow/Green verdict
    """
    try:
        # Validate request
        if not request.text or len(request.text.strip()) < 5:
            raise HTTPException(status_code=400, detail="Text must be at least 5 characters")

        # Generate scan ID
        scan_id = str(uuid.uuid4())
        created_at = datetime.now()
        start_time = time.time()

        # Check if using mock data
        if llm_service.use_mock:
            # Return pre-generated mock result (faster)
            mock_result = get_mock_scan(text=request.text)
            mock_result["scan_id"] = scan_id
            mock_result["user_id"] = request.user_id
            mock_result["source_url"] = request.source_url
            mock_result["original_text"] = request.text
            mock_result["created_at"] = created_at.isoformat()

            processing_time = int((time.time() - start_time) * 1000)
            mock_result["processing_time_ms"] = processing_time

            # Save in background
            if firebase_service and request.user_id:
                background_tasks.add_task(firebase_service.save_scan, mock_result)

            return {
                "scan_id": scan_id,
                "status": mock_result["verdict"]["status"],
                "confidence": mock_result["verdict"]["confidence"],
                "consistency_score": mock_result["verdict"]["consistency_score"],
                "reasoning": mock_result["verdict"]["reasoning"],
                "suspicious_claims": mock_result["verdict"]["suspicious_claims"],
                "sentence_verdicts": mock_result["verdict"].get("sentence_verdicts", []),
                "claims": mock_result["claims"],
                "processing_time_ms": processing_time
            }

        # Run real detection pipeline
        try:
            claims, interrogations, verdict = await llm_service.analyze_text(request.text)
        except Exception as e:
            print(f"Detection error: {e}, falling back to offline fact-check")
            claims, interrogations, verdict = analyze_text_offline(request.text)

        # Build scan result
        processing_time = int((time.time() - start_time) * 1000)

        scan_result = {
            "scan_id": scan_id,
            "user_id": request.user_id,
            "source_url": request.source_url,
            "original_text": request.text,
            "claims": claims,
            "interrogations": interrogations,
            "verdict": {
                "status": verdict.status,
                "confidence": verdict.confidence,
                "consistency_score": verdict.consistency_score,
                "reasoning": verdict.reasoning,
                "suspicious_claims": verdict.suspicious_claims,
                "sentence_verdicts": [sv.model_dump() if hasattr(sv, "model_dump") else sv.dict() for sv in verdict.sentence_verdicts] if verdict.sentence_verdicts else []
            },
            "user_feedback": None,
            "created_at": created_at.isoformat(),
            "processing_time_ms": processing_time
        }

        # Save to Firestore in background
        if firebase_service and request.user_id:
            background_tasks.add_task(firebase_service.save_scan, scan_result)

        return {
            "scan_id": scan_id,
            "status": verdict.status,
            "confidence": verdict.confidence,
            "consistency_score": verdict.consistency_score,
            "reasoning": verdict.reasoning,
            "suspicious_claims": verdict.suspicious_claims,
            "sentence_verdicts": [sv.model_dump() if hasattr(sv, "model_dump") else sv.dict() for sv in verdict.sentence_verdicts] if verdict.sentence_verdicts else [],
            "claims": claims,
            "processing_time_ms": processing_time
        }

    except ValidationError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except HTTPException:
        # Re-raise HTTPExceptions as-is
        raise
    except Exception as e:
        import traceback
        print(f"Unexpected error in /analyze: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail="Internal server error")
