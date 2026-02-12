#!/bin/bash
# Run this in a NEW, FRESH terminal window

echo "=== MindMatch Setup & Start ==="
echo ""

# Navigate to project
cd /Users/ansalka/vite-project/psy-matrimoni

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install --silent

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../web
npm install --silent

echo ""
echo "✅ Dependencies installed!"
echo ""
echo "=== Starting servers ==="
echo ""

# Start backend in background
echo "🚀 Starting backend on port 5001..."
cd ../backend
npm run dev > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait for backend
sleep 5

# Start frontend
echo "🚀 Starting frontend on port 5173..."
cd ../web
npm run dev

# Cleanup on exit
trap "kill $BACKEND_PID 2>/dev/null" EXIT
