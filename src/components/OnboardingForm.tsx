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
 * Onboarding Form Component
 * Complete onboarding with name, phone, SMS verification, and email login
 * Can be used on landing page
 */

'use client'

import { useState } from 'react'
import { User, Mail, Phone, Lock, Shield, CheckCircle2, ArrowRight, AlertCircle, Eye, EyeOff, Send } from 'lucide-react'
import { motion } from 'framer-motion'

interface OnboardingFormProps {
  onSuccess?: (data: { name: string; email: string; phone: string }) => void
  onError?: (error: string) => void
  className?: string
}

export default function OnboardingForm({ onSuccess, onError, className = '' }: OnboardingFormProps) {
  const [step, setStep] = useState<'info' | 'sms' | 'email'>('info')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [smsCode, setSmsCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [smsSent, setSmsSent] = useState(false)

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name || !phone || !email) {
      setError('Vennligst fyll ut alle felt')
      return
    }

    // Phone validation (Norwegian format)
    const phoneRegex = /^(\+47|0047)?[2-9]\d{7}$/
    const cleanPhone = phone.replace(/\s/g, '')
    if (!phoneRegex.test(cleanPhone)) {
      setError('Ugyldig telefonnummer. Bruk norsk format (+47 123 45 678)')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Ugyldig e-postadresse')
      return
    }

    setLoading(true)

    try {
      // Send SMS verification code
      const response = await fetch('/api/admin/onboarding/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: cleanPhone, email, name }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSmsSent(true)
        setStep('sms')
      } else {
        setError(data.error || 'Kunne ikke sende SMS')
      }
    } catch (err: any) {
      setError('En feil oppstod. Prøv igjen.')
      onError?.(err.message || 'En feil oppstod')
    } finally {
      setLoading(false)
    }
  }

  const handleSMSVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (smsCode.length !== 6) {
      setError('SMS-kode må være 6 siffer')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/admin/onboarding/verify-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, smsCode, email }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setStep('email')
      } else {
        setError(data.error || 'Ugyldig SMS-kode')
      }
    } catch (err: any) {
      setError('En feil oppstod. Prøv igjen.')
      onError?.(err.message || 'En feil oppstod')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Passord må være minst 8 tegn')
      return
    }

    if (password !== confirmPassword) {
      setError('Passordene stemmer ikke overens')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/admin/onboarding/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        onSuccess?.({ name, email, phone })
        // Redirect to admin or success page
        window.location.href = '/admin'
      } else {
        setError(data.error || 'Kunne ikke opprette konto')
        onError?.(data.error || 'Kunne ikke opprette konto')
      }
    } catch (err: any) {
      setError('En feil oppstod. Prøv igjen.')
      onError?.(err.message || 'En feil oppstod')
    } finally {
      setLoading(false)
    }
  }

  const resendSMS = async () => {
    setLoading(true)
    try {
      const cleanPhone = phone.replace(/\s/g, '')
      await fetch('/api/admin/onboarding/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone, email, name }),
      })
      setSmsSent(true)
    } catch (err) {
      setError('Kunne ikke sende SMS på nytt')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {[
          { id: 'info', label: 'Info', active: step === 'info', completed: step !== 'info' },
          { id: 'sms', label: 'SMS', active: step === 'sms', completed: step === 'email' },
          { id: 'email', label: 'E-post', active: step === 'email', completed: false }
        ].map((s, index) => (
          <div key={s.id} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-semibold transition-all ${
              s.completed
                ? 'bg-green-500 border-green-500 text-white'
                : s.active
                ? 'bg-purple-600 border-purple-600 text-white'
                : 'bg-white/5 border-white/20 text-gray-400'
            }`}>
              {s.completed ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
            </div>
            {index < 2 && (
              <div className={`w-16 h-0.5 mx-2 ${
                s.completed ? 'bg-green-500' : 'bg-white/20'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-3"
        >
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-400">{error}</p>
        </motion.div>
      )}

      {/* Step 1: Info */}
      {step === 'info' && (
        <motion.form
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onSubmit={handleInfoSubmit}
          className="space-y-4"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
              Navn
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Ditt fulle navn"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
              Telefonnummer
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="+47 123 45 678"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              E-postadresse
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="din@epost.no"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? 'Sender SMS...' : (
              <>
                <span>Send SMS-kode</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </motion.form>
      )}

      {/* Step 2: SMS Verification */}
      {step === 'sms' && (
        <motion.form
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onSubmit={handleSMSVerify}
          className="space-y-4"
        >
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-300">
              Vi har sendt en 6-sifret kode til <strong className="text-white">{phone}</strong>
            </p>
          </div>

          <div>
            <label htmlFor="smsCode" className="block text-sm font-medium text-white mb-2">
              SMS-kode
            </label>
            <input
              id="smsCode"
              type="text"
              value={smsCode}
              onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              maxLength={6}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="000000"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setStep('info')}
              className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              Tilbake
            </button>
            <button
              type="submit"
              disabled={loading || smsCode.length !== 6}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifiserer...' : 'Verifiser'}
            </button>
          </div>

          <button
            type="button"
            onClick={resendSMS}
            disabled={loading}
            className="w-full text-sm text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send SMS-kode på nytt
          </button>
        </motion.form>
      )}

      {/* Step 3: Email Login Setup */}
      {step === 'email' && (
        <motion.form
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onSubmit={handleEmailSubmit}
          className="space-y-4"
        >
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <p className="text-sm font-semibold text-white">SMS Verifisert!</p>
            </div>
            <p className="text-sm text-gray-300">
              Sett opp e-post innlogging for {email}
            </p>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
              Passord
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Minst 8 tegn"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
              Bekreft Passord
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Bekreft passord"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setStep('sms')}
              className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              Tilbake
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? 'Oppretter konto...' : (
                <>
                  <span>Fullfør Registrering</span>
                  <Shield className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </motion.form>
      )}
    </div>
  )
}



