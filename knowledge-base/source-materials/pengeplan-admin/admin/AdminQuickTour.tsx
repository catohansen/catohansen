"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function AdminQuickTour() {
  const [authed, setAuthed] = useState<"ADMIN"|"USER"|"GUARDIAN_READ"|"NONE">("NONE");

  useEffect(() => {
    const role = document.cookie.split("; ").find(c => c.startsWith("role="))?.split("=")[1];
    setAuthed((role as any) || "NONE");
  }, []);

  const Pill = ({ ok, label }: { ok: boolean; label: string }) => (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ok ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"}`}>{label}</span>
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">Admin Quick Tour</h3>
        <div className="flex items-center gap-2">
          <Pill ok={authed==="ADMIN"} label={authed==="ADMIN"?"ADMIN":"Ikke innlogget"} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <Link href="/admin" className="group rounded-lg border border-gray-200 p-4 hover:bg-gray-50 hover:border-gray-300 transition-all">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏠</span>
            <div>
              <div className="font-medium text-gray-900 group-hover:text-blue-600">Admin Dashboard</div>
              <div className="text-sm text-gray-500">Hovedoversikt og KPI</div>
            </div>
          </div>
        </Link>
        
        <Link href="/admin/cerbos" className="group rounded-lg border border-gray-200 p-4 hover:bg-gray-50 hover:border-gray-300 transition-all">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛡️</span>
            <div>
              <div className="font-medium text-gray-900 group-hover:text-blue-600">Cerbos</div>
              <div className="text-sm text-gray-500">Authorization & policies</div>
            </div>
          </div>
        </Link>
        
        <Link href="/admin/ai" className="group rounded-lg border border-gray-200 p-4 hover:bg-gray-50 hover:border-gray-300 transition-all">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🤖</span>
            <div>
              <div className="font-medium text-gray-900 group-hover:text-blue-600">AI Governance</div>
              <div className="text-sm text-gray-500">AI compliance & monitoring</div>
            </div>
          </div>
        </Link>
        
        <Link href="/admin/ai/system-cards" className="group rounded-lg border border-gray-200 p-4 hover:bg-gray-50 hover:border-gray-300 transition-all">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎴</span>
            <div>
              <div className="font-medium text-gray-900 group-hover:text-blue-600">AI System Cards</div>
              <div className="text-sm text-gray-500">Investor showcase</div>
            </div>
          </div>
        </Link>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Tips:</strong> Ikke innlogget? Du sendes automatisk til <code className="bg-blue-100 px-1 rounded">/admin-login</code>.
        </p>
      </div>
    </div>
  );
}
















