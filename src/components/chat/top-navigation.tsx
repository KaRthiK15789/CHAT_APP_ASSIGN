'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  FiRefreshCw,
  FiHelpCircle,
  FiWifi,
  FiWifiOff,
  FiBell,
  FiSearch,
  FiMoreVertical,
  FiSettings,
  FiLogOut
} from 'react-icons/fi'
import { createClientSupabaseClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface TopNavigationProps {
  currentUser: {
    id: string
    username: string
    email: string
    avatar_url?: string | null
  } | null
  onRefresh: () => void
}

export default function TopNavigation({ currentUser, onRefresh }: TopNavigationProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const supabase = createClientSupabaseClient()
  const router = useRouter()

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await onRefresh()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const handleSignOut = async () => {
    // Clear demo data
    localStorage.removeItem('demoUser')
    localStorage.removeItem('isDemoMode')
    router.push('/')
  }

  return (
    <header className="bg-[#2a2f32] text-white px-4 py-3 flex items-center justify-between border-b border-gray-700">
      {/* Left side - Logo and title */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <h1 className="text-lg font-semibold">Periskope Chat</h1>
        </div>

        {/* Connection status */}
        <div className="flex items-center space-x-1">
          {isOnline ? (
            <>
              <FiWifi className="h-4 w-4 text-green-400" />
              <span className="text-xs text-gray-300">Connected</span>
            </>
          ) : (
            <>
              <FiWifiOff className="h-4 w-4 text-red-400" />
              <span className="text-xs text-gray-300">Disconnected</span>
            </>
          )}
        </div>
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full bg-[#3b4043] text-white placeholder-gray-400 pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Right side - Actions and user menu */}
      <div className="flex items-center space-x-2">
        {/* Refresh button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="text-gray-300 hover:text-white hover:bg-gray-600"
        >
          <FiRefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>

        {/* Help button */}
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-300 hover:text-white hover:bg-gray-600"
        >
          <FiHelpCircle className="h-4 w-4" />
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-300 hover:text-white hover:bg-gray-600 relative"
        >
          <FiBell className="h-4 w-4" />
          <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs bg-red-500">
            3
          </Badge>
        </Button>

        {/* User menu */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="text-gray-300 hover:text-white hover:bg-gray-600 flex items-center space-x-2"
          >
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {currentUser?.username?.slice(0, 2).toUpperCase() || 'U'}
              </span>
            </div>
            <FiMoreVertical className="h-3 w-3" />
          </Button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="font-medium text-gray-900">{currentUser?.username}</p>
                <p className="text-sm text-gray-500">{currentUser?.email}</p>
              </div>

              <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                <FiSettings className="h-4 w-4" />
                <span>Settings</span>
              </button>

              <button
                onClick={handleSignOut}
                className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-50 flex items-center space-x-2"
              >
                <FiLogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
