#!/bin/bash

# Copyright (c) 2025 Cato Hansen. All rights reserved.
# Open all admin pages in Chrome for testing

BASE_URL="http://localhost:3000"

# Array of all admin pages
PAGES=(
  "/admin/login"
  "/admin"
  "/admin/profile"
  "/admin/clients"
  "/admin/clients/new"
  "/admin/clients/leads"
  "/admin/clients/pipeline"
  "/admin/crm"
  "/admin/content"
  "/admin/content/pages"
  "/admin/content/sections"
  "/admin/content/media"
  "/admin/content/seo"
  "/admin/projects"
  "/admin/projects/new"
  "/admin/projects/templates"
  "/admin/portfolio"
  "/admin/portfolio/featured"
  "/admin/portfolio/cases"
  "/admin/billing"
  "/admin/billing/invoices"
  "/admin/billing/payments"
  "/admin/billing/pricing"
  "/admin/billing/reports"
  "/admin/analytics"
  "/admin/analytics/website"
  "/admin/analytics/clients"
  "/admin/analytics/revenue"
  "/admin/ai"
  "/admin/ai/agents"
  "/admin/ai/automation"
  "/admin/ai/content"
  "/admin/ai/clients"
  "/admin/hansen-security"
  "/admin/hansen-security/audit"
  "/admin/hansen-security/policies"
  "/admin/hansen-security/metrics"
  "/admin/hansen-security/settings"
  "/admin/knowledge-base"
  "/admin/modules"
  "/admin/modules/onboarding"
  "/admin/modules/graph"
  "/admin/modules/hierarchy"
  "/admin/deploy"
  "/admin/deploy/history"
  "/admin/deploy/settings"
  "/admin/settings"
  "/admin/settings/users"
  "/admin/settings/policies"
  "/admin/settings/integrations"
  "/admin/mindmaps"
)

echo "🚀 Opening all admin pages in Chrome..."
echo "Base URL: $BASE_URL"
echo ""

# Check if Chrome is available
if command -v open &> /dev/null; then
  # macOS
  for page in "${PAGES[@]}"; do
    echo "Opening: $BASE_URL$page"
    open -a "Google Chrome" "$BASE_URL$page"
    sleep 1
  done
elif command -v xdg-open &> /dev/null; then
  # Linux
  for page in "${PAGES[@]}"; do
    echo "Opening: $BASE_URL$page"
    xdg-open "$BASE_URL$page" 2>/dev/null &
    sleep 1
  done
elif command -v start &> /dev/null; then
  # Windows
  for page in "${PAGES[@]}"; do
    echo "Opening: $BASE_URL$page"
    start "chrome" "$BASE_URL$page"
    sleep 1
  done
else
  echo "❌ Could not detect browser command"
  echo "Please open Chrome manually and navigate to: $BASE_URL/admin"
  exit 1
fi

echo ""
echo "✅ All pages opened! Check Chrome tabs."
echo "📝 Test checklist:"
echo "   1. Login at /admin/login"
echo "   2. Check each page loads correctly"
echo "   3. Verify data is displayed (not mock)"
echo "   4. Test search functionality"
echo "   5. Check responsiveness"



