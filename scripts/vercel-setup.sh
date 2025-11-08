#!/bin/bash
# Copyright (c) 2025 Cato Hansen. All rights reserved.
# Proprietary - Unauthorized copying, modification, distribution, or use
# of this software, via any medium is strictly prohibited without express
# written permission from Cato Hansen.

# Interactive Vercel setup script
# Usage: ./scripts/vercel-setup.sh

set -e

echo "🚀 Vercel Setup Assistant"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo "📦 Installerer Vercel CLI..."
  npm install -g vercel
  echo "✅ Vercel CLI installert"
  echo ""
fi

# Check if logged in
if ! vercel whoami &> /dev/null; then
  echo "🔐 Du må logge inn på Vercel først"
  echo ""
  echo "Åpner Vercel login..."
  vercel login
  echo ""
fi

echo "✅ Logget inn på Vercel som: $(vercel whoami)"
echo ""

# Check if project exists
if [ -f .vercel/project.json ]; then
  echo "✅ Vercel prosjekt allerede konfigurert"
  cat .vercel/project.json
  echo ""
  read -p "Vil du redeploye eksisterende prosjekt? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "⚠️  VIKTIG: Sett environment variables i Vercel Dashboard først!"
    echo "   Se DEPLOY_INSTRUKSJONER.md for alle 8 variabler"
    echo ""
    read -p "Har du satt alle environment variables? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      echo ""
      echo "🚀 Deployer til produksjon..."
      vercel --prod
    else
      echo ""
      echo "❌ Sett environment variables først i Vercel Dashboard"
      echo "   Se DEPLOY_INSTRUKSJONER.md"
      exit 1
    fi
  fi
else
  echo "📦 Setter opp nytt Vercel prosjekt..."
  echo ""
  echo "⚠️  VIKTIG: Dette vil linke til GitHub repo 'catohansen'"
  echo ""
  read -p "Fortsett med setup? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🔗 Linker til GitHub repo..."
    vercel link
    echo ""
    echo "⚠️  VIKTIG: Sett environment variables i Vercel Dashboard nå!"
    echo "   Se DEPLOY_INSTRUKSJONER.md for alle 8 variabler"
    echo ""
    echo "Når environment variables er satt, kjør:"
    echo "  npm run deploy:vercel"
    echo ""
  fi
fi

