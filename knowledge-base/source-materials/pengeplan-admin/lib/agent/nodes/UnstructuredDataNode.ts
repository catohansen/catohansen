import { AgentNode, AgentState, AgentCtx, AgentOutput } from '../types';

export class UnstructuredDataNode implements AgentNode {
  name: string = "UnstructuredDataNode";
  failFast: boolean = false;

  async execute(state: AgentState, context: AgentCtx): Promise<AgentOutput> {
    console.log(`[${this.name}] Executing for user: ${context.userId}`);

    try {
      // Gather unstructured data from various sources
      const unstructuredData = {
        documents: await this.getDocumentsData(context.userId),
        emails: await this.getEmailsData(context.userId),
        pdfs: await this.getPDFsData(context.userId),
        ocrResults: await this.getOCRResults(context.userId)
      };

      // Process and extract information
      const processedData = await this.processUnstructuredData(unstructuredData);
      
      // Identify key information and patterns
      const extractedInfo = this.extractKeyInformation(processedData);
      
      // Generate insights from unstructured data
      const insights = this.generateUnstructuredInsights(processedData, extractedInfo);

      return {
        newState: {
          ...state,
          unstructuredData,
          processedData,
          extractedInfo,
          insights
        },
        suggestions: [],
        decision: {
          documentCount: unstructuredData.documents.length,
          emailCount: unstructuredData.emails.length,
          pdfCount: unstructuredData.pdfs.length,
          ocrCount: unstructuredData.ocrResults.length,
          extractedInfoCount: extractedInfo.length,
          insightsCount: insights.length
        }
      };

    } catch (error: any) {
      console.error(`[${this.name}] Error:`, error);
      return {
        newState: {
          ...state,
          unstructuredDataError: error.message
        },
        suggestions: [],
        decision: { error: error.message }
      };
    }
  }

  private async getDocumentsData(userId: string): Promise<any[]> {
    // Mock implementation - in real scenario, this would query the database
    return [
      {
        id: '1',
        title: 'Lønnslipp September 2024',
        type: 'PAYSLIP',
        content: 'Bruttolønn: 45,000 NOK\nNetto: 35,200 NOK\nSkatt: 9,800 NOK',
        uploadedAt: '2024-09-15T10:00:00Z',
        status: 'PROCESSED'
      },
      {
        id: '2',
        title: 'Bankutskrift Oktober 2024',
        type: 'BANK_STATEMENT',
        content: 'Innskudd: 35,200 NOK\nUtbetalinger: 12,500 NOK\nSaldo: 45,800 NOK',
        uploadedAt: '2024-10-01T14:30:00Z',
        status: 'PROCESSED'
      }
    ];
  }

  private async getEmailsData(userId: string): Promise<any[]> {
    // Mock implementation
    return [
      {
        id: '1',
        subject: 'Faktura fra Telenor',
        sender: 'faktura@telenor.no',
        receivedAt: '2024-09-20T08:00:00Z',
        content: 'Din månedlige faktura er klar. Beløp: 299 NOK. Forfall: 15.10.2024',
        extractedInfo: {
          amount: 299,
          dueDate: '2024-10-15',
          company: 'Telenor',
          type: 'BILL'
        }
      },
      {
        id: '2',
        subject: 'Bekreftelse på støtte fra NAV',
        sender: 'nav@nav.no',
        receivedAt: '2024-09-18T12:00:00Z',
        content: 'Din søknad om støtte er godkjent. Beløp: 8,500 NOK. Utbetaling: 25.09.2024',
        extractedInfo: {
          amount: 8500,
          paymentDate: '2024-09-25',
          organization: 'NAV',
          type: 'BENEFIT'
        }
      }
    ];
  }

  private async getPDFsData(userId: string): Promise<any[]> {
    // Mock implementation
    return [
      {
        id: '1',
        title: 'Skattemelding 2023',
        type: 'TAX_RETURN',
        extractedText: 'Inntekt: 540,000 NOK\nSkatt: 108,000 NOK\nFradrag: 15,000 NOK',
        processedAt: '2024-09-10T16:00:00Z',
        status: 'PROCESSED'
      },
      {
        id: '2',
        title: 'Forsikringspolise Hus',
        type: 'INSURANCE',
        extractedText: 'Premie: 2,400 NOK per år\nDekning: 2,000,000 NOK\nForfall: 15.11.2024',
        processedAt: '2024-09-05T11:00:00Z',
        status: 'PROCESSED'
      }
    ];
  }

  private async getOCRResults(userId: string): Promise<any[]> {
    // Mock implementation
    return [
      {
        id: '1',
        sourceDocument: 'Receipt_ICA_20240920',
        extractedText: 'ICA Supermarket\n20.09.2024\nMelk: 25 NOK\nBrød: 35 NOK\nTotal: 60 NOK',
        confidence: 0.95,
        processedAt: '2024-09-20T18:00:00Z'
      },
      {
        id: '2',
        sourceDocument: 'Receipt_Ruter_20240919',
        extractedText: 'Ruter\n19.09.2024\nBillett: 80 NOK\nGyldig til: 20.09.2024',
        confidence: 0.98,
        processedAt: '2024-09-19T17:30:00Z'
      }
    ];
  }

  private async processUnstructuredData(data: any): Promise<any> {
    // Process and normalize unstructured data
    const processed = {
      documents: data.documents.map((doc: any) => ({
        ...doc,
        processedContent: this.processDocumentContent(doc.content),
        keywords: this.extractKeywords(doc.content),
        entities: this.extractEntities(doc.content)
      })),
      emails: data.emails.map((email: any) => ({
        ...email,
        processedContent: this.processEmailContent(email.content),
        urgency: this.assessEmailUrgency(email),
        category: this.categorizeEmail(email)
      })),
      pdfs: data.pdfs.map((pdf: any) => ({
        ...pdf,
        processedText: this.processPDFText(pdf.extractedText),
        structuredData: this.extractStructuredDataFromPDF(pdf.extractedText)
      })),
      ocrResults: data.ocrResults.map((ocr: any) => ({
        ...ocr,
        processedText: this.processOCRText(ocr.extractedText),
        extractedAmounts: this.extractAmounts(ocr.extractedText),
        extractedDates: this.extractDates(ocr.extractedText)
      }))
    };

    return processed;
  }

  private processDocumentContent(content: string): any {
    // Simple text processing
    return {
      wordCount: content.split(' ').length,
      hasNumbers: /\d/.test(content),
      hasCurrency: /NOK|kr|øre/.test(content),
      hasDates: /\d{1,2}\.\d{1,2}\.\d{4}/.test(content)
    };
  }

  private extractKeywords(content: string): string[] {
    // Simple keyword extraction
    const keywords = content.toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !['nok', 'kr', 'øre', 'fra', 'til', 'den', 'det', 'og', 'er'].includes(word));
    
    return [...new Set(keywords)].slice(0, 10);
  }

  private extractEntities(content: string): any {
    // Simple entity extraction
    const entities = {
      amounts: (content.match(/\d+[\s,]*\d*\s*(NOK|kr|øre)/gi) || []).map(match => ({
        text: match,
        value: this.extractNumericValue(match)
      })),
      dates: (content.match(/\d{1,2}\.\d{1,2}\.\d{4}/g) || []).map(date => ({
        text: date,
        parsed: new Date(date.split('.').reverse().join('-'))
      })),
      companies: (content.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g) || [])
        .filter(company => company.length > 2)
        .slice(0, 5)
    };

    return entities;
  }

  private extractNumericValue(text: string): number {
    const match = text.match(/(\d+[\s,]*\d*)/);
    return match ? parseFloat(match[1].replace(/\s/g, '').replace(',', '.')) : 0;
  }

  private processEmailContent(content: string): any {
    return {
      wordCount: content.split(' ').length,
      hasUrgentKeywords: /haster|raskt|umiddelbart|frist|forfall/.test(content.toLowerCase()),
      hasAmount: /\d+[\s,]*\d*\s*(NOK|kr|øre)/.test(content),
      hasDate: /\d{1,2}\.\d{1,2}\.\d{4}/.test(content)
    };
  }

  private assessEmailUrgency(email: any): string {
    const urgentKeywords = ['haster', 'raskt', 'umiddelbart', 'frist', 'forfall', 'overfør'];
    const content = email.content.toLowerCase();
    
    if (urgentKeywords.some(keyword => content.includes(keyword))) {
      return 'HIGH';
    }
    
    if (email.extractedInfo?.type === 'BILL' && email.extractedInfo?.dueDate) {
      const dueDate = new Date(email.extractedInfo.dueDate);
      const daysUntilDue = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilDue <= 3) return 'HIGH';
      if (daysUntilDue <= 7) return 'MEDIUM';
    }
    
    return 'LOW';
  }

  private categorizeEmail(email: any): string {
    const content = email.content.toLowerCase();
    
    if (content.includes('faktura') || content.includes('regning')) return 'BILL';
    if (content.includes('støtte') || content.includes('utbetaling')) return 'BENEFIT';
    if (content.includes('bekreftelse') || content.includes('kvittering')) return 'CONFIRMATION';
    if (content.includes('påminnelse') || content.includes('overfør')) return 'REMINDER';
    
    return 'OTHER';
  }

  private processPDFText(text: string): any {
    return {
      wordCount: text.split(' ').length,
      hasStructuredData: /\d+[\s,]*\d*\s*(NOK|kr|øre)/.test(text),
      hasDates: /\d{1,2}\.\d{1,2}\.\d{4}/.test(text),
      hasTables: text.includes('\n') && text.split('\n').length > 5
    };
  }

  private extractStructuredDataFromPDF(text: string): any {
    const amounts = (text.match(/\d+[\s,]*\d*\s*(NOK|kr|øre)/gi) || [])
      .map(match => this.extractNumericValue(match));
    
    const dates = (text.match(/\d{1,2}\.\d{1,2}\.\d{4}/g) || [])
      .map(date => new Date(date.split('.').reverse().join('-')));
    
    return {
      amounts,
      dates,
      totalAmount: amounts.reduce((sum, amount) => sum + amount, 0),
      dateRange: dates.length > 0 ? {
        earliest: new Date(Math.min(...dates.map(d => d.getTime()))),
        latest: new Date(Math.max(...dates.map(d => d.getTime())))
      } : null
    };
  }

  private processOCRText(text: string): any {
    return {
      wordCount: text.split(' ').length,
      hasAmount: /\d+[\s,]*\d*\s*(NOK|kr|øre)/.test(text),
      hasDate: /\d{1,2}\.\d{1,2}\.\d{4}/.test(text),
      hasStore: /ICA|Rema|Kiwi|Coop|Ruter|NSB/.test(text)
    };
  }

  private extractAmounts(text: string): number[] {
    return (text.match(/\d+[\s,]*\d*\s*(NOK|kr|øre)/gi) || [])
      .map(match => this.extractNumericValue(match));
  }

  private extractDates(text: string): string[] {
    return text.match(/\d{1,2}\.\d{1,2}\.\d{4}/g) || [];
  }

  private extractKeyInformation(processedData: any): any[] {
    const keyInfo = [];

    // Extract key information from documents
    processedData.documents.forEach((doc: any) => {
      if (doc.entities.amounts.length > 0) {
        keyInfo.push({
          type: 'AMOUNT',
          source: 'DOCUMENT',
          value: doc.entities.amounts[0].value,
          context: doc.title,
          confidence: 0.9
        });
      }
    });

    // Extract key information from emails
    processedData.emails.forEach((email: any) => {
      if (email.extractedInfo) {
        keyInfo.push({
          type: email.extractedInfo.type,
          source: 'EMAIL',
          value: email.extractedInfo.amount || email.extractedInfo.paymentDate,
          context: email.subject,
          confidence: 0.8
        });
      }
    });

    // Extract key information from PDFs
    processedData.pdfs.forEach((pdf: any) => {
      if (pdf.structuredData.totalAmount > 0) {
        keyInfo.push({
          type: 'FINANCIAL_DOCUMENT',
          source: 'PDF',
          value: pdf.structuredData.totalAmount,
          context: pdf.title,
          confidence: 0.85
        });
      }
    });

    // Extract key information from OCR results
    processedData.ocrResults.forEach((ocr: any) => {
      if (ocr.extractedAmounts.length > 0) {
        keyInfo.push({
          type: 'RECEIPT',
          source: 'OCR',
          value: ocr.extractedAmounts[0],
          context: ocr.sourceDocument,
          confidence: ocr.confidence
        });
      }
    });

    return keyInfo;
  }

  private generateUnstructuredInsights(processedData: any, extractedInfo: any[]): any[] {
    const insights = [];

    // Email urgency insights
    const urgentEmails = processedData.emails.filter((email: any) => email.urgency === 'HIGH');
    if (urgentEmails.length > 0) {
      insights.push({
        type: 'EMAIL_URGENCY',
        severity: 'WARNING',
        message: `${urgentEmails.length} urgent emails require attention`,
        action: 'Review and respond to urgent emails promptly'
      });
    }

    // Bill detection insights
    const bills = extractedInfo.filter(info => info.type === 'BILL');
    if (bills.length > 0) {
      insights.push({
        type: 'BILL_DETECTION',
        severity: 'INFO',
        message: `${bills.length} bills detected in documents/emails`,
        action: 'Verify bills are properly recorded in your budget'
      });
    }

    // Receipt tracking insights
    const receipts = extractedInfo.filter(info => info.type === 'RECEIPT');
    if (receipts.length > 0) {
      insights.push({
        type: 'RECEIPT_TRACKING',
        severity: 'INFO',
        message: `${receipts.length} receipts processed via OCR`,
        action: 'Review receipt data for accuracy'
      });
    }

    // Document processing insights
    const unprocessedDocs = processedData.documents.filter((doc: any) => doc.status !== 'PROCESSED');
    if (unprocessedDocs.length > 0) {
      insights.push({
        type: 'DOCUMENT_PROCESSING',
        severity: 'WARNING',
        message: `${unprocessedDocs.length} documents pending processing`,
        action: 'Complete document processing for better insights'
      });
    }

    return insights;
  }
}
