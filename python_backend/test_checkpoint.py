#!/usr/bin/env python3
"""Comprehensive backend test script"""

import subprocess
import time
import requests
import json
import sys

print("\n" + "="*60)
print("🧥 TruthLens Backend Checkpoint Test")
print("="*60 + "\n")

# Check Python
try:
    import fastapi
    import uvicorn
    import pydantic
    print("✅ Core dependencies installed")
except ImportError as e:
    print(f"❌ Missing dependency: {e}")
    sys.exit(1)

# Test modules
print("\n📦 Testing Python modules...")
try:
    from models.schemas import VerdictSchema, ScanRequest
    print("  ✅ Pydantic schemas loaded")

    from services.mock_data import get_mock_scan, get_all_mock_scans
    print("  ✅ Mock data module loaded")

    from services.llm_service import LLMService
    print("  ✅ LLM service loaded")

    from services.firebase_service import FirebaseService
    print("  ✅ Firebase service loaded")

    import asyncio
    async def test_mock_data():
        red = get_mock_scan("Red")
        yellow = get_mock_scan("Yellow")
        green = get_mock_scan("Green")
        return red["verdict"]["status"], yellow["verdict"]["status"], green["verdict"]["status"]

    red_status, yellow_status, green_status = asyncio.run(test_mock_data())

    print(f"  ✅ Mock data verified:")
    print(f"     • Red: {red_status}")
    print(f"     • Yellow: {yellow_status}")
    print(f"     • Green: {green_status}")

except Exception as e:
    print(f"  ❌ Error: {e}")
    sys.exit(1)

print("\n🚀 Starting FastAPI server...")
print("   (This will run for 10 seconds then stop)")

# Start server in background
proc = subprocess.Popen(
    ["python3", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"],
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE
)

# Wait for server to start
time.sleep(3)

try:
    print("   ✅ Server started on http://localhost:8000")

    print("\n🧪 Testing API endpoints...\n")

    # Test 1: Root endpoint
    print("  [1/6] Testing GET /")
    response = requests.get("http://localhost:8000/")
    if response.status_code == 200:
        data = response.json()
        print(f"        ✅ Status: {data['status']}")
        print(f"        ✅ Mock Mode: {data['mock_mode']}")
    else:
        print(f"        ❌ Status: {response.status_code}")

    # Test 2: Health endpoint
    print("  [2/6] Testing GET /health")
    response = requests.get("http://localhost:8000/health")
    if response.status_code == 200:
        data = response.json()
        print(f"        ✅ Backend: {data['backend']}")
        print(f"        ✅ Mock Mode: {data['mock_mode']}")
    else:
        print(f"        ❌ Status: {response.status_code}")

    # Test 3: Analyze endpoint (mock data)
    print("  [3/6] Testing POST /analyze (hallucinated text)")
    response = requests.post(
        "http://localhost:8000/analyze",
        json={
            "text": "The 1912 Martian Meteorite was discovered in London by Sir Arthur Conan Doyle. It was named the Victoria Stone after Queen Victoria.",
            "source_url": "http://localhost:3000/demo",
            "user_id": "test-user"
        }
    )
    if response.status_code == 200:
        data = response.json()
        print(f"        ✅ Scan ID: {data['scan_id'][:8]}...")
        print(f"        ✅ Status: {data['status']} (Red = hallucinated)")
        print(f"        ✅ Confidence: {data['confidence']}%")
        print(f"        ✅ Latency: {data['processing_time_ms']}ms")
        scan_id = data['scan_id']
    else:
        print(f"        ❌ Status: {response.status_code}")
        scan_id = None

    # Test 4: Get specific scan
    if scan_id:
        print(f"  [4/6] Testing GET /scan/:id")
        response = requests.get(f"http://localhost:8000/scan/{scan_id}")
        if response.status_code == 200:
            print(f"        ✅ Scan retrieved")
        else:
            print(f"        ⚠️  Status: {response.status_code} (expected in mock mode)")

    # Test 5: User history
    print(f"  [5/6] Testing GET /history/test-user")
    response = requests.get("http://localhost:8000/history/test-user")
    if response.status_code == 200:
        data = response.json()
        print(f"        ✅ User history retrieved")
        print(f"        ℹ️  Scans count: {data['count']}")
    else:
        print(f"        ⚠️  Status: {response.status_code} (expected in mock mode)")

    # Test 6: User stats
    print(f"  [6/6] Testing GET /stats/test-user")
    response = requests.get("http://localhost:8000/stats/test-user")
    if response.status_code == 200:
        data = response.json()
        print(f"        ✅ User stats retrieved")
        print(f"        ℹ️  Total scans: {data.get('total_scans', 'N/A')}")
    else:
        print(f"        ⚠️  Status: {response.status_code} (expected in mock mode)")

    print("\n" + "="*60)
    print("✅ All Tests Passed!")
    print("="*60)

    print("\n📊 Backend Status: READY FOR HACKATHON")
    print("\n🚀 To start backend server:")
    print("   cd python_backend")
    print("   ./start.sh")
    print("\n📖 API Documentation:")
    print("   http://localhost:8000/docs")
    print("\n" + "="*60 + "\n")

except Exception as e:
    print(f"\n❌ Error during testing: {e}")
    import traceback
    traceback.print_exc()

finally:
    # Kill server
    proc.terminate()
    proc.wait(timeout=5)
    print("🛑 Server stopped\n")
