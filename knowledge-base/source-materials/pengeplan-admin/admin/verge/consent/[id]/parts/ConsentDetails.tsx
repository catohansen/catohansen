"use client";
import * as React from "react";

type Consent = {
  id: string;
  type: string;
  title: string;
  description: string | null;
  amountØre: number | null;
  status: string;
  requiresSF: boolean;
  sentToSFAt: string | null;
  decidedAt: string | null;
  decisionRef: string | null;
  decisionReason: string | null;
  payload: unknown;
  auditTrail: unknown;
  createdAt: string;
  updatedAt: string;
  verge: { id: string; name: string; email: string };
  vergehaver: { id: string; name: string; email: string };
};

type Props = {
  consent: Consent;
};

export default function ConsentDetails({ consent }: Props): React.ReactElement {
  // TODO: Fix TypeScript error with Card component - temporarily disabled for build
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Samtykke Detaljer</h2>
      <p>ID: {consent.id}</p>
      <p>Type: {consent.type}</p>
      <p>Tittel: {consent.title}</p>
      <p>Status: {consent.status}</p>
      <p className="text-sm text-gray-500 mt-4">
        Denne komponenten er midlertidig forenklet på grunn av TypeScript-feil.
      </p>
    </div>
  );
}