import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
  typescript: true,
})

// Stripe Price IDs for different plans and credit packs
export const STRIPE_PRICES = {
  // Subscription plans
  START: process.env.STRIPE_PRICE_START || 'price_start_plan',
  PRO: process.env.STRIPE_PRICE_PRO || 'price_pro_plan', 
  PREMIUM: process.env.STRIPE_PRICE_PREMIUM || 'price_premium_plan',
  
  // Credit packs
  PACK_50: process.env.STRIPE_PRICE_PACK_50 || 'price_pack_50_credits',
  PACK_200: process.env.STRIPE_PRICE_PACK_200 || 'price_pack_200_credits',
} as const

// Credit pack configurations
export const CREDIT_PACKS = {
  PACK_50: {
    credits: 50,
    priceNok: 4900, // 49 NOK in øre
    description: '50 AI-spørsmål',
  },
  PACK_200: {
    credits: 200,
    priceNok: 14900, // 149 NOK in øre
    description: '200 AI-spørsmål',
  },
} as const

// Plan configurations
export const PLAN_CONFIGS = {
  START: {
    name: 'Startpakke',
    priceNok: 9900, // 99 NOK in øre
    billingCycle: 'month' as const,
    includedQuota: 5,
    billingCycleType: 'DAILY' as const,
  },
  PRO: {
    name: 'Pro',
    priceNok: 19900, // 199 NOK in øre
    billingCycle: 'month' as const,
    includedQuota: 100,
    billingCycleType: 'MONTHLY' as const,
  },
  PREMIUM: {
    name: 'Premium',
    priceNok: 29900, // 299 NOK in øre
    billingCycle: 'month' as const,
    includedQuota: 250,
    billingCycleType: 'MONTHLY' as const,
  },
} as const
