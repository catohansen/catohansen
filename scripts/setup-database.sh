#!/bin/bash
# Copyright (c) 2025 Cato Hansen. All rights reserved.
# 
# Proprietary - Unauthorized copying, modification, distribution, or use
# of this software, via any medium is strictly prohibited without express
# written permission from Cato Hansen.

# Setup Database Script
# Sets up PostgreSQL using Docker

set -e

echo "🐳 Setting up PostgreSQL database with Docker..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker is not running. Please start Docker Desktop first."
  echo "   Or use Neon/Supabase cloud database instead."
  exit 1
fi

# Check if container already exists
if docker ps -a --format "{{.Names}}" | grep -q "^catohansen-postgres$"; then
  echo "📦 PostgreSQL container already exists"
  
  # Check if container is running
  if docker ps --format "{{.Names}}" | grep -q "^catohansen-postgres$"; then
    echo "✅ PostgreSQL container is already running"
  else
    echo "🔄 Starting existing PostgreSQL container..."
    docker start catohansen-postgres
    echo "✅ PostgreSQL container started"
  fi
else
  echo "📦 Creating new PostgreSQL container..."
  docker run -d \
    --name catohansen-postgres \
    -e POSTGRES_USER=catohansen \
    -e POSTGRES_PASSWORD=catohansen123 \
    -e POSTGRES_DB=catohansen_online \
    -p 5432:5432 \
    postgres:14
  
  echo "⏳ Waiting for PostgreSQL to start..."
  sleep 5
  
  echo "✅ PostgreSQL container created and started"
fi

# Test connection
echo "🔍 Testing database connection..."
if docker exec catohansen-postgres psql -U catohansen -d catohansen_online -c "SELECT 1" > /dev/null 2>&1; then
  echo "✅ Database connection successful!"
else
  echo "⏳ Waiting for database to be ready..."
  sleep 3
fi

# Display connection info
echo ""
echo "✅ PostgreSQL is ready!"
echo ""
echo "📋 Connection Details:"
echo "   Host: localhost"
echo "   Port: 5432"
echo "   Database: catohansen_online"
echo "   Username: catohansen"
echo "   Password: catohansen123"
echo ""
echo "📝 Add to .env file:"
echo "   DATABASE_URL=\"postgresql://catohansen:catohansen123@localhost:5432/catohansen_online?schema=public\""
echo ""
echo "🚀 Next steps:"
echo "   1. Update .env file with DATABASE_URL above"
echo "   2. Run: npx prisma generate"
echo "   3. Run: npm run db:push"
echo "   4. Run: npm run seed:owner"
echo ""







