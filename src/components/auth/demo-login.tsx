'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

export default function DemoLogin() {
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleDemoLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return

    setIsLoading(true)

    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Store demo user data in localStorage
    const demoUser = {
      id: 'demo-user-1',
      email: `${username}@demo.com`,
      username: username,
      avatar_url: null
    }

    localStorage.setItem('demoUser', JSON.stringify(demoUser))
    localStorage.setItem('isDemoMode', 'true')

    router.push('/chat')
  }

  const handleQuickLogin = (name: string) => {
    setUsername(name)
    const demoUser = {
      id: `demo-user-${name.toLowerCase()}`,
      email: `${name.toLowerCase()}@demo.com`,
      username: name,
      avatar_url: null
    }

    localStorage.setItem('demoUser', JSON.stringify(demoUser))
    localStorage.setItem('isDemoMode', 'true')

    router.push('/chat')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">P</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Periskope Chat Demo
          </h1>
          <p className="text-gray-600">
            Experience our real-time chat application
          </p>
        </div>

        <form onSubmit={handleDemoLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || !username.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? 'Logging in...' : 'Enter Demo'}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Quick Demo Access</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => handleQuickLogin('Alice')}
              className="text-sm"
            >
              Login as Alice
            </Button>
            <Button
              variant="outline"
              onClick={() => handleQuickLogin('Bob')}
              className="text-sm"
            >
              Login as Bob
            </Button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              <strong>Demo Mode:</strong> This is a demonstration version.
              No real authentication or data persistence.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
