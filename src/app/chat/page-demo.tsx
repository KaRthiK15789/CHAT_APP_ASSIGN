'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ChatSidebar from '@/components/chat/chat-sidebar-demo'
import ChatHeader from '@/components/chat/chat-header-demo'
import MessageList from '@/components/chat/message-list-demo'
import MessageInput from '@/components/chat/message-input-demo'
import TopNavigation from '@/components/chat/top-navigation'
import { getDemoUser, isDemoMode, getDemoChatsForUser, demoChats, type DemoUser, type DemoChat } from '@/lib/demo-data'

export default function DemoChatPage() {
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(null)
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [selectedChat, setSelectedChat] = useState<DemoChat | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!isDemoMode()) {
      router.push('/')
      return
    }

    const user = getDemoUser()
    if (!user) {
      router.push('/')
      return
    }

    setCurrentUser(user)
    setIsLoading(false)
  }, [router])

  useEffect(() => {
    if (selectedChatId) {
      const chat = demoChats.find(c => c.id === selectedChatId)
      setSelectedChat(chat || null)
    } else {
      setSelectedChat(null)
    }
  }, [selectedChatId])

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId)
  }

  const handleRefresh = async () => {
    // In demo mode, just simulate refresh
    console.log('Refreshing demo data...')
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top Navigation */}
      <TopNavigation currentUser={currentUser} onRefresh={handleRefresh} />

      <div className="flex-1 flex">
        {/* Sidebar */}
        <ChatSidebar
          selectedChatId={selectedChatId}
          onChatSelect={handleChatSelect}
          currentUser={currentUser}
        />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          <ChatHeader chat={selectedChat} currentUser={currentUser} />
          <MessageList chatId={selectedChatId} currentUser={currentUser} />
          <MessageInput chatId={selectedChatId} currentUser={currentUser} />
        </div>
      </div>
    </div>
  )
}
