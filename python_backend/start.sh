#!/bin/bash
# TruthLens Backend Startup Script

set -e

echo "🧠 TruthLens Backend Startup"
echo "============================"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found"
    exit 1
fi

echo "✅ Python: $(python3 --version)"

# Install dependencies if needed
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

echo "📦 Activating virtual environment..."
source venv/bin/activate

echo "📦 Installing dependencies..."
pip install --prefer-binary -q -r requirements.txt

# Check .env file
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found, creating from template..."
    cp .env.example .env
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Starting server on http://localhost:8000"
echo "Docs available at http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Start server
python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
