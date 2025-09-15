#!/bin/bash

# Atlas-Alert FastAPI Backend Startup Script

echo "🌊 Starting Atlas-Alert Backend Server..."

# Set environment variables
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
export HOST=${HOST:-"0.0.0.0"}
export PORT=${PORT:-8000}
export WORKERS=${WORKERS:-4}
export LOG_LEVEL=${LOG_LEVEL:-"info"}

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📚 Installing dependencies..."
pip install -r requirements.txt

# Run database migrations (if needed)
echo "🗄️ Checking database..."
# python scripts/migrate.py

# Generate mock data
echo "🎭 Generating mock data..."
python -c "
from mock_data.data_generator import generate_all_mock_data
import json
data = generate_all_mock_data()
with open('mock_data.json', 'w') as f:
    json.dump(data, f, indent=2)
print('Mock data generated successfully!')
"

# Start the server
echo "🚀 Starting FastAPI server..."
python scripts/run_server.py
