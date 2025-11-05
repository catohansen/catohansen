<!--
Copyright (c) 2025 Cato Hansen. All rights reserved.

Proprietary - Unauthorized copying, modification, distribution, or use
of this software, via any medium is strictly prohibited without express
written permission from Cato Hansen.

License: PROPRIETARY
Author: Cato Hansen
Contact: cato@catohansen.no
Website: www.catohansen.no
-->

# 🏪 Hansen Marketplace - Module Distribution & Sales

**Version:** 1.0.0  
**Author:** Cato Hansen  
**Status:** ✅ Ready for Production

---

## 🎯 OVERVIEW

Hansen Marketplace er salgskanalen for alle Hansen Global moduler.

Hver modul kan:
- ✅ Vises med pris og features
- ✅ Testes med live demo
- ✅ Kjøpes med Stripe/Vipps (når aktivert)
- ✅ Lastes ned som NPM package
- ✅ Integreres med SDK

---

## 📦 TILGJENGELIGE PRODUKTER

### **1. Hansen Security 2.0** 🛡️
- **Pris:** NOK 1,999/mnd
- **Status:** Active
- **Features:** Policy Engine, RBAC/ABAC, Audit Logging
- **Demo:** /hansen-security/demo
- **Docs:** /hansen-security/docs

### **2. Nora AI** 🤖
- **Pris:** NOK 2,999/mnd
- **Status:** Active
- **Features:** Multi-modal AI, RAG, Memory, Voice
- **Demo:** /nora
- **Docs:** /nora/docs

### **3. Hansen CRM 2.0** 👥
- **Pris:** NOK 1,499/mnd
- **Status:** Active
- **Features:** Lead Management, Pipeline, AI Insights
- **Demo:** /hansen-crm
- **Docs:** /hansen-crm/docs

---

## 🚀 USAGE

### **Visit Marketplace:**
```
https://catohansen.no/marketplace
```

### **API Access:**
```bash
# List all products
GET /api/marketplace/products

# Get specific product
GET /api/marketplace/products/hansen-security

# Filter by category
GET /api/marketplace/products?category=security
```

---

## 💳 PAYMENT INTEGRATION (Ready)

### **Stripe Setup:**

**Add to .env:**
```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Create checkout session:**
```bash
POST /api/payments/create-session
{
  "moduleId": "hansen-security",
  "plan": "professional",
  "priceId": "price_..."
}
```

**Returns:**
```json
{
  "success": true,
  "sessionId": "cs_..."
}
```

---

## 🔧 DEVELOPMENT

### **Add New Product:**

**1. Update database (Prisma):**
```typescript
await prisma.module.update({
  where: { name: 'your-module' },
  data: {
    public: true,
    metadata: {
      pricing: {
        starter: 999,
        professional: 1999,
        enterprise: 'custom'
      },
      features: ['Feature 1', 'Feature 2'],
      demo: '/your-module/demo',
      docs: '/your-module/docs'
    }
  }
})
```

**2. Product appears automatically in marketplace**

---

## 📊 ADMIN MANAGEMENT

**Dashboard:** `/admin/modules`

**Features:**
- View all modules
- Edit pricing
- Toggle public/private
- View sales stats (when Stripe active)

---

## 🎓 PRICING STRATEGY

### **Suggested Pricing:**

| Module | Free | Starter | Professional | Enterprise |
|--------|------|---------|--------------|------------|
| Security 2.0 | Demo | 999 kr | 1999 kr | Custom |
| Nora AI | Demo | 1499 kr | 2999 kr | Custom |
| CRM 2.0 | Demo | 499 kr | 1499 kr | Custom |
| Content CMS | Demo | 399 kr | 999 kr | Custom |

### **Bundles:**
- **Starter Pack:** Security + CRM = NOK 1,999/mnd (20% rabatt)
- **Pro Pack:** Security + Nora + CRM = NOK 4,999/mnd (30% rabatt)
- **Enterprise:** All modules + support = Custom pricing

---

## 🔐 LICENSE MANAGEMENT

**After purchase (Stripe webhook):**
```typescript
// Auto-create license in database
await prisma.license.create({
  data: {
    moduleId,
    userId,
    plan,
    expiresAt: new Date(Date.now() + 30*24*60*60*1000), // 30 days
    status: 'ACTIVE'
  }
})
```

---

## 📞 SUPPORT

**For purchases:**
- E-post: cato@catohansen.no
- Phone: +47 (ring for demo)

**For technical:**
- Docs: /marketplace/docs
- GitHub: github.com/catohansen

---

## 🎯 ROADMAP

### **Phase 3A (Current):**
- ✅ Marketplace structure
- ✅ Product listing
- ✅ Pricing display
- ⏳ Stripe integration (ready, needs keys)

### **Phase 3B (Next):**
- ⏳ License verification
- ⏳ Auto-renewal
- ⏳ Usage tracking
- ⏳ Analytics dashboard

---

**© 2025 Cato Hansen. All rights reserved.**

**Made with ❤️ in Drøbak, Norway**

