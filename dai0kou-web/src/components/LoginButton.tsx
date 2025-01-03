'use client'

import { useState } from 'react'
import { signInWithPopup, GithubAuthProvider } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

export function LoginButton() {
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const handleLogin = async () => {
    setLoading(true)
    try {
      const provider = new GithubAuthProvider()
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error('Error signing in with GitHub:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    setLoading(true)
    try {
      await auth.signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setLoading(false)
    }
  }

  if (user) {
    return (
      <Button onClick={handleLogout} disabled={loading}>
        {loading ? 'Logging out...' : 'Logout'}
      </Button>
    )
  }

  return (
    <Button onClick={handleLogin} disabled={loading}>
      {loading ? 'Logging in...' : 'Login with GitHub'}
    </Button>
  )
}