"use client";

import useSWR from "swr";
import { useState } from "react";
import { GitBranch, CheckCircle, ArrowUp, RotateCcw, Shield, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface PolicyVersion {
  hash: string;
  files: number;
  deployedAt?: string;
  author?: string;
  description?: string;
}

interface PolicyLifecycleData {
  active: PolicyVersion;
  staging: PolicyVersion;
  previous: PolicyVersion;
  diff: string;
  requireApproval: boolean;
  validationStatus: 'pending' | 'valid' | 'invalid';
  lastValidation?: string;
}

export default function CerbosPolicyLifecycleTab() {
  const [isValidating, setIsValidating] = useState(false);
  const [isPromoting, setIsPromoting] = useState(false);
  const [isRollingBack, setIsRollingBack] = useState(false);

  const { data, mutate, isLoading } = useSWR<PolicyLifecycleData>(
    "/api/admin/cerbos/policy-lifecycle",
    fetcher,
    { refreshInterval: 10000 }
  );

  const handleAction = async (path: string, body?: any, setLoading?: (loading: boolean) => void) => {
    try {
      setLoading?.(true);
      const response = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`Action failed: ${response.statusText}`);
      }

      // Refresh data after successful action
      await mutate();
      
      // Show success message (you might want to add a toast system)
      console.log('Action completed successfully');
    } catch (error) {
      console.error('Action failed:', error);
      // Handle error (show toast, etc.)
    } finally {
      setLoading?.(false);
    }
  };

  const handleValidate = () => handleAction("/api/admin/cerbos/policy/validate", null, setIsValidating);
  const handlePromote = () => handleAction("/api/admin/cerbos/policy/promote", null, setIsPromoting);
  const handleRollback = () => handleAction("/api/admin/cerbos/policy/rollback", null, setIsRollingBack);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const policy = data || {
    active: { hash: "—", files: 0 },
    staging: { hash: "—", files: 0 },
    previous: { hash: "—", files: 0 },
    diff: "Ingen diff tilgjengelig",
    requireApproval: false,
    validationStatus: 'pending' as const
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">🔄 Policy Lifecycle</h2>
          <p className="text-gray-600 mt-1">Versjonering, validering og deployment av Cerbos policies</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={policy.requireApproval ? "destructive" : "secondary"}>
            {policy.requireApproval ? "🔒 Approval Required" : "🔓 Auto Deploy"}
          </Badge>
        </div>
      </div>

      {/* Version Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Active Production */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              🟢 Production (Aktiv)
            </CardTitle>
            <CardDescription>Kjørende i produksjon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600">Policy Hash</div>
                <code className="text-xs bg-white px-2 py-1 rounded border">
                  {policy.active.hash.substring(0, 12)}...
                </code>
              </div>
              <div>
                <div className="text-sm text-gray-600">Files</div>
                <div className="font-semibold">{policy.active.files} policies</div>
              </div>
              {policy.active.deployedAt && (
                <div>
                  <div className="text-sm text-gray-600">Deployed</div>
                  <div className="text-sm">{new Date(policy.active.deployedAt).toLocaleString('nb-NO')}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Staging */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-blue-600" />
              🔵 Staging
            </CardTitle>
            <CardDescription>Klar for testing og validering</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600">Policy Hash</div>
                <code className="text-xs bg-white px-2 py-1 rounded border">
                  {policy.staging.hash.substring(0, 12)}...
                </code>
              </div>
              <div>
                <div className="text-sm text-gray-600">Files</div>
                <div className="font-semibold">{policy.staging.files} policies</div>
              </div>
              
              {/* Validation Status */}
              <div>
                <div className="text-sm text-gray-600">Status</div>
                <Badge 
                  className={
                    policy.validationStatus === 'valid' ? 'bg-green-100 text-green-800' :
                    policy.validationStatus === 'invalid' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }
                >
                  {policy.validationStatus === 'valid' ? '✅ Valid' :
                   policy.validationStatus === 'invalid' ? '❌ Invalid' :
                   '⏳ Pending'}
                </Badge>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleValidate}
                  disabled={isValidating}
                  className="flex-1"
                >
                  {isValidating ? (
                    <Clock className="h-3 w-3 mr-1 animate-spin" />
                  ) : (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  )}
                  Validate
                </Button>
                
                <Button 
                  size="sm"
                  onClick={handlePromote}
                  disabled={isPromoting || policy.validationStatus !== 'valid'}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isPromoting ? (
                    <Clock className="h-3 w-3 mr-1 animate-spin" />
                  ) : (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  )}
                  Promote
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Previous/Rollback */}
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-orange-600" />
              🟡 Previous
            </CardTitle>
            <CardDescription>Forrige produksjonsversjon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600">Policy Hash</div>
                <code className="text-xs bg-white px-2 py-1 rounded border">
                  {policy.previous.hash.substring(0, 12)}...
                </code>
              </div>
              <div>
                <div className="text-sm text-gray-600">Files</div>
                <div className="font-semibold">{policy.previous.files} policies</div>
              </div>
              
              {/* Rollback Button */}
              <div className="pt-2">
                <Button 
                  size="sm"
                  variant="destructive"
                  onClick={handleRollback}
                  disabled={isRollingBack}
                  className="w-full"
                >
                  {isRollingBack ? (
                    <Clock className="h-3 w-3 mr-1 animate-spin" />
                  ) : (
                    <RotateCcw className="h-3 w-3 mr-1" />
                  )}
                  Rollback
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Policy Diff */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Policy Diff (Staging → Production)
          </CardTitle>
          <CardDescription>
            Endringer som vil bli applisert ved promote til produksjon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-auto max-h-80">
            <pre className="whitespace-pre-wrap">{policy.diff || "Ingen endringer"}</pre>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Deployment Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">Require Approval for Production</div>
                <div className="text-sm text-gray-600">
                  Krever manuell godkjenning før deployment til produksjon
                </div>
              </div>
              <Badge variant={policy.requireApproval ? "destructive" : "secondary"}>
                {policy.requireApproval ? "Påkrevd" : "Automatisk"}
              </Badge>
            </div>

            {policy.lastValidation && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">Siste Validering</div>
                  <div className="text-sm text-gray-600">
                    {new Date(policy.lastValidation).toLocaleString('nb-NO')}
                  </div>
                </div>
                <Badge variant="outline">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Validert
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}