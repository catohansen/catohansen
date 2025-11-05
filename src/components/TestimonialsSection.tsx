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

import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Kunde A',
    role: 'CEO, Startup',
    content: 'Cato leverte en komplett AI-løsning som gikk langt utover våre forventninger. Prosjektet ble levert på tid og innenfor budsjett.',
    rating: 5,
  },
  {
    name: 'Kunde B',
    role: 'CTO, Enterprise',
    content: 'Hans ekspertise innen systemarkitektur og sikkerhet var avgjørende for vårt prosjekt. Vi anbefaler ham på det sterkeste.',
    rating: 5,
  },
  {
    name: 'Kunde C',
    role: 'Founder, SaaS',
    content: 'Fra idé til produksjon – Cato guidet oss gjennom hele prosessen med profesjonalitet og kreativitet. Fantastisk opplevelse!',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
          <span className="gradient-text">Hva Kunder Sier</span>
        </h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Anbefalinger fra kunder som har jobbet med meg
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, i) => (
          <div
            key={i}
            className="glass rounded-3xl p-6"
          >
            <Quote className="w-12 h-12 text-purple-500 mb-4" />
            <p className="text-slate-700 mb-4 leading-relaxed italic">
              &ldquo;{testimonial.content}&rdquo;
            </p>
            <div className="flex gap-1 mb-4">
              {[...Array(testimonial.rating)].map((_, j) => (
                <span key={j} className="text-yellow-400">★</span>
              ))}
            </div>
            <div>
              <div className="font-bold text-slate-900">{testimonial.name}</div>
              <div className="text-sm text-slate-600">{testimonial.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

