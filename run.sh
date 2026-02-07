#!/bin/bash
# Development server start script for Linux/Mac

echo "🚀 OOA Database - Development Server"
echo "======================================"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install it first."
    exit 1
fi

echo "✅ Python found: $(python3 --version)"
echo ""
echo "Starting server on http://localhost:8000"
echo "Press Ctrl+C to stop the server"
echo ""

# Change to script directory
cd "$(dirname "$0")"

# Start Python server
python3 server.py
