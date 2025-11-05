/**
 * Lazy Loading Pattern for Next.js
 * Brukes for å laste komponenter kun når de trengs
 */

import dynamic from 'next/dynamic';

// Eksempel: Lazy load en tung komponent
// const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
//   loading: () => <div className="h-96">Laster...</div>, // Loading state
//   ssr: true, // Server-side rendering (default: true)
// });

// Eksempel: Lazy load med no SSR
// const ClientOnlyComponent = dynamic(
//   () => import('@/components/ClientOnlyComponent'),
//   {
//     ssr: false, // Ikke render på server
//   }
// );

/**
 * Bruk dette mønsteret for:
 * - Store komponenter som ikke er viktige for initial load
 * - Komponenter som krever browser APIs
 * - Third-party komponenter
 */

