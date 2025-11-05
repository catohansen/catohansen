"use client";
import * as React from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Policy = {
  id: string;
  policyType: string;
  isEnabled: boolean;
  consentGiven: boolean;
  consentDate: string | null;
  lastUpdated: string;
  verge: { id: string; name: string };
  vergehaver: { id: string; name: string };
};

type Props = {
  policies: Policy[];
};

const POLICY_TYPES = [
  { value: "DATA_ACCESS", label: "Data-tilgang", color: "bg-blue-100 text-blue-800" },
  { value: "AI_INTERACTIONS", label: "AI-interaksjoner", color: "bg-green-100 text-green-800" },
  { value: "AUTOMATION", label: "Automatisering", color: "bg-purple-100 text-purple-800" },
  { value: "ANALYTICS", label: "Analyse", color: "bg-orange-100 text-orange-800" }
];

export default function ComplianceDashboard({ policies }: Props) {
  const getPolicyTypeInfo = (type: string) => {
    return POLICY_TYPES.find(p => p.value === type) || POLICY_TYPES[0];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('no-NO');
  };

  // Calculate compliance metrics
  const totalPolicies = policies.length;
  const policiesWithConsent = policies.filter(p => p.consentGiven).length;
  const activePolicies = policies.filter(p => p.isEnabled).length;
  const policiesWithoutConsent = policies.filter(p => !p.consentGiven);
  const inactivePolicies = policies.filter(p => !p.isEnabled);

  const complianceRate = totalPolicies > 0 ? (policiesWithConsent / totalPolicies) * 100 : 0;
  const activationRate = totalPolicies > 0 ? (activePolicies / totalPolicies) * 100 : 0;

  // Group by policy type
  const policiesByType = policies.reduce((acc, policy) => {
    if (!acc[policy.policyType]) {
      acc[policy.policyType] = [];
    }
    acc[policy.policyType]?.push(policy);
    return acc;
  }, {} as Record<string, Policy[]>);

  // Calculate days since last update
  const getDaysSinceUpdate = (dateString: string) => {
    const lastUpdate = new Date(dateString);
    const today = new Date();
    const diffTime = today.getTime() - lastUpdate.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  // Find stale policies (not updated in 90 days)
  const stalePolicies = policies.filter(p => getDaysSinceUpdate(p.lastUpdated) > 90);

  return (
    <div className="space-y-6">
      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{totalPolicies}</div>
            <div className="text-sm text-muted-foreground">Totalt policies</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{policiesWithConsent}</div>
            <div className="text-sm text-muted-foreground">Med samtykke</div>
            <div className="text-xs text-gray-500">{Math.round(complianceRate)}% compliance</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{activePolicies}</div>
            <div className="text-sm text-muted-foreground">Aktive policies</div>
            <div className="text-xs text-gray-500">{Math.round(activationRate)}% aktivering</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{stalePolicies.length}</div>
            <div className="text-sm text-muted-foreground">Utgåtte policies</div>
            <div className="text-xs text-gray-500">&gt;90 dager siden oppdatering</div>
          </CardContent>
        </Card>
      </div>

      {/* Policy Type Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Policy Type Oversikt</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {POLICY_TYPES.map(type => {
              const typePolicies = policiesByType[type.value] || [];
              const withConsent = typePolicies.filter(p => p.consentGiven).length;
              const active = typePolicies.filter(p => p.isEnabled).length;
              
              return (
                <div key={type.value} className="border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge className={type.color}>{type.label}</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Totalt:</span>
                      <span className="font-medium">{typePolicies.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Med samtykke:</span>
                      <span className="font-medium text-green-600">{withConsent}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Aktive:</span>
                      <span className="font-medium text-blue-600">{active}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${typePolicies.length > 0 ? (withConsent / typePolicies.length) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Issues and Alerts */}
      {(policiesWithoutConsent.length > 0 || inactivePolicies.length > 0 || stalePolicies.length > 0) && (
        <div className="space-y-4">
          {/* Missing Consent */}
          {policiesWithoutConsent.length > 0 && (
            <Card className="bg-red-50 border-red-200">
              <CardHeader>
                <CardTitle className="text-red-800">
                  ⚠️ Policies uten samtykke ({policiesWithoutConsent.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {policiesWithoutConsent.slice(0, 5).map(policy => {
                    const typeInfo = getPolicyTypeInfo(policy.policyType);
                    return (
                      <div key={policy.id} className="flex items-center justify-between p-2 bg-white rounded border">
                        <div>
                          <div className="font-medium">{policy.verge.name} → {policy.vergehaver.name}</div>
                          <div className="text-sm text-gray-600">
                            <Badge className={typeInfo?.color || 'bg-gray-100'}>{typeInfo?.label || 'Unknown'}</Badge>
                            <span className="ml-2">Opprettet: {formatDate(policy.lastUpdated)}</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          Gi samtykke
                        </Button>
                      </div>
                    );
                  })}
                  {policiesWithoutConsent.length > 5 && (
                    <p className="text-sm text-gray-600 text-center">
                      ... og {policiesWithoutConsent.length - 5} flere
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Inactive Policies */}
          {inactivePolicies.length > 0 && (
            <Card className="bg-orange-50 border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-800">
                  🔔 Deaktiverte policies ({inactivePolicies.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {inactivePolicies.slice(0, 5).map(policy => {
                    const typeInfo = getPolicyTypeInfo(policy.policyType);
                    return (
                      <div key={policy.id} className="flex items-center justify-between p-2 bg-white rounded border">
                        <div>
                          <div className="font-medium">{policy.verge.name} → {policy.vergehaver.name}</div>
                          <div className="text-sm text-gray-600">
                            <Badge className={typeInfo?.color || 'bg-gray-100'}>{typeInfo?.label || 'Unknown'}</Badge>
                            <span className="ml-2">Sist oppdatert: {formatDate(policy.lastUpdated)}</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          Aktiver
                        </Button>
                      </div>
                    );
                  })}
                  {inactivePolicies.length > 5 && (
                    <p className="text-sm text-gray-600 text-center">
                      ... og {inactivePolicies.length - 5} flere
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stale Policies */}
          {stalePolicies.length > 0 && (
            <Card className="bg-yellow-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="text-yellow-800">
                  ⏰ Utgåtte policies ({stalePolicies.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stalePolicies.slice(0, 5).map(policy => {
                    const typeInfo = getPolicyTypeInfo(policy.policyType);
                    const daysSince = getDaysSinceUpdate(policy.lastUpdated);
                    return (
                      <div key={policy.id} className="flex items-center justify-between p-2 bg-white rounded border">
                        <div>
                          <div className="font-medium">{policy.verge.name} → {policy.vergehaver.name}</div>
                          <div className="text-sm text-gray-600">
                            <Badge className={typeInfo?.color || 'bg-gray-100'}>{typeInfo?.label || 'Unknown'}</Badge>
                            <span className="ml-2">{daysSince} dager siden oppdatering</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          Oppdater
                        </Button>
                      </div>
                    );
                  })}
                  {stalePolicies.length > 5 && (
                    <p className="text-sm text-gray-600 text-center">
                      ... og {stalePolicies.length - 5} flere
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Compliance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Sammendrag</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Samtykke Compliance</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${complianceRate}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{Math.round(complianceRate)}%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Policy Aktivering</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${activationRate}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{Math.round(activationRate)}%</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Totalt policies:</span> {totalPolicies}
                </div>
                <div>
                  <span className="font-medium">Med samtykke:</span> {policiesWithConsent}
                </div>
                <div>
                  <span className="font-medium">Aktive:</span> {activePolicies}
                </div>
                <div>
                  <span className="font-medium">Utgåtte:</span> {stalePolicies.length}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
