#!/bin/bash

# Copyright (c) 2025 Cato Hansen. All rights reserved.
# Open landing page and all Cato Hansen pages in Chrome

BASE_URL="http://localhost:3000"

# Array of landing page and Cato Hansen pages
PAGES=(
  "/"
  "/hansen-hub"
  "/hansen-auth"
  "/hansen-security"
  "/hansen-mindmap-2.0"
)

echo "🚀 Opening landing page and Cato Hansen pages in Chrome..."
echo "Base URL: $BASE_URL"
echo ""
echo "Opening pages:"
echo "  1. Landing Page (/)"
echo "  2. Hansen Hub (/hansen-hub)"
echo "  3. Hansen Auth (/hansen-auth)"
echo "  4. Hansen Security (/hansen-security)"
echo "  5. Hansen Mindmap 2.0 (/hansen-mindmap-2.0)"
echo ""

# Wait a moment for server to be ready
echo "⏳ Waiting for server to be ready..."
sleep 3

# Check if Chrome is available
if command -v open &> /dev/null; then
  # macOS
  for page in "${PAGES[@]}"; do
    echo "Opening: $BASE_URL$page"
    open -a "Google Chrome" "$BASE_URL$page"
    sleep 2
  done
elif command -v xdg-open &> /dev/null; then
  # Linux
  for page in "${PAGES[@]}"; do
    echo "Opening: $BASE_URL$page"
    xdg-open "$BASE_URL$page" 2>/dev/null &
    sleep 2
  done
elif command -v start &> /dev/null; then
  # Windows
  for page in "${PAGES[@]}"; do
    echo "Opening: $BASE_URL$page"
    start "chrome" "$BASE_URL$page"
    sleep 2
  done
else
  echo "❌ Could not detect browser command"
  echo "Please open Chrome manually and navigate to:"
  for page in "${PAGES[@]}"; do
    echo "  - $BASE_URL$page"
  done
  exit 1
fi

echo ""
echo "✅ All pages opened! Check Chrome tabs."
echo ""
echo "📝 Pages opened:"
echo "  1. Landing Page: $BASE_URL/"
echo "  2. Hansen Hub: $BASE_URL/hansen-hub"
echo "  3. Hansen Auth: $BASE_URL/hansen-auth"
echo "  4. Hansen Security: $BASE_URL/hansen-security"
echo "  5. Hansen Mindmap 2.0: $BASE_URL/hansen-mindmap-2.0"
echo ""
echo "🎨 Test each page:"
echo "  - Check if it loads correctly"
echo "  - Verify animations and effects"
echo "  - Test navigation"
echo "  - Check responsive design"



