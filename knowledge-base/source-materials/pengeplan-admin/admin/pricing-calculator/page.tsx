'use client';

import { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign, AlertTriangle, CheckCircle, Brain, Mic, Database, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MODULE_PRICING, PricingCalculator } from '@/lib/pricing/pricingService';

interface CostCalculation {
  module: string;
  usage: number;
  baseCost: number;
  apiCosts: number;
  totalCost: number;
  profit: number;
  margin: number;
}

export default function PricingCalculatorPage() {
  const [calculations, setCalculations] = useState<CostCalculation[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalMargin, setTotalMargin] = useState(0);
  const [isProfitable, setIsProfitable] = useState(true);

  const calculateCosts = () => {
    const newCalculations: CostCalculation[] = [];
    let totalCostSum = 0;
    let totalProfitSum = 0;

    MODULE_PRICING.forEach(module => {
      const usage = getUsageForModule(module.id);
      const baseCost = PricingCalculator.calculateModuleCost(module.id, usage);
      const apiCosts = Object.values(module.apiCosts).reduce((sum, cost) => sum + cost, 0) * usage;
      const totalCost = baseCost + apiCosts;
      const profit = baseCost - apiCosts;
      const margin = apiCosts > 0 ? (profit / totalCost) * 100 : 100;

      newCalculations.push({
        module: module.name,
        usage,
        baseCost,
        apiCosts,
        totalCost,
        profit,
        margin
      });

      totalCostSum += totalCost;
      totalProfitSum += profit;
    });

    setCalculations(newCalculations);
    setTotalCost(totalCostSum);
    setTotalProfit(totalProfitSum);
    setTotalMargin(totalCostSum > 0 ? (totalProfitSum / totalCostSum) * 100 : 0);
    setIsProfitable(totalProfitSum > 0);
  };

  const getUsageForModule = (moduleId: string): number => {
    // Simulated usage data - in real app, this would come from database
    const usageData: Record<string, number> = {
      'ai-basic': 1000,
      'ai-advanced': 500,
      'voice-basic': 100,
      'storage-basic': 50,
      'premium-features': 10
    };
    return usageData[moduleId] || 0;
  };

  useEffect(() => {
    calculateCosts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div>
            <div className="flex items-center justify-center gap-3 mb-6">
              <Calculator className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
                API <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Kostnadskalkulator</span>
              </h1>
            </div>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Beregn API-kostnader og lønnsomhet for alle moduler i Pengeplan 2.0
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Total Kostnad</h3>
                  <p className="text-sm text-gray-600">API-kostnader</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-blue-600">
                {totalCost.toFixed(2)} kr
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-500 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Total Profitt</h3>
                  <p className="text-sm text-gray-600">Etter API-kostnader</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-green-600">
                {totalProfit.toFixed(2)} kr
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Calculator className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Margin</h3>
                  <p className="text-sm text-gray-600">Lønnsomhet</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-purple-600">
                {totalMargin.toFixed(1)}%
              </div>
            </CardContent>
          </Card>

          <Card className={`${isProfitable ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200' : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'}`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${isProfitable ? 'bg-green-500' : 'bg-red-500'}`}>
                  {isProfitable ? (
                    <CheckCircle className="h-6 w-6 text-white" />
                  ) : (
                    <AlertTriangle className="h-6 w-6 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Status</h3>
                  <p className="text-sm text-gray-600">Lønnsomhet</p>
                </div>
              </div>
              <div className={`text-3xl font-bold ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
                {isProfitable ? 'Lønnsom' : 'Tap'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Calculations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                Modul-kostnader
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {calculations.map((calc, index) => (
                  <div
                    key={calc.module}
                    className="p-4 bg-gray-50 rounded-lg transition-all duration-300 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{calc.module}</h4>
                      <Badge variant={calc.margin > 50 ? 'default' : calc.margin > 20 ? 'secondary' : 'destructive'}>
                        {calc.margin.toFixed(1)}% margin
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Bruk:</span>
                        <span className="font-semibold ml-2">{calc.usage.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Grunnpris:</span>
                        <span className="font-semibold ml-2">{calc.baseCost.toFixed(2)} kr</span>
                      </div>
                      <div>
                        <span className="text-gray-600">API-kostnad:</span>
                        <span className="font-semibold ml-2">{calc.apiCosts.toFixed(2)} kr</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Profitt:</span>
                        <span className={`font-semibold ml-2 ${calc.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {calc.profit.toFixed(2)} kr
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Lønnsomhetsanalyse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Anbefalinger</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {totalMargin > 50 ? (
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Utmerket lønnsomhet! Vurder å utvide tjenestene.
                      </li>
                    ) : totalMargin > 20 ? (
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        God lønnsomhet. Optimaliser API-kostnader for bedre margin.
                      </li>
                    ) : (
                      <li className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        Lav lønnsomhet. Vurder å øke priser eller redusere API-kostnader.
                      </li>
                    )}
                  </ul>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Kostnadsoptimalisering</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-blue-500" />
                      Bruk DeepSeek for billigere AI-forespørsler
                    </li>
                    <li className="flex items-center gap-2">
                      <Mic className="h-4 w-4 text-purple-500" />
                      Optimaliser stemme-API bruk
                    </li>
                    <li className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-green-500" />
                      Komprimer lagrede data
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* API Cost Breakdown */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              API-kostnadsoversikt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="openai" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="openai">OpenAI</TabsTrigger>
                <TabsTrigger value="deepseek">DeepSeek</TabsTrigger>
                <TabsTrigger value="azure">Azure TTS</TabsTrigger>
                <TabsTrigger value="whisper">Whisper</TabsTrigger>
              </TabsList>

              {['openai', 'deepseek', 'azure', 'whisper'].map((provider) => (
                <TabsContent key={provider} value={provider}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MODULE_PRICING.map((module) => {
                      const usage = getUsageForModule(module.id);
                      const apiCost = module.apiCosts[provider as keyof typeof module.apiCosts] * usage;
                      
                      return (
                        <div key={module.id} className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">{module.name}</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Kostnad per enhet:</span>
                              <span className="font-semibold">
                                {module.apiCosts[provider as keyof typeof module.apiCosts]} kr
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Bruk:</span>
                              <span className="font-semibold">{usage.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Total kostnad:</span>
                              <span className="font-semibold text-blue-600">
                                {apiCost.toFixed(2)} kr
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button 
            onClick={calculateCosts}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
          >
            <Calculator className="h-5 w-5 mr-2" />
            Oppdater beregninger
          </Button>
          <Button 
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3"
          >
            <TrendingUp className="h-5 w-5 mr-2" />
            Eksporter rapport
          </Button>
        </div>
      </div>
    </div>
  );
}
