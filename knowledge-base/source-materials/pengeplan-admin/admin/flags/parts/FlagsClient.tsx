"use client";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { ApprovalModal } from "@/components/admin/ApprovalModal";

import { decideFlagRequestAction, requestFlagChangeAction } from "../actions";

type Flag = { key: string; value: string | number | boolean | Record<string, unknown>; description?: string|null; requiresApproval: boolean; updatedAt: string };
type Pending = { id: string; flagKey: string; proposedValue: string | number | boolean | Record<string, unknown>; reason: string; requestedBy: string; createdAt: string };

export default function FlagsClient({ flags, pending }: { flags: Flag[]; pending: Pending[] }) {
  const [open, setOpen] = React.useState(false);
  const [current, setCurrent] = React.useState<Flag | null>(null);
  const [busy, start] = React.useTransition();
  const [state, setState] = React.useState<{ flags: Flag[]; pending: Pending[] }>({ flags, pending });
  const [error, setError] = React.useState<string | null>(null);

  function openModal(f: Flag) { setCurrent(f); setOpen(true); setError(null); }

  async function onSubmitModal(p: { proposedValue: unknown; reason: string }) {
    if (!current) return;
    setError(null);
    start(async () => {
      const res = await requestFlagChangeAction(current.key, p.proposedValue, p.reason);
      if (!res.ok) return setError('Request failed');
      // Optimistisk: legg til "pending" fake id (server oppdaterer på reload)
      setState(s => ({ ...s, pending: [{ id: (res.data as { requestId: string }).requestId, flagKey: current.key, proposedValue: p.proposedValue as string | number | boolean | Record<string, unknown>, reason: p.reason, requestedBy: "you", createdAt: new Date().toISOString() }, ...s.pending ] }));
      setOpen(false);
    });
  }

  function decide(reqId: string, key: string, approve: boolean) {
    setError(null);
    start(async () => {
      const res = await decideFlagRequestAction({ requestId: reqId, key, approve });
      if (!res.ok) return setError('Request failed');
      // Optimistisk: fjern fra pending
      setState(s => ({ ...s, pending: s.pending.filter(p => p.id !== reqId) }));
    });
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Feature Flags</h1>
        {busy && <div className="text-xs text-muted-foreground">Oppdaterer…</div>}
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-muted-foreground border-b">
            <th className="py-2">Key</th>
            <th>Value</th>
            <th>Requires Approval</th>
            <th>Updated</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {state.flags.map((f) => (
            <tr key={f.key} className="border-b align-top">
              <td className="py-2 font-mono">{f.key}</td>
              <td><pre className="text-xs max-w-[520px] overflow-auto">{JSON.stringify(f.value, null, 2)}</pre></td>
              <td>{f.requiresApproval ? "Yes" : "No"}</td>
              <td className="text-xs">{new Date(f.updatedAt).toLocaleString()}</td>
              <td className="text-right">
                <Button size="sm" onClick={() => openModal(f)}>Foreslå endring</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {state.pending.length > 0 && (
        <div>
          <div className="mt-8 mb-2 font-medium">Avventer godkjenning</div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b">
                <th className="py-2">Flag</th>
                <th>Proposed</th>
                <th>Reason</th>
                <th>Requested by</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {state.pending.map((r) => (
                <tr key={r.id} className="border-b align-top">
                  <td className="py-2 font-mono">{r.flagKey}</td>
                  <td><pre className="text-xs max-w-[520px] overflow-auto">{JSON.stringify(r.proposedValue, null, 2)}</pre></td>
                  <td className="max-w-[360px] truncate">{r.reason}</td>
                  <td className="text-xs">{r.requestedBy}</td>
                  <td className="text-right space-x-2">
                    <Button size="sm" variant="outline" onClick={() => decide(r.id, r.flagKey, false)}>Avvis</Button>
                    <Button size="sm" onClick={() => decide(r.id, r.flagKey, true)}>Godkjenn</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && current && (
        <ApprovalModal
          open={open}
          onOpenChange={setOpen}
          flagKey={current.key}
          currentValue={current.value}
          requiresApproval={current.requiresApproval}
          onSubmitted={() => {}}
          onSubmit={onSubmitModal}
        />
      )}
    </div>
  );
}
