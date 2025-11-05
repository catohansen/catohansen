'use client'

import Link from 'next/link'
import { FileX, Home, ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white/80 backdrop-blur rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileX className="h-8 w-8 text-orange-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Side ikke funnet
        </h1>
        
        <p className="text-gray-600 mb-6">
          Denne admin-siden eksisterer ikke. Sjekk URL-en eller gå tilbake til admin-dashboardet.
        </p>
        
        <div className="space-y-3">
          <Button asChild className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
            <Link href="/admin">
              <Home className="h-4 w-4 mr-2" />
              Admin Dashboard
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="w-full"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Gå tilbake
          </Button>
        </div>
      </div>
    </div>
  )
}


