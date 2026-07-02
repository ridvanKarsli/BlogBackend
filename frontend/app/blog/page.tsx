'use client'

import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import apiClient from '@/lib/apiClient'
import { PostCard, type PostPreview } from '@/components/PostCard'
import { PostCardSkeleton, EmptyState, PageLoader } from '@/components/Skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function BlogPage() {
  const [posts, setPosts] = useState<PostPreview[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [isSearch, setIsSearch] = useState(false)

  const loadPosts = async (searchQuery?: string) => {
    setSearching(true)
    try {
      const trimmed = searchQuery?.trim()
      const url = trimmed ? `/api/search?q=${encodeURIComponent(trimmed)}` : '/api/posts'
      const res = await apiClient.get(url)
      setPosts(res.data)
      setIsSearch(!!trimmed)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
      setSearching(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadPosts(query)
  }

  const clearSearch = () => {
    setQuery('')
    loadPosts()
  }

  return (
    <div className="container-page py-10 sm:py-14">
      {/* Page header */}
      <div className="mb-10 animate-slide-up">
        <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Yazılar</h1>
        <p className="mt-2 max-w-xl text-slate-500">
          Tüm yayınlanmış içerikleri keşfedin. Anahtar kelime ile arama yapabilirsiniz.
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Yazılarda ara..."
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={searching}>
            {searching ? 'Aranıyor...' : 'Ara'}
          </Button>
          {isSearch && (
            <Button type="button" variant="outline" onClick={clearSearch}>
              <X className="h-4 w-4" />
              Temizle
            </Button>
          )}
        </div>
      </form>

      {isSearch && !loading && (
        <p className="mb-6 text-sm text-slate-500">
          <span className="font-medium text-slate-700">{posts.length}</span> sonuç bulundu
        </p>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <EmptyState
          title={isSearch ? 'Sonuç bulunamadı' : 'Henüz yazı yok'}
          description={
            isSearch
              ? 'Farklı anahtar kelimeler deneyin veya aramayı temizleyin.'
              : 'İlk yazı yayınlandığında burada görünecek.'
          }
          action={
            isSearch ? (
              <Button variant="outline" onClick={clearSearch}>
                Aramayı Temizle
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
