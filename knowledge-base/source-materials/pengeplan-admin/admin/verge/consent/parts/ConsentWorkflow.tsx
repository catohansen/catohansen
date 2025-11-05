"use client";
import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Consent = {
  id: string;
  status: string;
  type: string;
  title: string;
  amountØre: number | null;
  createdAt: string;
  sentToSFAt: string | null;
  decidedAt: string | null;
  verge: { name: string };
  vergehaver: { name: string };
};

type Props = {
  consent: Consent;
};

const WORKFLOW_STEPS = [
  { key: "DRAFT", label: "Utkast", description: "Samtykke opprettet" },
  { key: "SENT_VERGEHAVER", label: "Sendt til vergehaver", description: "Venter på vergehaver" },
  { key: "AGREED", label: "Enig", description: "Vergehaver har godkjent" },
  { key: "SENT_SF", label: "Sendt til Statsforvalteren", description: "Venter på Statsforvalteren" },
  { key: "APPROVED", label: "Godkjent", description: "Endelig godkjenning" },
  { key: "REJECTED", label: "Avvist", description: "Samtykke avvist" }
];

export default function ConsentWorkflow({ consent }: Props) {
  const getStepIndex = (status: string) => {
    return WORKFLOW_STEPS.findIndex(step => step.key === status);
  };

  const currentStepIndex = getStepIndex(consent.status);
  const isCompleted = (stepIndex: number) => stepIndex < currentStepIndex;
  const isCurrent = (stepIndex: number) => stepIndex === currentStepIndex;
  const isRejected = consent.status === "REJECTED";

  const formatAmount = (amountØre: number | null) => {
    if (!amountØre) return "—";
    return new Intl.NumberFormat('no-NO', {
      style: 'currency',
      currency: 'NOK'
    }).format(amountØre / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('no-NO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{consent.title}</h3>
              <p className="text-sm text-gray-600">
                {consent.verge.name} → {consent.vergehaver.name}
              </p>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="mb-2">{consent.type}</Badge>
              <div className="text-sm font-mono">{formatAmount(consent.amountØre)}</div>
            </div>
          </div>

          {/* Workflow Steps */}
          <div className="space-y-4">
            {WORKFLOW_STEPS.map((step, index) => {
              const completed = isCompleted(index);
              const current = isCurrent(index);
              const showRejected = isRejected && step.key === "REJECTED";

              return (
                <div key={step.key} className="flex items-center space-x-4">
                  {/* Step Circle */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    completed 
                      ? "bg-green-100 text-green-800" 
                      : current 
                        ? "bg-blue-100 text-blue-800" 
                        : showRejected
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-400"
                  }`}>
                    {completed ? "✓" : showRejected ? "✗" : index + 1}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className={`font-medium ${
                        completed || current || showRejected 
                          ? "text-gray-900" 
                          : "text-gray-500"
                      }`}>
                        {step.label}
                      </h4>
                      {current && <Badge className="bg-blue-100 text-blue-800">Aktiv</Badge>}
                      {showRejected && <Badge className="bg-red-100 text-red-800">Avvist</Badge>}
                    </div>
                    <p className="text-sm text-gray-600">{step.description}</p>
                    
                    {/* Timestamps */}
                    {step.key === "DRAFT" && consent.createdAt && (
                      <p className="text-xs text-gray-500 mt-1">
                        Opprettet: {formatDate(consent.createdAt)}
                      </p>
                    )}
                    {step.key === "SENT_SF" && consent.sentToSFAt && (
                      <p className="text-xs text-gray-500 mt-1">
                        Sendt: {formatDate(consent.sentToSFAt)}
                      </p>
                    )}
                    {step.key === "APPROVED" && consent.decidedAt && (
                      <p className="text-xs text-gray-500 mt-1">
                        Godkjent: {formatDate(consent.decidedAt)}
                      </p>
                    )}
                    {step.key === "REJECTED" && consent.decidedAt && (
                      <p className="text-xs text-gray-500 mt-1">
                        Avvist: {formatDate(consent.decidedAt)}
                      </p>
                    )}
                  </div>

                  {/* Connector Line */}
                  {index < WORKFLOW_STEPS.length - 1 && (
                    <div className={`absolute left-4 top-8 w-0.5 h-8 ${
                      completed ? "bg-green-200" : "bg-gray-200"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Fremdrift</span>
              <span>{Math.round(((currentStepIndex + 1) / WORKFLOW_STEPS.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  isRejected ? "bg-red-500" : "bg-blue-500"
                }`}
                style={{ 
                  width: `${Math.min(((currentStepIndex + 1) / WORKFLOW_STEPS.length) * 100, 100)}%` 
                }}
              />
            </div>
          </div>

          {/* Estimated Timeline */}
          {!isRejected && currentStepIndex < WORKFLOW_STEPS.length - 1 && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-sm text-blue-800">
                <strong>Estimert tidslinje:</strong>{" "}
                {currentStepIndex === 0 && "1-2 dager til vergehaver"}
                {currentStepIndex === 1 && "3-5 dager til svar fra vergehaver"}
                {currentStepIndex === 2 && "1-2 dager til Statsforvalteren"}
                {currentStepIndex === 3 && "5-10 dager til endelig godkjenning"}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
