/**
 * Copyright (c) 2025 Cato Hansen. All rights reserved.
 * 
 * Proprietary - Unauthorized copying, modification, distribution, or use
 * of this software, via any medium is strictly prohibited without express
 * written permission from Cato Hansen.
 * 
 * @license PROPRIETARY
 * SPDX-License-Identifier: PROPRIETARY
 * @author Cato Hansen
 * @contact cato@catohansen.no
 * @website www.catohansen.no
 */

/**
 * Module Dependency Graph
 * Interactive visualization of module dependencies
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Network, ZoomIn, ZoomOut, RefreshCw, Download, Info } from 'lucide-react'
import Link from 'next/link'

interface GraphNode {
  id: string
  name: string
  displayName: string
  version: string
  status: string
  buildStatus: string
  category?: string
  position: { x: number; y: number }
}

interface GraphEdge {
  id: string
  source: string
  target: string
  type: string
  label?: string
}

export default function DependencyGraphPage() {
  const router = useRouter()
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const [edges, setEdges] = useState<GraphEdge[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    fetchGraph()
  }, [])

  const fetchGraph = async () => {
    try {
      const response = await fetch('/api/modules/graph', {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch dependency graph')
      }

      const data = await response.json()
      setNodes(data.graph.nodes || [])
      setEdges(data.graph.edges || [])

      // Simple layout algorithm (force-directed would be better)
      layoutNodes(data.graph.nodes || [])
    } catch (error) {
      console.error('Error fetching graph:', error)
    } finally {
      setLoading(false)
    }
  }

  const layoutNodes = (graphNodes: GraphNode[]) => {
    // Simple grid layout (could use force-directed algorithm)
    const cols = Math.ceil(Math.sqrt(graphNodes.length))
    const spacing = 250
    const centerX = 400
    const centerY = 400

    const positioned = graphNodes.map((node, index) => {
      const row = Math.floor(index / cols)
      const col = index % cols
      
      return {
        ...node,
        position: {
          x: centerX + (col - cols / 2) * spacing,
          y: centerY + (row - cols / 2) * spacing,
        },
      }
    })

    setNodes(positioned)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SYNCED':
        return 'text-green-500'
      case 'SYNCING':
        return 'text-yellow-500'
      case 'ERROR':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  const getBuildStatusColor = (status: string) => {
    switch (status) {
      case 'PASSING':
        return 'bg-green-500'
      case 'FAILING':
        return 'bg-red-500'
      case 'PENDING':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Module Dependency Graph
          </h1>
          <p className="text-gray-400 mt-2">
            Visualize module dependencies and relationships
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setZoom(Math.min(zoom + 0.1, 2))}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <ZoomIn className="w-4 h-4" />
            Zoom In
          </button>
          <button
            onClick={() => setZoom(Math.max(zoom - 0.1, 0.5))}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <ZoomOut className="w-4 h-4" />
            Zoom Out
          </button>
          <button
            onClick={fetchGraph}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Graph Visualization */}
      <div className="relative bg-gray-900 rounded-xl border border-gray-700 overflow-hidden" style={{ height: '800px' }}>
        <svg width="100%" height="100%" className="absolute inset-0">
          {/* Render edges */}
          {edges.map((edge) => {
            const sourceNode = nodes.find((n) => n.id === edge.source)
            const targetNode = nodes.find((n) => n.id === edge.target)

            if (!sourceNode || !targetNode) return null

            const x1 = sourceNode.position.x * zoom
            const y1 = sourceNode.position.y * zoom
            const x2 = targetNode.position.x * zoom
            const y2 = targetNode.position.y * zoom

            return (
              <line
                key={edge.id}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={edge.type === 'runtime' ? '#3b82f6' : '#8b5cf6'}
                strokeWidth="2"
                strokeDasharray={edge.type === 'dev' ? '5,5' : 'none'}
              />
            )
          })}

          {/* Render nodes */}
          {nodes.map((node) => {
            const x = node.position.x * zoom
            const y = node.position.y * zoom

            return (
              <g
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className="cursor-pointer"
              >
                {/* Node circle */}
                <circle
                  cx={x}
                  cy={y}
                  r="30"
                  fill={selectedNode?.id === node.id ? '#3b82f6' : '#4b5563'}
                  stroke={getBuildStatusColor(node.buildStatus)}
                  strokeWidth="3"
                  className="hover:opacity-80 transition-opacity"
                />
                {/* Node label */}
                <text
                  x={x}
                  y={y + 60}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="12"
                  className="pointer-events-none"
                >
                  {node.displayName}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Info Panel */}
        {selectedNode && (
          <div className="absolute top-4 right-4 bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 border border-gray-700 max-w-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">{selectedNode.displayName}</h3>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-400">Version:</span>{' '}
                <span className="text-white">{selectedNode.version}</span>
              </div>
              <div>
                <span className="text-gray-400">Status:</span>{' '}
                <span className={getStatusColor(selectedNode.status)}>
                  {selectedNode.status}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Build:</span>{' '}
                <span className={getStatusColor(selectedNode.buildStatus)}>
                  {selectedNode.buildStatus}
                </span>
              </div>
              {selectedNode.category && (
                <div>
                  <span className="text-gray-400">Category:</span>{' '}
                  <span className="text-white">{selectedNode.category}</span>
                </div>
              )}
            </div>
            <div className="pt-4 border-t border-gray-700">
              <Link
                href={`/admin/modules?moduleId=${selectedNode.id}`}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                View Module Details →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold mb-4">Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span>Synced</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <span>Syncing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span>Error</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-blue-500"></div>
            <span>Runtime Dependency</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-purple-500 border-dashed border-t-2"></div>
            <span>Dev Dependency</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm">Total Modules</p>
          <p className="text-2xl font-bold mt-2">{nodes.length}</p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm">Dependencies</p>
          <p className="text-2xl font-bold mt-2">{edges.length}</p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm">Synced Modules</p>
          <p className="text-2xl font-bold mt-2">
            {nodes.filter((n) => n.status === 'SYNCED').length}
          </p>
        </div>
      </div>
    </div>
  )
}





