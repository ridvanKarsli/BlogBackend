'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Tags,
  Image,
  Globe,
  LogOut,
  BookOpen,
  Menu,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/authContext'
import { cn } from '@/lib/utils'
import { PageLoader } from '@/components/Skeleton'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/posts', label: 'Yazılar', icon: FileText },
  { href: '/admin/categories', label: 'Kategoriler', icon: FolderOpen },
  { href: '/admin/tags', label: 'Etiketler', icon: Tags },
  { href: '/admin/media', label: 'Medya', icon: Image },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading, logout } = useAuth()
  const [loggingOut, setLoggingOut] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [user, loading, router])

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await logout()
      router.push('/login')
    } catch {
      alert('Çıkış başarısız')
    } finally {
      setLoggingOut(false)
    }
  }

  if (loading) return <PageLoader text="Oturum kontrol ediliyor..." />
  if (!user) return null

  const Sidebar = () => (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-700/50 p-6">
        <Link href="/" className="flex items-center gap-2.5 font-display text-lg font-bold text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600">
            <BookOpen className="h-4 w-4" />
          </span>
          Blog Admin
        </Link>
        <p className="mt-3 truncate text-xs text-slate-400">{user.email}</p>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const active = item.exact ? pathname === item.href : pathname?.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                active
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
        <Link
          href="/blog"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
        >
          <Globe className="h-4 w-4" />
          Siteyi Gör
        </Link>
      </nav>

      <div className="border-t border-slate-700/50 p-4">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-slate-300 hover:bg-slate-800 hover:text-white"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          <LogOut className="h-4 w-4" />
          {loggingOut ? 'Çıkılıyor...' : 'Çıkış Yap'}
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-shrink-0 bg-slate-900 lg:block">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative h-full w-64 bg-slate-900 shadow-xl">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute right-3 top-3 rounded-lg p-2 text-slate-400 hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-4 border-b border-slate-200 bg-white px-4 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <p className="text-sm text-slate-500">Yönetim Paneli</p>
        </header>
        <main className="flex-1 overflow-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
