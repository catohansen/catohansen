#!/bin/bash
# Copyright (c) 2025 Cato Hansen. All rights reserved.
# Proprietary - Unauthorized copying, modification, distribution, or use
# of this software, via any medium is strictly prohibited without express
# written permission from Cato Hansen.

# Generate secrets for Vercel environment variables
# Usage: ./scripts/generate-env-secrets.sh

set -e

echo "🔑 Genererer secrets for Vercel environment variables..."
echo ""

echo "NEXTAUTH_SECRET:"
openssl rand -base64 32
echo ""

echo "JWT_SECRET:"
openssl rand -base64 32
echo ""

echo "✅ Kopier disse verdiene og legg dem til i Vercel Dashboard → Settings → Environment Variables"
echo ""

