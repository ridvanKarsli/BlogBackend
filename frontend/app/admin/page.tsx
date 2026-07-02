'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FileText, CheckCircle, Clock, FolderOpen, Tags, Image, Plus } from 'lucide-react'
import apiClient from '@/lib/apiClient'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageLoader } from '@/components/Skeleton'

type Post = { status: string }

const statConfig = [
  { key: 'posts', label: 'Toplam Yazı', icon: FileText, color: 'text-slate-900' },
  { key: 'published', label: 'Yayında', icon: CheckCircle, color: 'text-emerald-600' },
  { key: 'drafts', label: 'Taslak', icon: Clock, color: 'text-amber-600' },
  { key: 'categories', label: 'Kategoriler', icon: FolderOpen, color: 'text-slate-900' },
  { key: 'tags', label: 'Etiketler', icon: Tags, color: 'text-slate-900' },
  { key: 'media', label: 'Medya', icon: Image, color: 'text-slate-900' },
] as const

export default function AdminPage() {
  const [stats, setStats] = useState({
    posts: 0,
    published: 0,
    drafts: 0,
    categories: 0,
    tags: 0,
    media: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [posts, categories, tags, media] = await Promise.all([
          apiClient.get('/api/admin/posts'),
          apiClient.get('/api/admin/categories'),
          apiClient.get('/api/admin/tags'),
          apiClient.get('/api/admin/media'),
        ])
        const postList: Post[] = posts.data
        setStats({
          posts: postList.length,
          published: postList.filter((p) => p.status === 'PUBLISHED').length,
          drafts: postList.filter((p) => p.status === 'DRAFT').length,
          categories: categories.data.length,
          tags: tags.data.length,
          media: media.data.length,
        })
      } catch {
        console.error('Stats yüklenemedi')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) return <PageLoader />

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Blog içeriklerinize genel bakış</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statConfig.map((item) => (
          <Card key={item.key} className="!p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{item.label}</p>
                <p className={`mt-1 font-display text-3xl font-bold ${item.color}`}>
                  {stats[item.key]}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <item.icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hızlı İşlemler</CardTitle>
          <CardDescription>Sık kullanılan işlemlere tek tıkla erişin</CardDescription>
        </CardHeader>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/admin/posts/new">
              <Plus className="h-4 w-4" />
              Yeni Yazı
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/categories/new">Yeni Kategori</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/tags/new">Yeni Etiket</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/media">Medya Yükle</Link>
          </Button>
        </div>
      </Card>
    </div>
  )
}
