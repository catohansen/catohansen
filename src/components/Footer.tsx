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

import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Brain, Linkedin, Github, Mail } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  
  // Check if we're on demo-admin, hansen-auth, or hansen-security page - use dark theme
  const isDemoAdmin = pathname === '/demo-admin';
  const isHansenAuth = pathname === '/hansen-auth';
  const isHansenSecurity = pathname === '/hansen-security';
  const isDarkPage = isDemoAdmin || isHansenAuth || isHansenSecurity;
  const isModulePage = pathname?.startsWith('/hansen-') || pathname === '/pengeplan-2.0' || pathname === '/demo-admin';
  
  const textColor = isDarkPage ? 'text-slate-300' : 'text-slate-600';
  const headingColor = isDarkPage ? 'text-white' : 'text-slate-900';
  const linkColor = isDarkPage ? 'text-slate-300 hover:text-purple-400' : 'text-slate-600 hover:text-purple-600';
  const borderColor = isDarkPage ? 'border-slate-700' : 'border-slate-200';
  const logoColor = isDarkPage ? 'text-white' : 'gradient-text';

  return (
    <footer className={`relative z-10 border-t ${borderColor} mt-20 ${isDemoAdmin ? 'bg-gray-950/50' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <motion.a
              href="/"
              className="flex items-center gap-3 mb-4 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className={`text-xl font-bold ${logoColor}`}>Cato Hansen</span>
            </motion.a>
            <p className={`${textColor} text-sm leading-relaxed`}>
              AI ekspert, systemarkitekt og entreprenør. Bygger innovative løsninger som virker.
            </p>
          </div>
          
          <div>
            <h3 className={`font-bold mb-4 ${headingColor}`}>Navigasjon</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href={isModulePage ? '/' : '#expertise'} className={`${linkColor} transition-colors`}>
                  Kompetanse
                </a>
              </li>
              <li>
                <a href={isModulePage ? '/' : '#portfolio'} className={`${linkColor} transition-colors`}>
                  Portefølje
                </a>
              </li>
              <li>
                <a href={isModulePage ? '/' : '#contact'} className={`${linkColor} transition-colors`}>
                  Kontakt
                </a>
              </li>
              <li>
                <a href="/hansen-hub" className={`${linkColor} transition-colors`}>
                  Hansen Hub
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className={`font-bold mb-4 ${headingColor}`}>Følg Meg</h3>
            <div className="flex gap-4">
              <motion.a
                href="https://www.linkedin.com/in/catohansen"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white hover:scale-110 transition-transform"
              >
                <Linkedin className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://github.com/catohansen"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white hover:scale-110 transition-transform"
              >
                <Github className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="mailto:cato@catohansen.no"
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white hover:scale-110 transition-transform"
              >
                <Mail className="w-5 h-5" />
              </motion.a>
            </div>
          </div>
        </div>
        
        <div className={`border-t ${borderColor} pt-8 text-center text-sm ${textColor}`}>
          <p>© {currentYear} Cato Hansen. Alle rettigheter forbeholdt.</p>
        </div>
      </div>
    </footer>
  );
}

