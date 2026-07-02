'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BookOpen, LogIn } from 'lucide-react'
import { useAuth } from '@/lib/authContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    if (!email.includes('@')) {
      setError('Geçerli bir e-posta giriniz')
      setLoading(false)
      return
    }
    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır')
      setLoading(false)
      return
    }
    try {
      await login(email, password)
      router.push('/admin')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Giriş başarısız')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-brand-600 via-brand-700 to-violet-800 p-12 text-white lg:flex">
        <Link href="/" className="flex items-center gap-2.5 font-display text-xl font-bold">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
            <BookOpen className="h-5 w-5" />
          </span>
          Blog
        </Link>
        <div>
          <h2 className="font-display text-3xl font-bold leading-tight">
            Admin paneli
          </h2>
          <p className="mt-4 max-w-sm text-brand-100">
            Yazı eklemek ve düzenlemek için giriş yap.
          </p>
        </div>
        <p className="text-sm text-brand-200">© {new Date().getFullYear()} Blog</p>
      </div>

      <div className="flex flex-1 items-center justify-center bg-surface-muted px-6 py-12">
        <div className="w-full max-w-md animate-slide-up">
          <div className="mb-8 text-center lg:text-left">
            <div className="mb-4 flex justify-center lg:hidden">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white">
                <BookOpen className="h-6 w-6" />
              </span>
            </div>
            <h1 className="font-display text-2xl font-bold text-slate-900">Giriş</h1>
            <p className="mt-2 text-sm text-slate-500">E-posta ve şifrenle devam et</p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-card">
            {error && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                type="email"
                label="E-posta"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                required
              />
              <Input
                type="password"
                label="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                <LogIn className="h-4 w-4" />
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </Button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Hesabınız yok mu?{' '}
            <Link href="/register" className="font-medium text-brand-600 hover:text-brand-700">
              Kayıt olun
            </Link>
          </p>
          <p className="mt-3 text-center">
            <Link href="/" className="text-sm text-slate-400 hover:text-slate-600">
              ← Ana sayfaya dön
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
