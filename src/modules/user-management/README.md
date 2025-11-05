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

# 🔐 User Management Module - Modern Authentication & Advanced RBAC

## ✅ Ekstremt Avansert Bruker- og Rolle-System

Dette er en **produksjonsklar, modulær** bruker- og rolle-administrasjons-modul som kan:
- ✅ Ekstrakteres som standalone modul
- ✅ Publiseres som NPM package
- ✅ Brukes i andre prosjekter
- ✅ Selges som separat produkt
- ✅ **Modernisert med Better Auth-inspirert API** 🚀

---

## 🎯 Features

### 1. Modern Authentication (Better Auth Style) ✅ NEW!
- ✅ **AuthEngine** - Framework-agnostic auth engine
- ✅ **Simple API** - `auth.signIn()`, `auth.signUp()`, `auth.signOut()`
- ✅ **Pre-built Components** - `LoginButton`, `SignInForm`, `SignUpForm`
- ✅ **React Hooks** - `useAuth()` hook for React apps
- ✅ **TypeScript-first** - Full type safety

### 2. User Management
- ✅ User CRUD operations
- ✅ Email verification
- ✅ Password hashing (bcrypt)
- ✅ 2FA support
- ✅ Account locking
- ✅ Multi-tenant support
- ✅ Status management (ACTIVE, SUSPENDED, PENDING_VERIFICATION, etc.)

### 2. Advanced RBAC (Role-Based Access Control)
- ✅ **Hierarkiske roller** - Roller kan arve permissions fra parent-roller
- ✅ **Granulære permissions** - Resource.action pattern (e.g. "project.create")
- ✅ **Direct user permissions** - Assign permissions directly to users
- ✅ **Role permissions** - Assign permissions via roles
- ✅ **Group permissions** - Assign permissions via groups
- ✅ **Resource-specific roles** - Different roles on different resources
- ✅ **Permission inheritance** - Permissions inherited through role hierarchy
- ✅ **Expiration support** - Roles and permissions can expire

### 3. Group Management
- ✅ Team/Department/Organization support
- ✅ Group roles
- ✅ Group permissions
- ✅ User-group assignments

### 4. Multi-Tenant Support
- ✅ Tenant isolation
- ✅ Tenant-specific roles
- ✅ Tenant-specific permissions
- ✅ Tenant-specific groups

---

## 📁 Module Structure

```
src/modules/user-management/
├── core/
│   ├── AuthEngine.ts       # ✅ NEW: Modern auth engine (Better Auth style)
│   ├── index.ts            # ✅ NEW: Core exports
│   ├── UserManager.ts      # User CRUD operations
│   ├── RoleManager.ts      # Role management
│   ├── PermissionManager.ts # Permission management
│   └── RBACEngine.ts       # Access control engine
├── api/
│   └── auth/
│       ├── signin/         # ✅ NEW: Sign in endpoint
│       ├── signup/         # ✅ NEW: Sign up endpoint
│       ├── signout/        # ✅ NEW: Sign out endpoint
│       └── session/       # ✅ NEW: Session verification
├── components/
│   ├── LoginButton.tsx     # ✅ NEW: Social login button
│   ├── SignInForm.tsx      # ✅ NEW: Sign in form
│   └── SignUpForm.tsx      # ✅ NEW: Sign up form
├── adapters/
│   └── react.tsx           # ✅ NEW: React adapter with useAuth hook
├── dashboard/
│   └── [Admin dashboard]
└── sdk/
    └── index.ts            # External SDK
```

---

## 🚀 Usage

### Quick Start (5 Minutes) ✅ NEW!

```typescript
// Step 1: Import and configure
import { createAuth } from '@/modules/user-management/core'

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

// Step 2: Use in your API
import { auth } from '@/modules/user-management/core'

// Sign in
const result = await auth.signIn({
  email: 'user@example.com',
  password: 'secure-password',
  rememberMe: true,
})

if (result.success) {
  console.log('User:', result.user)
  console.log('Session:', result.session)
}

// Step 3: Use pre-built components
import { SignInForm } from '@/modules/user-management/components/SignInForm'

<SignInForm
  socialProviders={['google', 'github']}
  onSuccess={(user) => console.log('Signed in:', user)}
/>
```

### React Hook Usage ✅ NEW!

```typescript
// Wrap your app
import { AuthProvider } from '@/modules/user-management/adapters/react'

<AuthProvider>
  <YourApp />
</AuthProvider>

// Use in components
import { useAuth } from '@/modules/user-management/adapters/react'

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

### Basic User Management

```typescript
import { userManager } from '@/modules/user-management/core'

// Create user
const user = await userManager.createUser({
  email: 'user@example.com',
  name: 'John Doe',
  password: 'secure-password',
  role: 'EDITOR',
})

// Get user
const foundUser = await userManager.getUserById(user.id)

// Update user
await userManager.updateUser(user.id, {
  name: 'John Updated',
  role: 'ADMIN',
})
```

### Advanced RBAC

```typescript
import { rbacEngine } from '@/modules/user-management/core/RBACEngine'

// Check access
const decision = await rbacEngine.checkAccess({
  userId: 'user-id',
  resource: 'project',
  action: 'create',
  resourceId: 'project-id', // Optional: resource-specific
})

if (decision.allowed) {
  // User has access
  console.log('Reason:', decision.reason)
  console.log('Roles:', decision.roles)
  console.log('Permissions:', decision.permissions)
}
```

### Role Management

```typescript
import { roleManager } from '@/modules/user-management/core/RoleManager'

// Create role
const role = await roleManager.createRole({
  name: 'Content Editor',
  slug: 'content-editor',
  description: 'Can create and edit content',
  level: 5,
  permissions: ['project.create', 'project.update', 'project.read'],
})

// Assign role to user
await roleManager.assignRoleToUser(userId, role.id)
```

### Permission Management

```typescript
import { permissionManager } from '@/modules/user-management/core/PermissionManager'

// Create permission
const permission = await permissionManager.createPermission({
  name: 'project.delete',
  resource: 'project',
  action: 'DELETE',
  description: 'Delete projects',
  category: 'content',
})

// Check if user has permission
const hasPermission = await permissionManager.userHasPermission(
  userId,
  'project.delete'
)
```

---

## 📊 Database Schema

### Key Models

1. **User** - Users with multi-tenant support
2. **Role** - Roles with hierarchy and permissions
3. **Permission** - Granular permissions (resource.action)
4. **Group** - User groups (Team, Department, Organization)
5. **UserRole** - User-role assignments
6. **UserPermission** - Direct user permissions
7. **RolePermission** - Role-permission assignments
8. **GroupRole** - Group-role assignments
9. **RoleHierarchy** - Role inheritance
10. **RoleAssignment** - Resource-specific roles

---

## 🔐 Security Features

- ✅ Password hashing (bcrypt, 12 rounds)
- ✅ Email verification
- ✅ 2FA support (TOTP)
- ✅ Account locking (after failed attempts)
- ✅ Session management
- ✅ Audit logging
- ✅ Permission expiration
- ✅ Role expiration

---

## 📦 Module as Product

Dette modulen kan selges som:
- **Standalone SaaS** - User management as a service
- **NPM Package** - `@catohansen/user-management`
- **White-label** - Branded for partners
- **Enterprise License** - Custom implementations

---

## 🎯 Next Steps

1. ✅ Database schema er klar
2. ✅ Core managers er implementert
3. ⏳ API routes (under development)
4. ⏳ Admin dashboard UI (under development)
5. ⏳ SDK export (under development)

---

© 2025 Cato Hansen. All rights reserved.
www.catohansen.no



