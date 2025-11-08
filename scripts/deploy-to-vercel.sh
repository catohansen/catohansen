#!/bin/bash
# Copyright (c) 2025 Cato Hansen. All rights reserved.
# Proprietary - Unauthorized copying, modification, distribution, or use
# of this software, via any medium is strictly prohibited without express
# written permission from Cato Hansen.

# Script for deploying to Vercel using CLI
# Usage: ./scripts/deploy-to-vercel.sh

set -e

echo "🚀 Vercel Deployment Script"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo "⚠️  Vercel CLI ikke installert"
  echo ""
  echo "📦 Installer Vercel CLI:"
  echo "   npm install -g vercel"
  echo ""
  echo "Eller deploy via Vercel Dashboard:"
  echo "   1. Gå til vercel.com"
  echo "   2. Følg DEPLOY_NOW.md guide"
  echo ""
  exit 1
fi

echo "✅ Vercel CLI funnet"
echo ""

# Check if logged in
if ! vercel whoami &> /dev/null; then
  echo "🔐 Du må logge inn på Vercel først:"
  echo "   vercel login"
  echo ""
  exit 1
fi

echo "✅ Logget inn på Vercel"
echo ""

# Set environment variables
echo "📋 Environment Variables:"
echo "  - DATABASE_URL: ✅"
echo "  - NEXTAUTH_SECRET: ✅"
echo "  - JWT_SECRET: ✅"
echo "  - NEXT_PUBLIC_URL: ✅"
echo "  - NODE_ENV: ✅"
echo "  - GOOGLE_AI_API_KEY: ✅"
echo "  - GOOGLE_AI_MODEL: ✅"
echo "  - NORA_AI_PROVIDER: ✅"
echo ""
echo "⚠️  VIKTIG: Sett environment variables i Vercel Dashboard først!"
echo "   Se DEPLOY_NOW.md for verdier"
echo ""
read -p "Har du satt alle environment variables i Vercel Dashboard? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ Sett environment variables først i Vercel Dashboard"
  echo "   Se DEPLOY_NOW.md for instruksjoner"
  exit 1
fi

echo ""
echo "🚀 Deployer til Vercel..."
echo ""

# Deploy to production
vercel --prod

echo ""
echo "✅ Deployment fullført!"
echo ""
echo "📋 Neste steg:"
echo "   1. Test hjemmesiden: https://catohansen.vercel.app"
echo "   2. Sjekk build logs i Vercel Dashboard"
echo "   3. Test alle funksjoner"
echo ""

