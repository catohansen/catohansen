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

# 🚀 User Management - Quick Start Guide

## ⚡ 5-Minute Setup

Get started with User Management in just 5 minutes!

### Step 1: Install (Already Done ✅)

The User Management module is already included in this project.

### Step 2: Configure Auth Engine

```typescript
// src/lib/auth/config.ts
import { createAuth } from '@/modules/user-management/core'

export const auth = createAuth({
  emailAndPassword: {
    enabled: true,
  },
  socialAuth: {
    providers: ['google', 'github', 'discord', 'twitter'],
  },
  twoFactor: {
    enabled: true,
  },
  organization: {
    enabled: true,
  },
  session: {
    maxAge: 30, // 30 days
    defaultAge: 7, // 7 days
  },
})
```

### Step 3: Use Pre-built Components

```tsx
// src/app/login/page.tsx
'use client'

import { SignInForm } from '@/modules/user-management/components/SignInForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-8 text-center">Sign In</h1>
        <SignInForm
          socialProviders={['google', 'github']}
          showRememberMe={true}
          onSuccess={(user) => {
            console.log('Signed in:', user)
            window.location.href = '/admin'
          }}
        />
      </div>
    </div>
  )
}
```

### Step 4: Use React Hook (Optional)

```tsx
// src/app/layout.tsx
import { AuthProvider } from '@/modules/user-management/adapters/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

// src/app/admin/page.tsx
'use client'

import { useAuth } from '@/modules/user-management/adapters/react'

export default function AdminPage() {
  const { user, loading, signOut } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Please sign in</div>

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

## 🎯 That's It!

You now have:
- ✅ Email/Password authentication
- ✅ Social login (Google, GitHub, etc.)
- ✅ Session management
- ✅ Pre-built UI components
- ✅ React hooks
- ✅ Framework-agnostic core

## 📚 Learn More

- [Full Documentation](./USER_MANAGEMENT_FULL.md)
- [API Reference](./USER_MANAGEMENT_API.md)
- [Advanced Features](./USER_MANAGEMENT_ADVANCED.md)

---

© 2025 Cato Hansen. All rights reserved.
www.catohansen.no





