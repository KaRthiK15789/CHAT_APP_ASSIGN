export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          username: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      chats: {
        Row: {
          id: string
          name: string
          type: 'direct' | 'group'
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'direct' | 'group'
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'direct' | 'group'
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          chat_id: string
          user_id: string
          content: string
          message_type: 'text' | 'image' | 'file'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          chat_id: string
          user_id: string
          content: string
          message_type?: 'text' | 'image' | 'file'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          chat_id?: string
          user_id?: string
          content?: string
          message_type?: 'text' | 'image' | 'file'
          created_at?: string
          updated_at?: string
        }
      }
      chat_members: {
        Row: {
          id: string
          chat_id: string
          user_id: string
          role: 'admin' | 'member'
          joined_at: string
        }
        Insert: {
          id?: string
          chat_id: string
          user_id: string
          role?: 'admin' | 'member'
          joined_at?: string
        }
        Update: {
          id?: string
          chat_id?: string
          user_id?: string
          role?: 'admin' | 'member'
          joined_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
