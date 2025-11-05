#!/bin/bash
# Copyright (c) 2025 Cato Hansen. All rights reserved.
# Script to open all pages in the system

BASE_URL="http://localhost:3000"
DELAY=2

echo "🌐 Åpner alle sider i systemet..."

# Public pages
echo "📄 Åpner public sider..."
open "$BASE_URL"
sleep $DELAY
open "$BASE_URL/hansen-hub"
sleep $DELAY
open "$BASE_URL/hansen-auth"
sleep $DELAY
open "$BASE_URL/hansen-security"
sleep $DELAY
open "$BASE_URL/pengeplan-2.0"
sleep $DELAY
open "$BASE_URL/pengeplan-2.0/spleis"
sleep $DELAY
open "$BASE_URL/demo-admin"

# Admin pages (requires login, so we'll just list them)
echo ""
echo "🔐 Admin sider (krever login):"
echo "  - $BASE_URL/admin"
echo "  - $BASE_URL/admin/profile"
echo "  - $BASE_URL/admin/clients"
echo "  - $BASE_URL/admin/clients/new"
echo "  - $BASE_URL/admin/clients/leads"
echo "  - $BASE_URL/admin/clients/pipeline"
echo "  - $BASE_URL/admin/crm"
echo "  - $BASE_URL/admin/content"
echo "  - $BASE_URL/admin/content/pages"
echo "  - $BASE_URL/admin/content/sections"
echo "  - $BASE_URL/admin/content/media"
echo "  - $BASE_URL/admin/content/seo"
echo "  - $BASE_URL/admin/projects"
echo "  - $BASE_URL/admin/projects/new"
echo "  - $BASE_URL/admin/projects/templates"
echo "  - $BASE_URL/admin/portfolio"
echo "  - $BASE_URL/admin/portfolio/featured"
echo "  - $BASE_URL/admin/portfolio/cases"
echo "  - $BASE_URL/admin/billing"
echo "  - $BASE_URL/admin/billing/invoices"
echo "  - $BASE_URL/admin/billing/payments"
echo "  - $BASE_URL/admin/billing/pricing"
echo "  - $BASE_URL/admin/billing/reports"
echo "  - $BASE_URL/admin/analytics"
echo "  - $BASE_URL/admin/analytics/website"
echo "  - $BASE_URL/admin/analytics/clients"
echo "  - $BASE_URL/admin/analytics/revenue"
echo "  - $BASE_URL/admin/ai"
echo "  - $BASE_URL/admin/ai/agents"
echo "  - $BASE_URL/admin/ai/automation"
echo "  - $BASE_URL/admin/ai/content"
echo "  - $BASE_URL/admin/ai/clients"
echo "  - $BASE_URL/admin/hansen-security"
echo "  - $BASE_URL/admin/hansen-security/policies"
echo "  - $BASE_URL/admin/hansen-security/audit"
echo "  - $BASE_URL/admin/hansen-security/metrics"
echo "  - $BASE_URL/admin/hansen-security/settings"
echo "  - $BASE_URL/admin/modules"
echo "  - $BASE_URL/admin/modules/onboarding"
echo "  - $BASE_URL/admin/modules/graph"
echo "  - $BASE_URL/admin/deploy"
echo "  - $BASE_URL/admin/deploy/history"
echo "  - $BASE_URL/admin/deploy/settings"
echo "  - $BASE_URL/admin/settings"
echo "  - $BASE_URL/admin/settings/users"
echo "  - $BASE_URL/admin/settings/policies"
echo "  - $BASE_URL/admin/settings/integrations"
echo "  - $BASE_URL/admin/knowledge-base"
echo ""
echo "✅ Alle public sider er åpnet i nettleseren!"
echo "📋 Admin sider er listet opp - logg inn for å få tilgang"



