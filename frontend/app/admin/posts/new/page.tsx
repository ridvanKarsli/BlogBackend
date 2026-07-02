'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import apiClient from '@/lib/apiClient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Category = { id: number; name: string }
type Tag = { id: number; name: string }

export default function NewPostPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    status: 'DRAFT',
    seoTitle: '',
    seoDescription: '',
    canonicalUrl: '',
    ogImage: '',
    categoryIds: [] as number[],
    tagIds: [] as number[],
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [catRes, tagRes] = await Promise.all([
          apiClient.get('/api/admin/categories'),
          apiClient.get('/api/admin/tags'),
        ])
        setCategories(catRes.data)
        setTags(tagRes.data)
      } catch {
        // ignore
      }
    }
    fetchMeta()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const slugify = (s: string) =>
    s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9ğüşöçıİĞÜŞÖÇ\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: prev.slug || slugify(value),
      seoTitle: prev.seoTitle || value,
    }))
  }

  const toggleSelection = (field: 'categoryIds' | 'tagIds', value: number) => {
    setForm((prev) => {
      const current = prev[field]
      const next = current.includes(value) ? current.filter((id) => id !== value) : [...current, value]
      return { ...prev, [field]: next }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await apiClient.post('/api/admin/posts', form)
      router.push('/admin/posts')
    } catch (err: any) {
      alert(err.response?.data?.message || 'Kaydetme başarısız')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Yeni Yazı</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Başlık</label>
          <Input name="title" value={form.title} onChange={handleTitleChange} required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <Input name="slug" value={form.slug} onChange={handleChange} />
          <p className="text-sm text-gray-500 mt-1">URL: /blog/{form.slug || '...'}</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">İçerik</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            required
            rows={12}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Özet</label>
          <textarea
            name="excerpt"
            value={form.excerpt}
            onChange={handleChange}
            rows={3}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">SEO Başlığı</label>
            <Input name="seoTitle" value={form.seoTitle} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">SEO Açıklaması</label>
            <Input name="seoDescription" value={form.seoDescription} onChange={handleChange} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Canonical URL</label>
            <Input name="canonicalUrl" value={form.canonicalUrl} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">OG Görsel URL</label>
            <Input name="ogImage" value={form.ogImage} onChange={handleChange} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Kategoriler</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-1 text-sm border rounded px-2 py-1">
                <input
                  type="checkbox"
                  checked={form.categoryIds.includes(cat.id)}
                  onChange={() => toggleSelection('categoryIds', cat.id)}
                />
                {cat.name}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Etiketler</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <label key={tag.id} className="flex items-center gap-1 text-sm border rounded px-2 py-1">
                <input
                  type="checkbox"
                  checked={form.tagIds.includes(tag.id)}
                  onChange={() => toggleSelection('tagIds', tag.id)}
                />
                {tag.name}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Durum</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="DRAFT">Taslak</option>
            <option value="PUBLISHED">Yayınlandı</option>
          </select>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            İptal
          </Button>
        </div>
      </form>
    </div>
  )
}
