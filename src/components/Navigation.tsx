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

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Brain, Package, ChevronDown, Shield, DollarSign, Lock } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHubMenuOpen, setIsHubMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation items - use page-specific links or fallback to homepage
  const isModulePage = pathname?.startsWith('/hansen-') || pathname === '/pengeplan-2.0' || pathname === '/demo-admin';
  
  const navItems = [
    { label: 'Kompetanse', href: isModulePage ? '/' : '#expertise' },
    { label: 'Løsninger', href: isModulePage ? '/' : '#solutions' },
    { label: 'Portefølje', href: isModulePage ? '/' : '#portfolio' },
    { label: 'Priser', href: isModulePage ? '/' : '#pricing' },
    { label: 'Kontakt', href: isModulePage ? '/' : '#contact' },
  ];

  const hubModules = [
    { label: 'Hansen Hub', href: '/hansen-hub', icon: Package, badge: 'All' },
    { label: 'Nora', href: '/nora', icon: Brain, badge: 'AI' },
    { label: 'Hansen Security', href: '/hansen-security', icon: Shield, badge: 'Featured' },
    { label: 'Hansen Auth', href: '/hansen-auth', icon: Lock, badge: 'New' },
    { label: 'Pengeplan 2.0', href: '/pengeplan-2.0', icon: DollarSign, badge: 'New' },
  ];

  // Check if we're on demo-admin, hansen-auth, or hansen-security page - always show white background
  const isDemoAdmin = pathname === '/demo-admin';
  const isHansenAuth = pathname === '/hansen-auth';
  const isHansenSecurity = pathname === '/hansen-security';
  
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-navigation transition-all duration-300 ${
        isDemoAdmin || isHansenAuth || isHansenSecurity || isScrolled ? 'bg-white shadow-lg border-b border-gray-300' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <motion.a
            href="/"
            className="flex items-center gap-3 text-xl font-bold text-slate-900 hover:text-purple-600 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span>Cato Hansen</span>
          </motion.a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <motion.a
                key={item.href}
                href={item.href}
                className="text-slate-900 hover:text-purple-600 font-semibold transition-colors"
              >
                {item.label}
              </motion.a>
            ))}
            
            {/* Hansen Hub Dropdown */}
            <div className="relative">
              <motion.button
                onClick={() => setIsHubMenuOpen(!isHubMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold hover:shadow-lg transition-all"
              >
                <Package className="w-4 h-4" />
                Hansen Hub
                <ChevronDown className={`w-4 h-4 transition-transform ${isHubMenuOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {isHubMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 mt-2 w-64 glass rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-dropdown"
                  >
                    <div className="p-2">
                      {hubModules.map((module) => {
                        const Icon = module.icon
                        return (
                          <motion.a
                            key={module.href}
                            href={module.href}
                            onClick={() => setIsHubMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/50 transition-colors group"
                          >
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-900">{module.label}</span>
                                {module.badge && (
                                  <span className="px-2 py-0.5 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold">
                                    {module.badge}
                                  </span>
                                )}
                              </div>
                            </div>
                          </motion.a>
                        )
                      })}
                      <div className="border-t border-slate-200 mt-2 pt-2">
                        <motion.a
                          href="/hansen-hub"
                          onClick={() => setIsHubMenuOpen(false)}
                          className="flex items-center justify-center gap-2 px-4 py-3 text-purple-600 font-semibold hover:bg-purple-50 rounded-xl transition-colors"
                        >
                          Se Alle Moduler <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                        </motion.a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition-all"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Book Møte
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t"
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block text-slate-700 hover:text-purple-600 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              
              {/* Mobile Hansen Hub */}
              <div className="pt-2 border-t border-slate-200">
                <a
                  href="/hansen-hub"
                  className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Package className="w-5 h-5" />
                  Hansen Hub
                </a>
                <div className="mt-2 pl-4 space-y-2">
                  {hubModules.slice(1).map((module) => {
                    const Icon = module.icon
                    return (
                      <a
                        key={module.href}
                        href={module.href}
                        className="flex items-center gap-3 text-sm text-slate-600 hover:text-purple-600"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon className="w-4 h-4" />
                        {module.label}
                      </a>
                    )
                  })}
                </div>
              </div>
              
              <button 
                className="w-full px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Book Møte
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

