#!/bin/bash

# MindMatch Development Script
# Starts backend and frontend servers

set -e

echo "Starting MindMatch development servers..."

# Navigate to project root
cd "$(dirname "$0")/.."

# Start backend
echo "Starting backend server..."
cd backend
npm install 2>/dev/null || true
npm run dev &
BACKEND_PID=$!
echo "Backend started (PID: $BACKEND_PID)"

# Wait a bit for backend to start
sleep 3

# Start frontend
echo "Starting frontend server..."
cd ../web
npm install 2>/dev/null || true
npm run dev &
FRONTEND_PID=$!
echo "Frontend started (PID: $FRONTEND_PID)"

echo ""
echo "==================================="
echo "MindMatch is running!"
echo "Backend: http://localhost:5001"
echo "Frontend: http://localhost:5173"
echo "==================================="
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM

wait
