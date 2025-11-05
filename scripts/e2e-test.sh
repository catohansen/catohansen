#!/bin/bash

# Copyright (c) 2025 Cato Hansen. All rights reserved.
# 
# Proprietary - Unauthorized copying, modification, distribution, or use
# of this software, via any medium is strictly prohibited without express
# written permission from Cato Hansen.
# 
# License: PROPRIETARY
# SPDX-License-Identifier: PROPRIETARY
# Author: Cato Hansen
# Contact: cato@catohansen.no
# Website: www.catohansen.no

# E2E Test Script
# Systematic end-to-end testing of the entire system

BASE_URL="${TEST_URL:-http://localhost:3000}"
OWNER_EMAIL="cato@catohansen.no"
OWNER_PASSWORD="Kilma2386!!"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0
TOTAL_TESTS=0

# Function to print test result
test_result() {
    local test_name="$1"
    local status="$2"
    local message="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if [ "$status" = "PASS" ]; then
        echo -e "${GREEN}✅ PASS${NC}: $test_name"
        if [ -n "$message" ]; then
            echo "   $message"
        fi
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}❌ FAIL${NC}: $test_name"
        if [ -n "$message" ]; then
            echo "   $message"
        fi
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
    echo ""
}

echo "🧪 Starting E2E Test Suite"
echo "=========================="
echo ""

# Test 1: Database Connection
echo "📊 Test 1: Database Connection"
if npx prisma db push --skip-generate > /dev/null 2>&1; then
    test_result "Database Connection" "PASS" "Prisma can connect to database"
else
    test_result "Database Connection" "FAIL" "Cannot connect to database"
fi

# Test 2: Server Status
echo "🌐 Test 2: Server Status"
if curl -s "$BASE_URL" > /dev/null 2>&1; then
    test_result "Server Status" "PASS" "Next.js server is running"
else
    test_result "Server Status" "FAIL" "Server is not running"
    echo "⚠️  Server is not available. Please start server first: npm run dev"
    exit 1
fi

# Test 3: Login Page Access
echo "🔐 Test 3: Login Page Access"
LOGIN_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/admin/login")
if [ "$LOGIN_RESPONSE" = "200" ]; then
    test_result "Login Page Access" "PASS" "Login page is accessible (HTTP $LOGIN_RESPONSE)"
else
    test_result "Login Page Access" "FAIL" "Login page returned HTTP $LOGIN_RESPONSE"
fi

# Test 4: Seed Owner User
echo "👤 Test 4: Seed Owner User"
SEED_RESPONSE=$(curl -s -X POST "$BASE_URL/api/admin/seed-owner" \
    -H "Content-Type: application/json" \
    -H "x-seed-secret: dev-secret-change-in-production" \
    -w "%{http_code}")
HTTP_CODE="${SEED_RESPONSE: -3}"
RESPONSE_BODY="${SEED_RESPONSE%???}"

if [ "$HTTP_CODE" = "200" ]; then
    test_result "Seed Owner User" "PASS" "Owner user seeded successfully"
else
    test_result "Seed Owner User" "FAIL" "Failed to seed owner user (HTTP $HTTP_CODE)"
    echo "   Response: $RESPONSE_BODY"
fi

# Test 5: Login API - Successful Login
echo "🔑 Test 5: Login API - Successful Login"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/admin/login" \
    -H "Content-Type: application/json" \
    -H "Cookie: admin-token=test" \
    -c /tmp/cookies.txt \
    -w "\n%{http_code}" \
    -d "{\"email\":\"$OWNER_EMAIL\",\"password\":\"$OWNER_PASSWORD\"}")

HTTP_CODE=$(echo "$LOGIN_RESPONSE" | tail -n 1)
RESPONSE_BODY=$(echo "$LOGIN_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    if echo "$RESPONSE_BODY" | grep -q "\"success\":true"; then
        TOKEN=$(echo "$RESPONSE_BODY" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
        test_result "Login API - Successful Login" "PASS" "Login successful, token received"
        echo "   Token: ${TOKEN:0:20}..."
    else
        test_result "Login API - Successful Login" "FAIL" "Login returned 200 but success=false"
    fi
else
    test_result "Login API - Successful Login" "FAIL" "Login failed (HTTP $HTTP_CODE)"
    echo "   Response: $RESPONSE_BODY"
fi

# Test 6: Login API - Invalid Password
echo "🚫 Test 6: Login API - Invalid Password"
INVALID_LOGIN=$(curl -s -X POST "$BASE_URL/api/admin/login" \
    -H "Content-Type: application/json" \
    -w "\n%{http_code}" \
    -d "{\"email\":\"$OWNER_EMAIL\",\"password\":\"wrongpassword\"}")

INVALID_HTTP_CODE=$(echo "$INVALID_LOGIN" | tail -n 1)
if [ "$INVALID_HTTP_CODE" = "401" ]; then
    test_result "Login API - Invalid Password" "PASS" "Correctly denies invalid password (HTTP 401)"
else
    test_result "Login API - Invalid Password" "FAIL" "Expected 401, got HTTP $INVALID_HTTP_CODE"
fi

# Test 7: Admin Panel Access (Unauthenticated)
echo "🛡️  Test 7: Admin Panel Access (Unauthenticated)"
ADMIN_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -L "$BASE_URL/admin")
if [ "$ADMIN_RESPONSE" = "200" ] || [ "$ADMIN_RESPONSE" = "307" ] || [ "$ADMIN_RESPONSE" = "302" ]; then
    test_result "Admin Panel Access (Unauthenticated)" "PASS" "Correctly redirects or shows login (HTTP $ADMIN_RESPONSE)"
else
    test_result "Admin Panel Access (Unauthenticated)" "FAIL" "Unexpected response (HTTP $ADMIN_RESPONSE)"
fi

# Test 8: API Routes Status
echo "🔌 Test 8: API Routes Status"
API_ROUTES=(
    "/api/admin/login"
    "/api/admin/seed-owner"
)

for route in "${API_ROUTES[@]}"; do
    API_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$route")
    if [ "$API_RESPONSE" != "404" ]; then
        test_result "API Route: $route" "PASS" "Route exists (HTTP $API_RESPONSE)"
    else
        test_result "API Route: $route" "FAIL" "Route not found (HTTP 404)"
    fi
done

# Test 9: Prisma Studio (Optional)
echo "📊 Test 9: Prisma Schema Sync"
if npx prisma validate > /dev/null 2>&1; then
    test_result "Prisma Schema Sync" "PASS" "Schema is valid"
else
    test_result "Prisma Schema Sync" "FAIL" "Schema validation failed"
fi

# Summary
echo ""
echo "=========================="
echo "📊 Test Summary"
echo "=========================="
echo -e "${GREEN}✅ Passed:${NC} $TESTS_PASSED"
echo -e "${RED}❌ Failed:${NC} $TESTS_FAILED"
echo -e "📝 Total: $TOTAL_TESTS"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some tests failed. Please review the errors above.${NC}"
    exit 1
fi

