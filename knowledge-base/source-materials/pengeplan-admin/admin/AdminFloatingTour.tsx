"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  HelpCircle, 
  X, 
  Home, 
  Shield, 
  Brain, 
  Settings,
  Eye,
  Users,
  Zap
} from "lucide-react";

export default function AdminFloatingTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    // Check if user is admin
    const role = document.cookie.split("; ").find(c => c.startsWith("role="))?.split("=")[1];
    setIsAdmin(role === "ADMIN" || role === "SUPERADMIN");
    setCurrentPath(window.location.pathname);
  }, []);

  if (!isAdmin) return null;

  const tourItems = [
    {
      href: "/admin",
      icon: <Home className="h-4 w-4" />,
      label: "Dashboard",
      description: "System overview & KPIs",
      active: currentPath.startsWith("/admin") && currentPath === "/admin"
    },
    {
      href: "/admin/security",
      icon: <Shield className="h-4 w-4" />,
      label: "Security",
      description: "Live monitoring & audit",
      active: currentPath.startsWith("/admin/security")
    },
    {
      href: "/admin/cerbos",
      icon: <Shield className="h-4 w-4" />,
      label: "Cerbos",
      description: "Authorization policies",
      active: currentPath.startsWith("/admin/cerbos")
    },
    {
      href: "/admin/ai",
      icon: <Brain className="h-4 w-4" />,
      label: "AI Governance",
      description: "AI compliance & monitoring",
      active: currentPath.startsWith("/admin/ai") && !currentPath.includes("system-cards")
    },
    {
      href: "/admin/ai/system-cards",
      icon: <Eye className="h-4 w-4" />,
      label: "AI Showcase",
      description: "Investor presentation",
      active: currentPath.includes("system-cards") && !currentPath.includes("security")
    },
    {
      href: "/admin/security/system-card",
      icon: <Shield className="h-4 w-4" />,
      label: "Security Card",
      description: "Enterprise compliance",
      active: currentPath.includes("security/system-card")
    },
    {
      href: "/qa",
      icon: <Zap className="h-4 w-4" />,
      label: "QA Hub",
      description: "All system links",
      active: currentPath === "/qa"
    }
  ];

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`h-14 w-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
            isOpen 
              ? "bg-red-500 hover:bg-red-600 rotate-180" 
              : "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 hover:scale-110"
          }`}
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <HelpCircle className="h-6 w-6 text-white animate-pulse" />
          )}
        </button>
      </div>

      {/* Tour Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-80">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-white" />
                <div>
                  <h3 className="font-semibold text-white">Admin Quick Tour</h3>
                  <p className="text-violet-100 text-sm">Navigate admin functions</p>
                </div>
              </div>
            </div>

            {/* Tour Items */}
            <div className="p-4 space-y-2 max-h-80 overflow-y-auto">
              {tourItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                    item.active 
                      ? "bg-violet-100 border-2 border-violet-300 shadow-sm" 
                      : "hover:bg-gray-50 border-2 border-transparent"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <div className={`flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center ${
                    item.active 
                      ? "bg-violet-600 text-white" 
                      : "bg-gray-100 text-gray-600 group-hover:bg-violet-100 group-hover:text-violet-600"
                  }`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium text-sm ${
                      item.active ? "text-violet-900" : "text-gray-900"
                    }`}>
                      {item.label}
                    </div>
                    <div className={`text-xs ${
                      item.active ? "text-violet-600" : "text-gray-500"
                    }`}>
                      {item.description}
                    </div>
                  </div>
                  {item.active && (
                    <div className="flex-shrink-0">
                      <div className="h-2 w-2 bg-violet-600 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </Link>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-xs text-gray-600">Admin Mode Active</span>
                </div>
                <Link 
                  href="/landing" 
                  className="text-xs text-violet-600 hover:text-violet-700 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  ← Landing
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
