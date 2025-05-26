import { createClientSupabaseClient } from './supabase'

export const setupSampleData = async () => {
  const supabase = createClientSupabaseClient()

  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No authenticated user')

    // Create sample chats
    const sampleChats = [
      {
        name: 'Demo Support Chat',
        type: 'group' as const,
        created_by: user.id
      },
      {
        name: 'Internal Team Discussion',
        type: 'group' as const,
        created_by: user.id
      },
      {
        name: 'Signup Assistance',
        type: 'group' as const,
        created_by: user.id
      },
      {
        name: 'Content Review',
        type: 'group' as const,
        created_by: user.id
      },
      {
        name: 'Customer Support',
        type: 'group' as const,
        created_by: user.id
      }
    ]

    // Insert chats
    const { data: insertedChats, error: chatError } = await supabase
      .from('chats')
      .insert(sampleChats)
      .select()

    if (chatError) throw chatError

    // Add user as member to all chats
    if (insertedChats) {
      const chatMemberships = insertedChats.map(chat => ({
        chat_id: chat.id,
        user_id: user.id,
        role: 'admin' as const
      }))

      const { error: memberError } = await supabase
        .from('chat_members')
        .insert(chatMemberships)

      if (memberError) throw memberError

      // Add sample messages
      const sampleMessages = [
        {
          chat_id: insertedChats[0].id,
          user_id: user.id,
          content: 'Welcome to the demo support chat! How can we help you today?',
          message_type: 'text' as const
        },
        {
          chat_id: insertedChats[1].id,
          user_id: user.id,
          content: 'Team meeting scheduled for tomorrow at 2 PM',
          message_type: 'text' as const
        },
        {
          chat_id: insertedChats[2].id,
          user_id: user.id,
          content: 'New user needs help with account activation',
          message_type: 'text' as const
        }
      ]

      const { error: messageError } = await supabase
        .from('messages')
        .insert(sampleMessages)

      if (messageError) throw messageError
    }

    console.log('Sample data created successfully!')
    return true
  } catch (error) {
    console.error('Error setting up sample data:', error)
    return false
  }
}

export const createTablesSQL = `
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chats table
CREATE TABLE IF NOT EXISTS chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('direct', 'group')) NOT NULL,
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT CHECK (message_type IN ('text', 'image', 'file')) DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_members table
CREATE TABLE IF NOT EXISTS chat_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('admin', 'member')) DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(chat_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_members_user_id ON chat_members(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_members_chat_id ON chat_members(chat_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for chats table
CREATE POLICY "Users can view chats they're members of" ON chats
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_members
      WHERE chat_members.chat_id = chats.id
      AND chat_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create chats" ON chats
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- RLS Policies for messages table
CREATE POLICY "Users can view messages from their chats" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_members
      WHERE chat_members.chat_id = messages.chat_id
      AND chat_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages to their chats" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM chat_members
      WHERE chat_members.chat_id = messages.chat_id
      AND chat_members.user_id = auth.uid()
    )
  );

-- RLS Policies for chat_members table
CREATE POLICY "Users can view chat memberships" ON chat_members
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM chat_members cm
      WHERE cm.chat_id = chat_members.chat_id
      AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage chat memberships" ON chat_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM chat_members cm
      WHERE cm.chat_id = chat_members.chat_id
      AND cm.user_id = auth.uid()
      AND cm.role = 'admin'
    )
  );

-- Function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, username)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE chats;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_members;
`
