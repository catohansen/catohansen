import { redirect } from 'next/navigation'

import { getSessionFromCookie } from '@/lib/auth'
import AppShell from '@/components/layout/AppShell'

import TeamAdmin from './parts/TeamAdmin'

export default async function AdminTeamsPage() {
  const session = await getSessionFromCookie()
  
  if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPERADMIN')) {
    redirect('/login')
  }

  return (
    <AppShell role={session.role as any} user={session}>
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            👥 Team-administrasjon
          </h1>
          <p className="text-gray-600">
            Administrer team, innstillinger og maler for organisasjoner
          </p>
        </div>
        
        <TeamAdmin />
      </div>
    </AppShell>
  )
}
