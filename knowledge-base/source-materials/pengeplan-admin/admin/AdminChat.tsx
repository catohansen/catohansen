'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  Send, 
  Users, 
  Plus, 
  MoreVertical,
  Smile,
  Paperclip,
  Phone,
  Video,
  Settings,
  Search,
  Filter,
  Archive,
  Trash2,
  Edit,
  Reply,
  ThumbsUp,
  Heart,
  Laugh,
  Angry,
  Sad
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'

interface AdminChatRoom {
  id: string
  name: string
  description?: string
  isPrivate: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
  participants: AdminChatParticipant[]
  messages: AdminChatMessage[]
  _count: {
    messages: number
    participants: number
  }
}

interface AdminChatParticipant {
  id: string
  roomId: string
  userId: string
  role: string
  joinedAt: string
  lastSeen: string
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

interface AdminChatMessage {
  id: string
  roomId: string
  senderId: string
  content: string
  messageType: string
  metadata?: any
  isEdited: boolean
  editedAt?: string
  isDeleted: boolean
  deletedAt?: string
  createdAt: string
  sender: {
    id: string
    name: string
    email: string
    role: string
  }
  reactions: AdminChatReaction[]
}

interface AdminChatReaction {
  id: string
  messageId: string
  userId: string
  emoji: string
  createdAt: string
  user: {
    id: string
    name: string
  }
}

interface AdminChatProps {
  className?: string
}

const emojiReactions = ['👍', '❤️', '😂', '😮', '😢', '😡', '🎉', '👏']

export default function AdminChat({ className }: AdminChatProps) {
  const [rooms, setRooms] = useState<AdminChatRoom[]>([])
  const [selectedRoom, setSelectedRoom] = useState<AdminChatRoom | null>(null)
  const [messages, setMessages] = useState<AdminChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [showCreateRoom, setShowCreateRoom] = useState(false)
  const [newRoomName, setNewRoomName] = useState('')
  const [newRoomDescription, setNewRoomDescription] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Fetch rooms
  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/admin/chat/rooms')
      const data = await response.json()
      
      if (data.success) {
        setRooms(data.data)
        if (data.data.length > 0 && !selectedRoom) {
          setSelectedRoom(data.data[0])
        }
      }
    } catch (error) {
      console.error('Error fetching rooms:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch messages for selected room
  const fetchMessages = async (roomId: string) => {
    try {
      const response = await fetch(`/api/admin/chat/rooms/${roomId}/messages`)
      const data = await response.json()
      
      if (data.success) {
        setMessages(data.data)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom || isSending) return

    setIsSending(true)
    try {
      const response = await fetch(`/api/admin/chat/rooms/${selectedRoom.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage,
          messageType: 'text'
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setMessages(prev => [...prev, data.data])
        setNewMessage('')
        // Scroll to bottom
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsSending(false)
    }
  }

  // Create new room
  const createRoom = async () => {
    if (!newRoomName.trim()) return

    try {
      const response = await fetch('/api/admin/chat/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newRoomName,
          description: newRoomDescription,
          isPrivate
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setRooms(prev => [data.data, ...prev])
        setSelectedRoom(data.data)
        setShowCreateRoom(false)
        setNewRoomName('')
        setNewRoomDescription('')
        setIsPrivate(false)
      }
    } catch (error) {
      console.error('Error creating room:', error)
    }
  }

  // Add reaction to message
  const addReaction = async (messageId: string, emoji: string) => {
    try {
      const response = await fetch(`/api/admin/chat/messages/${messageId}/reactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emoji })
      })

      if (response.ok) {
        // Refresh messages to show updated reactions
        if (selectedRoom) {
          fetchMessages(selectedRoom.id)
        }
      }
    } catch (error) {
      console.error('Error adding reaction:', error)
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  useEffect(() => {
    if (selectedRoom) {
      fetchMessages(selectedRoom.id)
    }
  }, [selectedRoom])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('nb-NO', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'I dag'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'I går'
    } else {
      return date.toLocaleDateString('nb-NO')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className={`flex h-[600px] bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Admin Chat</h2>
            <Button
              size="sm"
              onClick={() => setShowCreateRoom(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Ny chat
            </Button>
          </div>
          
          {showCreateRoom && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3 p-3 bg-gray-50 rounded-lg"
            >
              <Input
                placeholder="Chat navn"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
              />
              <Input
                placeholder="Beskrivelse (valgfritt)"
                value={newRoomDescription}
                onChange={(e) => setNewRoomDescription(e.target.value)}
              />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="private"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                />
                <label htmlFor="private" className="text-sm text-gray-600">
                  Privat chat
                </label>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" onClick={createRoom} className="bg-green-600 hover:bg-green-700">
                  Opprett
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setShowCreateRoom(false)}
                >
                  Avbryt
                </Button>
              </div>
            </motion.div>
          )}
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {rooms.map((room) => (
              <motion.div
                key={room.id}
                whileHover={{ backgroundColor: '#f3f4f6' }}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedRoom?.id === room.id ? 'bg-blue-50 border border-blue-200' : ''
                }`}
                onClick={() => setSelectedRoom(room)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <MessageCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{room.name}</h3>
                      <p className="text-sm text-gray-500">
                        {room._count.participants} medlemmer
                      </p>
                    </div>
                  </div>
                  {room.isPrivate && (
                    <Badge variant="secondary" className="text-xs">
                      Privat
                    </Badge>
                  )}
                </div>
                {room.messages.length > 0 && (
                  <p className="text-sm text-gray-600 mt-1 truncate">
                    {room.messages[0].content}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedRoom.name}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedRoom._count.participants} medlemmer
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline">
                    <Users className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea ref={messagesContainerRef} className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message, index) => {
                  const prevMessage = index > 0 ? messages[index - 1] : null
                  const showDate = !prevMessage || 
                    formatDate(message.createdAt) !== formatDate(prevMessage.createdAt)
                  
                  return (
                    <div key={message.id}>
                      {showDate && (
                        <div className="text-center text-sm text-gray-500 my-4">
                          {formatDate(message.createdAt)}
                        </div>
                      )}
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex space-x-2 max-w-xs lg:max-w-md ${message.senderId === 'current-user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>
                              {message.sender.name?.charAt(0) || 'A'}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className={`rounded-lg px-3 py-2 ${
                            message.senderId === 'current-user' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-xs font-medium">
                                {message.sender.name}
                              </span>
                              <span className="text-xs opacity-70">
                                {formatTime(message.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm">{message.content}</p>
                            
                            {/* Reactions */}
                            {message.reactions.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {message.reactions.map((reaction) => (
                                  <span
                                    key={reaction.id}
                                    className="text-xs bg-white bg-opacity-20 rounded-full px-2 py-1"
                                  >
                                    {reaction.emoji} {reaction.user.name}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Skriv en melding..."
                    className="resize-none"
                    rows={1}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        sendMessage()
                      }
                    }}
                  />
                  <div className="absolute right-2 top-2 flex space-x-1">
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || isSending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Quick Reactions */}
              <div className="flex space-x-1 mt-2">
                {emojiReactions.map((emoji) => (
                  <Button
                    key={emoji}
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-lg"
                    onClick={() => {
                      // Add reaction to last message or create new message with reaction
                      if (messages.length > 0) {
                        addReaction(messages[messages.length - 1].id, emoji)
                      }
                    }}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Velg en chat for å begynne</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
