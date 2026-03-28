"""Firebase Firestore service for data persistence"""
import os
import json
from datetime import datetime
from typing import Optional, List, Dict
import uuid


class FirebaseService:
    def __init__(self, credentials_json: Optional[str] = None):
        self.db = None
        self.initialized = False

        if credentials_json:
            try:
                import firebase_admin
                from firebase_admin import credentials, firestore

                # Parse credentials
                if isinstance(credentials_json, str):
                    creds_dict = json.loads(credentials_json)
                else:
                    creds_dict = credentials_json

                cred = credentials.Certificate(creds_dict)
                firebase_admin.initialize_app(cred)
                self.db = firestore.client()
                self.initialized = True
                print("Firebase initialized successfully")
            except Exception as e:
                print(f"Warning: Firebase initialization failed ({e}), using mock mode")
                self.initialized = False

    async def save_scan(self, scan_data: dict) -> str:
        """Save a scan result to Firestore"""
        scan_id = scan_data.get("scan_id", str(uuid.uuid4()))

        if not self.initialized:
            print(f"Mock: Saving scan {scan_id}")
            return scan_id

        try:
            # Convert datetime to ISO string for Firestore
            scan_copy = scan_data.copy()
            if isinstance(scan_copy.get("created_at"), datetime):
                scan_copy["created_at"] = scan_copy["created_at"].isoformat()

            self.db.collection("scans").document(scan_id).set(scan_copy)

            # Update user stats if user_id provided
            user_id = scan_data.get("user_id")
            if user_id:
                await self.update_user_stats(user_id, scan_data)

            return scan_id
        except Exception as e:
            print(f"Error saving scan: {e}")
            return scan_id

    async def get_scan(self, scan_id: str) -> Optional[dict]:
        """Retrieve a scan result from Firestore"""
        if not self.initialized:
            print(f"Mock: Getting scan {scan_id}")
            return None

        try:
            doc = self.db.collection("scans").document(scan_id).get()
            if doc.exists:
                return doc.to_dict()
            return None
        except Exception as e:
            print(f"Error getting scan: {e}")
            return None

    async def get_user_history(self, user_id: str, limit: int = 50) -> List[dict]:
        """Get all scans for a user"""
        if not self.initialized:
            print(f"Mock: Getting history for user {user_id}")
            return []

        try:
            query = (
                self.db.collection("scans")
                .where("user_id", "==", user_id)
                .order_by("created_at", direction="DESCENDING")
                .limit(limit)
            )
            docs = query.stream()
            return [doc.to_dict() for doc in docs]
        except Exception as e:
            print(f"Error getting user history: {e}")
            return []

    async def get_user_stats(self, user_id: str) -> dict:
        """Get aggregated stats for a user"""
        if not self.initialized:
            print(f"Mock: Getting stats for user {user_id}")
            return {
                "uid": user_id,
                "total_scans": 0,
                "red_count": 0,
                "yellow_count": 0,
                "green_count": 0,
                "avg_confidence": 0.0
            }

        try:
            doc = self.db.collection("users").document(user_id).get()
            if doc.exists:
                return doc.to_dict()

            # If user doesn't exist, return default stats
            return {
                "uid": user_id,
                "total_scans": 0,
                "red_count": 0,
                "yellow_count": 0,
                "green_count": 0,
                "avg_confidence": 0.0,
                "created_at": datetime.now().isoformat(),
                "last_active": datetime.now().isoformat()
            }
        except Exception as e:
            print(f"Error getting user stats: {e}")
            return {}

    async def update_user_stats(self, user_id: str, scan_data: dict) -> None:
        """Update user statistics after a scan"""
        if not self.initialized:
            print(f"Mock: Updating stats for user {user_id}")
            return

        try:
            # Get current stats
            stats = await self.get_user_stats(user_id)

            # Update counts
            verdict_status = scan_data.get("verdict", {}).get("status", "Green")
            stats["total_scans"] = stats.get("total_scans", 0) + 1

            if verdict_status == "Red":
                stats["red_count"] = stats.get("red_count", 0) + 1
            elif verdict_status == "Yellow":
                stats["yellow_count"] = stats.get("yellow_count", 0) + 1
            else:
                stats["green_count"] = stats.get("green_count", 0) + 1

            # Update average confidence
            confidence = scan_data.get("verdict", {}).get("confidence", 0)
            old_avg = stats.get("avg_confidence", 0)
            old_total = stats.get("total_scans", 1) - 1
            stats["avg_confidence"] = (old_avg * old_total + confidence) / stats.get("total_scans", 1)
            stats["last_active"] = datetime.now().isoformat()

            # Save updated stats
            self.db.collection("users").document(user_id).set(stats)
        except Exception as e:
            print(f"Error updating user stats: {e}")

    async def save_feedback(self, scan_id: str, user_id: str, feedback: str) -> bool:
        """Save user feedback on a scan verdict"""
        if not self.initialized:
            print(f"Mock: Saving feedback for scan {scan_id}")
            return True

        try:
            self.db.collection("scans").document(scan_id).update({
                "user_feedback": feedback,
                "feedback_timestamp": datetime.now().isoformat()
            })
            return True
        except Exception as e:
            print(f"Error saving feedback: {e}")
            return False

    async def health_check(self) -> dict:
        """Check Firebase connection status"""
        if not self.initialized:
            return {"status": "mock", "firebase": False}

        try:
            # Simple read to verify connection
            self.db.collection("_health").document("ping").get()
            return {"status": "ok", "firebase": True}
        except Exception as e:
            return {"status": "error", "firebase": False, "error": str(e)}
