"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authz";

// Bytt til ditt ekte auth-system:
async function getUser() {
  // f.eks. via cookies/session:
  return { id: "admin-ui", role: "admin" as const, ip: undefined as string|undefined };
}

type ActionResult<T = unknown> = { ok: true; data?: T } | { ok: false; error: string };

export async function requestFlagChangeAction(key: string, proposedValue: unknown, reason: string): Promise<ActionResult> {
  const { id, role } = await getUser();
  try {
    requireAdmin(role);
    if (!key) return { ok: false, error: "MISSING_KEY" };
    if (!reason || reason.trim().length < 5) return { ok: false, error: "REASON_TOO_SHORT" };

    // const flag = await prisma.featureFlag.findUnique({ where: { key } });
    // if (!flag) return { ok: false, error: "FLAG_NOT_FOUND" };

    // const reqRow = await prisma.flagChangeRequest.create({
    //   data: { flagKey: key, proposedValue: String(proposedValue), reason, requestedBy: id, status: "PENDING" },
    // });
    const reqRow = { id: 'mock-request-id' }

    // TODO: audit + slack (valgfritt)
    return { ok: true, data: { requestId: reqRow.id } };
  } catch (e: unknown) {
    return { ok: false, error: (e as Error)?.message || "REQUEST_FAILED" };
  }
}

export async function decideFlagRequestAction(params: {
  requestId: string;
  key: string;
  approve: boolean;
  reason?: string;
}): Promise<ActionResult> {
  const { id, role } = await getUser();
  try {
    requireAdmin(role);
    const { requestId, key, approve } = params;
    if (!requestId || !key) return { ok: false, error: "BAD_INPUT" };

    // const cr = await prisma.flagChangeRequest.findUnique({ where: { id: requestId } });
    // if (!cr || cr.flagKey !== key) return { ok: false, error: "REQUEST_NOT_FOUND" };
    // if (cr.status !== "PENDING") return { ok: false, error: "ALREADY_RESOLVED" };
    // if (cr.requestedBy === id) return { ok: false, error: "TWO_MAN_RULE" };

    if (approve) {
      // await prisma.featureFlag.update({
      //   where: { key },
      //   data: { value: String(cr.proposedValue), updatedBy: id },
      // });
      // await prisma.flagChangeRequest.update({
      //   where: { id: requestId },
      //   data: { status: "APPROVED", approvedBy: id },
      // });
      // TODO: audit + slack
      return { ok: true };
    } else {
      // await prisma.flagChangeRequest.update({
      //   where: { id: requestId },
      //   data: { status: "REJECTED", approvedBy: id },
      // });
      // TODO: audit + slack
      return { ok: true };
    }
  } catch (e: unknown) {
    return { ok: false, error: (e as Error)?.message || "DECISION_FAILED" };
  }
}
