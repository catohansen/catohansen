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
 * Spleis & Crowdfunding Informasjon Side
 * Forklarer hva Spleis er, hvorfor vi bruker det, og hvordan crowdfunding fungerer
 */

'use client'

import dynamic from 'next/dynamic'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ParticlesBackground from '@/components/ParticlesBackground'
import { motion } from 'framer-motion'
import { 
  Heart, DollarSign, Users, Shield, CheckCircle2, 
  ArrowRight, Info, HelpCircle, TrendingUp, Gift,
  Sparkles, Rocket, Target, Clock
} from 'lucide-react'

export default function SpleisInfoPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <ParticlesBackground />
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-pink-600/10" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-8 shadow-2xl"
          >
            <Heart className="w-12 h-12 text-white" />
          </motion.div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6">
            <span className="gradient-text">Hva er Spleis?</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-slate-600 max-w-3xl mx-auto mb-8">
            Norges største innsamlingsplattform for crowdfunding
          </p>
          
          <motion.a
            href="/pengeplan-2.0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-lg shadow-2xl hover:shadow-purple-500/50 transition-all"
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
            Tilbake til Pengeplan 2.0
          </motion.a>
        </div>
      </section>

      {/* Hva er Spleis? */}
      <section className="section-padding relative z-10 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-3xl p-8 md:p-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Info className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold gradient-text">
                Hva er Spleis?
              </h2>
            </div>
            
            <div className="space-y-6 text-lg text-slate-700 leading-relaxed">
              <p>
                <strong className="text-purple-600">Spleis</strong> er Norges største innsamlingsplattform for crowdfunding, 
                eid av SpareBank 1. Plattformen lar organisasjoner, bedrifter og enkeltpersoner samle inn penger til 
                prosjekter, veldedighet, og utvikling.
              </p>
              
              <p>
                Spleis gjør det enkelt og trygt å donere penger til prosjekter du tror på. 
                Alt foregår via BankID, så både mottaker og giver er verifisert og trygg.
              </p>
              
              <div className="bg-purple-50 rounded-xl p-6 mt-6 border border-purple-200">
                <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-600" />
                  Hvorfor er Spleis trygt?
                </h3>
                <ul className="space-y-2 text-purple-800">
                  <li>✓ BankID-verifisert for både mottaker og giver</li>
                  <li>✓ Eid av SpareBank 1 - etablert og pålitelig</li>
                  <li>✓ Transparent bruk av midler med oversikt over donasjoner</li>
                  <li>✓ Trygg betaling via Vipps, kort eller faktura</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hva er Crowdfunding? */}
      <section className="section-padding relative z-10 bg-gradient-to-b from-white to-purple-50/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-3xl p-8 md:p-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold gradient-text">
                Hva er Crowdfunding?
              </h2>
            </div>
            
            <div className="space-y-6 text-lg text-slate-700 leading-relaxed">
              <p>
                <strong className="text-blue-600">Crowdfunding</strong> (folkefinansiering) betyr å samle inn penger 
                fra mange mennesker til ett prosjekt. I stedet for å få et stort lån fra én kilde, 
                får man små bidrag fra mange støttespillere.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white rounded-xl p-6 border-2 border-blue-200">
                  <Users className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">Mange Givere</h3>
                  <p className="text-sm text-gray-600">
                    I stedet for én stor investor, får vi støtte fra mange som tror på prosjektet
                  </p>
                </div>
                
                <div className="bg-white rounded-xl p-6 border-2 border-purple-200">
                  <Target className="w-12 h-12 text-purple-600 mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">Tydelig Mål</h3>
                  <p className="text-sm text-gray-600">
                    Vi setter et konkret mål (100,000 NOK) og viser fremdrift i sanntid
                  </p>
                </div>
                
                <div className="bg-white rounded-xl p-6 border-2 border-pink-200">
                  <Gift className="w-12 h-12 text-pink-600 mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">Givere Får Belønninger</h3>
                  <p className="text-sm text-gray-600">
                    Alle som donerer får eksklusive belønninger som VIP-tilgang til plattformen
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hvorfor bruker vi Spleis? */}
      <section className="section-padding relative z-10 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-3xl p-8 md:p-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold gradient-text">
                Hvorfor bruker vi Spleis?
              </h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                  <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    Vi jobber alene med private midler
                  </h3>
                  <p className="text-purple-800">
                    Jeg (Cato Hansen) jobber alene på Pengeplan 2.0 og bruker kun mine egne private penger. 
                    Din støtte hjelper meg å bygge videre, skalere infrastrukturen, og levere til alle som trenger det.
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-blue-600" />
                    Vi trenger støtte for utvikling
                  </h3>
                  <p className="text-blue-800">
                    Pengene går til server-infrastruktur, AI-tjenester (OpenAI, Hugging Face), 
                    og videreutvikling av funksjoner som gjør Pengeplan 2.0 bedre for alle.
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-600" />
                    Vi bygger et fellesskap
                  </h3>
                  <p className="text-green-800">
                    Givere blir en del av Pengeplan 2.0-familien. Du får VIP-tilgang, tidlig tilgang til nye funksjoner, 
                    og blir hørt når vi planlegger fremtiden for plattformen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hva trenger vi? */}
      <section className="section-padding relative z-10 bg-gradient-to-b from-purple-50/30 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-3xl p-8 md:p-12 border-2 border-purple-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold gradient-text">
                Hva trenger vi?
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <div className="text-3xl font-extrabold gradient-text mb-2">50,000 NOK</div>
                <div className="text-sm text-gray-600 mb-4">Server & Infrastruktur</div>
                <p className="text-sm text-gray-700">
                  Skalérbar hosting, database, CDN og backup-systemer for å håndtere mange brukere
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <div className="text-3xl font-extrabold gradient-text mb-2">30,000 NOK</div>
                <div className="text-sm text-gray-600 mb-4">AI-tjenester & API</div>
                <p className="text-sm text-gray-700">
                  OpenAI GPT-4, Hugging Face og andre AI API-kostnader for å drive intelligente funksjoner
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <div className="text-3xl font-extrabold gradient-text mb-2">20,000 NOK</div>
                <div className="text-sm text-gray-600 mb-4">Utvikling & Features</div>
                <p className="text-sm text-gray-700">
                  Videreutvikling av funksjoner, testing og QA for å sikre kvalitet
                </p>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-4xl font-extrabold gradient-text mb-2">100,000 NOK</div>
                <div className="text-lg text-gray-600">Totalt mål</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hvordan fungerer det? */}
      <section className="section-padding relative z-10 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-3xl p-8 md:p-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold gradient-text">
                Hvordan fungerer det?
              </h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-2">Du donerer via Spleis</h3>
                  <p className="text-gray-600">
                    Gå til vår Spleis-side og velg ditt bidrag. Du kan betale via Vipps, kort eller faktura.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-2">Du får VIP-tilgang</h3>
                  <p className="text-gray-600">
                    Etter din donasjon får du en e-post med VIP-kode og instruksjoner for å få tilgang til Pengeplan 2.0.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-2">Du blir en del av fellesskapet</h3>
                  <p className="text-gray-600">
                    Som VIP-bruker får du tidlig tilgang til nye funksjoner, eksklusive webinars, 
                    og mulighet til å påvirke fremtidig utvikling.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-2">Vi bygger videre sammen</h3>
                  <p className="text-gray-600">
                    Dine penger går direkte til utvikling og infrastruktur. Du kan følge fremdriften i sanntid.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding relative z-10 bg-gradient-to-b from-white to-purple-50/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass rounded-3xl p-12 border-4 border-purple-500 shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 gradient-text">
              Klar til å støtte Pengeplan 2.0?
            </h2>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Din støtte hjelper oss å bygge Norges første enterprise-grade AI økonomiplattform
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.a
                href="/pengeplan-2.0#spleis-cta"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-lg shadow-2xl hover:shadow-purple-500/50 transition-all flex items-center gap-3"
              >
                <Heart className="w-5 h-5" />
                Støtt via Spleis
                <ArrowRight className="w-5 h-5" />
              </motion.a>
              
              <motion.a
                href="/pengeplan-2.0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 glass rounded-full font-bold text-lg hover:bg-white/80 transition-all flex items-center gap-3"
              >
                Les mer om Pengeplan 2.0
              </motion.a>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}





