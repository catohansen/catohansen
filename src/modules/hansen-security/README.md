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

# Hansen Security Module

Fine-grained authorization system built by Cato Hansen Agency. Policy-based access control with RBAC and ABAC support.

**This is our own implementation** - not based on Cerbos, but inspired by modern authorization patterns.

## Features

- ✅ Policy-based authorization
- ✅ RBAC (Role-Based Access Control)
- ✅ ABAC (Attribute-Based Access Control)
- ✅ Audit logging
- ✅ Policy versioning
- ✅ Deny by default

## Usage

### Server-side

```typescript
import { policyEngine } from '@/modules/hansen-security/core/PolicyEngine'

const principal = {
  id: 'user-123',
  roles: ['EDITOR'],
  attributes: {}
}

const resource = {
  kind: 'content',
  id: 'post-456',
  attributes: {}
}

const allowed = await policyEngine.evaluate(principal, resource, 'write')
```

### Client-side (via SDK)

```typescript
import { hansenSecurity } from '@/modules/hansen-security/sdk'

const result = await hansenSecurity.check(
  principal,
  resource,
  'write'
)

if (result.allowed) {
  // Allow action
}
```

## API Routes

- `POST /api/modules/hansen-security/check` - Check single action
- `POST /api/modules/hansen-security/check-multiple` - Check multiple actions

## License

**PROPRIETARY** - Copyright (c) 2025 Cato Hansen. All rights reserved.

Unauthorized copying, modification, distribution, or use of this software is strictly prohibited without express written permission from Cato Hansen.

