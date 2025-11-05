import { Metadata } from 'next'
import AdminChat from '@/components/admin/AdminChat'

export const metadata: Metadata = {
  title: 'Admin Chat - Pengeplan 2.0',
  description: 'Admin chat system for Pengeplan 2.0 administrators'
}

export default function AdminChatPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Chat System
        </h1>
        <p className="text-gray-600">
          Kommuniser med andre admin-brukere for å forbedre Pengeplan 2.0
        </p>
      </div>

      <AdminChat className="w-full" />
    </div>
  )
}
