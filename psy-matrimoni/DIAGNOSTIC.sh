#!/bin/bash
# Diagnostic - Run this to see what's wrong

echo "🔍 MindMatch Diagnostic"
echo "======================="
echo ""

echo "1️⃣ Checking if backend dependencies exist..."
if [ -d "/Users/ansalka/vite-project/psy-matrimoni/backend/node_modules" ]; then
    echo "   ✅ Backend node_modules exists"
else
    echo "   ❌ Backend node_modules MISSING - need to run npm install"
fi

echo ""
echo "2️⃣ Checking if frontend dependencies exist..."
if [ -d "/Users/ansalka/vite-project/psy-matrimoni/web/node_modules" ]; then
    echo "   ✅ Frontend node_modules exists"
else
    echo "   ❌ Frontend node_modules MISSING - need to run npm install"
fi

echo ""
echo "3️⃣ Checking if backend is running..."
if curl -s http://localhost:5001/health > /dev/null 2>&1; then
    echo "   ✅ Backend is running on port 5001"
    curl -s http://localhost:5001/health
else
    echo "   ❌ Backend NOT running on port 5001"
fi

echo ""
echo "4️⃣ Checking if frontend is running..."
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "   ✅ Frontend is running on port 5173"
else
    echo "   ❌ Frontend NOT running on port 5173"
fi

echo ""
echo "5️⃣ Checking what processes are running..."
ps aux | grep -E "node|vite" | grep -v grep || echo "   ❌ No node/vite processes found"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Final recommendation
if [ ! -d "/Users/ansalka/vite-project/psy-matrimoni/backend/node_modules" ] || [ ! -d "/Users/ansalka/vite-project/psy-matrimoni/web/node_modules" ]; then
    echo "🔴 PROBLEM: Dependencies not installed"
    echo ""
    echo "FIX: Run this now:"
    echo "   cd /Users/ansalka/vite-project/psy-matrimoni"
    echo "   chmod +x EMERGENCY_FIX.sh"
    echo "   ./EMERGENCY_FIX.sh"
elif ! curl -s http://localhost:5001/health > /dev/null 2>&1 || ! curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "🔴 PROBLEM: Servers not running"
    echo ""
    echo "FIX: Run this now:"
    echo "   cd /Users/ansalka/vite-project/psy-matrimoni"
    echo "   chmod +x EMERGENCY_FIX.sh"
    echo "   ./EMERGENCY_FIX.sh"
else
    echo "🟢 Everything looks good!"
    echo ""
    echo "Open browser to: http://localhost:5173"
    echo ""
    echo "If still blank, press F12 and check Console for errors"
fi

echo ""
