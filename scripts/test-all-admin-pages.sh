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

# Test All Admin Pages Script
# Tests all admin pages systematically

BASE_URL="${TEST_URL:-http://localhost:3000}"
OWNER_EMAIL="cato@catohansen.no"
OWNER_PASSWORD="Kilma2386!!"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

TESTS_PASSED=0
TESTS_FAILED=0

test_page() {
    local page="$1"
    local name="$2"
    local token="$3"
    
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" -H "Cookie: admin-token=$token" "$BASE_URL$page")
    
    if [ "$STATUS" = "200" ]; then
        echo -e "${GREEN}✅${NC} $name (HTTP $STATUS)"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}❌${NC} $name (HTTP $STATUS)"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
}

echo "🧪 Testing All Admin Pages"
echo "=========================="
echo ""

# Login first
echo "🔑 Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/admin/login" \
    -H "Content-Type: application/json" \
    -c /tmp/admin-cookies.txt \
    -d "{\"email\":\"$OWNER_EMAIL\",\"password\":\"$OWNER_PASSWORD\"}")

TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo -e "${RED}❌ Login failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Logged in${NC}"
echo ""

# Test admin pages
echo "📄 Testing Admin Pages..."
echo ""

test_page "/admin" "Admin Dashboard" "$TOKEN"
test_page "/admin/profile" "Profile Page" "$TOKEN"
test_page "/admin/clients" "Clients Page" "$TOKEN"
test_page "/admin/crm" "CRM Dashboard" "$TOKEN"
test_page "/admin/hansen-security/settings" "Security Settings" "$TOKEN"

# Test API endpoints
echo ""
echo "🔌 Testing API Endpoints..."
echo ""

test_page "/api/admin/verify" "Verify API" "$TOKEN"
test_page "/api/admin/profile" "Profile API" "$TOKEN"
test_page "/api/admin/stats" "Stats API" "$TOKEN"
test_page "/api/modules/hansen-security/settings" "Security Settings API" "$TOKEN"

# Summary
echo ""
echo "=========================="
echo "📊 Test Summary"
echo "=========================="
echo -e "${GREEN}✅ Passed:${NC} $TESTS_PASSED"
echo -e "${RED}❌ Failed:${NC} $TESTS_FAILED"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some tests failed.${NC}"
    exit 1
fi





