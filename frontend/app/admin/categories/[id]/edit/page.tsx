'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import apiClient from '@/lib/apiClient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function EditCategoryPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await apiClient.get(`/api/admin/categories/${id}`)
        setName(res.data.name)
      } catch {
        alert('Kategori yüklenemedi')
      } finally {
        setLoading(false)
      }
    }
    fetchCategory()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await apiClient.put(`/api/admin/categories/${id}`, { name })
      router.push('/admin/categories')
    } catch {
      alert('Kategori güncellenemedi')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div>Yükleniyor...</div>

  return (
    <div className="max-w-lg">
      <h1 className="text-3xl font-bold mb-6">Kategori Düzenle</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Kategori Adı</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
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
