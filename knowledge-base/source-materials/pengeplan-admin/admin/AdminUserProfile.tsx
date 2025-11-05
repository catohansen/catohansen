'use client'

import { useState, useEffect } from 'react'
import { 
  User, 
  ChevronDown, 
  Settings, 
  LogOut, 
  Shield, 
  Key, 
  Bell, 
  HelpCircle, 
  Activity,
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle
} from 'lucide-react'
// Utility function for class names
function cn(...inputs) {
  return inputs.filter(Boolean).join(' ')
}

interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  lastLogin: Date
  sessionExpires: Date
  twoFactorEnabled: boolean
  passwordLastChanged: Date
}

const mockUser: UserProfile = {
  id: 'cato-hansen',
  name: 'Cato Hansen',
  email: 'cato@catohansen.no',
  role: 'Super Administrator',
  lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  sessionExpires: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
  twoFactorEnabled: true,
  passwordLastChanged: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
}

interface AdminUserProfileProps {
  className?: string
}

export function AdminUserProfile({ className }: AdminUserProfileProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [showSessionInfo, setShowSessionInfo] = useState(false)
  const [user, setUser] = useState<UserProfile>(mockUser)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showCurrent: false,
    showNew: false,
    showConfirm: false
  })
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  const formatTime = (date: Date) => {
    return date.toLocaleDateString('nb-NO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getSessionTimeLeft = () => {
    const now = new Date()
    const diff = user.sessionExpires.getTime() - now.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days}d ${hours}t igjen`
    if (hours > 0) return `${hours}t igjen`
    return 'Utløper snart'
  }

  const getPasswordAge = () => {
    const now = new Date()
    const diff = now.getTime() - user.passwordLastChanged.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days < 30) return { text: `${days} dager siden`, color: 'text-green-600' }
    if (days < 90) return { text: `${days} dager siden`, color: 'text-yellow-600' }
    return { text: `${days} dager siden`, color: 'text-red-600' }
  }

  const handlePasswordChange = async () => {
    setIsChangingPassword(true)
    setPasswordError('')
    setPasswordSuccess(false)

    // Validation
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Nye passord matcher ikke')
      setIsChangingPassword(false)
      return
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('Nytt passord må være minst 8 tegn')
      setIsChangingPassword(false)
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update user data
      setUser(prev => ({
        ...prev,
        passwordLastChanged: new Date()
      }))
      
      setPasswordSuccess(true)
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        showCurrent: false,
        showNew: false,
        showConfirm: false
      })
      
      setTimeout(() => {
        setShowPasswordForm(false)
        setPasswordSuccess(false)
      }, 2000)
      
    } catch (error) {
      setPasswordError('Kunne ikke endre passord. Prøv igjen.')
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleLogout = () => {
    // Clear session and redirect to login
    if (confirm('Er du sikker på at du vil logge ut?')) {
      // Clear cookies/localStorage
      document.cookie = 'pengeplan_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      window.location.href = '/login'
    }
  }

  const passwordAge = getPasswordAge()

  return (
    <div className={cn('relative', className)}>
      {/* User Profile Button */}
      <div className="flex items-center space-x-3">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">{user.name}</p>
          <p className="text-xs text-gray-500">{user.role}</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <ChevronDown className={cn(
              'h-4 w-4 text-gray-400 transition-transform',
              isOpen && 'rotate-180'
            )} />
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {/* User Info Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
            </div>
          </div>

          {/* Session Info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Sesjon</span>
              <button
                onClick={() => setShowSessionInfo(!showSessionInfo)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                {showSessionInfo ? 'Skjul' : 'Vis detaljer'}
              </button>
            </div>
            <div className="text-sm text-gray-600">
              {getSessionTimeLeft()}
            </div>
            {showSessionInfo && (
              <div className="mt-3 space-y-2 text-xs text-gray-500">
                <div>Sist innlogging: {formatTime(user.lastLogin)}</div>
                <div>Utløper: {formatTime(user.sessionExpires)}</div>
                <div className="flex items-center gap-2">
                  <span>2FA:</span>
                  {user.twoFactorEnabled ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      Aktivert
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center gap-1">
                      <X className="h-3 w-3" />
                      Deaktivert
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Password Security */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Passord</span>
              <span className={cn('text-xs', passwordAge.color)}>
                {passwordAge.text}
              </span>
            </div>
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Endre passord
            </button>
          </div>

          {/* Password Change Form */}
          {showPasswordForm && (
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              {passwordSuccess ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="h-4 w-4" />
                  <span className="text-sm">Passord endret!</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {passwordError && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>{passwordError}</span>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Nåværende passord</label>
                    <div className="relative">
                      <input
                        type={passwordForm.showCurrent ? 'text' : 'password'}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nåværende passord"
                      />
                      <button
                        type="button"
                        onClick={() => setPasswordForm(prev => ({ ...prev, showCurrent: !prev.showCurrent }))}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        {passwordForm.showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Nytt passord</label>
                    <div className="relative">
                      <input
                        type={passwordForm.showNew ? 'text' : 'password'}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nytt passord (minst 8 tegn)"
                      />
                      <button
                        type="button"
                        onClick={() => setPasswordForm(prev => ({ ...prev, showNew: !prev.showNew }))}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        {passwordForm.showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Bekreft nytt passord</label>
                    <div className="relative">
                      <input
                        type={passwordForm.showConfirm ? 'text' : 'password'}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Bekreft nytt passord"
                      />
                      <button
                        type="button"
                        onClick={() => setPasswordForm(prev => ({ ...prev, showConfirm: !prev.showConfirm }))}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        {passwordForm.showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={handlePasswordChange}
                      disabled={isChangingPassword}
                      className="flex-1 bg-blue-600 text-white text-sm py-2 px-3 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isChangingPassword ? 'Endrer...' : 'Endre passord'}
                    </button>
                    <button
                      onClick={() => setShowPasswordForm(false)}
                      className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                    >
                      Avbryt
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={() => {
                window.location.href = '/admin/profile'
                setIsOpen(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <User className="h-4 w-4" />
              Min profil
            </button>
            
            <button
              onClick={() => {
                window.location.href = '/admin/settings'
                setIsOpen(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Settings className="h-4 w-4" />
              Innstillinger
            </button>
            
            <button
              onClick={() => {
                window.location.href = '/admin/security'
                setIsOpen(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Shield className="h-4 w-4" />
              Sikkerhet
            </button>
            
            <button
              onClick={() => {
                window.location.href = '/admin/activity'
                setIsOpen(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Activity className="h-4 w-4" />
              Aktivitetslogg
            </button>
            
            <button
              onClick={() => {
                window.location.href = '/admin/help'
                setIsOpen(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <HelpCircle className="h-4 w-4" />
              Hjelp & Support
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-200 py-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Logg ut
            </button>
          </div>
        </div>
      )}
    </div>
  )
}


















