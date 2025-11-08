#!/bin/bash
# Copyright (c) 2025 Cato Hansen. All rights reserved.
# 
# Proprietary - Unauthorized copying, modification, distribution, or use
# of this software, via any medium is strictly prohibited without express
# written permission from Cato Hansen.

# Global Local Dev Fix Script (for Mac)
# Can be used from any project directory
# Usage: curl -sSL https://raw.githubusercontent.com/catohansen/scripts/main/fix-local-global.sh | bash

set -e

echo "🧹 COMPLETE LOCAL DEV FIX — GLOBAL VERSION"
echo "==========================================="

# 1. Cursor cache
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

# 2. Stop node/next prosesser og porter
echo ""
echo "⛔ 2. Stopper prosesser og frigjør porter..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "node.*next" 2>/dev/null || true

for PORT in {3000..3005}; do
  PIDS=$(lsof -ti :$PORT 2>/dev/null || true)
  if [ ! -z "$PIDS" ]; then
    echo "$PIDS" | xargs kill -9 2>/dev/null || true
    echo "✅ Port $PORT frigjort"
  fi
done

# 3. Prosjekt
echo ""
read -p "📂 Skriv inn full sti til prosjektet (eller trykk Enter for nåværende): " PROJECT
PROJECT=${PROJECT:-$(pwd)}

if [ ! -d "$PROJECT" ]; then
  echo "❌ Kan ikke finne prosjektet: $PROJECT"
  exit 1
fi

cd "$PROJECT" || { echo "❌ Kan ikke gå til prosjektet!"; exit 1; }

echo "📁 Prosjekt: $PROJECT"
echo ""

# 4. Rens cache
echo "🧼 3. Rydder .next og cache..."
rm -rf .next node_modules/.cache .turbo 2>/dev/null || true
echo "✅ Cache ryddet"

# 5. Reinstall node_modules
echo ""
read -p "Vil du reinstallere node_modules? [y/N] " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "📦 Reinstallerer node_modules..."
  rm -rf node_modules
  npm cache clean --force
  npm install
  echo "✅ node_modules reinstallert"
fi

# 6. Vercel env
if command -v vercel &> /dev/null && vercel whoami &> /dev/null 2>/dev/null; then
  echo ""
  read -p "Hente env fra Vercel? [y/N] " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔑 Henter environment variables fra Vercel..."
    vercel env pull .env.local 2>&1 || echo "⚠️  Kunne ikke hente fra Vercel"
    echo "✅ Environment variables hentet"
  fi
fi

# 7. Prisma
echo ""
echo "📦 4. Verifiserer Prisma..."
npx prisma generate > /dev/null 2>&1 || echo "⚠️  Prisma generate feilet (ikke kritisk)"

# 8. Start dev server
echo ""
echo "🚀 5. Starter dev-server på port 3001..."
echo "   Vent til du ser 'Ready - started server on http://localhost:3001'"
echo "   Trykk Ctrl+C for å stoppe"
echo ""
echo "📡 Åpne i Chrome: http://localhost:3001"
echo ""

PORT=3001 npm run dev

