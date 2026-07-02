'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import apiClient from '@/lib/apiClient'

export default function TagsPage() {
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await apiClient.get('/api/admin/tags')
        setTags(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Silmek istediğinizden emin misiniz?')) return
    try {
      await apiClient.delete(`/api/admin/tags/${id}`)
      setTags(tags.filter((t: any) => t.id !== id))
    } catch (err) {
      alert('Silme başarısız')
    }
  }

  if (loading) return <div>Yükleniyor...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Etiketler</h1>
        <Link href="/admin/tags/new" className="bg-blue-500 text-white px-4 py-2 rounded">
          Yeni Etiket
        </Link>
      </div>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Adı</th>
            <th className="border p-2">Slug</th>
            <th className="border p-2">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {tags.map((tag: any) => (
            <tr key={tag.id}>
              <td className="border p-2">{tag.name}</td>
              <td className="border p-2">{tag.slug}</td>
              <td className="border p-2 space-x-2">
                <Link href={`/admin/tags/${tag.id}/edit`} className="text-blue-500">
                  Düzenle
                </Link>
                <button onClick={() => handleDelete(tag.id)} className="text-red-500">
                  Sil
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
