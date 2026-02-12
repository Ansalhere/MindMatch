#!/bin/bash
# Quick test script - run this from psy-matrimoni directory

echo "Installing dependencies..."
(cd backend && npm install --silent) &
(cd web && npm install --silent) &
wait

echo "Starting servers..."
echo "Backend will be on http://localhost:5001"
echo "Frontend will be on http://localhost:5173"
echo ""

# Start backend in background
(cd backend && npm run dev) &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Start frontend
(cd web && npm run dev)

# Cleanup on exit
trap "kill $BACKEND_PID 2>/dev/null" EXIT
