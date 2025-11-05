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

import { motion } from 'framer-motion';
import { Code2, Brain, Rocket, Sparkles, Cpu, Zap } from 'lucide-react';

const icons = [
  { Icon: Brain, delay: 0, position: { top: '10%', left: '5%' } },
  { Icon: Code2, delay: 0.5, position: { top: '20%', right: '10%' } },
  { Icon: Rocket, delay: 1, position: { bottom: '15%', left: '8%' } },
  { Icon: Sparkles, delay: 1.5, position: { bottom: '25%', right: '5%' } },
  { Icon: Cpu, delay: 2, position: { top: '50%', left: '3%' } },
  { Icon: Zap, delay: 2.5, position: { top: '60%', right: '3%' } },
];

export default function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {icons.map(({ Icon, delay, position }, i) => (
        <motion.div
          key={i}
          className="absolute will-change-transform"
          style={{ ...position, willChange: 'transform' }}
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{
            opacity: [0, 1, 0.5, 1],
            scale: [0, 1.2, 0.9, 1],
            rotate: [0, 360],
            y: [0, -30, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay,
            ease: 'easeInOut',
          }}
        >
          <Icon className="w-12 h-12 md:w-16 md:h-16 text-purple-400/30" />
        </motion.div>
      ))}
    </div>
  );
}

