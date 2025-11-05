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
 * Robots.txt Generator
 * SEO-optimized robots.txt configuration
 */

import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.catohansen.no'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/hansen-hub',
          '/hansen-security',
          '/hansen-security/demo',
          '/hansen-security/docs',
          '/hansen-auth',
          '/hansen-crm',
          '/hansen-mindmap-2.0',
          '/pengeplan-2.0',
          '/pengeplan-2.0/spleis',
        ],
        disallow: [
          '/admin',
          '/api',
          '/_next',
          '/static',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/hansen-hub',
          '/hansen-security',
          '/hansen-security/demo',
          '/hansen-security/docs',
          '/hansen-auth',
          '/hansen-crm',
          '/hansen-mindmap-2.0',
          '/pengeplan-2.0',
        ],
        disallow: [
          '/admin',
          '/api',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}



