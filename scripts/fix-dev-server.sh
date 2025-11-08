#!/bin/bash
#
# Copyright (c) 2025 Cato Hansen. All rights reserved.
# 
# Proprietary - Unauthorized copying, modification, distribution, or use
# of this software, via any medium is strictly prohibited without express
# written permission from Cato Hansen.

# Fix Dev Server Script
# Stopper alle prosesser, rydder opp, og starter serveren på nytt

set -e

echo "🧹 1. Stopper alle Next.js og Node prosesser..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "node.*next" 2>/dev/null || true
sleep 2

echo "✅ Prosesser stoppet"

echo ""
echo "🧰 2. Rydder opp build-filer..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf .turbo
echo "✅ Cache ryddet"

echo ""
echo "🔍 3. Sjekker porter..."
PORTS=(3000 3001 3002 3333 4000 5000)
for port in "${PORTS[@]}"; do
  PIDS=$(lsof -ti :$port 2>/dev/null || true)
  if [ ! -z "$PIDS" ]; then
    echo "⚠️  Port $port er i bruk av prosess(er): $PIDS"
    echo "$PIDS" | xargs kill -9 2>/dev/null || true
    echo "✅ Port $port frigjort"
  else
    echo "✅ Port $port er ledig"
  fi
done

echo ""
echo "📦 4. Verifiserer Prisma..."
npx prisma generate > /dev/null 2>&1 || {
  echo "⚠️  Prisma generate feilet, men fortsetter..."
}

echo ""
echo "🔨 5. Tester build (for å finne feil)..."
if npm run build 2>&1 | tee /tmp/build-output.log | grep -q "Compiled successfully"; then
  echo "✅ Build lyktes!"
else
  echo "⚠️  Build har feil - sjekk /tmp/build-output.log"
  echo "Første feil:"
  grep -i "error\|failed\|failed to" /tmp/build-output.log | head -5 || echo "Ingen åpenbare feil funnet"
fi

echo ""
echo "🚀 6. Starter dev server på port 3001..."
echo "   Vent til du ser 'Ready - started server on http://localhost:3001'"
echo "   Trykk Ctrl+C for å stoppe"
echo ""

PORT=3001 npm run dev


