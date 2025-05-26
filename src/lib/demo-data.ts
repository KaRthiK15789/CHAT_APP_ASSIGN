export interface DemoUser {
  id: string
  email: string
  username: string
  avatar_url: string | null
}

export interface DemoChat {
  id: string
  name: string
  type: 'direct' | 'group'
  created_by: string
  created_at: string
  updated_at: string
  members: DemoUser[]
  last_message?: {
    content: string
    created_at: string
    user: { username: string }
  }
  unread_count?: number
}

export interface DemoMessage {
  id: string
  chat_id: string
  user_id: string
  content: string
  message_type: 'text' | 'image' | 'file'
  created_at: string
  updated_at: string
  user: DemoUser
}

export const demoUsers: DemoUser[] = [
  {
    id: 'demo-user-alice',
    email: 'alice@demo.com',
    username: 'Alice',
    avatar_url: null
  },
  {
    id: 'demo-user-bob',
    email: 'bob@demo.com',
    username: 'Bob',
    avatar_url: null
  },
  {
    id: 'demo-user-periskope',
    email: 'system@periskope.com',
    username: 'Periskope System',
    avatar_url: null
  },
  {
    id: 'demo-user-support',
    email: 'support@periskope.com',
    username: 'Support Team',
    avatar_url: null
  }
]

export const demoChats: DemoChat[] = [
  {
    id: 'demo-chat-1',
    name: 'Demo Support Chat',
    type: 'group',
    created_by: 'demo-user-periskope',
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updated_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    members: [demoUsers[0], demoUsers[2], demoUsers[3]],
    last_message: {
      content: 'Welcome to our demo support chat! How can we help you?',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      user: { username: 'Periskope System' }
    },
    unread_count: 2
  },
  {
    id: 'demo-chat-2',
    name: 'Internal Team Discussion',
    type: 'group',
    created_by: 'demo-user-alice',
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    updated_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    members: [demoUsers[0], demoUsers[1], demoUsers[3]],
    last_message: {
      content: 'The new feature deployment is scheduled for tomorrow',
      created_at: new Date(Date.now() - 7200000).toISOString(),
      user: { username: 'Bob' }
    }
  },
  {
    id: 'demo-chat-3',
    name: 'Signup Assistance',
    type: 'group',
    created_by: 'demo-user-support',
    created_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    updated_at: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    members: [demoUsers[0], demoUsers[2], demoUsers[3]],
    last_message: {
      content: 'User registration process has been simplified',
      created_at: new Date(Date.now() - 1800000).toISOString(),
      user: { username: 'Support Team' }
    },
    unread_count: 1
  },
  {
    id: 'demo-chat-4',
    name: 'Content Review',
    type: 'group',
    created_by: 'demo-user-alice',
    created_at: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    updated_at: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
    members: [demoUsers[0], demoUsers[1]],
    last_message: {
      content: 'All content has been reviewed and approved',
      created_at: new Date(Date.now() - 10800000).toISOString(),
      user: { username: 'Alice' }
    }
  },
  {
    id: 'demo-chat-5',
    name: 'Direct Chat with Bob',
    type: 'direct',
    created_by: 'demo-user-alice',
    created_at: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    updated_at: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
    members: [demoUsers[0], demoUsers[1]],
    last_message: {
      content: 'Hey! How are you doing?',
      created_at: new Date(Date.now() - 900000).toISOString(),
      user: { username: 'Bob' }
    }
  }
]

export const demoMessages: { [chatId: string]: DemoMessage[] } = {
  'demo-chat-1': [
    {
      id: 'msg-1',
      chat_id: 'demo-chat-1',
      user_id: 'demo-user-periskope',
      content: 'Welcome to the Demo Support Chat! 👋',
      message_type: 'text',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString(),
      user: demoUsers[2]
    },
    {
      id: 'msg-2',
      chat_id: 'demo-chat-1',
      user_id: 'demo-user-periskope',
      content: 'This is a demonstration of our real-time chat system. Feel free to send messages and explore the features!',
      message_type: 'text',
      created_at: new Date(Date.now() - 86340000).toISOString(),
      updated_at: new Date(Date.now() - 86340000).toISOString(),
      user: demoUsers[2]
    },
    {
      id: 'msg-3',
      chat_id: 'demo-chat-1',
      user_id: 'demo-user-support',
      content: 'How can we help you today? Our support team is here to assist!',
      message_type: 'text',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      updated_at: new Date(Date.now() - 3600000).toISOString(),
      user: demoUsers[3]
    }
  ],
  'demo-chat-2': [
    {
      id: 'msg-4',
      chat_id: 'demo-chat-2',
      user_id: 'demo-user-alice',
      content: 'Team, we need to discuss the upcoming feature release',
      message_type: 'text',
      created_at: new Date(Date.now() - 172800000).toISOString(),
      updated_at: new Date(Date.now() - 172800000).toISOString(),
      user: demoUsers[0]
    },
    {
      id: 'msg-5',
      chat_id: 'demo-chat-2',
      user_id: 'demo-user-bob',
      content: 'The new feature deployment is scheduled for tomorrow. All tests have passed! ✅',
      message_type: 'text',
      created_at: new Date(Date.now() - 7200000).toISOString(),
      updated_at: new Date(Date.now() - 7200000).toISOString(),
      user: demoUsers[1]
    }
  ],
  'demo-chat-5': [
    {
      id: 'msg-6',
      chat_id: 'demo-chat-5',
      user_id: 'demo-user-bob',
      content: 'Hey Alice! 👋',
      message_type: 'text',
      created_at: new Date(Date.now() - 1800000).toISOString(),
      updated_at: new Date(Date.now() - 1800000).toISOString(),
      user: demoUsers[1]
    },
    {
      id: 'msg-7',
      chat_id: 'demo-chat-5',
      user_id: 'demo-user-bob',
      content: 'How are you doing? Ready for the demo presentation?',
      message_type: 'text',
      created_at: new Date(Date.now() - 900000).toISOString(),
      updated_at: new Date(Date.now() - 900000).toISOString(),
      user: demoUsers[1]
    }
  ]
}

export const getDemoUser = (): DemoUser | null => {
  if (typeof window === 'undefined') return null
  const userData = localStorage.getItem('demoUser')
  return userData ? JSON.parse(userData) : null
}

export const isDemoMode = (): boolean => {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('isDemoMode') === 'true'
}

export const getDemoChatsForUser = (userId: string): DemoChat[] => {
  return demoChats.filter(chat =>
    chat.members.some(member => member.id === userId)
  )
}

export const getDemoMessagesForChat = (chatId: string): DemoMessage[] => {
  return demoMessages[chatId] || []
}

export const addDemoMessage = (chatId: string, message: Omit<DemoMessage, 'id' | 'created_at' | 'updated_at'>): DemoMessage => {
  const newMessage: DemoMessage = {
    ...message,
    id: `msg-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  if (!demoMessages[chatId]) {
    demoMessages[chatId] = []
  }

  demoMessages[chatId].push(newMessage)

  // Update last message in chat
  const chat = demoChats.find(c => c.id === chatId)
  if (chat) {
    chat.last_message = {
      content: newMessage.content,
      created_at: newMessage.created_at,
      user: { username: newMessage.user.username }
    }
    chat.updated_at = newMessage.created_at
  }

  return newMessage
}
