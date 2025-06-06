'use client'

import { useState, useEffect, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { createClientSupabaseClient } from '@/lib/supabase'
import type { Database } from '@/lib/database.types'
import { format, isToday, isYesterday } from 'date-fns'

type Message = Database['public']['Tables']['messages']['Row'] & {
  user: Database['public']['Tables']['users']['Row']
}

interface MessageListProps {
  chatId: string | null
  currentUser: Database['public']['Tables']['users']['Row'] | null
}

export default function MessageList({ chatId, currentUser }: MessageListProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const supabase = createClientSupabaseClient()

  useEffect(() => {
    if (!chatId) {
      setMessages([])
      return
    }

    fetchMessages()

    // Subscribe to new messages
    const channel = supabase.channel(`messages-${chatId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=eq.${chatId}`
      }, (payload) => {
        fetchMessages() // Refetch to get user data
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [chatId])

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  const fetchMessages = async () => {
    if (!chatId) return

    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          user:users (*)
        `)
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp)

    if (isToday(date)) {
      return format(date, 'HH:mm')
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, 'HH:mm')}`
    } else {
      return format(date, 'MMM d, HH:mm')
    }
  }

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {}

    messages.forEach(message => {
      const date = new Date(message.created_at)
      let dateKey: string

      if (isToday(date)) {
        dateKey = 'Today'
      } else if (isYesterday(date)) {
        dateKey = 'Yesterday'
      } else {
        dateKey = format(date, 'MMMM d, yyyy')
      }

      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(message)
    })

    return groups
  }

  if (!chatId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No chat selected</h3>
          <p className="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading messages...</p>
        </div>
      </div>
    )
  }

  const messageGroups = groupMessagesByDate(messages)

  return (
    <ScrollArea className="flex-1 bg-gray-50" ref={scrollAreaRef}>
      <div className="p-4">
        {Object.entries(messageGroups).map(([date, dateMessages]) => (
          <div key={date}>
            {/* Date separator */}
            <div className="flex items-center justify-center my-4">
              <div className="bg-white px-3 py-1 rounded-full text-xs text-gray-500 shadow-sm border">
                {date}
              </div>
            </div>

            {/* Messages for this date */}
            {dateMessages.map((message, index) => {
              const isCurrentUser = message.user_id === currentUser?.id
              const showAvatar = !isCurrentUser && (
                index === 0 ||
                dateMessages[index - 1]?.user_id !== message.user_id
              )
              const showUsername = !isCurrentUser && showAvatar

              return (
                <div
                  key={message.id}
                  className={`flex mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isCurrentUser && (
                    <div className="mr-3">
                      {showAvatar ? (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={message.user.avatar_url || undefined} />
                          <AvatarFallback>
                            {message.user.username.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-8 w-8" />
                      )}
                    </div>
                  )}

                  <div className={`max-w-xs lg:max-w-md ${isCurrentUser ? 'order-1' : ''}`}>
                    {showUsername && (
                      <p className={`text-xs mb-1 ml-3 font-medium ${
                        message.user.username.toLowerCase().includes('periskope') ||
                        message.user.username.toLowerCase().includes('system')
                          ? 'text-green-600'
                          : 'text-gray-500'
                      }`}>
                        {message.user.username}
                        {(message.user.username.toLowerCase().includes('periskope') ||
                          message.user.username.toLowerCase().includes('system')) && (
                          <span className="ml-1 text-xs bg-green-100 text-green-800 px-1 rounded">
                            System
                          </span>
                        )}
                      </p>
                    )}

                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        isCurrentUser
                          ? 'bg-blue-600 text-white rounded-br-md'
                          : 'bg-white text-gray-900 rounded-bl-md border'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                      {/* Message status indicators for sent messages */}
                      {isCurrentUser && (
                        <div className="flex items-center justify-end mt-1 space-x-1">
                          <span className="text-xs opacity-70">
                            {formatMessageTime(message.created_at)}
                          </span>
                          <div className="flex">
                            {/* Double checkmark for delivered/read */}
                            <svg className="w-3 h-3 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                            </svg>
                            <svg className="w-3 h-3 text-blue-200 -ml-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>

                    <p className={`text-xs text-gray-400 mt-1 ${isCurrentUser ? 'text-right' : 'ml-3'}`}>
                      {formatMessageTime(message.created_at)}
                    </p>
                  </div>

                  {isCurrentUser && (
                    <div className="ml-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={currentUser?.avatar_url || undefined} />
                        <AvatarFallback>
                          {currentUser?.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}

        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">👋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
            <p className="text-gray-500">Send a message to start the conversation</p>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}
