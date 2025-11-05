import { AgentNode, AgentState, AgentCtx, AgentOutput } from '../types';

export class APIRetrievalNode implements AgentNode {
  name: string = "APIRetrievalNode";
  failFast: boolean = false;

  async execute(state: AgentState, context: AgentCtx): Promise<AgentOutput> {
    console.log(`[${this.name}] Executing for user: ${context.userId}`);

    try {
      // Retrieve data from various APIs
      const apiData = {
        nav: await this.retrieveNAVData(context.userId),
        altinn: await this.retrieveAltinnData(context.userId),
        bankid: await this.retrieveBankIDData(context.userId),
        bank: await this.retrieveBankData(context.userId)
      };

      // Process and normalize API data
      const processedData = await this.processAPIData(apiData);
      
      // Identify data quality and completeness
      const dataQuality = this.assessAPIDataQuality(processedData);
      
      // Generate insights from API data
      const insights = this.generateAPIInsights(processedData);

      return {
        newState: {
          ...state,
          apiData,
          processedAPIData: processedData,
          apiDataQuality: dataQuality,
          apiInsights: insights
        },
        suggestions: [],
        decision: {
          navDataAvailable: !!apiData.nav,
          altinnDataAvailable: !!apiData.altinn,
          bankidDataAvailable: !!apiData.bankid,
          bankDataAvailable: !!apiData.bank,
          overallQuality: dataQuality.overallScore,
          insightsCount: insights.length
        }
      };

    } catch (error: any) {
      console.error(`[${this.name}] Error:`, error);
      return {
        newState: {
          ...state,
          apiDataError: error.message
        },
        suggestions: [],
        decision: { error: error.message }
      };
    }
  }

  private async retrieveNAVData(userId: string): Promise<any> {
    // Mock implementation - in real scenario, this would call NAV API
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        benefits: [
          {
            id: '1',
            type: 'UNEMPLOYMENT_BENEFIT',
            amount: 8500,
            period: '2024-09',
            status: 'ACTIVE',
            nextPayment: '2024-10-25'
          },
          {
            id: '2',
            type: 'CHILD_BENEFIT',
            amount: 1054,
            period: '2024-09',
            status: 'ACTIVE',
            nextPayment: '2024-10-20'
          }
        ],
        applications: [
          {
            id: '1',
            type: 'HOUSING_SUPPORT',
            status: 'PENDING',
            submittedAt: '2024-09-15',
            expectedDecision: '2024-10-15'
          }
        ],
        lastUpdated: new Date().toISOString(),
        dataQuality: 'HIGH'
      };
    } catch (error) {
      console.error('NAV API error:', error);
      return null;
    }
  }

  private async retrieveAltinnData(userId: string): Promise<any> {
    // Mock implementation - in real scenario, this would call Altinn API
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        taxInfo: {
          year: 2023,
          income: 540000,
          taxPaid: 108000,
          taxRefund: 5000,
          status: 'COMPLETED'
        },
        businessInfo: {
          hasBusiness: false,
          businessType: null,
          annualRevenue: 0
        },
        lastUpdated: new Date().toISOString(),
        dataQuality: 'HIGH'
      };
    } catch (error) {
      console.error('Altinn API error:', error);
      return null;
    }
  }

  private async retrieveBankIDData(userId: string): Promise<any> {
    // Mock implementation - in real scenario, this would call BankID API
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        authentication: {
          level: 'SUBSTANTIAL',
          method: 'BANKID_MOBILE',
          lastUsed: '2024-09-20T14:30:00Z',
          status: 'ACTIVE'
        },
        identity: {
          verified: true,
          name: '***MASKED***',
          birthDate: '***MASKED***',
          nationalId: '***MASKED***'
        },
        lastUpdated: new Date().toISOString(),
        dataQuality: 'HIGH'
      };
    } catch (error) {
      console.error('BankID API error:', error);
      return null;
    }
  }

  private async retrieveBankData(userId: string): Promise<any> {
    // Mock implementation - in real scenario, this would call bank APIs
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      return {
        accounts: [
          {
            id: '1',
            type: 'CHECKING',
            balance: 45800,
            currency: 'NOK',
            name: 'Hovedkonto',
            lastUpdated: '2024-09-20T18:00:00Z'
          },
          {
            id: '2',
            type: 'SAVINGS',
            balance: 12000,
            currency: 'NOK',
            name: 'Sparekonto',
            lastUpdated: '2024-09-20T18:00:00Z'
          }
        ],
        creditCards: [
          {
            id: '1',
            type: 'CREDIT_CARD',
            balance: 15000,
            limit: 25000,
            interestRate: 18.5,
            minimumPayment: 300,
            dueDate: '2024-10-15'
          }
        ],
        lastUpdated: new Date().toISOString(),
        dataQuality: 'HIGH'
      };
    } catch (error) {
      console.error('Bank API error:', error);
      return null;
    }
  }

  private async processAPIData(apiData: any): Promise<any> {
    const processed = {
      nav: apiData.nav ? this.processNAVData(apiData.nav) : null,
      altinn: apiData.altinn ? this.processAltinnData(apiData.altinn) : null,
      bankid: apiData.bankid ? this.processBankIDData(apiData.bankid) : null,
      bank: apiData.bank ? this.processBankData(apiData.bank) : null
    };

    return processed;
  }

  private processNAVData(navData: any): any {
    return {
      totalBenefits: navData.benefits.reduce((sum: number, benefit: any) => sum + benefit.amount, 0),
      activeBenefits: navData.benefits.filter((benefit: any) => benefit.status === 'ACTIVE'),
      pendingApplications: navData.applications.filter((app: any) => app.status === 'PENDING'),
      nextPaymentDate: this.getNextPaymentDate(navData.benefits),
      dataCompleteness: this.assessNAVDataCompleteness(navData)
    };
  }

  private processAltinnData(altinnData: any): any {
    return {
      taxSummary: {
        income: altinnData.taxInfo.income,
        taxPaid: altinnData.taxInfo.taxPaid,
        taxRefund: altinnData.taxInfo.taxRefund,
        netTax: altinnData.taxInfo.taxPaid - altinnData.taxInfo.taxRefund
      },
      businessStatus: altinnData.businessInfo.hasBusiness,
      dataCompleteness: this.assessAltinnDataCompleteness(altinnData)
    };
  }

  private processBankIDData(bankidData: any): any {
    return {
      authenticationLevel: bankidData.authentication.level,
      isVerified: bankidData.identity.verified,
      lastUsed: bankidData.authentication.lastUsed,
      dataCompleteness: this.assessBankIDDataCompleteness(bankidData)
    };
  }

  private processBankData(bankData: any): any {
    const totalBalance = bankData.accounts.reduce((sum: number, account: any) => sum + account.balance, 0);
    const totalDebt = bankData.creditCards.reduce((sum: number, card: any) => sum + card.balance, 0);
    
    return {
      totalBalance,
      totalDebt,
      netWorth: totalBalance - totalDebt,
      accountCount: bankData.accounts.length,
      creditCardCount: bankData.creditCards.length,
      dataCompleteness: this.assessBankDataCompleteness(bankData)
    };
  }

  private getNextPaymentDate(benefits: any[]): string | null {
    const activeBenefits = benefits.filter(benefit => benefit.status === 'ACTIVE');
    if (activeBenefits.length === 0) return null;
    
    const nextPayments = activeBenefits
      .map(benefit => benefit.nextPayment)
      .filter(date => date)
      .sort();
    
    return nextPayments.length > 0 ? nextPayments[0] : null;
  }

  private assessNAVDataCompleteness(navData: any): number {
    let score = 0;
    
    if (navData.benefits && navData.benefits.length > 0) score += 40;
    if (navData.applications && navData.applications.length >= 0) score += 30;
    if (navData.lastUpdated) score += 20;
    if (navData.dataQuality === 'HIGH') score += 10;
    
    return score;
  }

  private assessAltinnDataCompleteness(altinnData: any): number {
    let score = 0;
    
    if (altinnData.taxInfo) score += 50;
    if (altinnData.businessInfo) score += 30;
    if (altinnData.lastUpdated) score += 20;
    
    return score;
  }

  private assessBankIDDataCompleteness(bankidData: any): number {
    let score = 0;
    
    if (bankidData.authentication) score += 40;
    if (bankidData.identity) score += 40;
    if (bankidData.lastUpdated) score += 20;
    
    return score;
  }

  private assessBankDataCompleteness(bankData: any): number {
    let score = 0;
    
    if (bankData.accounts && bankData.accounts.length > 0) score += 40;
    if (bankData.creditCards && bankData.creditCards.length >= 0) score += 30;
    if (bankData.lastUpdated) score += 20;
    if (bankData.dataQuality === 'HIGH') score += 10;
    
    return score;
  }

  private assessAPIDataQuality(processedData: any): any {
    const quality = {
      nav: processedData.nav ? processedData.nav.dataCompleteness : 0,
      altinn: processedData.altinn ? processedData.altinn.dataCompleteness : 0,
      bankid: processedData.bankid ? processedData.bankid.dataCompleteness : 0,
      bank: processedData.bank ? processedData.bank.dataCompleteness : 0
    };

    const overallScore = Object.values(quality).reduce((sum: number, score: number) => sum + score, 0) / Object.keys(quality).length;

    return {
      ...quality,
      overallScore: Math.round(overallScore)
    };
  }

  private generateAPIInsights(processedData: any): any[] {
    const insights = [];

    // NAV insights
    if (processedData.nav) {
      if (processedData.nav.totalBenefits > 0) {
        insights.push({
          type: 'NAV_BENEFITS',
          severity: 'INFO',
          message: `Receiving ${processedData.nav.totalBenefits.toLocaleString()} NOK in monthly benefits`,
          action: 'Ensure benefits are included in your budget planning'
        });
      }

      if (processedData.nav.pendingApplications.length > 0) {
        insights.push({
          type: 'NAV_APPLICATIONS',
          severity: 'WARNING',
          message: `${processedData.nav.pendingApplications.length} NAV applications pending`,
          action: 'Follow up on pending applications'
        });
      }
    }

    // Altinn insights
    if (processedData.altinn) {
      if (processedData.altinn.taxSummary.taxRefund > 0) {
        insights.push({
          type: 'TAX_REFUND',
          severity: 'INFO',
          message: `Tax refund of ${processedData.altinn.taxSummary.taxRefund.toLocaleString()} NOK available`,
          action: 'Consider how to allocate your tax refund'
        });
      }
    }

    // Bank insights
    if (processedData.bank) {
      if (processedData.bank.netWorth < 0) {
        insights.push({
          type: 'NEGATIVE_NET_WORTH',
          severity: 'WARNING',
          message: 'Negative net worth detected',
          action: 'Focus on debt reduction strategies'
        });
      }

      if (processedData.bank.totalDebt > 100000) {
        insights.push({
          type: 'HIGH_DEBT',
          severity: 'WARNING',
          message: `High debt level: ${processedData.bank.totalDebt.toLocaleString()} NOK`,
          action: 'Consider debt consolidation or accelerated repayment'
        });
      }
    }

    // BankID insights
    if (processedData.bankid) {
      if (processedData.bankid.authenticationLevel === 'SUBSTANTIAL') {
        insights.push({
          type: 'HIGH_AUTH_LEVEL',
          severity: 'INFO',
          message: 'High authentication level verified',
          action: 'You have access to high-security services'
        });
      }
    }

    return insights;
  }
}
