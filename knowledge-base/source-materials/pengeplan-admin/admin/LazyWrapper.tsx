import React, { Suspense, lazy, ComponentType } from 'react'

interface LazyWrapperProps {
  component: () => Promise<{ default: ComponentType<any> }>
  fallback?: React.ReactNode
}

const LazyWrapper: React.FC<LazyWrapperProps> = ({ 
  component, 
  fallback = <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
}) => {
  const LazyComponent = lazy(component)

  return (
    <Suspense fallback={fallback}>
      <LazyComponent />
    </Suspense>
  )
}

export default LazyWrapper