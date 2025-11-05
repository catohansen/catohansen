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

import React from 'react';
import { TrendingUp, Code, Users, Award } from 'lucide-react';

const stats = [
  { icon: Code, value: '50+', label: 'Prosjekter Levert', color: 'from-blue-500 to-cyan-500' },
  { icon: TrendingUp, value: '15+', label: 'År Erfaring', color: 'from-purple-500 to-pink-500' },
  { icon: Users, value: '10+', label: 'Tilfredse Kunder', color: 'from-pink-500 to-rose-500' },
  { icon: Award, value: '20+', label: 'Teknologier Mestert', color: 'from-green-500 to-emerald-500' },
];

export default function StatsSection() {
  return (
    <section className="section-padding relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="text-center"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-4`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl md:text-5xl font-extrabold gradient-text mb-2">
                {stat.value}
              </div>
              <div className="text-slate-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

