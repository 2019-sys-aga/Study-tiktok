'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function SupabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error'>('testing')
  const [error, setError] = useState<string>('')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      setConnectionStatus('testing')
      setError('')

      // Test basic connection
      const { data, error: connectionError } = await supabase
        .from('study_decks')
        .select('count')
        .limit(1)

      if (connectionError) {
        throw connectionError
      }

      // Test auth
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      setConnectionStatus('connected')
      setUser(user)
      
    } catch (err: any) {
      setConnectionStatus('error')
      setError(err.message || 'Connection failed')
    }
  }

  const testAuth = async () => {
    try {
      console.log('Testing auth with Supabase client...')
      const { data, error } = await supabase.auth.signUp({
        email: 'test@example.com',
        password: 'testpassword123'
      })
      if (error) throw error
      console.log('Auth test successful:', data)
      alert('Auth test successful! Check console for details.')
    } catch (err: any) {
      console.error('Auth test failed:', err)
      alert(`Auth test failed: ${err.message}`)
    }
  }

  return (
    <div className="p-6 bg-background rounded-xl glass-effect max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">🔗 Supabase Connection Test</h2>
        <p className="text-muted-foreground">Testing your Supabase integration</p>
      </div>

      <div className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
          <span className="font-medium">Connection Status:</span>
          <div className="flex items-center gap-2">
            {connectionStatus === 'testing' && (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm">Testing...</span>
              </>
            )}
            {connectionStatus === 'connected' && (
              <>
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">Connected ✅</span>
              </>
            )}
            {connectionStatus === 'error' && (
              <>
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-sm text-red-600">Error ❌</span>
              </>
            )}
          </div>
        </div>

        {/* Project Info */}
        <div className="p-3 rounded-lg bg-muted/30">
          <div className="text-sm font-medium mb-2">Project Details:</div>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>URL: fxaizehgwbprptiwxiulf.supabase.co</div>
            <div>Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</div>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-3 rounded-lg bg-green-100 text-green-800">
            <div className="text-sm font-medium mb-1">Current User:</div>
            <div className="text-xs">{user.email || 'No user logged in'}</div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="p-3 rounded-lg bg-red-100 text-red-800">
            <div className="text-sm font-medium mb-1">Error:</div>
            <div className="text-xs">{error}</div>
          </div>
        )}

        {/* Test Buttons */}
        <div className="flex gap-2">
          <button
            onClick={testConnection}
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/80 transition-colors"
          >
            🔄 Retest Connection
          </button>
          <button
            onClick={testAuth}
            className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
          >
            🔐 Test Auth
          </button>
        </div>

        {/* Instructions */}
        <div className="p-3 rounded-lg bg-blue-100 text-blue-800">
          <div className="text-sm font-medium mb-1">Next Steps:</div>
          <div className="text-xs space-y-1">
            <div>1. Run SQL scripts in Supabase SQL Editor</div>
            <div>2. Create database tables</div>
            <div>3. Test authentication</div>
          </div>
        </div>
      </div>
    </div>
  )
}
