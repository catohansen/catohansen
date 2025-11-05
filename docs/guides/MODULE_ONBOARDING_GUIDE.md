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

# 🚀 Module Onboarding Guide

## Overview

The Module Onboarding Wizard is an interactive, step-by-step guide that makes it easy to register new modules in the system. It validates all inputs, checks GitHub repositories, and sets up automatic synchronization.

## Features

- ✅ **Multi-Step Wizard** - Guided 4-step process
- ✅ **Auto-Discovery** - Auto-fills from MODULE_INFO.json
- ✅ **Real-Time Validation** - Validates inputs as you type
- ✅ **GitHub Integration** - Checks repository existence via API
- ✅ **Progress Saving** - Saves progress automatically
- ✅ **Conflict Detection** - Detects potential conflicts
- ✅ **Webhook Auto-Setup** - Automatically configures webhooks

## Step-by-Step Guide

### Step 1: Discovery

**Purpose**: Enter module name and auto-detect information

**What to do**:
1. Enter module name/ID (e.g., `my-awesome-module`)
2. System automatically detects and loads `MODULE_INFO.json` if exists
3. Auto-fills all available fields

**Validation**:
- Module name format: lowercase, alphanumeric with hyphens
- Checks for duplicate module names

### Step 2: Information

**Purpose**: Provide module details

**Required Fields**:
- Module ID (auto-filled)
- Version (semantic versioning: X.Y.Z)
- Description (minimum 10 characters)

**Optional Fields**:
- Display Name
- Category
- Status

**Validation**:
- Semantic versioning format (1.0.0)
- Description length

### Step 3: GitHub Setup

**Purpose**: Connect to GitHub repository

**What to do**:
1. Enter GitHub repository URL (e.g., `https://github.com/owner/repo`)
2. System validates repository existence via GitHub API
3. Automatically sets up webhooks for push, release, and PR events

**Validation**:
- GitHub URL format
- Repository existence check
- Access permissions check

**Auto-Setup**:
- Webhook configuration
- Sync strategy selection
- Branch selection

### Step 4: Review & Confirm

**Purpose**: Review all information before registration

**What to see**:
- Complete module information summary
- GitHub repository status
- Validation status
- Conflict warnings (if any)

**Actions**:
- Review all details
- Confirm registration
- Module is registered and synced

## API Endpoints

### POST /api/modules/onboarding/validate
Validate complete module information

**Request**:
```json
{
  "moduleInfo": {
    "id": "my-module",
    "version": "1.0.0",
    "repository": {
      "url": "https://github.com/owner/repo"
    }
  },
  "moduleName": "my-module"
}
```

**Response**:
```json
{
  "success": true,
  "validation": {
    "valid": true,
    "errors": [],
    "warnings": [],
    "suggestions": []
  }
}
```

### GET /api/modules/onboarding/validate?field=id&value=my-module
Quick validation for single field (real-time)

**Response**:
```json
{
  "success": true,
  "valid": true,
  "message": "Module name is valid"
}
```

### POST /api/modules/onboarding/github-check
Check GitHub repository existence

**Request**:
```json
{
  "url": "https://github.com/owner/repo"
}
```

**Response**:
```json
{
  "success": true,
  "valid": true,
  "exists": true,
  "repo": {
    "owner": "owner",
    "name": "repo"
  }
}
```

### GET /api/modules/onboarding/auto-fill?module=my-module
Auto-fill from MODULE_INFO.json

**Response**:
```json
{
  "success": true,
  "moduleInfo": {
    "id": "my-module",
    "name": "My Module",
    "version": "1.0.0",
    "description": "Module description",
    "repository": {
      "url": "https://github.com/owner/repo"
    }
  }
}
```

### POST /api/modules/onboarding/setup
Complete module registration

**Request**:
```json
{
  "moduleInfo": {
    "id": "my-module",
    "version": "1.0.0",
    "repository": {
      "url": "https://github.com/owner/repo"
    }
  },
  "moduleName": "my-module"
}
```

**Response**:
```json
{
  "success": true,
  "moduleId": "module-id",
  "webhookId": "webhook-id",
  "message": "Module registered successfully"
}
```

## Validation Rules

### Module ID
- Format: lowercase, alphanumeric with hyphens
- Length: 3-50 characters
- Must be unique
- Examples: ✅ `my-module`, ❌ `My_Module`, ❌ `my.module`

### Version
- Format: Semantic Versioning (X.Y.Z)
- Optional: Pre-release and build metadata
- Examples: ✅ `1.0.0`, ✅ `1.0.0-alpha`, ❌ `1.0`, ❌ `v1.0.0`

### GitHub Repository
- Format: `https://github.com/owner/repo`
- Repository must exist and be accessible
- If private: Requires `GITHUB_TOKEN`

## Troubleshooting

### Module name already exists
**Solution**: Choose a different module name

### GitHub repository not found
**Solution**: 
1. Check repository URL format
2. Verify repository exists
3. If private: Configure `GITHUB_TOKEN`

### Validation fails
**Solution**: Check all required fields and follow format guidelines

## Best Practices

1. **Use MODULE_INFO.json**: Always create MODULE_INFO.json in your module directory for auto-discovery
2. **Follow naming conventions**: Use lowercase, hyphen-separated module names
3. **Semantic versioning**: Always use semantic versioning for versions
4. **Complete descriptions**: Provide detailed descriptions (minimum 10 characters)
5. **GitHub integration**: Always connect to GitHub for automatic sync

## Next Steps

After onboarding:
1. ✅ Module is registered in the system
2. ✅ Webhook is configured (if GitHub repo provided)
3. ✅ Initial sync is queued
4. ✅ Health monitoring is activated
5. ✅ Module appears in admin dashboard

## Support

For issues or questions:
- Check validation errors in the wizard
- Review module information
- Contact: cato@catohansen.no





