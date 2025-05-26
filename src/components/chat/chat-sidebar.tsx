'use client'

import { useState, useEffect, useCallback } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  FiSearch,
  FiFilter,
  FiPlus,
  FiSettings,
  FiUser,
  FiMessageSquare,
  FiMoreVertical,
  FiUsers
} from 'react-icons/fi'
import { createClientSupabaseClient } from '@/lib/supabase'
import type { Database } from '@/lib/database.types'

type User = Database['public']['Tables']['users']['Row']

type ChatMember = {
  user_id: string
  users: {
    username: string
    avatar_url?: string
  }
}

type Chat = Database['public']['Tables']['chats']['Row'] & {
  chat_members?: ChatMember[]
  last_message?: {
    content: string
    created_at: string
    user: { username: string }
  }
  unread_count?: number
}

interface ChatSidebarProps {
  selectedChatId: string | null
  onChatSelect: (chatId: string) => void
  currentUser: User | null
}

export default function ChatSidebar({ selectedChatId, onChatSelect, currentUser }: ChatSidebarProps) {
  const [chats, setChats] = useState<Chat[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'direct' | 'group'>('all')
  const supabase = createClientSupabaseClient()

  const fetchChats = useCallback(async () => {
    if (!currentUser) return

    try {
      const { data: chatMembers, error } = await supabase
        .from('chat_members')
        .select(`
          chat_id,
          chats!inner (
            id,
            name,
            type,
            created_by,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', currentUser.id)

      if (error) throw error

      const chatIds = chatMembers?.map(cm => cm.chat_id) || []

      if (chatIds.length > 0) {
        const { data: chatDetails } = await supabase
          .from('chats')
          .select(`
            *,
            chat_members!inner (
              user_id,
              users (username, avatar_url)
            )
          `)
          .in('id', chatIds)
          .order('updated_at', { ascending: false })

        setChats(chatDetails || [])
      }
    } catch (error) {
      console.error('Error fetching chats:', error)
    }
  }, [currentUser, supabase])

  useEffect(() => {
    if (!currentUser) return

    fetchChats()

    const channel = supabase.channel('chat-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chats' }, () => {
        fetchChats()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentUser, fetchChats, supabase])

  const createNewChat = async () => {
    console.log('Create new chat')
  }

  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || chat.type === filterType
    return matchesSearch && matchesFilter
  })

  const getChatDisplayName = (chat: Chat) => {
    if (chat.type === 'group') return chat.name
    const otherMember = chat.chat_members?.find((member: ChatMember) => member.user_id !== currentUser?.id)
    return otherMember?.users?.username || chat.name
  }

  const getChatTags = (chat: Chat) => {
    const tags: string[] = []
    if (chat.name.toLowerCase().includes('demo')) tags.push('Demo')
    if (chat.name.toLowerCase().includes('internal')) tags.push('Internal')
    if (chat.name.toLowerCase().includes('signup')) tags.push('Signup')
    if (chat.name.toLowerCase().includes('content')) tags.push('Content')
    if (chat.name.toLowerCase().includes('support')) tags.push('Support')
    return tags
  }

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'demo': return 'bg-blue-100 text-blue-800'
      case 'internal': return 'bg-purple-100 text-purple-800'
      case 'signup': return 'bg-green-100 text-green-800'
      case 'content': return 'bg-orange-100 text-orange-800'
      case 'support': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getChatAvatar = (chat: Chat) => {
    if (chat.type === 'group') return null
    const otherMember = chat.chat_members?.find((member: ChatMember) => member.user_id !== currentUser?.id)
    return otherMember?.users?.avatar_url
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Chats</h1>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={createNewChat}>
              <FiPlus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <FiSettings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative mb-3">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex space-x-2">
          <Button
            variant={filterType === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('all')}
            className="flex-1"
          >
            All
          </Button>
          <Button
            variant={filterType === 'direct' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('direct')}
            className="flex-1"
          >
            <FiUser className="h-3 w-3 mr-1" />
            Direct
          </Button>
          <Button
            variant={filterType === 'group' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('group')}
            className="flex-1"
          >
            <FiUsers className="h-3 w-3 mr-1" />
            Groups
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onChatSelect(chat.id)}
              className={`p-3 rounded-lg cursor-pointer transition-colors mb-1 ${
                selectedChatId === chat.id
                  ? 'bg-blue-100 border border-blue-200'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={getChatAvatar(chat) || undefined} />
                    <AvatarFallback>
                      {chat.type === 'group' ? (
                        <FiUsers className="h-5 w-5" />
                      ) : (
                        getChatDisplayName(chat).slice(0, 2).toUpperCase()
                      )}
                    </AvatarFallback>
                  </Avatar>
                  {chat.type === 'direct' && (
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-400 border-2 border-white rounded-full"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 truncate">
                      {getChatDisplayName(chat)}
                    </h3>
                    <div className="flex items-center space-x-1">
                      {chat.unread_count && chat.unread_count > 0 && (
                        <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                          {chat.unread_count}
                        </Badge>
                      )}
                      <Button variant="ghost" size="sm" className="p-1">
                        <FiMoreVertical className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {chat.last_message ? chat.last_message.content : 'No messages yet'}
                  </p>

                  {getChatTags(chat).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {getChatTags(chat).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className={`text-xs px-1.5 py-0.5 ${getTagColor(tag)}`}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-400">
                      {chat.last_message
                        ? new Date(chat.last_message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : new Date(chat.created_at).toLocaleDateString()}
                    </span>
                    {chat.type === 'group' && (
                      <div className="flex items-center text-xs text-gray-400">
                        <FiUsers className="h-3 w-3 mr-1" />
                        {chat.chat_members?.length || 0}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredChats.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FiMessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No chats found</p>
              <p className="text-sm">Start a new conversation</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
