/**
 * Copyright (c) 2025 Cato Hansen. All rights reserved.
 * 
 * Proprietary - Unauthorized copying, modification, distribution, or use
 * of this software, via any medium is strictly prohibited without express
 * written permission from Cato Hansen.
 * 
 * @license PROPRIETARY
 * SPDX-License-Identifier: PROPRIETARY
 * @author Cato Hansen
 * @contact cato@catohansen.no
 * @website www.catohansen.no
 */

/**
 * Pricing Calculator
 * Interactive step-by-step pricing calculator with modern UX
 * 
 * Features:
 * - Step-by-step wizard interface
 * - Real-time price calculation
 * - Responsive design
 * - Progress tracking
 * - Visual feedback
 * - Accessible
 */

'use client'

import React, { useState, useEffect } from 'react'
import {
  Globe,
  Code2,
  Brain,
  ShoppingCart,
  CheckCircle2,
  ArrowRight,
  Calculator,
  Zap,
  Database,
  Palette,
  Shield,
  Rocket,
  Server,
  Smartphone,
  Info,
  Mail,
  Send,
  RefreshCw,
} from 'lucide-react'

type ServiceType =
  | 'nettside'
  | 'webapp'
  | 'ai-system'
  | 'ecommerce'
  | 'portfolio'
  | 'bedriftsnettsted'
  | 'saas-platform'

type StyleType = 'moderne' | 'klassisk' | 'minimalistisk' | 'bold' | 'premium'

type PageCount = '1-5' | '6-10' | '11-20' | '21-50' | '50+'

type Addon =
  | 'seo'
  | 'google-analytics'
  | 'kontaktskjema'
  | 'booking-system'
  | 'blog'
  | 'multilingual'
  | 'integrasjoner'
  | 'mobilapp'

type HostingPackage = 'basic' | 'standard' | 'premium' | 'enterprise'

interface PricingConfig {
  services: Record<ServiceType, number>
  styles: Record<StyleType, number>
  pages: Record<PageCount, number>
  addons: Record<Addon, number>
  hosting: Record<HostingPackage, { setup: number; monthly: number }>
}

const pricing: PricingConfig = {
  services: {
    nettside: 15000,
    webapp: 35000,
    'ai-system': 75000,
    ecommerce: 45000,
    portfolio: 12000,
    bedriftsnettsted: 25000,
    'saas-platform': 100000,
  },
  styles: {
    moderne: 0,
    klassisk: 2000,
    minimalistisk: 3000,
    bold: 4000,
    premium: 8000,
  },
  pages: {
    '1-5': 0,
    '6-10': 5000,
    '11-20': 12000,
    '21-50': 25000,
    '50+': 50000,
  },
  addons: {
    seo: 8000,
    'google-analytics': 2000,
    kontaktskjema: 3000,
    'booking-system': 10000,
    blog: 5000,
    multilingual: 12000,
    integrasjoner: 15000,
    mobilapp: 35000,
  },
  hosting: {
    basic: { setup: 0, monthly: 299 },
    standard: { setup: 2000, monthly: 599 },
    premium: { setup: 5000, monthly: 1299 },
    enterprise: { setup: 15000, monthly: 2999 },
  },
}

const serviceOptions = [
  {
    value: 'nettside' as ServiceType,
    label: 'Nettside',
    icon: Globe,
    desc: 'Standard nettside med flere sider',
  },
  {
    value: 'webapp' as ServiceType,
    label: 'Webapplikasjon',
    icon: Code2,
    desc: 'Interaktiv webapplikasjon',
  },
  {
    value: 'ai-system' as ServiceType,
    label: 'AI-system',
    icon: Brain,
    desc: 'AI/LLM-integrasjoner og agenter',
  },
  {
    value: 'ecommerce' as ServiceType,
    label: 'Nettbutikk',
    icon: ShoppingCart,
    desc: 'E-handelsplattform',
  },
  {
    value: 'portfolio' as ServiceType,
    label: 'Portfolio',
    icon: Palette,
    desc: 'Personlig/bransjefolio',
  },
  {
    value: 'bedriftsnettsted' as ServiceType,
    label: 'Bedriftsnettsted',
    icon: Rocket,
    desc: 'Komplett bedriftsnettsted',
  },
  {
    value: 'saas-platform' as ServiceType,
    label: 'SaaS-plattform',
    icon: Server,
    desc: 'Skalerbar SaaS-løsning',
  },
]

const styleOptions = [
  { value: 'moderne' as StyleType, label: 'Moderne', desc: 'Trendy og oppdatert design' },
  {
    value: 'klassisk' as StyleType,
    label: 'Klassisk',
    desc: 'Tidsløst og profesjonelt',
  },
  {
    value: 'minimalistisk' as StyleType,
    label: 'Minimalistisk',
    desc: 'Rent og fokusert',
  },
  { value: 'bold' as StyleType, label: 'Bold', desc: 'Kraftfullt og utfordrende' },
  { value: 'premium' as StyleType, label: 'Premium', desc: 'Luksuriøst og eksklusivt' },
]

const pageOptions = [
  { value: '1-5' as PageCount, label: '1-5 sider', price: 0 },
  { value: '6-10' as PageCount, label: '6-10 sider', price: 5000 },
  { value: '11-20' as PageCount, label: '11-20 sider', price: 12000 },
  { value: '21-50' as PageCount, label: '21-50 sider', price: 25000 },
  { value: '50+' as PageCount, label: '50+ sider', price: 50000 },
]

const addonOptions = [
  { value: 'seo' as Addon, label: 'SEO-optimalisering', icon: Zap, price: 8000 },
  {
    value: 'google-analytics' as Addon,
    label: 'Google Analytics',
    icon: Database,
    price: 2000,
  },
  { value: 'kontaktskjema' as Addon, label: 'Kontaktskjema', icon: Rocket, price: 3000 },
  {
    value: 'booking-system' as Addon,
    label: 'Bookingsystem',
    icon: ShoppingCart,
    price: 10000,
  },
  { value: 'blog' as Addon, label: 'Blogg', icon: Code2, price: 5000 },
  {
    value: 'multilingual' as Addon,
    label: 'Fler språk',
    icon: Globe,
    price: 12000,
  },
  {
    value: 'integrasjoner' as Addon,
    label: 'Integrasjoner',
    icon: Server,
    price: 15000,
  },
  { value: 'mobilapp' as Addon, label: 'Mobilapp', icon: Smartphone, price: 35000 },
]

const hostingOptions = [
  {
    value: 'basic' as HostingPackage,
    label: 'Basic',
    desc: 'For små prosjekter',
    monthly: 299,
  },
  {
    value: 'standard' as HostingPackage,
    label: 'Standard',
    desc: 'For de fleste prosjekter',
    monthly: 599,
  },
  {
    value: 'premium' as HostingPackage,
    label: 'Premium',
    desc: 'For store prosjekter',
    monthly: 1299,
  },
  {
    value: 'enterprise' as HostingPackage,
    label: 'Enterprise',
    desc: 'For bedrifter',
    monthly: 2999,
  },
]

export default function PricingCalculator() {
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null)
  const [selectedStyle, setSelectedStyle] = useState<StyleType | null>(null)
  const [selectedPages, setSelectedPages] = useState<PageCount | null>(null)
  const [selectedAddons, setSelectedAddons] = useState<Set<Addon>>(new Set())
  const [selectedHosting, setSelectedHosting] = useState<HostingPackage | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const calculateTotal = () => {
    let total = 0

    if (selectedService) {
      total += pricing.services[selectedService]
    }
    if (selectedStyle) {
      total += pricing.styles[selectedStyle]
    }
    if (selectedPages) {
      total += pricing.pages[selectedPages]
    }
    selectedAddons.forEach((addon) => {
      total += pricing.addons[addon]
    })
    if (selectedHosting) {
      total += pricing.hosting[selectedHosting].setup
    }

    return total
  }

  const monthlyHosting = selectedHosting
    ? pricing.hosting[selectedHosting].monthly
    : 0
  const total = calculateTotal()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('no-NO', {
      style: 'currency',
      currency: 'NOK',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const toggleAddon = (addon: Addon) => {
    const newAddons = new Set(selectedAddons)
    if (newAddons.has(addon)) {
      newAddons.delete(addon)
    } else {
      newAddons.add(addon)
    }
    setSelectedAddons(newAddons)
  }

  const handleNextStep = () => {
    if (step < 5 && canProceed()) {
      setStep(step + 1)
    }
  }

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedService !== null
      case 2:
        return selectedStyle !== null
      case 3:
        return selectedPages !== null
      case 4:
        return true // Addons are optional
      case 5:
        return selectedHosting !== null
      default:
        return false
    }
  }

  const handleSubmit = async () => {
    if (!canProceed()) return

    setSubmitting(true)
    try {
      // Scroll to contact section
      const contactElement = document.getElementById('contact')
      if (contactElement) {
        contactElement.scrollIntoView({ behavior: 'smooth' })
        // Auto-fill contact form with selections (if form exists)
        setTimeout(() => {
          const messageField = document.querySelector(
            '#contact textarea[name="message"]'
          ) as HTMLTextAreaElement
          if (messageField) {
            const selections = []
            if (selectedService) {
              const service = serviceOptions.find((s) => s.value === selectedService)
              selections.push(`Tjeneste: ${service?.label}`)
            }
            if (selectedStyle) {
              selections.push(`Designstil: ${selectedStyle}`)
            }
            if (selectedPages) {
              selections.push(`Antall sider: ${selectedPages}`)
            }
            if (selectedAddons.size > 0) {
              const addonLabels = Array.from(selectedAddons)
                .map((a) => addonOptions.find((opt) => opt.value === a)?.label)
                .filter(Boolean)
              selections.push(`Tillegg: ${addonLabels.join(', ')}`)
            }
            if (selectedHosting) {
              const hosting = hostingOptions.find((h) => h.value === selectedHosting)
              selections.push(`Hosting: ${hosting?.label}`)
            }
            selections.push(`\nTotalpris: ${formatPrice(total)}`)
            messageField.value = `Jeg er interessert i følgende løsning:\n\n${selections.join('\n')}`
          }
        }, 500)
      }
    } catch (error) {
      console.error('Error submitting:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const progress = ((step - 1) / 4) * 100

  return (
    <div className="section-padding relative z-10">
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            <span className="gradient-text">Pris-kalkulator</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Finn ut hva din nettside eller tjeneste koster. Konfigurer steg for
            steg og få en umiddelbar prisoversikt.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Kalkulator */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8">
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-600">
                    Steg {step} av 5
                  </span>
                  <span className="text-sm font-medium text-slate-600">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Steg-indikator */}
              <div className="flex items-center justify-between mb-6 sm:mb-8 gap-1 sm:gap-2">
                {[1, 2, 3, 4, 5].map((s) => {
                  const isActive = s === step
                  const isCompleted = s < step
                  return (
                    <React.Fragment key={s}>
                      <div className="flex items-center flex-1">
                        <div
                          className={`w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm rounded-full flex items-center justify-center font-bold transition-all ${
                            isCompleted
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                              : isActive
                                ? 'bg-blue-500 text-white ring-4 ring-blue-500/30'
                                : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          ) : (
                            s
                          )}
                        </div>
                      </div>
                      {s < 5 && (
                        <div
                          className={`flex-1 h-1 mx-1 sm:mx-2 hidden sm:block transition-all ${
                            isCompleted
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                              : 'bg-slate-200'
                          }`}
                        />
                      )}
                    </React.Fragment>
                  )
                })}
              </div>

              {/* Steg 1: Velg Tjeneste */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-2">
                      Velg Tjeneste
                    </h3>
                    <p className="text-sm text-slate-600">
                      Hvilken type løsning trenger du?
                    </p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    {serviceOptions.map((option) => {
                      const Icon = option.icon
                      const isSelected = selectedService === option.value
                      return (
                        <button
                          key={option.value}
                          onClick={() => setSelectedService(option.value)}
                          className={`p-6 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] ${
                            isSelected
                              ? 'border-purple-500 bg-purple-50 shadow-lg shadow-purple-500/20'
                              : 'border-slate-200 hover:border-purple-300'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                                isSelected
                                  ? 'bg-gradient-to-br from-blue-600 to-purple-600'
                                  : 'bg-slate-100'
                              }`}
                            >
                              <Icon
                                className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-slate-600'}`}
                              />
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-lg mb-1">
                                {option.label}
                              </div>
                              <div className="text-sm text-slate-600">
                                {option.desc}
                              </div>
                              <div className="mt-2 font-semibold text-purple-600">
                                Fra {formatPrice(pricing.services[option.value])}
                              </div>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="w-6 h-6 text-purple-600 flex-shrink-0" />
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Steg 2: Velg Stil */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-2">
                      Velg Designstil
                    </h3>
                    <p className="text-sm text-slate-600">
                      Hvilken designstil passer best til ditt prosjekt?
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {styleOptions.map((option) => {
                      const isSelected = selectedStyle === option.value
                      return (
                        <button
                          key={option.value}
                          onClick={() => setSelectedStyle(option.value)}
                          className={`p-6 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] ${
                            isSelected
                              ? 'border-purple-500 bg-purple-50 shadow-lg shadow-purple-500/20'
                              : 'border-slate-200 hover:border-purple-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-bold text-lg mb-1">
                                {option.label}
                              </div>
                              <div className="text-sm text-slate-600">
                                {option.desc}
                              </div>
                              {pricing.styles[option.value] > 0 && (
                                <div className="mt-2 font-semibold text-purple-600">
                                  +{formatPrice(pricing.styles[option.value])}
                                </div>
                              )}
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="w-6 h-6 text-purple-600 flex-shrink-0 ml-4" />
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Steg 3: Antall Sider */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-2">
                      Antall Sider
                    </h3>
                    <p className="text-sm text-slate-600">
                      Hvor mange sider trenger du?
                    </p>
                  </div>
                  <div className="space-y-3">
                    {pageOptions.map((option) => {
                      const isSelected = selectedPages === option.value
                      return (
                        <button
                          key={option.value}
                          onClick={() => setSelectedPages(option.value)}
                          className={`w-full p-4 rounded-xl border-2 text-left flex items-center justify-between transition-all hover:scale-[1.01] ${
                            isSelected
                              ? 'border-purple-500 bg-purple-50 shadow-md shadow-purple-500/20'
                              : 'border-slate-200 hover:border-purple-300'
                          }`}
                        >
                          <span className="font-medium">{option.label}</span>
                          <div className="flex items-center gap-3">
                            {option.price > 0 && (
                              <span className="text-sm text-slate-600">
                                +{formatPrice(option.price)}
                              </span>
                            )}
                            {isSelected && (
                              <CheckCircle2 className="w-5 h-5 text-purple-600" />
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Steg 4: Tillegg */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-2">
                      Tilleggsfunksjoner
                    </h3>
                    <p className="text-sm text-slate-600">
                      Velg flere alternativer (valgfritt)
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {addonOptions.map((option) => {
                      const Icon = option.icon
                      const isSelected = selectedAddons.has(option.value)
                      return (
                        <button
                          key={option.value}
                          onClick={() => toggleAddon(option.value)}
                          className={`p-4 rounded-xl border-2 text-left transition-all hover:scale-[1.01] ${
                            isSelected
                              ? 'border-purple-500 bg-purple-50 shadow-md shadow-purple-500/20'
                              : 'border-slate-200 hover:border-purple-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Icon className="w-5 h-5 text-purple-600" />
                              <div>
                                <div className="font-medium">{option.label}</div>
                                <div className="text-sm text-purple-600">
                                  +{formatPrice(option.price)}
                                </div>
                              </div>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0" />
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Steg 5: Driftspakke */}
              {step === 5 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-2">
                      Velg Driftspakke
                    </h3>
                    <p className="text-sm text-slate-600">
                      Hvilken hosting-pakke passer best?
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {hostingOptions.map((option) => {
                      const isSelected = selectedHosting === option.value
                      const hostingInfo = pricing.hosting[option.value]
                      return (
                        <button
                          key={option.value}
                          onClick={() => setSelectedHosting(option.value)}
                          className={`p-6 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] ${
                            isSelected
                              ? 'border-purple-500 bg-purple-50 shadow-lg shadow-purple-500/20'
                              : 'border-slate-200 hover:border-purple-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <div className="font-bold text-lg">{option.label}</div>
                              <div className="text-sm text-slate-600">
                                {option.desc}
                              </div>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="w-6 h-6 text-purple-600 flex-shrink-0 ml-4" />
                            )}
                          </div>
                          <div className="mt-3 pt-3 border-t border-slate-200">
                            <div className="text-sm text-slate-600">
                              Oppsett: {formatPrice(hostingInfo.setup)}
                            </div>
                            <div className="text-sm text-slate-600">
                              Månedlig: {formatPrice(hostingInfo.monthly)}
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Navigasjonsknapper */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-slate-200">
                <button
                  onClick={handlePrevStep}
                  disabled={step === 1}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all ${
                    step === 1
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'glass hover:bg-opacity-80'
                  }`}
                >
                  Tilbake
                </button>
                {step < 5 ? (
                  <button
                    onClick={handleNextStep}
                    disabled={!canProceed()}
                    className="px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold flex items-center justify-center gap-2 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    Neste
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!canProceed() || submitting}
                    className="px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold flex items-center justify-center gap-2 text-sm sm:text-base bg-gradient-to-r from-green-600 to-emerald-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-700 hover:to-emerald-700 transition-all"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Sender...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Forespørsel
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Prisoversikt */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 lg:sticky lg:top-24">
              <div className="flex items-center gap-3 mb-6">
                <Calculator className="w-8 h-8 text-purple-600" />
                <h3 className="text-2xl font-bold">Prisoversikt</h3>
              </div>

              <div className="space-y-4 mb-6">
                {selectedService && (
                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <span className="text-slate-600">Tjeneste</span>
                    <span className="font-semibold">
                      {formatPrice(pricing.services[selectedService])}
                    </span>
                  </div>
                )}
                {selectedStyle && pricing.styles[selectedStyle] > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <span className="text-slate-600">Designstil</span>
                    <span className="font-semibold">
                      {formatPrice(pricing.styles[selectedStyle])}
                    </span>
                  </div>
                )}
                {selectedPages && pricing.pages[selectedPages] > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <span className="text-slate-600">Ekstra sider</span>
                    <span className="font-semibold">
                      {formatPrice(pricing.pages[selectedPages])}
                    </span>
                  </div>
                )}
                {selectedAddons.size > 0 && (
                  <div className="py-2 border-b border-slate-200">
                    <div className="text-slate-600 mb-2">Tillegg</div>
                    {Array.from(selectedAddons).map((addon) => {
                      const option = addonOptions.find((o) => o.value === addon)
                      return (
                        <div
                          key={addon}
                          className="flex justify-between items-center text-sm mb-1"
                        >
                          <span className="text-slate-500">{option?.label}</span>
                          <span className="font-medium">
                            {formatPrice(pricing.addons[addon])}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
                {selectedHosting && (
                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <span className="text-slate-600">Oppsett hosting</span>
                    <span className="font-semibold">
                      {formatPrice(pricing.hosting[selectedHosting].setup)}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t-2 border-slate-300">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-bold">Totalpris (engangs)</span>
                  <span className="text-3xl font-extrabold gradient-text">
                    {formatPrice(total)}
                  </span>
                </div>
                {selectedHosting && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span className="text-slate-600">Månedlig hosting</span>
                      <span className="font-semibold">
                        {formatPrice(pricing.hosting[selectedHosting].monthly)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() =>
                  document
                    .getElementById('contact')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Book Konsultasjon
              </button>

              {total > 0 && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-900">
                      <p className="font-medium mb-1">Forespørsel klar!</p>
                      <p className="text-blue-700">
                        Trykk på &quot;Send Forespørsel&quot; for å videresende
                        konfigurasjonen til kontakt-skjemaet.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
