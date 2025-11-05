"use client";

import { useState } from "react";
import { Upload, Save, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Logo from "@/components/ui/Logo";

export default function LogoAdminPage() {
  const [logoUrl, setLogoUrl] = useState("");
  const [logoText, setLogoText] = useState("");
  // const [previewUrl, setPreviewUrl] = useState("");

  const handleSave = () => {
    if (logoUrl) {
      localStorage.setItem("pengeplan-custom-logo", logoUrl);
    }
    if (logoText) {
      localStorage.setItem("pengeplan-custom-text", logoText);
    }
    
    // Trigger a page refresh to show changes
    window.location.reload();
  };

  const handleReset = () => {
    localStorage.removeItem("pengeplan-custom-logo");
    localStorage.removeItem("pengeplan-custom-text");
    setLogoUrl("");
    setLogoText("");
    // setPreviewUrl(""); // Removed unused function
    window.location.reload();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        // setPreviewUrl(result); // Removed unused function
        setLogoUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Logo-administrasjon</h1>
        <p className="text-slate-600">Endre logo og tekst for hele Pengeplan-systemet</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Logo-innstillinger */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Logo-innstillinger</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logo-text">Logo-tekst</Label>
              <Input
                id="logo-text"
                placeholder="Pengeplan"
                value={logoText}
                onChange={(e) => setLogoText(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo-url">Logo URL</Label>
              <Input
                id="logo-url"
                placeholder="https://example.com/logo.png"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo-file">Eller last opp fil</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="logo-file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="flex-1"
                />
                <Upload className="h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Lagre endringer
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Tilbakestill
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Forhåndsvisning */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Forhåndsvisning</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Stor logo (Landing/Login)</h4>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <Logo size="lg" showText={true} />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Medium logo (Sidebar)</h4>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <Logo size="md" showText={true} />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Liten logo (Topbar)</h4>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <Logo size="sm" showText={true} />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Kun ikon (Footer)</h4>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <Logo size="sm" showText={false} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instruksjoner */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Instruksjoner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-600">
          <p>• <strong>Logo-tekst:</strong> Endre navnet som vises ved siden av logoen</p>
          <p>• <strong>Logo URL:</strong> Direkte lenke til et bilde (PNG, JPG, SVG)</p>
          <p>• <strong>Fil-opplasting:</strong> Last opp et bilde fra din datamaskin</p>
          <p>• <strong>Anbefalt størrelse:</strong> 64x64px eller høyere, kvadratisk format</p>
          <p>• <strong>Formater:</strong> PNG, JPG, SVG, WebP</p>
          <p>• Endringene gjelder umiddelbart på alle sider i systemet</p>
        </CardContent>
      </Card>
    </div>
  );
}








