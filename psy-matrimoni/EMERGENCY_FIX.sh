#!/bin/bash
# EMERGENCY FIX - Run this if RUN_ME.sh doesn't work

set -e

echo "🚨 Emergency Fix Starting..."
echo ""

cd /Users/ansalka/vite-project/psy-matrimoni

# Kill any existing processes
echo "1️⃣ Killing any existing processes..."
pkill -9 node 2>/dev/null || true
pkill -9 vite 2>/dev/null || true
lsof -ti:5001 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true
sleep 2

# Clean installs
echo "2️⃣ Cleaning old installations..."
rm -rf backend/node_modules backend/package-lock.json
rm -rf web/node_modules web/package-lock.json

echo "3️⃣ Installing backend (this may take 2-3 minutes)..."
cd backend
npm install

echo "4️⃣ Installing frontend (this may take 2-3 minutes)..."
cd ../web
npm install

echo ""
echo "✅ Installation complete!"
echo ""
echo "5️⃣ Starting backend..."
cd ../backend
npm run dev > /tmp/mindmatch-backend.log 2>&1 &
BACKEND_PID=$!

echo "Backend PID: $BACKEND_PID"
echo "Waiting for backend to start..."
sleep 5

# Check backend health
if curl -s http://localhost:5001/health > /dev/null; then
    echo "✅ Backend is running!"
else
    echo "❌ Backend failed to start. Check /tmp/mindmatch-backend.log"
    exit 1
fi

echo ""
echo "6️⃣ Starting frontend..."
cd ../web
echo ""
echo "================================================"
echo "🎉 Frontend will start now!"
echo "================================================"
echo "When you see 'ready in X ms', open your browser to:"
echo ""
echo "   👉  http://localhost:5173  👈"
echo ""
echo "Press Ctrl+C to stop both servers"
echo "================================================"
echo ""

npm run dev

# Cleanup
trap "kill $BACKEND_PID 2>/dev/null" EXIT
