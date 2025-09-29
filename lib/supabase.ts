import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fxaizehgwbprptiwxiulf.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4YWl6ZWhnd2JycHRpd3hpdWxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMDA1MzcsImV4cCI6MjA3NDY3NjUzN30.BrAach3P-monfDdlrrYLDEeKtQPPOQDq5uV8f-7Z7Po'

// Debug logging
console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key:', supabaseAnonKey ? 'Present' : 'Missing')

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'study-tiktok-app'
    }
  }
})

// Database types
export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
  username?: string
  avatar_url?: string
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

export interface StudyDeck {
  id: string
  title: string
  subject: string
  description: string
  thumbnail_url?: string
  difficulty: 'Easy' | 'Medium' | 'Advanced'
  total_cards: number
  created_by: string
  created_at: string
  updated_at: string
}

export interface StudyCard {
  id: string
  deck_id: string
  question: string
  answer: string
  type: 'mcq' | 'text' | 'image'
  options?: string[]
  correct_answer?: number | string
  explanation?: string
  difficulty: 'Easy' | 'Medium' | 'Advanced'
  created_at: string
  updated_at: string
}

export interface ImportedContent {
  id: string
  user_id: string
  deck_id: string
  original_filename?: string
  file_type: 'pdf' | 'docx' | 'pptx' | 'text'
  file_size?: number
  extracted_text?: string
  processing_status: 'pending' | 'processing' | 'completed' | 'failed'
  ai_summary?: string
  generated_topics?: string[]
  created_at: string
  updated_at: string
}

export interface UserAchievement {
  id: string
  user_id: string
  achievement_type: string
  title: string
  description?: string
  icon?: string
  unlocked_at: string
}

export interface StudySession {
  id: string
  user_id: string
  deck_id: string
  session_duration?: number
  cards_studied: number
  correct_answers: number
  xp_earned: number
  started_at: string
  completed_at?: string
}

// Authentication functions
export const auth = {
  // Sign up with email and password
  signUp: async (email: string, password: string, username?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username || email.split('@')[0]
        }
      }
    })
    return { data, error }
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Get current session
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  }
}

// Database functions
export const db = {
  // User stats
  getUserStats: async (userId: string) => {
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single()
    return { data, error }
  },

  updateUserStats: async (userId: string, updates: Partial<UserStats>) => {
    const { data, error } = await supabase
      .from('user_stats')
      .upsert({ user_id: userId, ...updates, updated_at: new Date().toISOString() })
    return { data, error }
  },

  // Study progress
  getStudyProgress: async (userId: string) => {
    const { data, error } = await supabase
      .from('study_progress')
      .select('*')
      .eq('user_id', userId)
      .order('last_studied', { ascending: false })
    return { data, error }
  },

  updateStudyProgress: async (progress: Partial<StudyProgress>) => {
    const { data, error } = await supabase
      .from('study_progress')
      .upsert({ ...progress, updated_at: new Date().toISOString() })
    return { data, error }
  },

  // Notifications
  getNotifications: async (userId: string) => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  markNotificationAsRead: async (notificationId: string) => {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
    return { data, error }
  },

  // Study decks
  getStudyDecks: async () => {
    const { data, error } = await supabase
      .from('study_decks')
      .select('*')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  getStudyCards: async (deckId: string) => {
    const { data, error } = await supabase
      .from('study_cards')
      .select('*')
      .eq('deck_id', deckId)
      .order('created_at', { ascending: true })
    return { data, error }
  },

  // Imported content
  createImportedContent: async (content: Partial<ImportedContent>) => {
    const { data, error } = await supabase
      .from('imported_content')
      .insert(content)
      .select()
      .single()
    return { data, error }
  },

  getImportedContent: async (userId: string) => {
    const { data, error } = await supabase
      .from('imported_content')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  updateImportedContent: async (id: string, updates: Partial<ImportedContent>) => {
    const { data, error } = await supabase
      .from('imported_content')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  // User achievements
  getUserAchievements: async (userId: string) => {
    const { data, error } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false })
    return { data, error }
  },

  createUserAchievement: async (achievement: Partial<UserAchievement>) => {
    const { data, error } = await supabase
      .from('user_achievements')
      .insert(achievement)
      .select()
      .single()
    return { data, error }
  },

  // Study sessions
  createStudySession: async (session: Partial<StudySession>) => {
    const { data, error } = await supabase
      .from('study_sessions')
      .insert(session)
      .select()
      .single()
    return { data, error }
  },

  updateStudySession: async (id: string, updates: Partial<StudySession>) => {
    const { data, error } = await supabase
      .from('study_sessions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  getUserStudySessions: async (userId: string) => {
    const { data, error } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('started_at', { ascending: false })
    return { data, error }
  }
}
