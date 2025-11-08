#!/bin/bash
#
# Copyright (c) 2025 Cato Hansen. All rights reserved.
# 
# Proprietary - Unauthorized copying, modification, distribution, or use
# of this software, via any medium is strictly prohibited without express
# written permission from Cato Hansen.

# Start Next.js dev server on specified port
# Usage: ./scripts/start-dev.sh [port]
# Default: 3000

PORT=${1:-3000}

echo "🚀 Starting Next.js dev server on port $PORT..."
echo "📡 Access at: http://localhost:$PORT"

PORT=$PORT npm run dev


