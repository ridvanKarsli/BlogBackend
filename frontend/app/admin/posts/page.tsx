'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import apiClient from '@/lib/apiClient'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { PageLoader, EmptyState } from '@/components/Skeleton'

interface Post {
  id: number
  title: string
  slug: string
  status: string
  publishedAt?: string
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await apiClient.get('/api/admin/posts')
        setPosts(res.data)
      } catch (err: any) {
        setError(err.message || 'Yazılar yüklenemedi')
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Bu yazıyı silmek istediğinizden emin misiniz?')) return
    try {
      await apiClient.delete(`/api/admin/posts/${id}`)
      setPosts(posts.filter((p) => p.id !== id))
    } catch (err: any) {
      alert(err.response?.data?.message || 'Silme başarısız')
    }
  }

  if (loading) return <PageLoader />
  if (error) return <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Yazılar</h1>
          <p className="mt-1 text-sm text-slate-500">Yayınlanan ve taslak yazılarınızı yönetin</p>
        </div>
        <Button asChild>
          <Link href="/admin/posts/new">
            <Plus className="h-4 w-4" />
            Yeni Yazı
          </Link>
        </Button>
      </div>

      {posts.length === 0 ? (
        <EmptyState
          title="Henüz yazı yok"
          description="İlk yazınızı oluşturarak başlayın."
          action={
            <Button asChild>
              <Link href="/admin/posts/new">
                <Plus className="h-4 w-4" />
                Yeni Yazı Oluştur
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Card key={post.id} className="!p-0 overflow-hidden">
              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate font-medium text-slate-900">{post.title}</h3>
                    <Badge variant={post.status === 'PUBLISHED' ? 'success' : 'warning'}>
                      {post.status === 'PUBLISHED' ? 'Yayında' : 'Taslak'}
                    </Badge>
                  </div>
                  <p className="mt-1 truncate text-sm text-slate-500">/blog/{post.slug}</p>
                  {post.publishedAt && (
                    <p className="mt-1 text-xs text-slate-400">
                      {new Date(post.publishedAt).toLocaleDateString('tr-TR')}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/posts/${post.id}/edit`}>
                      <Pencil className="h-3.5 w-3.5" />
                      Düzenle
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => handleDelete(post.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Sil
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
