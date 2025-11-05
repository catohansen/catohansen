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
 * Pengeplan 2.0 Progress Component
 * Real-time progress tracking with animations and stats from Spleis API
 */

'use client'

import { motion, useSpring, useTransform } from 'framer-motion'
import { useState, useEffect } from 'react'
import { TrendingUp, Users, Calendar, Target, DollarSign, Sparkles } from 'lucide-react'

interface SpleisData {
  raised: number
  goal: number
  supporters: number
  daysLeft: number
  progress: number
  currency: string
  recentDonations?: Array<{ name: string; amount: number; time: string }>
}

export default function PengeplanProgress() {
  const [data, setData] = useState<SpleisData>({
    raised: 0,
    goal: 100000,
    supporters: 0,
    daysLeft: 42,
    progress: 0,
    currency: 'NOK'
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/pengeplan/spleis', {
          next: { revalidate: 60 } // Revalidate every minute
        })
        
        if (!response.ok) throw new Error('Failed to fetch')
        
        const result = await response.json()
        if (result.success && result.data) {
          setData(result.data)
        }
      } catch (err: any) {
        console.error('Error fetching Spleis data:', err)
        setError(err.message)
        // Fallback to default values
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    // Poll every 60 seconds for updates
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  // Animated progress value
  const progress = useSpring(0, { stiffness: 100, damping: 30 })
  const progressPercent = useTransform(progress, (value) => Math.min(value, 100))

  useEffect(() => {
    if (data.progress > 0) {
      progress.set(data.progress)
    }
  }, [data.progress, progress])

  // Animated counters
  const [displayRaised, setDisplayRaised] = useState(0)
  const [displaySupporters, setDisplaySupporters] = useState(0)

  useEffect(() => {
    if (loading) {
      return () => {} // Empty cleanup when loading is true
    }

    // Animate raised amount
    const raisedDuration = 2000
    const raisedSteps = 60
    const raisedIncrement = data.raised / raisedSteps
    let raisedCurrent = 0

    const raisedTimer = setInterval(() => {
      raisedCurrent += raisedIncrement
      if (raisedCurrent >= data.raised) {
        setDisplayRaised(data.raised)
        clearInterval(raisedTimer)
      } else {
        setDisplayRaised(Math.floor(raisedCurrent))
      }
    }, raisedDuration / raisedSteps)

    // Animate supporter count
    const supporterDuration = 1500
    const supporterSteps = 60
    const supporterIncrement = data.supporters / supporterSteps
    let supporterCurrent = 0

    const supporterTimer = setInterval(() => {
      supporterCurrent += supporterIncrement
      if (supporterCurrent >= data.supporters) {
        setDisplaySupporters(data.supporters)
        clearInterval(supporterTimer)
      } else {
        setDisplaySupporters(Math.floor(supporterCurrent))
      }
    }, supporterDuration / supporterSteps)

    return () => {
      clearInterval(raisedTimer)
      clearInterval(supporterTimer)
    }
  }, [data, loading])

  const remaining = data.goal - data.raised

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="glass rounded-3xl p-8 md:p-12 border-2 border-purple-200 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-3xl md:text-4xl font-extrabold mb-2 gradient-text">
            Innsamlingsstatus
          </h3>
          <p className="text-gray-600">Følg fremdriften i sanntid</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent" />
            <p className="mt-4 text-gray-600">Laster inn...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">
            <p>Kunne ikke laste inn data. Prøv igjen senere.</p>
          </div>
        ) : (
          <>
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <div className="text-4xl md:text-5xl font-extrabold gradient-text">
                  {displayRaised.toLocaleString('no-NO')} {data.currency}
                </div>
                <div className="text-gray-600 text-lg md:text-xl">
                  av {data.goal.toLocaleString('no-NO')} {data.currency}
                </div>
              </div>

              <div className="relative w-full bg-gray-200 rounded-full h-8 overflow-hidden shadow-inner">
                <div
                  style={{ width: `${Math.min(data.progress, 100)}%` }}
                  className="h-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-full relative overflow-hidden transition-all duration-1500"
                >
                  <motion.div
                    animate={{
                      backgroundPosition: ['0%', '100%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: 'reverse',
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    style={{
                      backgroundSize: '200% 100%',
                    }}
                  />
                </div>
                
                {/* Percentage text on progress bar */}
                <div
                  className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm"
                >
                  <span>{Math.round(progressPercent.get())}%</span>
                </div>
              </div>

              <div className="text-center mt-4 text-lg font-semibold text-purple-600">
                {Math.round(progressPercent.get())}% finansiert
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { 
                  icon: Users, 
                  label: 'Støttende givere', 
                  value: displaySupporters,
                  color: 'from-blue-500 to-cyan-500'
                },
                { 
                  icon: Calendar, 
                  label: 'Dager igjen', 
                  value: data.daysLeft,
                  color: 'from-purple-500 to-pink-500'
                },
                { 
                  icon: Target, 
                  label: 'Gjenstår', 
                  value: `${remaining.toLocaleString('no-NO')} ${data.currency}`,
                  color: 'from-green-500 to-emerald-500'
                },
              ].map((stat, i) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="text-center glass rounded-2xl p-6 cursor-pointer transition-all"
                  >
                    <motion.div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-4`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                )
              })}
            </div>

            {/* Recent Donations */}
            {data.recentDonations && data.recentDonations.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  Nylige donasjoner
                </h4>
                <div className="space-y-3">
                  {data.recentDonations.slice(0, 3).map((donation, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between glass rounded-xl p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{donation.name}</div>
                          <div className="text-sm text-gray-500">{donation.time}</div>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-purple-600">
                        {donation.amount} {data.currency}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

