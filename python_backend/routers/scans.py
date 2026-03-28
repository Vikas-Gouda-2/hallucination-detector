"""GET endpoints for scan history and stats"""
from fastapi import APIRouter, HTTPException
from typing import Optional

from services.firebase_service import FirebaseService

router = APIRouter()
firebase_service: Optional[FirebaseService] = None


def set_service(firebase: FirebaseService):
    """Set Firebase service instance"""
    global firebase_service
    firebase_service = firebase


@router.get("/scan/{scan_id}")
async def get_scan(scan_id: str):
    """
    Fetch a specific scan result by ID.
    """
    if not firebase_service:
        raise HTTPException(status_code=503, detail="Firebase service not available")

    scan = await firebase_service.get_scan(scan_id)
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")

    return scan


@router.get("/history/{user_id}")
async def get_user_history(user_id: str, limit: int = 50):
    """
    Get scan history for a user.

    Query params:
    - limit: Number of results (default 50, max 500)
    """
    if not firebase_service:
        raise HTTPException(status_code=503, detail="Firebase service not available")

    if limit > 500:
        limit = 500
    if limit < 1:
        limit = 10

    history = await firebase_service.get_user_history(user_id, limit)
    return {
        "user_id": user_id,
        "count": len(history),
        "scans": history
    }


@router.get("/stats/{user_id}")
async def get_user_stats(user_id: str):
    """
    Get aggregated statistics for a user.

    Returns:
    - total_scans
    - red_count, yellow_count, green_count
    - avg_confidence
    """
    if not firebase_service:
        raise HTTPException(status_code=503, detail="Firebase service not available")

    stats = await firebase_service.get_user_stats(user_id)
    return stats
