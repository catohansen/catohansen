"use client";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type Vergehaver = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: string;
  createdAt: string;
  vergehaverAccess: Array<{
    id: string;
    scope: string;
    status: string;
    requiresRenewalAt: string | null;
    verge: { id: string; name: string; email: string };
  }>;
};

type Access = {
  id: string;
  scope: string;
  status: string;
  requiresRenewalAt: string | null;
  createdAt: string;
  verge: { id: string; name: string; email: string };
  vergehaver: { id: string; name: string; email: string };
};

type Consent = {
  id: string;
  type: string;
  title: string;
  status: string;
  amountØre: number | null;
  createdAt: string;
  verge: { id: string; name: string; email: string };
  vergehaver: { id: string; name: string; email: string };
};

type Report = {
  id: string;
  year: number;
  status: string;
  submittedAt: string | null;
  createdAt: string;
  verge: { id: string; name: string; email: string };
  vergehaver: { id: string; name: string; email: string };
};

type Props = {
  initialVergehavere: Vergehaver[];
  initialAccess: Access[];
  initialConsents: Consent[];
  initialReports: Report[];
};

export default function VergeClient({ 
  initialVergehavere, 
  initialAccess, 
  initialConsents, 
  initialReports 
}: Props) {
  const [activeTab, setActiveTab] = React.useState<"vergehavere" | "access" | "consents" | "reports">("vergehavere");
  const [searchTerm, setSearchTerm] = React.useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "bg-green-100 text-green-800";
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "APPROVED": return "bg-green-100 text-green-800";
      case "REJECTED": return "bg-red-100 text-red-800";
      case "EXPIRED": return "bg-red-100 text-red-800";
      case "SUSPENDED": return "bg-orange-100 text-orange-800";
      case "TERMINATED": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatAmount = (amountØre: number | null) => {
    if (!amountØre) return "—";
    return new Intl.NumberFormat('no-NO', {
      style: 'currency',
      currency: 'NOK'
    }).format(amountØre / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('no-NO');
  };

  const filteredVergehavere = (initialVergehavere || []).filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAccess = (initialAccess || []).filter(a => 
    a.verge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.vergehaver.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredConsents = (initialConsents || []).filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.verge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.vergehaver.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredReports = (initialReports || []).filter(r => 
    r.verge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.vergehaver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.year.toString().includes(searchTerm)
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Verge-modul Administration
          </h1>
          <p className="text-slate-600 mt-1">Administrer vergehavere og deres tilganger</p>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Søk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 border-violet-200 focus:border-violet-400 focus:ring-violet-400"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gradient-to-r from-violet-100 to-purple-100 p-1 rounded-lg w-fit border border-violet-200">
        {[
          { key: "vergehavere", label: "Vergehavere", count: initialVergehavere.length },
          { key: "access", label: "Fullmakter", count: initialAccess.length },
          { key: "consents", label: "Samtykker", count: initialConsents.length },
          { key: "reports", label: "Årsrapporter", count: initialReports.length }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg"
                : "text-violet-700 hover:text-violet-900 hover:bg-white/50"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Vergehavere Tab */}
      {activeTab === "vergehavere" && (
        <Card>
          <CardHeader>
            <CardTitle>Vergehavere</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b text-muted-foreground">
                    <th className="py-2">Navn</th>
                    <th>E-post</th>
                    <th>Telefon</th>
                    <th>Status</th>
                    <th>Aktive fullmakter</th>
                    <th>Opprettet</th>
                    <th>Handlinger</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVergehavere.map((vergehaver) => (
                    <tr key={vergehaver.id} className="border-b">
                      <td className="py-2 font-medium">{vergehaver.name}</td>
                      <td>{vergehaver.email || "—"}</td>
                      <td>{vergehaver.phone || "—"}</td>
                      <td>
                        <Badge className={getStatusColor(vergehaver.status)}>
                          {vergehaver.status}
                        </Badge>
                      </td>
                      <td>
                        <span className="text-sm text-gray-600">
                          {vergehaver.vergehaverAccess.filter(a => a.status === "ACTIVE").length}
                        </span>
                      </td>
                      <td className="text-xs">{formatDate(vergehaver.createdAt)}</td>
                      <td>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Rediger</Button>
                          <Button size="sm" variant="outline">Fullmakter</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Access Tab */}
      {activeTab === "access" && (
        <Card>
          <CardHeader>
            <CardTitle>Fullmakter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b text-muted-foreground">
                    <th className="py-2">Verge</th>
                    <th>Vergehaver</th>
                    <th>Område</th>
                    <th>Status</th>
                    <th>Fornyelse</th>
                    <th>Opprettet</th>
                    <th>Handlinger</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAccess.map((access) => (
                    <tr key={access.id} className="border-b">
                      <td className="py-2">
                        <div>
                          <div className="font-medium">{access.verge.name}</div>
                          <div className="text-xs text-gray-500">{access.verge.email}</div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="font-medium">{access.vergehaver.name}</div>
                          <div className="text-xs text-gray-500">{access.vergehaver.email}</div>
                        </div>
                      </td>
                      <td>
                        <Badge variant="outline">{access.scope}</Badge>
                      </td>
                      <td>
                        <Badge className={getStatusColor(access.status)}>
                          {access.status}
                        </Badge>
                      </td>
                      <td className="text-xs">
                        {access.requiresRenewalAt ? formatDate(access.requiresRenewalAt) : "—"}
                      </td>
                      <td className="text-xs">{formatDate(access.createdAt)}</td>
                      <td>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Godkjenn</Button>
                          <Button size="sm" variant="outline">Avvis</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Consents Tab */}
      {activeTab === "consents" && (
        <Card>
          <CardHeader>
            <CardTitle>Samtykke-forespørsler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b text-muted-foreground">
                    <th className="py-2">Type</th>
                    <th>Tittel</th>
                    <th>Verge</th>
                    <th>Vergehaver</th>
                    <th>Beløp</th>
                    <th>Status</th>
                    <th>Opprettet</th>
                    <th>Handlinger</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredConsents.map((consent) => (
                    <tr key={consent.id} className="border-b">
                      <td className="py-2">
                        <Badge variant="outline">{consent.type}</Badge>
                      </td>
                      <td className="font-medium">{consent.title}</td>
                      <td>
                        <div>
                          <div className="font-medium">{consent.verge.name}</div>
                          <div className="text-xs text-gray-500">{consent.verge.email}</div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="font-medium">{consent.vergehaver.name}</div>
                          <div className="text-xs text-gray-500">{consent.vergehaver.email}</div>
                        </div>
                      </td>
                      <td className="font-mono">{formatAmount(consent.amountØre)}</td>
                      <td>
                        <Badge className={getStatusColor(consent.status)}>
                          {consent.status}
                        </Badge>
                      </td>
                      <td className="text-xs">{formatDate(consent.createdAt)}</td>
                      <td>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Se detaljer</Button>
                          <Button size="sm" variant="outline">Godkjenn</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reports Tab */}
      {activeTab === "reports" && (
        <Card>
          <CardHeader>
            <CardTitle>Årsrapporter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b text-muted-foreground">
                    <th className="py-2">År</th>
                    <th>Verge</th>
                    <th>Vergehaver</th>
                    <th>Status</th>
                    <th>Innsendt</th>
                    <th>Opprettet</th>
                    <th>Handlinger</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="border-b">
                      <td className="py-2 font-medium">{report.year}</td>
                      <td>
                        <div>
                          <div className="font-medium">{report.verge.name}</div>
                          <div className="text-xs text-gray-500">{report.verge.email}</div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="font-medium">{report.vergehaver.name}</div>
                          <div className="text-xs text-gray-500">{report.vergehaver.email}</div>
                        </div>
                      </td>
                      <td>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                      </td>
                      <td className="text-xs">
                        {report.submittedAt ? formatDate(report.submittedAt) : "—"}
                      </td>
                      <td className="text-xs">{formatDate(report.createdAt)}</td>
                      <td>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Se rapport</Button>
                          <Button size="sm" variant="outline">Godkjenn</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{initialVergehavere.length}</div>
            <div className="text-sm text-muted-foreground">Aktive vergehavere</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {initialAccess.filter(a => a.status === "ACTIVE").length}
            </div>
            <div className="text-sm text-muted-foreground">Aktive fullmakter</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {initialConsents.filter(c => c.status === "PENDING").length}
            </div>
            <div className="text-sm text-muted-foreground">Ventende samtykker</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {initialReports.filter(r => r.status === "DRAFT").length}
            </div>
            <div className="text-sm text-muted-foreground">Utkast til rapporter</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
