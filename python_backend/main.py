"""TruthLens FastAPI Backend - AI Hallucination Detector"""
import os
import json
from dotenv import load_dotenv

# Load env vars first
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

from services.llm_service import LLMService
from services.firebase_service import FirebaseService
from routers import analyze, scans, feedback

# Initialize FastAPI app
app = FastAPI(
    title="TruthLens API",
    description="AI Hallucination Detection Backend",
    version="1.0.0"
)

# Get configuration from environment
USE_MOCK_DATA = os.getenv("USE_MOCK_DATA", "false").lower() == "true"
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
FIREBASE_CREDENTIALS = os.getenv("FIREBASE_CREDENTIALS_JSON", "")
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173").split(",")
DEBUG = os.getenv("DEBUG", "true").lower() == "true"

# Initialize services
llm_service = LLMService(use_mock=USE_MOCK_DATA, api_key=GEMINI_API_KEY if not USE_MOCK_DATA else None)
firebase_service = FirebaseService(credentials_json=FIREBASE_CREDENTIALS if FIREBASE_CREDENTIALS else None)

# Set service instances in routers
analyze.set_services(llm_service, firebase_service)
scans.set_service(firebase_service)
feedback.set_service(firebase_service)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS + ["*"],  # Allow all for hackathon
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(analyze.router, tags=["analysis"])
app.include_router(scans.router, tags=["scans"])
app.include_router(feedback.router, tags=["feedback"])


@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "name": "TruthLens API",
        "version": "1.0.0",
        "description": "AI Hallucination Detection Backend",
        "status": "running",
        "mock_mode": USE_MOCK_DATA,
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    firebase_status = await firebase_service.health_check()
    return {
        "status": "ok",
        "backend": "healthy",
        "firebase": firebase_status,
        "mock_mode": USE_MOCK_DATA
    }


@app.get("/config")
async def get_config():
    """Get current configuration (for debugging)"""
    if not DEBUG:
        return JSONResponse({"error": "Not available"}, status_code=403)

    return {
        "use_mock_data": USE_MOCK_DATA,
        "firebase_initialized": firebase_service.initialized,
        "allowed_origins": ALLOWED_ORIGINS,
        "debug": DEBUG
    }


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    print(f"Error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )


@app.on_event("startup")
async def startup_event():
    """Startup event - validate services"""
    print("🧠 TruthLens Backend Starting...")
    print(f"📊 Mock Mode: {USE_MOCK_DATA}")
    print(f"🔥 Firebase: {'Initialized' if firebase_service.initialized else 'Mock Mode'}")
    print(f"✅ Backend Ready")


@app.on_event("shutdown")
async def shutdown_event():
    """Shutdown event"""
    print("🧠 TruthLens Backend Shutting Down...")


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=DEBUG,
        log_level="info"
    )
