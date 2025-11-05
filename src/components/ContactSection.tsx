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

'use client';

import { Mail, Phone, Linkedin, Github, Globe, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', message: '' });
        // Reset success message after 5 seconds
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(data.error || 'Kunne ikke sende melding. Prøv igjen senere.');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setError('En feil oppstod. Prøv igjen senere.');
    } finally {
      setLoading(false);
    }
  };

  const contactMethods = [
    { icon: Mail, label: 'E-post', value: 'cato@catohansen.no', href: 'mailto:cato@catohansen.no' },
    { icon: Phone, label: 'Telefon', value: '+47 •• •• •• ••', href: 'tel:+47' },
    { icon: Linkedin, label: 'LinkedIn', value: 'LinkedIn Profil', href: 'https://www.linkedin.com/in/catohansen' },
    { icon: Github, label: 'GitHub', value: 'GitHub Profil', href: 'https://github.com/catohansen' },
    { icon: Globe, label: 'Nettside', value: 'catohansen.no', href: 'https://catohansen.no' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
          <span className="gradient-text">La Oss Jobbe Sammen</span>
        </h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Har du et prosjekt? La oss diskutere hvordan jeg kan hjelpe deg å bygge noe fantastisk
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="glass rounded-3xl p-8">
          <h3 className="text-2xl font-bold mb-6">Send en Melding</h3>
          
          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-600">
                Takk for henvendelsen! Vi kommer tilbake til deg så snart som mulig.
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                Navn
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                E-post
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                Melding
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || success}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
              {loading ? 'Sender...' : success ? 'Sendt!' : 'Send Melding'}
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="glass rounded-3xl p-8">
          <h3 className="text-2xl font-bold mb-6">Kontaktinformasjon</h3>
          <div className="space-y-6">
            {contactMethods.map((method, i) => (
              <a
                key={i}
                href={method.href}
                className="flex items-center gap-4 p-4 rounded-xl group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <method.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm text-slate-600">{method.label}</div>
                  <div className="font-semibold text-slate-900">{method.value}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

