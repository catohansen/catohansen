# Module Management System

**Copyright (c) 2025 Cato Hansen. All rights reserved.**

## Overview

Enterprise-grade module management system for orchestrating monorepo modules with GitHub synchronization, semantic versioning, and automated releases.

## Features

- ✅ **Git Subtree Syncing** - Bidirectional sync between monorepo and GitHub repos
- ✅ **Semantic Versioning** - Auto-bump versions from commit messages (Conventional Commits)
- ✅ **Changelog Generation** - Automatic changelog from git history
- ✅ **GitHub Stats** - Fetch and cache GitHub/NPM statistics
- ✅ **Module Registration** - Auto-detect and register modules from `MODULE_INFO.json`
- ✅ **Release Management** - Create releases with changelogs and Git tags
- ✅ **Health Monitoring** - Track build status, test coverage, dependencies
- ✅ **Admin Dashboard** - Full UI for module management
- ✅ **API Routes** - REST API for all operations
- ✅ **GitHub Actions** - Automated sync and release workflows

## Architecture

```
src/modules/module-management/
├── core/
│   ├── ModuleSyncManager.ts    # Git Subtree sync
│   ├── VersionManager.ts       # Semantic versioning
│   ├── ChangelogGenerator.ts   # Changelog generation
│   ├── GitHubStatsManager.ts   # GitHub/NPM stats
│   ├── ModuleManager.ts        # Central orchestrator
│   └── index.ts                # Exports
└── README.md
```

## Usage

### Register Modules

```typescript
import { moduleManager } from '@/modules/module-management/core'

// Register all modules from src/modules directory
const result = await moduleManager.registerAllModules()
console.log(`Registered: ${result.success}, Failed: ${result.failed}`)
```

### Sync Module to GitHub

```typescript
import { moduleSyncManager } from '@/modules/module-management/core'

// Sync module to GitHub
const result = await moduleSyncManager.syncToGitHub('module-id', {
  force: false,
  commitMessage: 'chore: sync to GitHub'
})
```

### Bump Version

```typescript
import { versionManager } from '@/modules/module-management/core'

// Auto-bump version based on commits
const result = await versionManager.autoBumpVersion('module-id', {
  type: 'auto', // or 'major', 'minor', 'patch'
  createGitTag: true
})
```

### Create Release

```typescript
import { moduleManager } from '@/modules/module-management/core'

// Create release with changelog
const result = await moduleManager.createRelease('module-id', '1.0.0', {
  changelog: '...',
  releaseNotes: 'Major release',
  createGitTag: true,
  publishToNPM: false
})
```

## API Endpoints

- `GET /api/modules` - List all modules
- `GET /api/modules/[moduleId]` - Get module details
- `PATCH /api/modules/[moduleId]` - Update module
- `DELETE /api/modules/[moduleId]` - Delete module
- `POST /api/modules/[moduleId]/sync` - Sync module
- `POST /api/modules/[moduleId]/version` - Bump version
- `POST /api/modules/[moduleId]/release` - Create release
- `POST /api/modules/register` - Register all modules

## Admin Dashboard

Access the module management dashboard at `/admin/modules`.

Features:
- Module overview with stats
- Sync status indicators
- Quick actions (sync, bump version)
- GitHub/NPM statistics
- Filter by sync status
- Module details and history

## GitHub Actions

Workflows are configured in `.github/workflows/`:

- `module-sync.yml` - Auto-sync on module changes
- `module-release.yml` - Manual release creation

## Database Schema

See `prisma/schema.prisma` for:
- `Module` - Module metadata
- `ModuleRelease` - Release history
- `ModuleSync` - Sync history
- `ModuleHealthCheck` - Health metrics
- `ModuleDependency` - Dependency graph
- `GitHubWebhook` - Webhook configuration

## License

PROPRIETARY - Copyright (c) 2025 Cato Hansen. All rights reserved.





