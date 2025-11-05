import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function APIKeysPage() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('pengeplan_session')
  
  if (!sessionCookie) {
    redirect('/login')
  }

  // Fetch user data server-side
  let user = null
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/me`, {
      headers: {
        cookie: `pengeplan_session=${sessionCookie.value}`
      }
    })
    
    if (response.ok) {
      user = await response.json()
    }
  } catch (error) {
    console.error('Error fetching user data:', error)
  }

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
    redirect('/dashboard')
  }

  // Mock API keys data
  const apiKeys = [
    {
      id: '1',
      name: 'AI-Rådgiver Integration',
      key: 'pk_live_51H...abc123',
      status: 'active',
      usage: 1247,
      limit: 10000,
      createdAt: '2024-01-15',
      lastUsed: '2024-09-06T10:30:00Z'
    },
    {
      id: '2',
      name: 'NAV Støtteordninger API',
      key: 'pk_live_51H...def456',
      status: 'active',
      usage: 892,
      limit: 5000,
      createdAt: '2024-02-20',
      lastUsed: '2024-09-06T09:15:00Z'
    },
    {
      id: '3',
      name: 'Budsjett Kalkulator',
      key: 'pk_live_51H...ghi789',
      status: 'inactive',
      usage: 0,
      limit: 1000,
      createdAt: '2024-03-10',
      lastUsed: null
    }
  ]

  return (
    <div className="container mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  API Nøkler 🔑
            </h1>
                <p className="text-gray-600">
                  Administrer API nøkler for systemintegrasjoner
                </p>
              </div>
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg shadow-lg">
                Opprett ny nøkkel
              </button>
            </div>
          </div>

          {/* API Keys Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Aktive API Nøkler</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Navn</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">API Nøkkel</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bruk</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opprettet</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sist brukt</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Handlinger</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {apiKeys.map((key) => (
                    <tr key={key.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{key.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 font-mono">{key.key}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          key.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {key.status === 'active' ? 'Aktiv' : 'Inaktiv'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{key.usage.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">av {key.limit.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(key.createdAt).toLocaleDateString('no-NO')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {key.lastUsed ? new Date(key.lastUsed).toLocaleDateString('no-NO') : 'Aldri'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">Rediger</button>
                          <button className="text-red-600 hover:text-red-900">Slett</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* API Documentation */}
      <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">API Dokumentasjon</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Base URL</h4>
                <code className="text-sm text-gray-600 bg-white px-2 py-1 rounded">https://api.pengeplan.no/v1</code>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Autentisering</h4>
                <p className="text-sm text-gray-600 mb-2">Inkluder API nøkkel i Authorization header:</p>
                <code className="text-sm text-gray-600 bg-white px-2 py-1 rounded">Authorization: Bearer pk_live_...</code>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Endepunkter</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li><code className="bg-white px-1 rounded">GET /ai/advice</code> - AI-rådgivning</li>
                  <li><code className="bg-white px-1 rounded">GET /nav/schemes</code> - NAV støtteordninger</li>
                  <li><code className="bg-white px-1 rounded">POST /budget/calculate</code> - Budsjett kalkulator</li>
                </ul>
              </div>
            </div>
      </div>
    </div>
  )
}



