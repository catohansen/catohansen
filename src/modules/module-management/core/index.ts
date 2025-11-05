/**
 * Copyright (c) 2025 Cato Hansen. All rights reserved.
 * 
 * Proprietary - Unauthorized copying, modification, distribution, or use
 * of this software, via any medium is strictly prohibited without express
 * written permission from Cato Hansen.
 * 
 * @license PROPRIETARY
 * SPDX-License-Identifier: PROPRIETARY
 * @author Cato Hansen
 * @contact cato@catohansen.no
 * @website www.catohansen.no
 */

/**
 * Module Management Core
 * Central exports for all module management functionality
 */

export { ModuleSyncManager, moduleSyncManager, createModuleSyncManager } from './ModuleSyncManager'
export type { SyncResult, SyncOptions } from './ModuleSyncManager'
// ModuleInfo is exported separately to avoid conflicts

export { VersionManager, versionManager, createVersionManager } from './VersionManager'
export type { VersionBumpResult, VersionBumpOptions } from './VersionManager'

export { ChangelogGenerator, changelogGenerator, createChangelogGenerator } from './ChangelogGenerator'
export type { Changelog, ChangelogEntry, ChangelogOptions } from './ChangelogGenerator'

export { GitHubStatsManager, githubStatsManager, createGitHubStatsManager } from './GitHubStatsManager'
export type { GitHubStats, NPMStats } from './GitHubStatsManager'

export { ModuleManager, moduleManager, createModuleManager } from './ModuleManager'
export type { ModuleRegistration, ModuleHealth } from './ModuleManager'

export { GitHubWebhookManager, githubWebhookManager, createGitHubWebhookManager } from './GitHubWebhookManager'
export type { WebhookSetupOptions, WebhookVerificationResult } from './GitHubWebhookManager'

export { SyncQueueManager, syncQueueManager, createSyncQueueManager } from './SyncQueueManager'
export type { SyncJob, QueueStats } from './SyncQueueManager'

export { VulnerabilityScanner, vulnerabilityScanner, createVulnerabilityScanner } from './VulnerabilityScanner'
export type { Vulnerability, ScanResult } from './VulnerabilityScanner'

export { ConflictDetector, conflictDetector, createConflictDetector } from './ConflictDetector'
export type { Conflict, ConflictAnalysis } from './ConflictDetector'

export { SmartCacheManager, smartCacheManager, createSmartCacheManager } from './SmartCacheManager'
export type { CacheConfig } from './SmartCacheManager'

export { ModuleValidator, moduleValidator, createModuleValidator } from './ModuleValidator'
export type { ValidationResult, ValidationError, ValidationWarning, ModuleInfo } from './ModuleValidator'

export { OnboardingStateManager, onboardingStateManager, createOnboardingStateManager } from './OnboardingState'
export type { OnboardingState, OnboardingStep } from './OnboardingState'

export { autoSyncManager, createAutoSyncManager } from './AutoSyncManager'
export type { AutoSyncResult } from './AutoSyncManager'

