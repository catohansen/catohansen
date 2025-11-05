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
 * Structured Data Component
 * JSON-LD structured data for SEO (Organization, Person, WebSite)
 */

export default function StructuredData() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Cato Hansen Agency",
    "alternateName": "Cato Hansen",
    "url": "https://www.catohansen.no",
    "logo": "https://www.catohansen.no/logo.png",
    "description": "AI & LLM ekspert, systemarkitekt, webdesigner og entreprenør. Bygger innovative AI-systemer, skalerbare plattformer og digital innovasjon.",
    "sameAs": [
      "https://www.linkedin.com/in/catohansen",
      "https://github.com/catohansen"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+47",
      "contactType": "customer service",
      "email": "cato@catohansen.no",
      "areaServed": "NO",
      "availableLanguage": ["Norwegian", "English"]
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Drøbak",
      "addressCountry": "NO"
    },
    "founder": {
      "@type": "Person",
      "name": "Cato Hansen"
    },
    "foundingDate": "2024"
  }

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Cato Hansen",
    "jobTitle": "AI Ekspert & Systemarkitekt",
    "description": "AI & LLM ekspert, systemarkitekt, webdesigner og entreprenør. Bygger innovative AI-systemer, skalerbare plattformer og digital innovasjon.",
    "url": "https://www.catohansen.no",
    "image": "https://www.catohansen.no/og-image.jpg",
    "email": "cato@catohansen.no",
    "telephone": "+47",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Drøbak",
      "addressRegion": "Akershus",
      "addressCountry": "NO"
    },
    "sameAs": [
      "https://www.linkedin.com/in/catohansen",
      "https://github.com/catohansen"
    ],
    "knowsAbout": [
      "Artificial Intelligence",
      "Machine Learning",
      "System Architecture",
      "Web Development",
      "Enterprise Software",
      "TypeScript",
      "Next.js",
      "AI Systems",
      "Authorization Systems",
      "CRM Systems"
    ],
    "alumniOf": {
      "@type": "Organization",
      "name": "Cato Hansen Agency"
    }
  }

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Cato Hansen",
    "alternateName": "Cato Hansen Agency",
    "url": "https://www.catohansen.no",
    "description": "AI & LLM ekspert, systemarkitekt, webdesigner og entreprenør. Bygger innovative AI-systemer, skalerbare plattformer og digital innovasjon.",
    "publisher": {
      "@type": "Organization",
      "name": "Cato Hansen Agency",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.catohansen.no/logo.png"
      }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.catohansen.no/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "mainEntity": {
      "@type": "Person",
      "name": "Cato Hansen"
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  )
}



