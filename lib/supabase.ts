import { createClient } from '@supabase/supabase-js'

// These are placeholder values - you'll need to replace with your actual Supabase project details
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
}

export interface StudyProgress {
  id: string
  user_id: string
  deck_id: string
  deck_name: string
  subject: string
  completed_cards: number
  total_cards: number
  score: number
  streak: number
  last_studied: string
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'achievement' | 'reminder' | 'progress' | 'social'
  read: boolean
  created_at: string
}

export interface UserStats {
  id: string
  user_id: string
  total_xp: number
  current_streak: number
  longest_streak: number
  decks_completed: number
  cards_studied: number
  level: number
  created_at: string
  updated_at: string
}
