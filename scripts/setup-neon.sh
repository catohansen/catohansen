#!/bin/bash
# Copyright (c) 2025 Cato Hansen. All rights reserved.
# Proprietary - Unauthorized copying, modification, distribution, or use
# of this software, via any medium is strictly prohibited without express
# written permission from Cato Hansen.

# Setup script for Neon database
# Usage: ./scripts/setup-neon.sh <database-url>

set -e

DATABASE_URL=$1

if [ -z "$DATABASE_URL" ]; then
  echo "❌ Feil: Du må oppgi DATABASE_URL"
  echo ""
  echo "Usage: ./scripts/setup-neon.sh 'postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require'"
  echo ""
  echo "📋 Hvor får du DATABASE_URL?"
  echo "1. Gå til https://neon.tech"
  echo "2. Opprett prosjekt: catohansen-prod"
  echo "3. Gå til Connection Details"
  echo "4. Kopier Connection string (URI)"
  echo ""
  exit 1
fi

echo "🟢 Setter opp Neon database..."
echo ""

# Sett DATABASE_URL
export DATABASE_URL="$DATABASE_URL"

echo "📦 Genererer Prisma Client..."
npx prisma generate

echo ""
echo "🗄️  Pusher database schema til Neon..."
npx prisma db push --accept-data-loss

echo ""
echo "🔧 Enable pgvector extension..."
npx prisma db execute --stdin <<EOF
CREATE EXTENSION IF NOT EXISTS vector;
EOF

echo ""
echo "✅ Database setup fullført!"
echo ""
echo "📋 Neste steg:"
echo "1. Kopier DATABASE_URL for bruk i Vercel:"
echo "   $DATABASE_URL"
echo ""
echo "2. Test connection:"
echo "   DATABASE_URL=\"$DATABASE_URL\" npx prisma studio"
echo ""

