'use client';

import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  Activity,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface AIPolicy {
  id: string;
  name: string;
  version: string;
  category: 'ethics' | 'data' | 'transparency' | 'safety' | 'compliance';
  status: 'draft' | 'active' | 'deprecated' | 'under_review';
  description: string;
  lastUpdated: string;
  approvedBy: string;
  complianceScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
}

export default function AIGovernancePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Mock data for AI policies
  const [aiPolicies] = useState<AIPolicy[]>([
    {
      id: '1',
      name: 'AI Ethics Framework v2.1',
      version: '2.1.0',
      category: 'ethics',
      status: 'active',
      description: 'Comprehensive framework for ethical AI development and deployment in financial services.',
      lastUpdated: '2025-09-15T14:30:00Z',
      approvedBy: 'Dr. Sarah Chen',
      complianceScore: 95,
      riskLevel: 'low',
      tags: ['ethics', 'framework', 'financial-services']
    },
    {
      id: '2',
      name: 'Data Privacy & Protection Policy',
      version: '1.8.2',
      category: 'data',
      status: 'active',
      description: 'GDPR-compliant data handling procedures for AI systems and user data processing.',
      lastUpdated: '2025-09-10T09:15:00Z',
      approvedBy: 'Anna Johansen',
      complianceScore: 98,
      riskLevel: 'low',
      tags: ['gdpr', 'privacy', 'data-protection']
    },
    {
      id: '3',
      name: 'AI Transparency & Explainability',
      version: '1.5.0',
      category: 'transparency',
      status: 'under_review',
      description: 'Requirements for AI system transparency and explainability in decision-making processes.',
      lastUpdated: '2025-09-18T16:45:00Z',
      approvedBy: 'Prof. Erik Larsen',
      complianceScore: 87,
      riskLevel: 'medium',
      tags: ['transparency', 'explainability', 'decision-making']
    }
  ]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ethics': return <Shield className="h-4 w-4" />;
      case 'data': return <Lock className="h-4 w-4" />;
      case 'transparency': return <Eye className="h-4 w-4" />;
      case 'safety': return <AlertTriangle className="h-4 w-4" />;
      case 'compliance': return <CheckCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'deprecated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const filteredPolicies = aiPolicies.filter(policy => {
    const matchesSearch = policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || policy.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const overallComplianceScore = Math.round(
    aiPolicies.reduce((sum, policy) => sum + policy.complianceScore, 0) / aiPolicies.length
  );

  const activePolicies = aiPolicies.filter(p => p.status === 'active').length;
  const policiesUnderReview = aiPolicies.filter(p => p.status === 'under_review').length;
  const highRiskPolicies = aiPolicies.filter(p => p.riskLevel === 'high' || p.riskLevel === 'critical').length;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">AI Governance & Compliance</h1>
        <p className="text-gray-600">Manage AI policies, governance board, and compliance reporting</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Compliance</p>
                <p className="text-2xl font-bold text-gray-900">{overallComplianceScore}%</p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Policies</p>
                <p className="text-2xl font-bold text-gray-900">{activePolicies}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Under Review</p>
                <p className="text-2xl font-bold text-gray-900">{policiesUnderReview}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Risk Areas</p>
                <p className="text-2xl font-bold text-gray-900">{highRiskPolicies}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="policies">AI Policies</TabsTrigger>
          <TabsTrigger value="governance">Governance Board</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Compliance Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Compliance Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Compliance Score</span>
                    <span className="font-semibold">{overallComplianceScore}%</span>
                  </div>
                  <Progress value={overallComplianceScore} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{activePolicies}</div>
                    <div className="text-sm text-green-700">Active Policies</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{policiesUnderReview}</div>
                    <div className="text-sm text-blue-700">Under Review</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">SC</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Dr. Sarah Chen updated AI Ethics Framework</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">AJ</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Anna Johansen generated Q3 compliance report</p>
                      <p className="text-xs text-gray-500">4 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Search policies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64"
              />
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="ethics">Ethics</SelectItem>
                  <SelectItem value="data">Data</SelectItem>
                  <SelectItem value="transparency">Transparency</SelectItem>
                  <SelectItem value="safety">Safety</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Policy
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredPolicies.map((policy) => (
              <Card key={policy.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getCategoryIcon(policy.category)}
                        <h3 className="text-lg font-semibold">{policy.name}</h3>
                        <Badge className={getStatusColor(policy.status)}>
                          {policy.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{policy.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Version: {policy.version}</span>
                        <span>•</span>
                        <span>Updated: {new Date(policy.lastUpdated).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>Approved by: {policy.approvedBy}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-sm font-medium">Compliance Score:</span>
                        <div className="flex items-center gap-2">
                          <Progress value={policy.complianceScore} className="w-20 h-2" />
                          <span className="text-sm font-semibold">{policy.complianceScore}%</span>
                        </div>
                        <span className={`text-sm font-medium ${getRiskColor(policy.riskLevel)}`}>
                          {policy.riskLevel.toUpperCase()} RISK
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-3">
                        {policy.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="governance" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">AI Governance Board</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">SC</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">Dr. Sarah Chen</h3>
                      <Badge className="bg-green-100 text-green-800">active</Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">Chief AI Ethics Officer</p>
                    <p className="text-sm text-gray-500 mb-3">AI Governance</p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      <Badge variant="outline" className="text-xs">AI Ethics</Badge>
                      <Badge variant="outline" className="text-xs">Algorithmic Fairness</Badge>
                      <Badge variant="outline" className="text-xs">Risk Assessment</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>sarah.chen@pengeplan.no</span>
                      <span>Last active: Today</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">AJ</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">Anna Johansen</h3>
                      <Badge className="bg-green-100 text-green-800">active</Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">Data Protection Officer</p>
                    <p className="text-sm text-gray-500 mb-3">Legal & Compliance</p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      <Badge variant="outline" className="text-xs">GDPR</Badge>
                      <Badge variant="outline" className="text-xs">Data Privacy</Badge>
                      <Badge variant="outline" className="text-xs">Regulatory Affairs</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>anna.johansen@pengeplan.no</span>
                      <span>Last active: Today</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}