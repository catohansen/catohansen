'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface ProjectToggle {
  id: string
  key: string
  value: boolean | object
  description: string
  category: string
  dependencies?: string
  updatedAt: string
}

export default function AdminProjectPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [toggles, setToggles] = useState<ProjectToggle[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [favorites, setFavorites] = useState<string[]>([])
  const [sentryTestResult, setSentryTestResult] = useState<string>('')
  
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('pengeplan_session')
      if (session) {
        try {
          const userData = JSON.parse(session).user
          if (userData.role === 'admin') {
            setUser(userData)
            loadToggles()
            loadFavorites()
          } else {
            router.push('/dashboard')
          }
        } catch (error) {
          console.error('Error parsing session:', error)
          localStorage.removeItem('pengeplan_session')
          router.push('/')
        }
      } else {
        router.push('/')
      }
    }
    setIsLoading(false)
  }, [router])

  const loadToggles = async () => {
    try {
      const response = await fetch('/api/admin/toggles')
      if (response.ok) {
        const data = await response.json()
        setToggles(data)
      }
    } catch (error) {
      console.error('Error loading toggles:', error)
    }
  }

  const loadFavorites = () => {
    const saved = localStorage.getItem('pengeplan_favorites')
    if (saved) {
      setFavorites(JSON.parse(saved))
    }
  }

  const handleToggleChange = async (id: string, value: boolean) => {
    try {
      const response = await fetch(`/api/admin/toggles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value })
      })
      
      if (response.ok) {
        await loadToggles()
      }
    } catch (error) {
      console.error('Error updating toggle:', error)
    }
  }

  const toggleFavorite = (key: string) => {
    const newFavorites = favorites.includes(key)
      ? favorites.filter(f => f !== key)
      : [...favorites, key]
    
    setFavorites(newFavorites)
    localStorage.setItem('pengeplan_favorites', JSON.stringify(newFavorites))
  }

  const handleSentryTest = async (type: 'server' | 'client') => {
    try {
      setSentryTestResult('Sender test...')
      
      if (type === 'server') {
        const response = await fetch('/api/admin/sentry-test', {
          method: 'POST'
        })
        const result = await response.json()
        setSentryTestResult(`Server test: ${result.success ? '✅ Suksess' : '❌ Feil'}`)
      } else {
        // Client-side test
        throw new Error('Sentry test: deliberate client error')
      }
    } catch {
      setSentryTestResult(`Client test: ✅ Feil sendt til Sentry`)
    }
  }

  // const handleLogout = () => {
  //   if (typeof window !== 'undefined') {
  //     localStorage.removeItem('pengeplan_session')
  //   }
  //   router.push('/')
  // }

  const filteredToggles = toggles.filter(toggle => {
    const matchesSearch = toggle.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         toggle.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || toggle.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedToggles = filteredToggles.sort((a, b) => {
    const aFav = favorites.includes(a.key)
    const bFav = favorites.includes(b.key)
    if (aFav && !bFav) return -1
    if (!aFav && bFav) return 1
    return a.key.localeCompare(b.key)
  })

  const categories = ['all', ...Array.from(new Set(toggles.map(t => t.category)))]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pp-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pp-purple mx-auto mb-4"></div>
          <p className="text-gray-600">Laster admin panel...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-pp-light flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Ingen tilgang</h2>
          <p className="text-gray-600 mb-4">Du må være admin for å se denne siden</p>
          <Link href="/" className="btn-primary">
            Gå til innlogging
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Project Management ⚙️
        </h1>
        <p className="text-gray-600">
          Administrer feature toggles, system status og testing
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sentry Testing */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentry Testing</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Test Sentry error logging</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSentryTest('server')}
                        className="btn-primary text-sm px-3 py-2"
                      >
                        Server Test
                      </button>
                      <button
                        onClick={() => handleSentryTest('client')}
                        className="btn-secondary text-sm px-3 py-2"
                      >
                        Client Test
                      </button>
                    </div>
                  </div>
                  {sentryTestResult && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">{sentryTestResult}</p>
                    </div>
                  )}
                </div>
              </div>

        {/* System Status */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">API</span>
                    </div>
                    <span className="text-xs text-green-600">Operativ</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">Database</span>
                    </div>
                    <span className="text-xs text-green-600">Koblet</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm font-medium">Stripe</span>
                    </div>
                    <span className="text-xs text-yellow-600">Deaktivert</span>
                  </div>
                </div>
              </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Totalt toggles:</span>
                    <span className="text-sm font-medium">{toggles.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Aktive:</span>
                    <span className="text-sm font-medium">{toggles.filter(t => t.value === true).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Favoritter:</span>
                    <span className="text-sm font-medium">{favorites.length}</span>
                  </div>
                </div>
              </div>
            </div>

      {/* Feature Toggles */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mt-8">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Feature Toggles</h3>
                <div className="flex items-center space-x-4 mt-4">
                  {/* Search */}
                  <input
                    type="text"
                    placeholder="Søk toggles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pp-purple"
                  />
                  {/* Category Filter */}
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pp-purple"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'Alle kategorier' : category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="space-y-4">
                {sortedToggles.map((toggle) => (
                  <div key={toggle.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-medium text-gray-900">{toggle.key}</p>
                        <button
                          onClick={() => toggleFavorite(toggle.key)}
                          className="text-gray-400 hover:text-yellow-500"
                        >
                          {favorites.includes(toggle.key) ? '⭐' : '☆'}
                        </button>
                        {favorites.includes(toggle.key) && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                            Favoritt
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{toggle.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {toggle.category}
                        </span>
                        {toggle.dependencies && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            Avhenger av: {toggle.dependencies}
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          Oppdatert: {new Date(toggle.updatedAt).toLocaleString('nb-NO')}
                        </span>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={toggle.value as boolean}
                        onChange={(e) => handleToggleChange(toggle.id, e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pp-purple rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pp-purple"></div>
                    </label>
                  </div>
                ))}
        </div>
      </div>
    </div>
  )
}
