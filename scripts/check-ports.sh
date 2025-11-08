#!/bin/bash
#
# Copyright (c) 2025 Cato Hansen. All rights reserved.
# 
# Proprietary - Unauthorized copying, modification, distribution, or use
# of this software, via any medium is strictly prohibited without express
# written permission from Cato Hansen.

# Check which ports are in use
# Usage: ./scripts/check-ports.sh

echo "🔍 Checking port availability..."
echo ""

PORTS=(3000 3001 3002 4000 5000)

for port in "${PORTS[@]}"; do
  if lsof -i :$port > /dev/null 2>&1; then
    echo "❌ Port $port: IN USE"
    lsof -i :$port | grep LISTEN | head -1
  else
    echo "✅ Port $port: AVAILABLE"
  fi
done

echo ""
echo "💡 To start on a specific port:"
echo "   npm run dev:3001  (or dev:3002, dev:4000, dev:5000)"
echo "   PORT=3001 npm run dev"
echo "   ./scripts/start-dev.sh 3001"


