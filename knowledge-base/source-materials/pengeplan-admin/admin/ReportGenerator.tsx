'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  RefreshCw, 
  Settings, 
  Eye, 
  Share2, 
  CheckCircle, 
  AlertTriangle,
  BarChart3,
  Users,
  DollarSign,
  Shield,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

interface ReportOptions {
  format: 'pdf' | 'html' | 'markdown';
  type: 'investor_pitch' | 'system_overview' | 'metrics_report';
  includeScreenshots: boolean;
  includeQRCode: boolean;
  includeMetrics: boolean;
  styling: 'modern' | 'corporate' | 'glassmorphism';
}

interface GeneratedReport {
  filename: string;
  filepath: string;
  size: number;
  mimeType: string;
  generatedAt: string;
}

export default function ReportGenerator() {
  const [options, setOptions] = useState<ReportOptions>({
    format: 'pdf',
    type: 'investor_pitch',
    includeScreenshots: true,
    includeQRCode: true,
    includeMetrics: true,
    styling: 'modern'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);
  const [availableFormats, setAvailableFormats] = useState<any[]>([]);
  const [availableTypes, setAvailableTypes] = useState<any[]>([]);

  useEffect(() => {
    fetchAvailableOptions();
  }, []);

  const fetchAvailableOptions = async () => {
    try {
      const response = await fetch('/api/reports/export');
      if (!response.ok) throw new Error('Failed to fetch options');
      
      const data = await response.json();
      setAvailableFormats(data.formats);
      setAvailableTypes(data.types);
    } catch (error) {
      console.error('Error fetching options:', error);
      toast.error('Feil', { description: 'Kunne ikke hente tilgjengelige formater.' });
    }
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch('/api/reports/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options)
      });

      if (!response.ok) throw new Error('Failed to generate report');

      const report: GeneratedReport = await response.json();
      
      clearInterval(progressInterval);
      setProgress(100);

      setGeneratedReports(prev => [report, ...prev]);
      toast.success('Rapport generert', { description: `${report.filename} er klar for nedlasting.` });

    } catch (error: any) {
      console.error('Error generating report:', error);
      toast.error('Feil', { description: error.message || 'Kunne ikke generere rapport.' });
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const handleDownload = (report: GeneratedReport) => {
    const link = document.createElement('a');
    link.href = report.filepath;
    link.download = report.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = (report: GeneratedReport) => {
    window.open(report.filepath, '_blank');
  };

  const handleShare = async (report: GeneratedReport) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Pengeplan 2.0 Report',
          text: 'Generated report from Pengeplan 2.0',
          url: report.filepath
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(report.filepath);
      toast.success('Kopiert', { description: 'Rapport-URL er kopiert til utklippstavlen.' });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'investor_pitch': return <Users className="h-5 w-5 text-blue-500" />;
      case 'system_overview': return <BarChart3 className="h-5 w-5 text-green-500" />;
      case 'metrics_report': return <DollarSign className="h-5 w-5 text-purple-500" />;
      default: return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf': return <FileText className="h-4 w-4 text-red-500" />;
      case 'html': return <Zap className="h-4 w-4 text-orange-500" />;
      case 'markdown': return <FileText className="h-4 w-4 text-gray-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-4xl mx-auto shadow-lg">
        <CardHeader className="border-b pb-4">
          <CardTitle className="flex items-center space-x-2 text-2xl font-bold text-gray-800">
            <FileText className="h-7 w-7 text-blue-500" />
            <span>Rapport Generator</span>
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">Generer profesjonelle rapporter for investorer og tekniske partnere.</p>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Report Type Selection */}
          <div className="space-y-4">
            <Label htmlFor="report-type" className="text-base font-semibold">Rapport Type</Label>
            <Select 
              value={options.type} 
              onValueChange={(value: any) => setOptions(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Velg rapport type" />
              </SelectTrigger>
              <SelectContent>
                {availableTypes.map((type) => (
                  <SelectItem key={type.type} value={type.type}>
                    <div className="flex items-center space-x-2">
                      {getReportIcon(type.type)}
                      <span>{type.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Format Selection */}
          <div className="space-y-4">
            <Label htmlFor="format" className="text-base font-semibold">Format</Label>
            <Select 
              value={options.format} 
              onValueChange={(value: any) => setOptions(prev => ({ ...prev, format: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Velg format" />
              </SelectTrigger>
              <SelectContent>
                {availableFormats.map((format) => (
                  <SelectItem key={format.format} value={format.format}>
                    <div className="flex items-center space-x-2">
                      {getFormatIcon(format.format)}
                      <span>{format.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Styling Options */}
          <div className="space-y-4">
            <Label htmlFor="styling" className="text-base font-semibold">Design</Label>
            <Select 
              value={options.styling} 
              onValueChange={(value: any) => setOptions(prev => ({ ...prev, styling: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Velg design" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="modern">Moderne</SelectItem>
                <SelectItem value="corporate">Bedrift</SelectItem>
                <SelectItem value="glassmorphism">Glassmorphism</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Innstillinger</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="screenshots" className="text-sm">Inkluder screenshots</Label>
                <Switch
                  id="screenshots"
                  checked={options.includeScreenshots}
                  onCheckedChange={(checked) => setOptions(prev => ({ ...prev, includeScreenshots: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="qr-code" className="text-sm">Inkluder QR-kode</Label>
                <Switch
                  id="qr-code"
                  checked={options.includeQRCode}
                  onCheckedChange={(checked) => setOptions(prev => ({ ...prev, includeQRCode: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="metrics" className="text-sm">Inkluder metrics</Label>
                <Switch
                  id="metrics"
                  checked={options.includeMetrics}
                  onCheckedChange={(checked) => setOptions(prev => ({ ...prev, includeMetrics: checked }))}
                />
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <Button 
            onClick={handleGenerateReport} 
            disabled={isGenerating}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                Genererer rapport...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Generer rapport
              </>
            )}
          </Button>

          {/* Progress Bar */}
          {isGenerating && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-600 text-center">
                {progress < 50 ? 'Forbereder rapport...' : 
                 progress < 90 ? 'Genererer innhold...' : 
                 'Ferdigstiller rapport...'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generated Reports */}
      {generatedReports.length > 0 && (
        <Card className="w-full max-w-4xl mx-auto shadow-lg">
          <CardHeader className="border-b pb-4">
            <CardTitle className="flex items-center space-x-2 text-xl font-bold text-gray-800">
              <Download className="h-6 w-6 text-green-500" />
              <span>Genererte Rapporter</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {generatedReports.map((report, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                >
                  <div className="flex items-center space-x-3">
                    {getReportIcon(options.type)}
                    <div>
                      <p className="font-semibold text-gray-800">{report.filename}</p>
                      <p className="text-sm text-gray-600">
                        {formatFileSize(report.size)} • {new Date(report.generatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreview(report)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Forhåndsvis
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(report)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Last ned
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare(report)}
                    >
                      <Share2 className="h-4 w-4 mr-1" />
                      Del
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
