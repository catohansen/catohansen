'use client'

import { 
  AlertTriangle,
  Phone,
  Clock,
  Shield,
  Activity,
  FileText,
  Eye,
  Lock
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function IncidentRunbookPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enterprise Incident Runbook</h1>
          <p className="text-gray-600 mt-1">
            Production incident response procedures for Pengeplan 2.0
          </p>
        </div>
        <Badge className="bg-red-100 text-red-800 text-lg px-4 py-2">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Critical Operations
        </Badge>
      </div>

      {/* Emergency Contacts */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-900">
            <Phone className="h-5 w-5" />
            Emergency Contacts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-red-900 mb-3">Primary Response Team:</h4>
              <div className="space-y-2">
                <div className="bg-white rounded-lg p-3 border border-red-200">
                  <div className="font-medium text-gray-900">System Owner</div>
                  <div className="text-sm text-gray-600">Cato Hansen</div>
                  <div className="text-sm text-red-700">cato@catohansen.no</div>
                  <Badge className="bg-red-100 text-red-800 mt-1">24/7 On-Call</Badge>
                </div>
                <div className="bg-white rounded-lg p-3 border border-orange-200">
                  <div className="font-medium text-gray-900">Technical Lead</div>
                  <div className="text-sm text-gray-600">Development Team</div>
                  <div className="text-sm text-orange-700">tech@pengeplan.no</div>
                  <Badge className="bg-orange-100 text-orange-800 mt-1">Business Hours</Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-red-900 mb-3">Escalation Contacts:</h4>
              <div className="space-y-2">
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <div className="font-medium text-gray-900">Security Team</div>
                  <div className="text-sm text-gray-600">External Security Partner</div>
                  <div className="text-sm text-blue-700">security@pengeplan.no</div>
                  <Badge className="bg-blue-100 text-blue-800 mt-1">Critical Only</Badge>
                </div>
                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <div className="font-medium text-gray-900">Legal/Compliance</div>
                  <div className="text-sm text-gray-600">GDPR & AI Act Compliance</div>
                  <div className="text-sm text-purple-700">legal@pengeplan.no</div>
                  <Badge className="bg-purple-100 text-purple-800 mt-1">Data Breaches</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SLO/SLA Targets */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Clock className="h-5 w-5" />
            SLO/SLA Targets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-blue-900 mb-4">Service Level Objectives (SLO):</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">System Availability</span>
                  <Badge className="bg-green-100 text-green-800">99.9%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">API Response Time (P95)</span>
                  <Badge className="bg-blue-100 text-blue-800">≤ 400ms</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Cerbos Authorization</span>
                  <Badge className="bg-purple-100 text-purple-800">≤ 100ms</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">OCR Processing Success</span>
                  <Badge className="bg-orange-100 text-orange-800">≥ 98%</Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-blue-900 mb-4">Response Time Targets:</h4>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-3 border border-red-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Critical (Security)</span>
                    <Badge className="bg-red-100 text-red-800">≤ 15 min</Badge>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-orange-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">High (System Down)</span>
                    <Badge className="bg-orange-100 text-orange-800">≤ 1 hour</Badge>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Medium (Performance)</span>
                    <Badge className="bg-yellow-100 text-yellow-800">≤ 4 hours</Badge>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-green-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Low (Feature)</span>
                    <Badge className="bg-green-100 text-green-800">≤ 24 hours</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Incident Response Procedures */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-900">
            <Activity className="h-5 w-5" />
            Incident Response Procedures
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Critical Incidents */}
          <div>
            <h4 className="font-bold text-orange-900 mb-4">🚨 Critical Security Incidents:</h4>
            <div className="bg-white rounded-lg p-4 border border-red-200">
              <h5 className="font-semibold text-red-900 mb-2">Cerbos PDP Down:</h5>
              <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                <li>Immediate fail-closed - all requests denied</li>
                <li>Alert system owner within 5 minutes</li>
                <li>Display fallback banner in admin interface</li>
                <li>Investigate PDP health and restart if needed</li>
                <li>Document incident and root cause</li>
              </ol>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-orange-900 mb-4">🔐 Security Breach Response:</h4>
            <div className="bg-white rounded-lg p-4 border border-red-200">
              <h5 className="font-semibold text-red-900 mb-2">Unauthorized Admin Access:</h5>
              <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                <li>Immediately revoke all admin sessions</li>
                <li>Block suspicious IP addresses</li>
                <li>Alert system owner and security team</li>
                <li>Review audit logs for breach scope</li>
                <li>Implement additional security measures</li>
                <li>Document and report if required by law</li>
              </ol>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-orange-900 mb-4">🛡️ PII Masking Failure:</h4>
            <div className="bg-white rounded-lg p-4 border border-red-200">
              <h5 className="font-semibold text-red-900 mb-2">Exposed Sensitive Data:</h5>
              <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                <li>Immediately disable guardian access</li>
                <li>Identify scope of data exposure</li>
                <li>Notify affected users within 24 hours</li>
                <li>Report to data protection authority if required</li>
                <li>Implement fix and verify masking</li>
                <li>Conduct post-incident review</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monitoring & Alerts */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <Eye className="h-5 w-5" />
            Monitoring & Alert Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-purple-900 mb-3">Critical Alerts:</h4>
              <div className="space-y-2">
                <div className="bg-white rounded-lg p-3 border border-red-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Failed Admin Logins</span>
                    <Badge className="bg-red-100 text-red-800">&gt;20/5min</Badge>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-orange-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Cerbos Deny Rate</span>
                    <Badge className="bg-orange-100 text-orange-800">&gt;5%/15min</Badge>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">API Latency P95</span>
                    <Badge className="bg-yellow-100 text-yellow-800">&gt;400ms/10min</Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-purple-900 mb-3">Service Alerts:</h4>
              <div className="space-y-2">
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">OCR Error Rate</span>
                    <Badge className="bg-blue-100 text-blue-800">&gt;2%/30min</Badge>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-green-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Agent Failures</span>
                    <Badge className="bg-green-100 text-green-800">&gt;1%/1hour</Badge>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Database Latency</span>
                    <Badge className="bg-purple-100 text-purple-800">&gt;200ms/5min</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Matrix */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Enterprise Risk Matrix
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Risiko</th>
                  <th className="text-left p-3 font-semibold">Sannsynlighet</th>
                  <th className="text-left p-3 font-semibold">Konsekvens</th>
                  <th className="text-left p-3 font-semibold">Tiltak</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-3 font-medium">PDP utilgjengelig</td>
                  <td className="p-3"><Badge className="bg-green-100 text-green-800">Lav</Badge></td>
                  <td className="p-3"><Badge className="bg-red-100 text-red-800">Høy</Badge></td>
                  <td className="p-3 text-gray-600">Fail-closed + alert + fallback-banner</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Brute-force mot admin</td>
                  <td className="p-3"><Badge className="bg-yellow-100 text-yellow-800">Middels</Badge></td>
                  <td className="p-3"><Badge className="bg-yellow-100 text-yellow-800">Middels</Badge></td>
                  <td className="p-3 text-gray-600">Rate-limit + lockout + audit + 2FA</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Feil PII-maskering</td>
                  <td className="p-3"><Badge className="bg-green-100 text-green-800">Lav</Badge></td>
                  <td className="p-3"><Badge className="bg-red-100 text-red-800">Høy</Badge></td>
                  <td className="p-3 text-gray-600">Server-side masking + E2E-test + code-review</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Agent over-rekommanderer</td>
                  <td className="p-3"><Badge className="bg-green-100 text-green-800">Lav</Badge></td>
                  <td className="p-3"><Badge className="bg-yellow-100 text-yellow-800">Middels</Badge></td>
                  <td className="p-3 text-gray-600">Policy-gates + human-approval</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">OCR-driftsavvik</td>
                  <td className="p-3"><Badge className="bg-yellow-100 text-yellow-800">Middels</Badge></td>
                  <td className="p-3"><Badge className="bg-green-100 text-green-800">Lav</Badge></td>
                  <td className="p-3 text-gray-600">Retry + feilmåling + alert ved &gt;2%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Backup & Recovery */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900">
            <FileText className="h-5 w-5" />
            Backup & Recovery Procedures
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-green-900 mb-3">Backup Schedule:</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• <strong>Database:</strong> Daily full backup (30d retention)</li>
                <li>• <strong>Files:</strong> Daily incremental (7d retention)</li>
                <li>• <strong>Configuration:</strong> Weekly full backup</li>
                <li>• <strong>Audit Logs:</strong> Real-time replication</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-green-900 mb-3">Recovery Targets:</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• <strong>RTO (Recovery Time):</strong> ≤ 4 hours</li>
                <li>• <strong>RPO (Data Loss):</strong> ≤ 1 hour</li>
                <li>• <strong>Backup Verification:</strong> Weekly restore test</li>
                <li>• <strong>DR Site:</strong> Cross-region backup available</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Incident Procedures */}
      <Card className="border-violet-200 bg-violet-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-violet-900">
            <Lock className="h-5 w-5" />
            Compliance Incident Procedures
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-bold text-violet-900 mb-3">GDPR Data Breach Response:</h4>
            <div className="bg-white rounded-lg p-4 border border-violet-200">
              <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                <li><strong>Immediate (0-1 hour):</strong> Contain breach, assess scope</li>
                <li><strong>Within 24 hours:</strong> Notify affected users</li>
                <li><strong>Within 72 hours:</strong> Report to data protection authority</li>
                <li><strong>Within 1 week:</strong> Complete investigation and remediation</li>
                <li><strong>Within 1 month:</strong> Conduct post-incident review</li>
              </ol>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-violet-900 mb-3">AI Act Compliance Incident:</h4>
            <div className="bg-white rounded-lg p-4 border border-violet-200">
              <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                <li>Document AI system malfunction or bias</li>
                <li>Implement immediate safeguards</li>
                <li>Review and update risk management procedures</li>
                <li>Report to competent authority if required</li>
                <li>Update AI governance documentation</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Enterprise Incident Runbook</strong> - Last updated: {new Date().toLocaleDateString('nb-NO')}
          </p>
          <p className="text-xs text-gray-500">
            This runbook is reviewed quarterly and updated based on incident learnings and regulatory changes.
          </p>
        </div>
      </div>
    </div>
  )
}
















