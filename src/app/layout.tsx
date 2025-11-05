import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cato Hansen - AI Ekspert & Systemarkitekt',
  description: 'AI & LLM ekspert, systemarkitekt, webdesigner og entreprenør. Bygger innovative AI-systemer, skalerbare plattformer og digital innovasjon.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const NoraChatBubble = dynamic(() => import('@/modules/nora/ui/chat/NoraChatBubble'), {
    ssr: false,
    loading: () => null,
  })
  return (
    <html lang="no">
      <body>
        {children}
        <NoraChatBubble defaultOpen={false} enabled={true} />
      </body>
    </html>
  )
}

