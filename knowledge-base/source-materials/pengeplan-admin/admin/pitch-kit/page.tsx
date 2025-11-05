'use client';

import React, { useState } from 'react';
import { 
  Download, 
  FileText,
  Shield,
  BarChart3, 
  Users,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Globe,
  Lock,
  Eye,
  Brain,
  Zap,
  Star,
  Award,
  Target,
  Rocket
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface ComplianceMetrics {
  overallScore: number;
  policiesActive: number;
  policiesTotal: number;
  riskAreas: number;
  lastAudit: string;
  nextAudit: string;
  complianceFramework: string;
  certifications: string[];
}

interface InvestorMetrics {
  totalUsers: number;
  activeUsers: number;
  revenue: number;
  growthRate: number;
  churnRate: number;
  customerSatisfaction: number;
  marketSize: number;
  competitiveAdvantage: string[];
}

export default function PitchKitPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock compliance metrics
  const complianceMetrics: ComplianceMetrics = {
    overallScore: 89,
    policiesActive: 4,
    policiesTotal: 5,
    riskAreas: 1,
    lastAudit: '2025-09-21',
    nextAudit: '2025-12-21',
    complianceFramework: 'EU AI Act + Norwegian AI Guidelines',
    certifications: ['GDPR Compliant', 'ISO 27001 Ready', 'SOC 2 Type II']
  };

  // Mock investor metrics
  const investorMetrics: InvestorMetrics = {
    totalUsers: 1250,
    activeUsers: 980,
    revenue: 1250000, // 1.25M NOK
    growthRate: 45,
    churnRate: 8,
    customerSatisfaction: 4.7,
    marketSize: 5000000, // 5M NOK
    competitiveAdvantage: [
      'AI-first approach with explainable decisions',
      'Comprehensive compliance framework',
      'Norwegian market expertise',
      'Guardian/Verge integration for vulnerable users',
      'Real-time financial coaching'
    ]
  };

  const handleExportWhitepaper = async (format: 'pdf' | 'json') => {
    setIsGenerating(true);
    try {
      // Simulate generation time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would generate the actual whitepaper
      const whitepaperData = {
        title: 'Pengeplan 2.0 - AI & Compliance Whitepaper',
        version: '1.0',
        generatedAt: new Date().toISOString(),
        compliance: complianceMetrics,
        investor: investorMetrics,
        executiveSummary: 'Pengeplan 2.0 represents the next generation of financial management tools, combining AI-powered insights with comprehensive compliance frameworks to serve Norwegian families and vulnerable users.',
        keyFeatures: [
          'AI-powered budget analysis and recommendations',
          'Debt payoff optimization with snowball/avalanche strategies',
          'Motivational coaching with NLP techniques',
          'Guardian/Verge integration for vulnerable users',
          'Comprehensive audit trails and compliance reporting',
          'Real-time financial health monitoring'
        ],
        marketOpportunity: {
          size: '5M NOK Norwegian personal finance market',
          growth: '15% annual growth rate',
          target: 'Families, vulnerable users, and financial advisors',
          differentiation: 'AI-first approach with Norwegian compliance'
        },
        technologyStack: [
          'Next.js 14 with TypeScript',
          'Prisma ORM with SQLite/PostgreSQL',
          'Cerbos for role-based access control',
          'SWR for data fetching and caching',
          'Tailwind CSS for responsive design',
          'Playwright + Cypress for E2E testing'
        ],
        complianceFramework: {
          standards: ['EU AI Act', 'Norwegian AI Guidelines', 'GDPR'],
          policies: [
            'AI Ethics Framework v2.1',
            'Data Privacy & Protection Policy',
            'AI Transparency & Explainability',
            'AI Safety & Risk Management',
            'EU AI Act Compliance'
          ],
          governance: {
            board: 'AI Governance Board with external advisors',
            review: 'Quarterly compliance reviews',
            audit: 'Annual third-party audits',
            training: 'Regular staff training on AI ethics'
          }
        }
      };

      if (format === 'json') {
        const blob = new Blob([JSON.stringify(whitepaperData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pengeplan-ai-compliance-whitepaper-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        // For PDF, we would use a library like jsPDF or puppeteer
        // For now, we'll create a simple text-based "PDF"
        const pdfContent = generatePDFContent(whitepaperData);
        const blob = new Blob([pdfContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pengeplan-ai-compliance-whitepaper-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error generating whitepaper:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePDFContent = (data: any): string => {
    return `
PENGEPLAN 2.0 - AI & COMPLIANCE WHITEPAPER
Generated: ${new Date(data.generatedAt).toLocaleDateString()}
Version: ${data.version}

EXECUTIVE SUMMARY
${data.executiveSummary}

COMPLIANCE METRICS
- Overall Compliance Score: ${data.compliance.overallScore}%
- Active Policies: ${data.compliance.policiesActive}/${data.compliance.policiesTotal}
- Risk Areas: ${data.compliance.riskAreas}
- Last Audit: ${data.compliance.lastAudit}
- Next Audit: ${data.compliance.nextAudit}
- Framework: ${data.compliance.complianceFramework}

INVESTOR METRICS
- Total Users: ${data.investor.totalUsers.toLocaleString()}
- Active Users: ${data.investor.activeUsers.toLocaleString()}
- Revenue: ${data.investor.revenue.toLocaleString()} NOK
- Growth Rate: ${data.investor.growthRate}%
- Churn Rate: ${data.investor.churnRate}%
- Customer Satisfaction: ${data.investor.customerSatisfaction}/5

KEY FEATURES
${data.keyFeatures.map((feature: string, index: number) => `${index + 1}. ${feature}`).join('\n')}

COMPETITIVE ADVANTAGES
${data.investor.competitiveAdvantage.map((advantage: string, index: number) => `${index + 1}. ${advantage}`).join('\n')}

TECHNOLOGY STACK
${data.technologyStack.map((tech: string, index: number) => `${index + 1}. ${tech}`).join('\n')}

COMPLIANCE FRAMEWORK
Standards: ${data.complianceFramework.standards.join(', ')}
Policies: ${data.complianceFramework.policies.length} active policies
Governance: ${data.complianceFramework.governance.board}

MARKET OPPORTUNITY
Size: ${data.marketOpportunity.size}
Growth: ${data.marketOpportunity.growth}
Target: ${data.marketOpportunity.target}
Differentiation: ${data.marketOpportunity.differentiation}

This whitepaper demonstrates Pengeplan 2.0's commitment to responsible AI
development and comprehensive compliance with Norwegian and EU regulations.

For questions or clarifications, contact the AI Governance Board.
    `.trim();
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pitch Kit & Compliance Whitepaper</h1>
        <p className="text-gray-600">Investor-ready dokumentasjon og AI compliance-rapporter</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-600">Compliance Score</p>
                <p className="text-2xl font-bold text-green-600">{complianceMetrics.overallScore}%</p>
            </div>
              <Shield className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-blue-600">{investorMetrics.activeUsers.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                <p className="text-2xl font-bold text-purple-600">{investorMetrics.growthRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Customer Rating</p>
                <p className="text-2xl font-bold text-yellow-600">{investorMetrics.customerSatisfaction}/5</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
          </div>
        </CardContent>
      </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="investor">Investor Metrics</TabsTrigger>
          <TabsTrigger value="whitepaper">Whitepaper</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Company Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5" />
                  Pengeplan 2.0 - Company Overview
                </CardTitle>
        </CardHeader>
              <CardContent className="space-y-4">
              <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Mission:</span>
                    <span>Gjør Økonomi Gøy for Hele Familien! 🎉</span>
                </div>
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">Vision:</span>
                    <span>AI-powered financial freedom for all Norwegians</span>
                </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Market:</span>
                    <span>Norwegian personal finance market (5M NOK)</span>
                </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Key Differentiators:</h4>
                  <ul className="space-y-1">
                    {investorMetrics.competitiveAdvantage.map((advantage, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{advantage}</span>
                      </li>
                    ))}
                  </ul>
          </div>
        </CardContent>
      </Card>

            {/* Technology Stack */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Technology Stack
                </CardTitle>
        </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-semibold text-blue-800">Frontend</div>
                    <div className="text-sm text-blue-600">Next.js 14 + TypeScript</div>
            </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="font-semibold text-green-800">Backend</div>
                    <div className="text-sm text-green-600">Prisma + SQLite/PostgreSQL</div>
            </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="font-semibold text-purple-800">Security</div>
                    <div className="text-sm text-purple-600">Cerbos RBAC</div>
            </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="font-semibold text-orange-800">Testing</div>
                    <div className="text-sm text-orange-600">Playwright + Cypress</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Compliance Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Compliance Overview
                </CardTitle>
        </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Overall Score</span>
                    <div className="flex items-center gap-2">
                      <Progress value={complianceMetrics.overallScore} className="w-20 h-2" />
                      <span className="font-bold text-green-600">{complianceMetrics.overallScore}%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Active Policies</span>
                    <Badge className="bg-green-100 text-green-800">
                      {complianceMetrics.policiesActive}/{complianceMetrics.policiesTotal}
                    </Badge>
          </div>
          
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Risk Areas</span>
                    <Badge className={complianceMetrics.riskAreas > 0 ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}>
                      {complianceMetrics.riskAreas}
                    </Badge>
            </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Last Audit</span>
                    <span className="text-sm text-gray-600">{complianceMetrics.lastAudit}</span>
            </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Next Audit</span>
                    <span className="text-sm text-gray-600">{complianceMetrics.nextAudit}</span>
            </div>
          </div>
        </CardContent>
      </Card>

            {/* Compliance Framework */}
            <Card>
        <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Compliance Framework
                </CardTitle>
        </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Standards & Regulations:</h4>
                  <div className="space-y-2">
                    <Badge className="bg-blue-100 text-blue-800">EU AI Act</Badge>
                    <Badge className="bg-green-100 text-green-800">Norwegian AI Guidelines</Badge>
                    <Badge className="bg-purple-100 text-purple-800">GDPR</Badge>
              </div>
            </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Certifications:</h4>
                  <div className="space-y-2">
                    {complianceMetrics.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{cert}</span>
              </div>
                    ))}
            </div>
          </div>
                
            <div>
                  <h4 className="font-semibold mb-2">Governance:</h4>
                  <div className="space-y-1 text-sm">
                    <div>• AI Governance Board with external advisors</div>
                    <div>• Quarterly compliance reviews</div>
                    <div>• Annual third-party audits</div>
                    <div>• Regular staff training on AI ethics</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
        </TabsContent>

        <TabsContent value="investor" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Key Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Key Metrics
                </CardTitle>
        </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{investorMetrics.totalUsers.toLocaleString()}</div>
                    <div className="text-sm text-blue-700">Total Users</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{investorMetrics.activeUsers.toLocaleString()}</div>
                    <div className="text-sm text-green-700">Active Users</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{investorMetrics.growthRate}%</div>
                    <div className="text-sm text-purple-700">Growth Rate</div>
            </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{investorMetrics.churnRate}%</div>
                    <div className="text-sm text-orange-700">Churn Rate</div>
                </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Revenue</span>
                    <span className="font-bold text-green-600">{investorMetrics.revenue.toLocaleString()} NOK</span>
                </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Customer Satisfaction</span>
                    <span className="font-bold text-yellow-600">{investorMetrics.customerSatisfaction}/5</span>
              </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Market Size</span>
                    <span className="font-bold text-blue-600">{investorMetrics.marketSize.toLocaleString()} NOK</span>
            </div>
          </div>
        </CardContent>
      </Card>

            {/* Market Opportunity */}
            <Card>
        <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Market Opportunity
                </CardTitle>
        </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold mb-2">Target Market:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Norwegian families seeking financial guidance</li>
                      <li>• Vulnerable users requiring guardian support</li>
                      <li>• Financial advisors and social workers</li>
                      <li>• Municipalities and NAV offices</li>
                    </ul>
              </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Market Size:</h4>
                    <div className="text-2xl font-bold text-blue-600">{investorMetrics.marketSize.toLocaleString()} NOK</div>
                    <div className="text-sm text-gray-600">Norwegian personal finance market</div>
            </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Growth Potential:</h4>
                    <div className="space-y-1 text-sm">
                      <div>• 15% annual market growth</div>
                      <div>• Increasing AI adoption in finance</div>
                      <div>• Growing need for vulnerable user support</div>
                      <div>• Regulatory push for responsible AI</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
        </TabsContent>

        <TabsContent value="whitepaper" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                AI & Compliance Whitepaper
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <FileText className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Generate AI & Compliance Whitepaper</h3>
                <p className="text-gray-600 mb-6">
                  Create a comprehensive whitepaper showcasing Pengeplan 2.0's AI governance, 
                  compliance framework, and investor metrics.
                </p>
                
                <div className="flex items-center justify-center gap-4">
                  <Button 
                    onClick={() => handleExportWhitepaper('pdf')} 
                    disabled={isGenerating}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isGenerating ? 'Generating...' : 'Export PDF'}
                  </Button>
                  
                  <Button 
                    onClick={() => handleExportWhitepaper('json')} 
                    disabled={isGenerating}
                    variant="outline"
                  >
            <Download className="h-4 w-4 mr-2" />
                    {isGenerating ? 'Generating...' : 'Export JSON'}
          </Button>
        </div>
        </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">PDF Whitepaper Includes:</h4>
                  <ul className="space-y-1 text-sm text-blue-700">
                    <li>• Executive summary and company overview</li>
                    <li>• Comprehensive compliance metrics</li>
                    <li>• AI governance framework details</li>
                    <li>• Investor metrics and market analysis</li>
                    <li>• Technology stack and competitive advantages</li>
                    <li>• Regulatory compliance documentation</li>
                  </ul>
        </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">JSON Export Includes:</h4>
                  <ul className="space-y-1 text-sm text-green-700">
                    <li>• Machine-readable compliance data</li>
                    <li>• Structured investor metrics</li>
                    <li>• API-ready format for integrations</li>
                    <li>• Real-time compliance status</li>
                    <li>• Audit trail and governance data</li>
                    <li>• Technology stack specifications</li>
                  </ul>
        </div>
      </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}