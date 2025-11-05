"use client";
import * as React from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Report = {
  id: string;
  year: number;
  status: string;
  verge: { id: string; name: string; email: string };
  vergehaver: { id: string; name: string; email: string };
};

type Props = {
  reports: Report[];
  currentYear: number;
};

export default function DeadlineReminders({ reports, currentYear }: Props) {
  const getDaysUntilDeadline = (year: number) => {
    const deadline = new Date(year + 1, 2, 31); // 31. mars året etter
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // const getDeadlineStatus = (year: number) => {
  //   const days = getDaysUntilDeadline(year);
  //   if (days < 0) return { status: "overdue", label: "Forfalt", color: "text-red-600", bgColor: "bg-red-50 border-red-200" };
  //   if (days <= 7) return { status: "critical", label: `${days} dager igjen`, color: "text-red-600", bgColor: "bg-red-50 border-red-200" };
  //   if (days <= 30) return { status: "urgent", label: `${days} dager igjen`, color: "text-orange-600", bgColor: "bg-orange-50 border-orange-200" };
  //   if (days <= 60) return { status: "warning", label: `${days} dager igjen`, color: "text-yellow-600", bgColor: "bg-yellow-50 border-yellow-200" };
  //   return { status: "ok", label: `${days} dager igjen`, color: "text-green-600", bgColor: "bg-green-50 border-green-200" };
  // };

  const overdueReports = reports.filter(report => 
    getDaysUntilDeadline(report.year) < 0 && report.status !== "ACCEPTED"
  );

  const criticalReports = reports.filter(report => {
    const days = getDaysUntilDeadline(report.year);
    return days <= 7 && days >= 0 && report.status !== "ACCEPTED";
  });

  const urgentReports = reports.filter(report => {
    const days = getDaysUntilDeadline(report.year);
    return days <= 30 && days > 7 && report.status !== "ACCEPTED";
  });

  const warningReports = reports.filter(report => {
    const days = getDaysUntilDeadline(report.year);
    return days <= 60 && days > 30 && report.status !== "ACCEPTED";
  });

  const sendReminder = async (reportId: string, type: string) => {
    // TODO: Implement reminder sending logic
    console.log(`Sending ${type} reminder for report ${reportId}`);
  };

  const sendBulkReminder = async (reportIds: string[], type: string) => {
    // TODO: Implement bulk reminder sending
    console.log(`Sending bulk ${type} reminders for reports:`, reportIds);
  };

  if (reports.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Frister og påminnelser</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Ingen rapporter som trenger påminnelser.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Overdue Reports */}
      {overdueReports.length > 0 && (
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center justify-between">
              <span>⚠️ Forfalte rapporter ({overdueReports.length})</span>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => sendBulkReminder(overdueReports.map(r => r.id), "overdue")}
              >
                Send alle påminnelser
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {overdueReports.map(report => {
                const days = getDaysUntilDeadline(report.year);
                return (
                  <div key={report.id} className="flex items-center justify-between p-3 bg-white rounded border">
                    <div>
                      <div className="font-medium">{report.year}: {report.verge.name} → {report.vergehaver.name}</div>
                      <div className="text-sm text-gray-600">
                        {Math.abs(days)} dager forfalt • Status: <Badge className="bg-gray-100 text-gray-800">{report.status}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => sendReminder(report.id, "overdue")}>
                        Send påminnelse
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Critical Reports (≤7 days) */}
      {criticalReports.length > 0 && (
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center justify-between">
              <span>🚨 Kritiske frister ({criticalReports.length})</span>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => sendBulkReminder(criticalReports.map(r => r.id), "critical")}
              >
                Send alle påminnelser
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {criticalReports.map(report => {
                const days = getDaysUntilDeadline(report.year);
                return (
                  <div key={report.id} className="flex items-center justify-between p-3 bg-white rounded border">
                    <div>
                      <div className="font-medium">{report.year}: {report.verge.name} → {report.vergehaver.name}</div>
                      <div className="text-sm text-gray-600">
                        {days} dager igjen • Status: <Badge className="bg-gray-100 text-gray-800">{report.status}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => sendReminder(report.id, "critical")}>
                        Send påminnelse
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Urgent Reports (≤30 days) */}
      {urgentReports.length > 0 && (
        <Card className="bg-orange-50 border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-800 flex items-center justify-between">
              <span>🔔 Urgente frister ({urgentReports.length})</span>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => sendBulkReminder(urgentReports.map(r => r.id), "urgent")}
              >
                Send alle påminnelser
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {urgentReports.map(report => {
                const days = getDaysUntilDeadline(report.year);
                return (
                  <div key={report.id} className="flex items-center justify-between p-3 bg-white rounded border">
                    <div>
                      <div className="font-medium">{report.year}: {report.verge.name} → {report.vergehaver.name}</div>
                      <div className="text-sm text-gray-600">
                        {days} dager igjen • Status: <Badge className="bg-gray-100 text-gray-800">{report.status}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => sendReminder(report.id, "urgent")}>
                        Send påminnelse
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Warning Reports (≤60 days) */}
      {warningReports.length > 0 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center justify-between">
              <span>⚠️ Advarsel frister ({warningReports.length})</span>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => sendBulkReminder(warningReports.map(r => r.id), "warning")}
              >
                Send alle påminnelser
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {warningReports.map(report => {
                const days = getDaysUntilDeadline(report.year);
                return (
                  <div key={report.id} className="flex items-center justify-between p-3 bg-white rounded border">
                    <div>
                      <div className="font-medium">{report.year}: {report.verge.name} → {report.vergehaver.name}</div>
                      <div className="text-sm text-gray-600">
                        {days} dager igjen • Status: <Badge className="bg-gray-100 text-gray-800">{report.status}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => sendReminder(report.id, "warning")}>
                        Send påminnelse
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Frist-oversikt</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-red-600">{overdueReports.length}</div>
              <div className="text-sm text-gray-600">Forfalt</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{criticalReports.length}</div>
              <div className="text-sm text-gray-600">Kritisk (≤7 dager)</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{urgentReports.length}</div>
              <div className="text-sm text-gray-600">Urgent (≤30 dager)</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">{warningReports.length}</div>
              <div className="text-sm text-gray-600">Advarsel (≤60 dager)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
