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

# 🔐 Hansen Auth - Complete Documentation

**Modern authentication framework for TypeScript**

Inspired by [Better Auth](https://www.better-auth.com), enhanced with enterprise features.

---

## 📚 Table of Contents

1. [Quick Start](#quick-start)
2. [Features](#features)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Usage](#usage)
6. [OAuth Providers](#oauth-providers)
7. [Plugin System](#plugin-system)
8. [Framework Adapters](#framework-adapters)
9. [API Reference](#api-reference)
10. [Examples](#examples)

---

## ⚡ Quick Start

### 5-Minute Setup

```typescript
// 1. Install
npm install @catohansen/hansen-auth

// 2. Configure
import { createAuth } from '@catohansen/hansen-auth'

export const auth = createAuth({
  emailAndPassword: {
    enabled: true,
  },
  socialAuth: {
    providers: ['google', 'github'],
  },
  session: {
    maxAge: 30, // 30 days
    defaultAge: 7, // 7 days
  },
})

// 3. Use pre-built components
import { SignInForm } from '@catohansen/hansen-auth/react'

<SignInForm
  socialProviders={['google', 'github']}
  onSuccess={(user) => console.log('Signed in:', user)}
/>
```

---

## 🎯 Features

### Core Features
- ✅ **Email/Password Authentication** - Secure with bcrypt hashing
- ✅ **Social Sign-on** - OAuth (Google, GitHub, Discord, Twitter)
- ✅ **Two-Factor Authentication** - TOTP-based 2FA
- ✅ **Session Management** - Flexible sessions with remember-me
- ✅ **Account Security** - Account locking, failed login tracking
- ✅ **Framework Agnostic** - Works with React, Vue, Svelte, Next.js
- ✅ **TypeScript First** - Full type safety
- ✅ **Plugin System** - Extensible architecture

### Enterprise Features
- ✅ **Advanced RBAC** - Hierarchical roles, granular permissions
- ✅ **Policy Engine Integration** - Hansen Security integration
- ✅ **Audit Logging** - Complete audit trail
- ✅ **Multi-tenant Support** - Tenant isolation
- ✅ **Compliance** - SOC2, ISO27001, GDPR ready

---

## 📦 Installation

```bash
npm install @catohansen/hansen-auth
# or
yarn add @catohansen/hansen-auth
# or
pnpm add @catohansen/hansen-auth
```

---

## ⚙️ Configuration

### Basic Configuration

```typescript
import { createAuth } from '@catohansen/hansen-auth'

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
    maxAge: 30, // 30 days max
    defaultAge: 7, // 7 days default
  },
})
```

### OAuth Configuration

```typescript
import { createAuth, createOAuthProvider } from '@catohansen/hansen-auth'

const auth = createAuth({
  socialAuth: {
    providers: ['google', 'github', 'discord', 'twitter'],
  },
})

// Configure OAuth providers
auth.setOAuthConfig({
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    redirectUri: 'http://localhost:3000/api/auth/google/callback',
    scopes: ['openid', 'email', 'profile'],
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    redirectUri: 'http://localhost:3000/api/auth/github/callback',
    scopes: ['user:email'],
  },
  discord: {
    clientId: process.env.DISCORD_CLIENT_ID!,
    clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    redirectUri: 'http://localhost:3000/api/auth/discord/callback',
    scopes: ['identify', 'email'],
  },
  twitter: {
    clientId: process.env.TWITTER_CLIENT_ID!,
    clientSecret: process.env.TWITTER_CLIENT_SECRET!,
    redirectUri: 'http://localhost:3000/api/auth/twitter/callback',
    scopes: ['tweet.read', 'users.read', 'offline.access'],
  },
})
```

---

## 🚀 Usage

### React

```tsx
import { AuthProvider, useAuth } from '@catohansen/hansen-auth/react'

// Wrap your app
<AuthProvider>
  <App />
</AuthProvider>

// Use in components
function MyComponent() {
  const { user, loading, signIn, signOut } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!user) return <SignInForm />

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

### Vue

```vue
<script setup>
import { useAuth } from '@catohansen/hansen-auth/vue'

const { user, loading, signIn, signOut, isAuthenticated } = useAuth()
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="!isAuthenticated">
    <SignInForm />
  </div>
  <div v-else>
    <h1>Welcome, {{ user?.name }}</h1>
    <button @click="signOut">Sign Out</button>
  </div>
</template>
```

### Svelte

```svelte
<script>
  import { useAuth } from '@catohansen/hansen-auth/svelte'
  
  const { user, loading, signIn, signOut, isAuthenticated } = useAuth()
</script>

{#if $loading}
  <div>Loading...</div>
{:else if !$isAuthenticated}
  <SignInForm />
{:else}
  <h1>Welcome, {$user?.name}</h1>
  <button on:click={signOut}>Sign Out</button>
{/if}
```

---

## 🔗 OAuth Providers

### Supported Providers
- **Google** - OAuth 2.0
- **GitHub** - OAuth 2.0
- **Discord** - OAuth 2.0
- **Twitter** - OAuth 2.0

### Setup

1. **Create OAuth App** on provider's developer portal
2. **Get Credentials** (Client ID, Client Secret)
3. **Configure Redirect URI** (e.g., `http://localhost:3000/api/auth/google/callback`)
4. **Add to Environment Variables**:
   ```bash
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_SECRET=your_client_secret
   # ... etc
   ```

### Usage

```tsx
import { LoginButton } from '@catohansen/hansen-auth/react'

<LoginButton
  provider="google"
  onClick={() => window.location.href = '/api/auth/google'}
/>
```

---

## 🔌 Plugin System

### Creating a Plugin

```typescript
import type { AuthPlugin } from '@catohansen/hansen-auth'

const myPlugin: AuthPlugin = {
  name: 'my-plugin',
  version: '1.0.0',
  description: 'My custom plugin',
  hooks: {
    beforeSignIn: async (input) => {
      // Modify input before sign in
      console.log('Before sign in:', input)
      return input
    },
    afterSignIn: async (result) => {
      // Handle successful sign in
      console.log('After sign in:', result)
    },
  },
}

// Register plugin
auth.use(myPlugin)
```

### Example: Rate Limiting Plugin

```typescript
import { createRateLimitingPlugin } from '@catohansen/hansen-auth/plugins'

auth.use(createRateLimitingPlugin({
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
  blockDurationMs: 30 * 60 * 1000, // 30 minutes
}))
```

---

## 🔌 Framework Adapters

### React

```tsx
import { AuthProvider, useAuth } from '@catohansen/hansen-auth/react'

const { user, loading, signIn, signUp, signOut } = useAuth()
```

### Vue

```typescript
import { useAuth } from '@catohansen/hansen-auth/vue'

const { user, loading, signIn, signUp, signOut, isAuthenticated } = useAuth()
```

### Svelte

```typescript
import { useAuth } from '@catohansen/hansen-auth/svelte'

const { user, loading, signIn, signUp, signOut, isAuthenticated } = useAuth()
```

---

## 📡 API Reference

### Auth Engine

```typescript
class AuthEngine {
  signIn(input: SignInInput, context?: Context): Promise<AuthResult>
  signUp(input: SignUpInput, context?: Context): Promise<AuthResult>
  signOut(sessionToken: string): Promise<{ success: boolean }>
  verifySession(sessionToken: string): Promise<SessionResult>
  getOAuthUrl(provider: OAuthProviderName): Promise<string>
  handleOAuthCallback(...): Promise<AuthResult>
  use(plugin: AuthPlugin): void
}
```

### API Routes

- `POST /api/modules/user-management/auth/signin` - Sign in
- `POST /api/modules/user-management/auth/signup` - Sign up
- `POST /api/modules/user-management/auth/signout` - Sign out
- `GET /api/modules/user-management/auth/session` - Verify session
- `GET /api/modules/user-management/auth/[provider]` - OAuth authorization
- `GET /api/modules/user-management/auth/[provider]/callback` - OAuth callback

---

## 📖 Examples

### Custom Sign In Page

```tsx
import { SignInForm } from '@catohansen/hansen-auth/react'

export default function CustomLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-8 text-center">Sign In</h1>
        <SignInForm
          socialProviders={['google', 'github', 'discord']}
          showRememberMe={true}
          onSuccess={(user) => {
            console.log('Signed in:', user)
            window.location.href = '/admin'
          }}
          onError={(error) => {
            console.error('Sign in error:', error)
          }}
        />
      </div>
    </div>
  )
}
```

---

## 🆚 Comparison with Better Auth

| Feature | Better Auth | Hansen Auth | Status |
|---------|------------|-------------|--------|
| Email/Password | ✅ | ✅ | ✅ |
| OAuth | ✅ | ✅ | ✅ |
| 2FA | ✅ | ✅ | ✅ |
| Plugin System | ✅ | ✅ | ✅ |
| Framework Agnostic | ✅ | ✅ | ✅ |
| TypeScript | ✅ | ✅ | ✅ |
| **Advanced RBAC** | ❌ | ✅ | ✅ **Better** |
| **Policy Engine** | ❌ | ✅ | ✅ **Better** |
| **Audit Logging** | ❌ | ✅ | ✅ **Better** |
| **Compliance** | ❌ | ✅ | ✅ **Better** |
| **Modular** | ❌ | ✅ | ✅ **Better** |

---

## 📚 Learn More

- [Quick Start Guide](./USER_MANAGEMENT_QUICK_START.md)
- [Comparison with Better Auth](./USER_MANAGEMENT_COMPARISON.md)
- [API Documentation](./USER_MANAGEMENT_API.md)
- [Plugin Development Guide](./PLUGIN_DEVELOPMENT.md)

---

© 2025 Cato Hansen. All rights reserved.
www.catohansen.no





