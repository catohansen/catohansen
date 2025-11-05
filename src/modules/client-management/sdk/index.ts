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
 * Hansen CRM SDK
 * Client-side SDK for CRM operations
 * Can be used as standalone NPM package: @hansen-crm/sdk
 */

export { ClientManager } from '../core/ClientManager'
export { LeadManager } from '../core/LeadManager'
export { PipelineManager } from '../core/PipelineManager'
export { CommunicationLogger } from '../core/CommunicationLogger'
export { Communication360 } from '../core/Communication360'
export { AdvancedLeadScoring } from '../core/AdvancedLeadScoring'
export { automationEngine } from '../core/AutomationEngine'
export { TaskManager } from '../core/TaskManager'
export { DocumentManager } from '../core/DocumentManager'
export { ReportingEngine } from '../core/ReportingEngine'
export { AIInsightsEngine } from '../core/AIInsightsEngine'
export { NotificationManager } from '../core/NotificationManager'
export { EmailSystem } from '../core/EmailSystem'

export type {
  ClientData,
  CreateClientInput,
  UpdateClientInput,
  ClientFilters
} from '../core/ClientManager'

export type {
  LeadData,
  CreateLeadInput,
  UpdateLeadInput,
  LeadFilters
} from '../core/LeadManager'

export type {
  PipelineData,
  CreatePipelineInput,
  UpdatePipelineInput,
  PipelineFilters
} from '../core/PipelineManager'

export type {
  CommunicationData,
  CreateCommunicationInput,
  UpdateCommunicationInput,
  CommunicationFilters
} from '../core/CommunicationLogger'

export type {
  CommunicationTimeline,
  CommunicationStats
} from '../core/Communication360'

export type {
  EngagementMetrics,
  FirmographicData,
  LeadScoreFactors
} from '../core/AdvancedLeadScoring'

export type {
  WorkflowTrigger,
  WorkflowAction,
  WorkflowData,
  ExecutionContext
} from '../core/AutomationEngine'

export type {
  TaskData,
  CreateTaskInput,
  UpdateTaskInput,
  TaskFilters
} from '../core/TaskManager'

export type {
  DocumentData,
  CreateDocumentInput,
  UpdateDocumentInput,
  DocumentFilters,
  DocumentTemplate
} from '../core/DocumentManager'

export type {
  ReportConfig,
  ReportResult,
  ChartData
} from '../core/ReportingEngine'

export type {
  AIRecommendation,
  PredictiveAnalysis,
  ContentSuggestion
} from '../core/AIInsightsEngine'

export type {
  NotificationData,
  CreateNotificationInput,
  NotificationFilters
} from '../core/NotificationManager'

export type {
  EmailData,
  CreateEmailInput,
  EmailFilters,
  EmailTemplate,
  EmailAttachment
} from '../core/EmailSystem'

