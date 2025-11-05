/**
 * MotivasjonsAgent - NLP-coach med forankring og future pacing
 * Basert på LangGraph-stil orkestrering med explainability
 */

import { z } from 'zod';

// Zod schemas for type safety
const MotivationProfileSchema = z.object({
  userId: z.string(),
  motivationType: z.enum(['achievement', 'security', 'freedom', 'growth', 'contribution']),
  currentMood: z.enum(['excited', 'motivated', 'neutral', 'frustrated', 'overwhelmed']),
  energyLevel: z.enum(['high', 'medium', 'low']),
  stressLevel: z.enum(['low', 'medium', 'high', 'critical']),
  goals: z.array(z.string()),
  challenges: z.array(z.string()),
  strengths: z.array(z.string()),
  lastUpdated: z.string()
});

const MotivationMessageSchema = z.object({
  id: z.string(),
  type: z.enum(['encouragement', 'challenge', 'celebration', 'guidance', 'reminder']),
  title: z.string(),
  message: z.string(),
  tone: z.enum(['supportive', 'energetic', 'calm', 'urgent', 'celebratory']),
  actionPrompt: z.string().optional(),
  explanation: z.string().max(240), // ≤240 tegn for explainability
  confidence: z.number().min(0).max(100),
  personalizedElements: z.array(z.string())
});

const MotivationStrategySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  technique: z.enum(['anchoring', 'future_pacing', 'reframing', 'chunking', 'visualization']),
  targetMood: z.enum(['excited', 'motivated', 'neutral', 'frustrated', 'overwhelmed']),
  effectiveness: z.number().min(0).max(100),
  explanation: z.string().max(240),
  steps: z.array(z.string()),
  expectedOutcome: z.string()
});

const MotivationAgentStateSchema = z.object({
  userId: z.string(),
  analysisDate: z.string(),
  profile: MotivationProfileSchema,
  messages: z.array(MotivationMessageSchema),
  strategies: z.array(MotivationStrategySchema),
  recentInteractions: z.array(z.object({
    date: z.string(),
    type: z.string(),
    response: z.string(),
    effectiveness: z.number().min(0).max(100)
  })),
  agentVersion: z.string()
});

export type MotivationProfile = z.infer<typeof MotivationProfileSchema>;
export type MotivationMessage = z.infer<typeof MotivationMessageSchema>;
export type MotivationStrategy = z.infer<typeof MotivationStrategySchema>;
export type MotivationAgentState = z.infer<typeof MotivationAgentStateSchema>;

export class MotivationAgent {
  private state: MotivationAgentState;
  private agentVersion = '1.0.0';

  // NLP coaching templates
  private coachingTemplates = {
    encouragement: [
      "Du har allerede tatt det viktigste steget - å starte! 🚀",
      "Hver dag du jobber mot målet ditt er en seier! 💪",
      "Du er sterkere enn du tror - se hvor langt du har kommet! ✨",
      "Små steg hver dag fører til store endringer! 🌟"
    ],
    challenge: [
      "Er du klar for å ta neste steg? Din fremtidige jeg takker deg! 🎯",
      "Hva om du kunne se deg selv om 6 måneder - hva ville du si til deg nå? 🔮",
      "Den beste tiden å plante et tre var for 20 år siden. Den nest beste er nå! 🌳",
      "Din fremtidige frihet starter med valgene du tar i dag! 🗽"
    ],
    celebration: [
      "Fantastisk! Du fortjener å feire denne seieren! 🎉",
      "Se på deg! Du gjør det! Dette er bare begynnelsen! 🏆",
      "Hver seier, stor eller liten, bringer deg nærmere målet! ⭐",
      "Du inspirerer meg! Fortsett å gjøre det du gjør! 🌈"
    ],
    guidance: [
      "La oss bryte dette ned i mindre, håndterbare steg 📋",
      "Fokuser på det du kan kontrollere - resten kommer av seg selv 🎯",
      "Hva ville du råde en venn i din situasjon? 🤝",
      "Din erfaring er verdifull - bruk den til å veilede andre 💎"
    ],
    reminder: [
      "Husk hvorfor du startet denne reisen 🧭",
      "Din fremtidige jeg vil takke deg for det du gjør i dag 🙏",
      "Hver dag er en ny mulighet til å komme nærmere målet 🌅",
      "Du har allerede bevist at du kan - fortsett! 🔥"
    ]
  };

  // Anchoring phrases for different motivation types
  private anchoringPhrases = {
    achievement: [
      "Jeg er en person som oppnår mine mål",
      "Jeg tar ansvar for min økonomiske fremtid",
      "Jeg er disiplinert og fokuseret",
      "Jeg feirer mine seire og lærer av mine utfordringer"
    ],
    security: [
      "Jeg bygger en trygg økonomisk fremtid",
      "Jeg beskytter meg selv og mine kjære",
      "Jeg tar smarte, trygge valg",
      "Jeg skaper stabilitet i mitt liv"
    ],
    freedom: [
      "Jeg skaper frihet gjennom smarte valg",
      "Jeg er ansvarlig for min egen økonomiske frihet",
      "Jeg velger frihet over umiddelbar tilfredsstillelse",
      "Jeg bygger en fremtid fylt med muligheter"
    ],
    growth: [
      "Jeg vokser og lærer hver dag",
      "Jeg utfordrer meg selv til å bli bedre",
      "Jeg ser muligheter der andre ser problemer",
      "Jeg investerer i min egen utvikling"
    ],
    contribution: [
      "Jeg skaper verdi for meg selv og andre",
      "Jeg bygger en fremtid hvor jeg kan hjelpe andre",
      "Jeg er en positiv kraft i verden",
      "Jeg inspirerer andre til å ta ansvar for sin økonomi"
    ]
  };

  constructor(userId: string, initialProfile?: Partial<MotivationProfile>) {
    this.state = {
      userId,
      analysisDate: new Date().toISOString(),
      profile: {
        userId,
        motivationType: initialProfile?.motivationType || 'achievement',
        currentMood: initialProfile?.currentMood || 'neutral',
        energyLevel: initialProfile?.energyLevel || 'medium',
        stressLevel: initialProfile?.stressLevel || 'medium',
        goals: initialProfile?.goals || [],
        challenges: initialProfile?.challenges || [],
        strengths: initialProfile?.strengths || [],
        lastUpdated: new Date().toISOString()
      },
      messages: [],
      strategies: [],
      recentInteractions: [],
      agentVersion: this.agentVersion
    };
  }

  /**
   * Main orchestration method - LangGraph style workflow
   */
  async generateMotivation(context: any): Promise<MotivationAgentState> {
    try {
      // Step 1: Sensing - Analyze current state and context
      await this.sensing(context);
      
      // Step 2: Reasoning - Determine appropriate motivation approach
      await this.reasoning();
      
      // Step 3: Planning - Generate personalized messages and strategies
      await this.planning();
      
      // Step 4: Acting - Create actionable motivation content
      await this.acting();
      
      // Step 5: Learning - Update agent knowledge
      await this.learning();
      
      return this.state;
    } catch (error) {
      console.error('MotivationAgent analysis failed:', error);
      throw new Error(`Motivation generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Step 1: Sensing - Analyze current state and context
   */
  private async sensing(context: any): Promise<void> {
    console.log('🔍 [MotivationAgent] Sensing: Analyzing motivation context...');
    
    // Update profile based on context
    if (context.mood) {
      this.state.profile.currentMood = context.mood;
    }
    if (context.energyLevel) {
      this.state.profile.energyLevel = context.energyLevel;
    }
    if (context.stressLevel) {
      this.state.profile.stressLevel = context.stressLevel;
    }
    if (context.goals) {
      this.state.profile.goals = context.goals;
    }
    if (context.challenges) {
      this.state.profile.challenges = context.challenges;
    }
    
    this.state.profile.lastUpdated = new Date().toISOString();
    
    console.log(`✅ [MotivationAgent] Sensing complete: Mood=${this.state.profile.currentMood}, Energy=${this.state.profile.energyLevel}`);
  }

  /**
   * Step 2: Reasoning - Determine appropriate motivation approach
   */
  private async reasoning(): Promise<void> {
    console.log('🧠 [MotivationAgent] Reasoning: Determining motivation approach...');
    
    // Analyze mood and energy patterns
    const isLowEnergy = this.state.profile.energyLevel === 'low';
    const isStressed = this.state.profile.stressLevel === 'high' || this.state.profile.stressLevel === 'critical';
    const isFrustrated = this.state.profile.currentMood === 'frustrated' || this.state.profile.currentMood === 'overwhelmed';
    
    // Determine primary approach based on current state
    if (isFrustrated || isStressed) {
      // Focus on calming and reframing
      this.state.profile.motivationType = 'security';
    } else if (isLowEnergy) {
      // Focus on energizing and achievement
      this.state.profile.motivationType = 'achievement';
    }
    
    console.log(`✅ [MotivationAgent] Reasoning complete: Approach=${this.state.profile.motivationType}`);
  }

  /**
   * Step 3: Planning - Generate personalized messages and strategies
   */
  private async planning(): Promise<void> {
    console.log('📋 [MotivationAgent] Planning: Generating motivation strategies...');
    
    const strategies: MotivationStrategy[] = [];
    
    // Generate strategies based on current state
    if (this.state.profile.currentMood === 'frustrated') {
      strategies.push(await this.generateReframingStrategy());
      strategies.push(await this.generateChunkingStrategy());
    } else if (this.state.profile.currentMood === 'overwhelmed') {
      strategies.push(await this.generateChunkingStrategy());
      strategies.push(await this.generateVisualizationStrategy());
    } else if (this.state.profile.energyLevel === 'low') {
      strategies.push(await this.generateAnchoringStrategy());
      strategies.push(await this.generateFuturePacingStrategy());
    } else {
      strategies.push(await this.generateFuturePacingStrategy());
      strategies.push(await this.generateAnchoringStrategy());
    }
    
    this.state.strategies = strategies;
    
    console.log(`✅ [MotivationAgent] Planning complete: ${strategies.length} strategies generated`);
  }

  /**
   * Step 4: Acting - Create actionable motivation content
   */
  private async acting(): Promise<void> {
    console.log('⚡ [MotivationAgent] Acting: Creating motivation messages...');
    
    const messages: MotivationMessage[] = [];
    
    // Generate primary message based on current state
    const primaryMessage = await this.generatePrimaryMessage();
    messages.push(primaryMessage);
    
    // Generate supporting messages
    const supportingMessages = await this.generateSupportingMessages();
    messages.push(...supportingMessages);
    
    this.state.messages = messages;
    
    console.log(`✅ [MotivationAgent] Acting complete: ${messages.length} messages generated`);
  }

  /**
   * Step 5: Learning - Update agent knowledge
   */
  private async learning(): Promise<void> {
    console.log('🎓 [MotivationAgent] Learning: Updating knowledge base...');
    
    // In a real implementation, this would update the agent's knowledge base
    // with insights from the current interaction
    
    const insights = {
      motivationType: this.state.profile.motivationType,
      currentMood: this.state.profile.currentMood,
      energyLevel: this.state.profile.energyLevel,
      stressLevel: this.state.profile.stressLevel,
      strategiesUsed: this.state.strategies.length,
      messagesGenerated: this.state.messages.length
    };
    
    console.log('📊 Learning insights:', insights);
    console.log('✅ [MotivationAgent] Learning complete: Knowledge base updated');
  }

  /**
   * Generate primary motivation message
   */
  private async generatePrimaryMessage(): Promise<MotivationMessage> {
    const mood = this.state.profile.currentMood;
    const motivationType = this.state.profile.motivationType;
    
    let type: MotivationMessage['type'];
    let tone: MotivationMessage['tone'];
    let template: string;
    
    // Determine message type and tone based on current state
    if (mood === 'frustrated' || mood === 'overwhelmed') {
      type = 'guidance';
      tone = 'calm';
      template = this.coachingTemplates.guidance[Math.floor(Math.random() * this.coachingTemplates.guidance.length)];
    } else if (mood === 'excited' || mood === 'motivated') {
      type = 'challenge';
      tone = 'energetic';
      template = this.coachingTemplates.challenge[Math.floor(Math.random() * this.coachingTemplates.challenge.length)];
    } else {
      type = 'encouragement';
      tone = 'supportive';
      template = this.coachingTemplates.encouragement[Math.floor(Math.random() * this.coachingTemplates.encouragement.length)];
    }
    
    // Add personalized elements
    const personalizedElements = this.generatePersonalizedElements();
    const personalizedMessage = this.personalizeMessage(template, personalizedElements);
    
    return {
      id: `msg_${Date.now()}`,
      type,
      title: this.generateMessageTitle(type),
      message: personalizedMessage,
      tone,
      actionPrompt: this.generateActionPrompt(type),
      explanation: `Personalisert ${type}-melding basert på ${mood} humør og ${motivationType} motivasjonstype.`,
      confidence: 85,
      personalizedElements
    };
  }

  /**
   * Generate supporting messages
   */
  private async generateSupportingMessages(): Promise<MotivationMessage[]> {
    const messages: MotivationMessage[] = [];
    
    // Add anchoring message
    const anchoringMessage = await this.generateAnchoringMessage();
    messages.push(anchoringMessage);
    
    // Add future pacing message if appropriate
    if (this.state.profile.currentMood !== 'overwhelmed') {
      const futurePacingMessage = await this.generateFuturePacingMessage();
      messages.push(futurePacingMessage);
    }
    
    return messages;
  }

  /**
   * Generate anchoring message
   */
  private async generateAnchoringMessage(): Promise<MotivationMessage> {
    const motivationType = this.state.profile.motivationType;
    const phrases = this.anchoringPhrases[motivationType];
    const selectedPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    
    return {
      id: `anchor_${Date.now()}`,
      type: 'reminder',
      title: 'Forankring for din økonomiske reise',
      message: `Husk: ${selectedPhrase}. Dette er hvem du er og hvem du blir. 💎`,
      tone: 'supportive',
      actionPrompt: 'Gjenta denne setningen for deg selv tre ganger',
      explanation: `Forankring basert på ${motivationType} motivasjonstype for å styrke din identitet og mål.`,
      confidence: 90,
      personalizedElements: [motivationType, 'anchoring']
    };
  }

  /**
   * Generate future pacing message
   */
  private async generateFuturePacingMessage(): Promise<MotivationMessage> {
    const goals = this.state.profile.goals;
    const primaryGoal = goals[0] || 'økonomisk frihet';
    
    return {
      id: `future_${Date.now()}`,
      type: 'challenge',
      title: 'Se deg selv i fremtiden',
      message: `Steng øynene og se deg selv om 6 måneder. Du har oppnådd ${primaryGoal}. Hvordan føles det? Hva ville du si til deg selv i dag? 🔮`,
      tone: 'energetic',
      actionPrompt: 'Ta 2 minutter til å visualisere din fremtidige suksess',
      explanation: `Future pacing for å koble nåværende handlinger til fremtidige resultater og øke motivasjon.`,
      confidence: 80,
      personalizedElements: [primaryGoal, 'future_pacing']
    };
  }

  /**
   * Generate motivation strategies
   */
  private async generateAnchoringStrategy(): Promise<MotivationStrategy> {
    return {
      id: 'anchoring_strategy',
      name: 'Forankring',
      description: 'Bruk positive forankringer for å styrke din økonomiske identitet',
      technique: 'anchoring',
      targetMood: 'motivated',
      effectiveness: 85,
      explanation: 'Forankring hjelper deg å koble til din økonomiske identitet og styrke troen på dine evner.',
      steps: [
        'Identifiser din økonomiske identitet',
        'Velg positive forankringsuttrykk',
        'Gjenta forankringer daglig',
        'Koble forankringer til økonomiske handlinger'
      ],
      expectedOutcome: 'Økt selvtillit og konsistent handling mot økonomiske mål'
    };
  }

  private async generateFuturePacingStrategy(): Promise<MotivationStrategy> {
    return {
      id: 'future_pacing_strategy',
      name: 'Fremtidig pacing',
      description: 'Visualiser din økonomiske fremtid for å øke motivasjon',
      technique: 'future_pacing',
      targetMood: 'excited',
      effectiveness: 80,
      explanation: 'Future pacing kobler nåværende handlinger til fremtidige resultater og øker motivasjon.',
      steps: [
        'Visualiser din økonomiske fremtid',
        'Koble nåværende handlinger til fremtidige resultater',
        'Bruk alle sanser i visualiseringen',
        'Gjenta visualiseringen regelmessig'
      ],
      expectedOutcome: 'Økt motivasjon og klarhet om økonomiske mål'
    };
  }

  private async generateReframingStrategy(): Promise<MotivationStrategy> {
    return {
      id: 'reframing_strategy',
      name: 'Omramming',
      description: 'Endre perspektiv på utfordringer for å finne muligheter',
      technique: 'reframing',
      targetMood: 'neutral',
      effectiveness: 75,
      explanation: 'Omramming hjelper deg å se utfordringer som muligheter for vekst og læring.',
      steps: [
        'Identifiser negative tanker',
        'Spør: "Hva kan jeg lære av dette?"',
        'Se etter muligheter i utfordringen',
        'Fokuser på det du kan kontrollere'
      ],
      expectedOutcome: 'Redusert stress og økt problemløsningsevne'
    };
  }

  private async generateChunkingStrategy(): Promise<MotivationStrategy> {
    return {
      id: 'chunking_strategy',
      name: 'Oppdeling',
      description: 'Bryt store mål ned i mindre, håndterbare deler',
      technique: 'chunking',
      targetMood: 'neutral',
      effectiveness: 90,
      explanation: 'Oppdeling gjør store mål mer håndterbare og reduserer overveldelse.',
      steps: [
        'Identifiser det store målet',
        'Bryt det ned i mindre delmål',
        'Fokuser på ett steg om gangen',
        'Feire hver milepæl'
      ],
      expectedOutcome: 'Redusert overveldelse og økt fremgang'
    };
  }

  private async generateVisualizationStrategy(): Promise<MotivationStrategy> {
    return {
      id: 'visualization_strategy',
      name: 'Visualisering',
      description: 'Bruk mentale bilder for å styrke motivasjon og fokus',
      technique: 'visualization',
      targetMood: 'motivated',
      effectiveness: 80,
      explanation: 'Visualisering hjelper hjernen å forberede seg på suksess og øker motivasjon.',
      steps: [
        'Lag et klart mentalt bilde av målet',
        'Bruk alle sanser i visualiseringen',
        'Visualiser både prosessen og resultatet',
        'Gjør visualiseringen til en daglig rutine'
      ],
      expectedOutcome: 'Økt fokus og motivasjon for å oppnå mål'
    };
  }

  /**
   * Generate personalized elements
   */
  private generatePersonalizedElements(): string[] {
    const elements: string[] = [];
    
    if (this.state.profile.goals.length > 0) {
      elements.push(this.state.profile.goals[0]);
    }
    
    if (this.state.profile.strengths.length > 0) {
      elements.push(this.state.profile.strengths[0]);
    }
    
    elements.push(this.state.profile.motivationType);
    
    return elements;
  }

  /**
   * Personalize message with user-specific elements
   */
  private personalizeMessage(template: string, elements: string[]): string {
    let personalized = template;
    
    // Add user's primary goal if available
    if (elements.length > 0) {
      personalized = personalized.replace('målet ditt', elements[0]);
    }
    
    return personalized;
  }

  /**
   * Generate message title based on type
   */
  private generateMessageTitle(type: MotivationMessage['type']): string {
    const titles = {
      encouragement: 'Du har dette! 💪',
      challenge: 'Klar for neste steg? 🚀',
      celebration: 'Fantastisk jobb! 🎉',
      guidance: 'La oss finne en vei frem 📋',
      reminder: 'Husk hvorfor du startet 🧭'
    };
    
    return titles[type];
  }

  /**
   * Generate action prompt based on message type
   */
  private generateActionPrompt(type: MotivationMessage['type']): string {
    const prompts = {
      encouragement: 'Ta et dypt åndedrag og husk hvor sterk du er',
      challenge: 'Hva er det neste steget du kan ta i dag?',
      celebration: 'Feir denne seieren - du fortjener det!',
      guidance: 'Hvilken lille handling kan du ta nå?',
      reminder: 'Hvorfor startet du denne reisen?'
    };
    
    return prompts[type];
  }

  /**
   * Get explainability summary (≤240 characters)
   */
  getExplainabilitySummary(): string {
    const mood = this.state.profile.currentMood;
    const motivationType = this.state.profile.motivationType;
    const messageCount = this.state.messages.length;
    
    return `Motivasjonsanalyse: ${mood} humør, ${motivationType} type, ${messageCount} personlige meldinger generert med NLP-coaching og forankring.`;
  }

  /**
   * Get agent state for observability
   */
  getState(): MotivationAgentState {
    return { ...this.state };
  }
}
