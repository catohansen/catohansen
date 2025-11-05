#!/bin/bash

# Script for å eksportere Next.js som statiske filer og laste opp til Domeneshop

echo "🔨 Bygger statisk versjon..."

# Endre next.config.js til å eksportere statisk
sed -i.bak 's|// output: '\''export'\'',|output: '\''export'\'',|' next.config.js

# Bygg
npm run build

# Gjenopprett original config
mv next.config.js.bak next.config.js

echo "✅ Build fullført! Filene ligger i 'out/' mappen"
echo ""
echo "📤 For å laste opp til Domeneshop, bruk en av disse metodene:"
echo ""
echo "1. Via FileZilla/FTP-klient:"
echo "   - Server: ftp.domeneshop.no"
echo "   - Brukernavn: catohansen"
echo "   - Mappe: /www"
echo "   - Upload hele 'out/' mappen"
echo ""
echo "2. Via SCP (fra terminal):"
echo "   scp -r out/* catohansen@scp.domeneshop.no:/www/"
echo ""
echo "3. Via SFTP (fra terminal):"
echo "   sftp catohansen@sftp.domeneshop.no"
echo "   cd /www"
echo "   put -r out/*"

