'use client'

import { useState, useEffect } from 'react'
import { 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  BarChart3,
  Download,
  Eye,
  Calendar
} from 'lucide-react';
import Link from 'next/link';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { SimpleNewReportModal } from './parts/SimpleNewReportModal';

export default function QAAdminPage() {
  const [mounted, setMounted] = useState(false);
  
  const qaReports = [
    {
      id: 'admin-system-test',
      title: 'Admin System Test Report',
      description: 'Fullstendig test av admin systemet med sikkerhet, funksjonalitet og performance',
      status: 'completed',
      date: '2024-01-15',
      file: '/api/admin/qa/reports/ADMIN_SYSTEM_TEST_REPORT.md',
      tests: 20,
      passed: 20,
      failed: 0
    },
    {
      id: 'security-build-health',
      title: 'Security & Build Health Report',
      description: 'Omfattende rapport om sikkerhetstiltak og build monitoring system',
      status: 'completed',
      date: '2024-01-14',
      file: '/api/admin/qa/reports/QA_REPORT_SECURITY_AND_BUILD_HEALTH.md',
      tests: 15,
      passed: 15,
      failed: 0
    },
    {
      id: 'sprint2-verdiboostere',
      title: 'Sprint 2 Verdiboostere QA',
      description: 'QA-rapport for alle Sprint 2 funksjoner og moduler',
      status: 'completed',
      date: '2024-01-13',
      file: '/api/admin/qa/reports/QA_REPORT_SPRINT2.md',
      tests: 8,
      passed: 8,
      failed: 0
    },
    {
      id: 'expert-test-report',
      title: 'Expert Test Report',
      description: 'Omfattende eksperttest av hele Pengeplan systemet',
      status: 'completed',
      date: '2024-01-12',
      file: '/api/admin/qa/reports/PENGEPLAN_EXPERT_TESTREPORT.md',
      tests: 25,
      passed: 24,
      failed: 1
    }
  ];

  useEffect(() => {
    setMounted(true);
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'in-progress': return 'text-yellow-600 bg-yellow-50';
      case 'failed': return 'text-red-600 bg-red-50';

      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in-progress': return <AlertTriangle className="h-4 w-4" />;
      case 'failed': return <AlertTriangle className="h-4 w-4" />;

      default: return <FileText className="h-4 w-4" />;
    }
  };

  const totalTests = qaReports.reduce((sum, report) => sum + report.tests, 0);
  const totalPassed = qaReports.reduce((sum, report) => sum + report.passed, 0);
  const totalFailed = qaReports.reduce((sum, report) => sum + report.failed, 0);
  const successRate = totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0;

  if (!mounted) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">QA & Testing Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Oversikt over alle QA-rapporter og testresultater
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTests}</div>
            <p className="text-xs text-gray-500">Alle test suites</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Passed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalPassed}</div>
            <p className="text-xs text-gray-500">Bestått</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalFailed}</div>
            <p className="text-xs text-gray-500">Feilet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{successRate}%</div>
            <p className="text-xs text-gray-500">Bestått rate</p>
          </CardContent>
        </Card>
      </div>

      {/* QA Reports */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">QA Rapporter</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
            <Button
              size="sm" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg"
              onClick={() => {
                // Show beautiful notification,

                const notification = document.createElement('div');
                notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-4 rounded-lg shadow-xl z-50 flex items-center gap-3 max-w-md'
                notification.innerHTML = `
                  <div class="flex-shrink-0">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold">New Report Funksjonalitet</h4>
                    <p class="text-sm opacity-90">Funksjonen kommer snart med flotte test maler!</p>
                  </div>
                `
                document.body.appendChild(notification);
                // Remove after 5 seconds
                setTimeout(() => {
                  if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                  }
                }, 5000)
              }}
            >
              <FileText className="h-4 w-4 mr-2" />
              New Report
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {qaReports.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(report.status)}
                    <div>
                      <CardTitle className="text-lg">{report.title}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{report.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{report.tests} tests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">{report.passed} passed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-red-600">{report.failed} failed</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Link href={report.file}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Report;
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download;
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <BarChart3 className="h-6 w-6" />
              <span>Run System Tests</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <CheckCircle className="h-6 w-6" />
              <span>Security Scan</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <FileText className="h-6 w-6" />
              <span>Generate Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
