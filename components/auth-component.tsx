'use client'

import { useState, useEffect } from 'react'
import { auth, db } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

interface AuthComponentProps {
  onAuthSuccess: (user: User) => void
}

export default function AuthComponent({ onAuthSuccess }: AuthComponentProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Check if user is already logged in
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { user } = await auth.getCurrentUser()
      if (user) {
        setUser(user)
        onAuthSuccess(user)
      }
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (isSignUp) {
        const { data, error } = await auth.signUp(email, password)
        if (error) throw error
        setMessage('Check your email for verification link! 📧')
      } else {
        const { data, error } = await auth.signIn(email, password)
        if (error) throw error
        if (data.user) {
          setUser(data.user)
          onAuthSuccess(data.user)
        }
      }
    } catch (error: any) {
      setMessage(error.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await auth.signOut()
      setUser(null)
      setMessage('Signed out successfully! 👋')
    } catch (error: any) {
      setMessage(error.message || 'Sign out failed')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="p-6 bg-background rounded-xl glass-effect">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">👤</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Welcome back!</h3>
          <p className="text-muted-foreground mb-4">{user.email}</p>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-background rounded-xl glass-effect">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">
          {isSignUp ? '🎓 Join StudyTok' : '🔑 Sign In'}
        </h2>
        <p className="text-muted-foreground">
          {isSignUp ? 'Start your learning journey!' : 'Welcome back to StudyTok!'}
        </p>
      </div>

      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50"
        >
          {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
        </button>
      </form>

      <div className="text-center mt-4">
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-primary hover:underline"
        >
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>
      </div>

      {message && (
        <div className={`mt-4 p-3 rounded-lg text-center ${
          message.includes('successfully') || message.includes('Check your email') 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}
    </div>
  )
}
