import { redirect } from 'next/navigation'

import { getSessionFromCookie } from '@/lib/auth'
import AppShell from '@/components/layout/AppShell'

import ModuleAdmin from './parts/ModuleAdmin'

export default async function AdminModulesPage() {
  const session = await getSessionFromCookie()
  
  if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPERADMIN')) {
    redirect('/login')
  }

  return (
    <AppShell role={session.role as any} user={session}>
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🛍️ Moduladministrasjon
          </h1>
          <p className="text-gray-600">
            Administrer tilgjengelige moduler, priser og funksjoner for Pengeplan 2.0
          </p>
        </div>
        
        <ModuleAdmin />
      </div>
    </AppShell>
  )
}

