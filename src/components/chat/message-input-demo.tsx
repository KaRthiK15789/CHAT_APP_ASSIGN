'use client'

import { useState, useRef, KeyboardEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  FiSend,
  FiPaperclip,
  FiSmile,
  FiMic,
  FiImage,
  FiFile,
  FiChevronDown,
  FiUser
} from 'react-icons/fi'
import { addDemoMessage, demoUsers, type DemoUser } from '@/lib/demo-data'

interface MessageInputDemoProps {
  chatId: string | null
  currentUser: DemoUser | null
}

export default function MessageInputDemo({ chatId, currentUser }: MessageInputDemoProps) {
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false)
  const [showAccountSelector, setShowAccountSelector] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState('personal')
  const inputRef = useRef<HTMLInputElement>(null)

  // Available accounts for sending messages
  const accounts = [
    { id: 'personal', name: 'Personal Account', icon: FiUser, color: 'bg-blue-500' },
    { id: 'periskope', name: 'Periskope System', icon: FiUser, color: 'bg-green-500' },
    { id: 'support', name: 'Support Team', icon: FiUser, color: 'bg-purple-500' },
  ]

  const getSelectedAccountInfo = () => {
    return accounts.find(acc => acc.id === selectedAccount) || accounts[0]
  }

  const sendMessage = async () => {
    if (!message.trim() || !chatId || !currentUser || isSending) return

    setIsSending(true)

    // Simulate sending delay
    await new Promise(resolve => setTimeout(resolve, 300))

    try {
      // Determine which user to send as based on selected account
      let sendingUser = currentUser
      if (selectedAccount === 'periskope') {
        sendingUser = demoUsers.find(u => u.username === 'Periskope System') || currentUser
      } else if (selectedAccount === 'support') {
        sendingUser = demoUsers.find(u => u.username === 'Support Team') || currentUser
      }

      addDemoMessage(chatId, {
        chat_id: chatId,
        user_id: sendingUser.id,
        content: message.trim(),
        message_type: 'text',
        user: sendingUser
      })

      setMessage('')
      inputRef.current?.focus()

      // Trigger a page refresh to show the new message
      window.location.reload()
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleEmojiClick = (emoji: string) => {
    setMessage(prev => prev + emoji)
    setShowEmojiPicker(false)
    inputRef.current?.focus()
  }

  // Common emojis for quick access
  const quickEmojis = ['😀', '😂', '❤️', '👍', '👎', '😮', '😢', '😡', '🎉', '🔥']

  if (!chatId) {
    return null
  }

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      {/* Quick emoji bar */}
      {showEmojiPicker && (
        <div className="mb-3 p-2 bg-gray-50 rounded-lg">
          <div className="flex space-x-2 mb-2">
            {quickEmojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleEmojiClick(emoji)}
                className="text-xl hover:bg-gray-200 rounded p-1 transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500">Click an emoji to add it to your message</p>
        </div>
      )}

      {/* Attachment menu */}
      {showAttachmentMenu && (
        <div className="mb-3 p-2 bg-gray-50 rounded-lg">
          <div className="flex space-x-4">
            <button className="flex items-center space-x-2 text-sm text-gray-700 hover:text-blue-600 transition-colors">
              <FiImage className="h-4 w-4" />
              <span>Photo</span>
            </button>
            <button className="flex items-center space-x-2 text-sm text-gray-700 hover:text-blue-600 transition-colors">
              <FiFile className="h-4 w-4" />
              <span>Document</span>
            </button>
            <button className="flex items-center space-x-2 text-sm text-gray-700 hover:text-blue-600 transition-colors">
              <FiMic className="h-4 w-4" />
              <span>Voice</span>
            </button>
          </div>
        </div>
      )}

      <div className="flex items-end space-x-3">
        {/* Account selector */}
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setShowAccountSelector(!showAccountSelector)
              setShowAttachmentMenu(false)
              setShowEmojiPicker(false)
            }}
            className="flex items-center space-x-2 min-w-[120px]"
          >
            <div className={`w-3 h-3 rounded-full ${getSelectedAccountInfo().color}`} />
            <span className="text-xs truncate">{getSelectedAccountInfo().name}</span>
            <FiChevronDown className="h-3 w-3" />
          </Button>

          {showAccountSelector && (
            <div className="absolute bottom-full mb-2 left-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              {accounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => {
                    setSelectedAccount(account.id)
                    setShowAccountSelector(false)
                  }}
                  className={`w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 ${
                    selectedAccount === account.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${account.color}`} />
                  <span className="text-sm">{account.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Attachment button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setShowAttachmentMenu(!showAttachmentMenu)
            setShowEmojiPicker(false)
            setShowAccountSelector(false)
          }}
          className={`${showAttachmentMenu ? 'bg-gray-100' : ''}`}
        >
          <FiPaperclip className="h-4 w-4" />
        </Button>

        {/* Message input */}
        <div className="flex-1 relative">
          <Input
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={isSending}
            className="pr-12 min-h-[44px] resize-none"
          />

          {/* Emoji button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowEmojiPicker(!showEmojiPicker)
              setShowAttachmentMenu(false)
              setShowAccountSelector(false)
            }}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 ${showEmojiPicker ? 'bg-gray-100' : ''}`}
          >
            <FiSmile className="h-4 w-4" />
          </Button>
        </div>

        {/* Send button */}
        <Button
          onClick={sendMessage}
          disabled={!message.trim() || isSending}
          className="bg-blue-600 hover:bg-blue-700 min-w-[44px] h-[44px]"
        >
          {isSending ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          ) : (
            <FiSend className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Demo mode indicator */}
      <div className="mt-2 h-4">
        <p className="text-xs text-gray-400">
          Demo Mode: Messages will appear after page refresh
        </p>
      </div>
    </div>
  )
}
