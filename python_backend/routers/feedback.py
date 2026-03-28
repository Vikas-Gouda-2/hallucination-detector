"""POST /feedback endpoint for user feedback on verdicts"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional

from services.firebase_service import FirebaseService

router = APIRouter()
firebase_service: Optional[FirebaseService] = None


class FeedbackRequest(BaseModel):
    scan_id: str
    user_id: str
    feedback: str = Field(..., pattern="^(agree|disagree)$")


def set_service(firebase: FirebaseService):
    """Set Firebase service instance"""
    global firebase_service
    firebase_service = firebase


@router.post("/feedback")
async def submit_feedback(request: FeedbackRequest):
    """
    Submit user feedback on a scan verdict.

    Feedback:
    - "agree": User agrees with the verdict
    - "disagree": User disagrees with the verdict

    This data is stored for future model fine-tuning.
    """
    if not firebase_service:
        raise HTTPException(status_code=503, detail="Firebase service not available")

    try:
        success = await firebase_service.save_feedback(
            request.scan_id,
            request.user_id,
            request.feedback
        )

        if success:
            return {
                "status": "success",
                "scan_id": request.scan_id,
                "feedback": request.feedback
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to save feedback")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
