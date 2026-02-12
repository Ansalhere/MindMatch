#!/bin/bash
# Run this to commit and push to MindMatch repo

cd /Users/ansalka/vite-project

echo "Adding files to git..."
git add psy-matrimoni/

echo "Committing..."
git commit -m "Add complete MindMatch matrimonial platform

Features:
- React + TypeScript frontend with Vite
- Node.js + Express backend with TypeScript
- JWT authentication
- Profile management
- Psychological matching
- Interest request system
- File-based JSON storage
- Responsive UI with notifications"

echo "Pushing to MindMatch repository..."
git remote add mindmatch https://github.com/Ansalhere/MindMatch.git 2>/dev/null || true
git push mindmatch HEAD:main --force

echo "✓ Pushed to https://github.com/Ansalhere/MindMatch"
