'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  FiPhone,
  FiVideo,
  FiMoreVertical,
  FiSearch,
  FiInfo,
  FiUsers
} from 'react-icons/fi'
import type { Database } from '@/lib/database.types'

type Chat = Database['public']['Tables']['chats']['Row'] & {
  members?: Database['public']['Tables']['users']['Row'][]
}

interface ChatHeaderProps {
  chat: Chat | null
  currentUser: Database['public']['Tables']['users']['Row'] | null
}

export default function ChatHeader({ chat, currentUser }: ChatHeaderProps) {
  if (!chat) {
    return (
      <div className="h-16 border-b border-gray-200 flex items-center justify-center bg-white">
        <p className="text-gray-500">Select a chat to start messaging</p>
      </div>
    )
  }

  const getChatDisplayName = () => {
    if (chat.type === 'group') {
      return chat.name
    }
    // For direct chats, show the other user's name
    const otherMember = chat.members?.find(member => member.id !== currentUser?.id)
    return otherMember?.username || chat.name
  }

  const getChatAvatar = () => {
    if (chat.type === 'group') {
      return null // Use default group avatar
    }
    const otherMember = chat.members?.find(member => member.id !== currentUser?.id)
    return otherMember?.avatar_url
  }

  const getOnlineStatus = () => {
    if (chat.type === 'group') {
      const onlineCount = chat.members?.length || 0
      return `${onlineCount} members`
    }
    return 'Online' // In a real app, you'd track actual online status
  }

  return (
    <div className="h-16 border-b border-gray-200 bg-white px-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={getChatAvatar() || undefined} />
          <AvatarFallback>
            {chat.type === 'group' ? (
              <FiUsers className="h-5 w-5" />
            ) : (
              getChatDisplayName().slice(0, 2).toUpperCase()
            )}
          </AvatarFallback>
        </Avatar>

        <div>
          <h2 className="font-semibold text-gray-900">{getChatDisplayName()}</h2>
          <div className="flex items-center space-x-2">
            {chat.type === 'direct' && (
              <div className="flex items-center">
                <div className="h-2 w-2 bg-green-400 rounded-full mr-1"></div>
                <span className="text-sm text-gray-500">Online</span>
              </div>
            )}
            {chat.type === 'group' && (
              <span className="text-sm text-gray-500">{getOnlineStatus()}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm">
          <FiSearch className="h-4 w-4" />
        </Button>

        {chat.type === 'direct' && (
          <>
            <Button variant="ghost" size="sm">
              <FiPhone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <FiVideo className="h-4 w-4" />
            </Button>
          </>
        )}

        <Button variant="ghost" size="sm">
          <FiInfo className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="sm">
          <FiMoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
