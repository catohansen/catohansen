#!/bin/bash
# Copyright (c) 2025 Cato Hansen. All rights reserved.
# Proprietary - Unauthorized copying, modification, distribution, or use
# of this software, via any medium is strictly prohibited without express
# written permission from Cato Hansen.

# Setup script for GitHub repository
# Usage: ./scripts/setup-github.sh <github-username>

set -e

GITHUB_USERNAME=$1

if [ -z "$GITHUB_USERNAME" ]; then
  echo "❌ Feil: Du må oppgi GitHub brukernavn"
  echo "Usage: ./scripts/setup-github.sh <github-username>"
  exit 1
fi

echo "🔵 Setter opp GitHub repository..."

# Sjekk om remote allerede eksisterer
if git remote get-url origin > /dev/null 2>&1; then
  echo "⚠️  Remote 'origin' eksisterer allerede"
  read -p "Vil du erstatte den? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    git remote remove origin
  else
    echo "❌ Avbrutt"
    exit 1
  fi
fi

# Legg til remote
echo "📦 Legger til GitHub remote..."
git remote add origin "https://github.com/${GITHUB_USERNAME}/catohansen.git"

# Vis remote info
echo "✅ Remote konfigurert:"
git remote -v

echo ""
echo "📋 Neste steg:"
echo "1. Opprett repo på GitHub: https://github.com/new"
echo "   - Repository name: catohansen"
echo "   - Visibility: Private (anbefales)"
echo "   - Ikke huk av 'Initialize with README'"
echo ""
echo "2. Når repo er opprettet, kjør:"
echo "   git push -u origin master"
echo ""

