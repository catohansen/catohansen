#!/bin/bash
#
# Copyright (c) 2025 Cato Hansen. All rights reserved.
# 
# Proprietary - Unauthorized copying, modification, distribution, or use
# of this software, via any medium is strictly prohibited without express
# written permission from Cato Hansen.

# Complete Local Dev Fix Script
# Fixes Cursor cache issues, port conflicts, and restarts dev server

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

echo "🧹 COMPLETE LOCAL DEV FIX"
echo "=========================="
echo ""

# 1. Cursor cache (viktig for "cannot see code" problemet)
echo "🧹 1. Rens Cursor cache..."
for DIR in \
  "$HOME/Library/Application Support/Cursor/Cache" \
  "$HOME/Library/Application Support/Cursor/GPUCache" \
  "$HOME/Library/Application Support/Cursor/Session Storage"
do
  if [ -d "$DIR" ]; then
    rm -rf "$DIR" 2>/dev/null && echo "✅ Slettet: $(basename "$DIR")" || echo "⚠️  Kunne ikke slette: $(basename "$DIR")"
  fi
done

# 2. Stop Node/Next prosesser
echo ""
echo "⛔ 2. Stopper alle Next.js prosesser..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "node.*next" 2>/dev/null || true
sleep 2
echo "✅ Prosesser stoppet"

# 3. Frigjør porter 3000-3005
echo ""
echo "🔍 3. Frigjør porter 3000-3005..."
for PORT in {3000..3005}; do
  PIDS=$(lsof -ti :$PORT 2>/dev/null || true)
  if [ ! -z "$PIDS" ]; then
    echo "$PIDS" | xargs kill -9 2>/dev/null || true
    echo "✅ Port $PORT frigjort"
  fi
done

# 4. Rens prosjekt cache
echo ""
echo "🧼 4. Rens prosjekt cache..."
rm -rf .next node_modules/.cache .turbo 2>/dev/null || true
echo "✅ Prosjekt-cache ryddet"

# 5. Reinstall node_modules (valgfritt)
echo ""
read -p "Vil du reinstallere node_modules? (tar 1-2 min) [y/N] " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "📦 Reinstallerer node_modules..."
  rm -rf node_modules
  npm cache clean --force
  npm install
  echo "✅ node_modules reinstallert"
fi

# 6. Hent env fra Vercel (valgfritt)
echo ""
if command -v vercel &> /dev/null && vercel whoami &> /dev/null 2>/dev/null; then
  read -p "Hente environment variables fra Vercel? [y/N] " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔑 Henter environment variables fra Vercel..."
    vercel env pull .env.local 2>&1 || echo "⚠️  Kunne ikke hente fra Vercel"
    echo "✅ Environment variables hentet"
  fi
fi

# 7. Verifiser Prisma
echo ""
echo "📦 7. Verifiserer Prisma..."
npx prisma generate > /dev/null 2>&1 || {
  echo "⚠️  Prisma generate feilet"
}

# 8. Test build (valgfritt)
echo ""
read -p "Vil du teste build først? [y/N] " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "🔨 Tester build..."
  if npm run build 2>&1 | grep -q "Compiled successfully"; then
    echo "✅ Build lyktes!"
  else
    echo "⚠️  Build har feil - sjekk output over"
  fi
fi

# 9. Start dev server
echo ""
echo "🚀 8. Starter dev server på port 3001..."
echo "   Vent til du ser 'Ready - started server on http://localhost:3001'"
echo "   Trykk Ctrl+C for å stoppe"
echo ""
echo "📡 Åpne i Chrome: http://localhost:3001"
echo ""

PORT=3001 npm run dev

