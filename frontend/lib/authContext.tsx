'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import apiClient from './apiClient'

type User = {
  id: number
  email: string
}

type AuthContextValue = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await apiClient.get('/api/auth/me')
        setUser(res.data)
      } catch (e) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    fetchMe()
  }, [])

  const login = async (email: string, password: string) => {
    const res = await apiClient.post('/api/auth/login', { email, password })
    // Backend sets HttpOnly cookie; /api/auth/me will return user on subsequent requests
    try {
      const me = await apiClient.get('/api/auth/me')
      setUser(me.data)
    } catch {
      setUser(res.data || null)
    }
  }

  const logout = async () => {
    await apiClient.post('/api/auth/logout')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

