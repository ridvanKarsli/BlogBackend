'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import apiClient from '@/lib/apiClient'

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await apiClient.get('/api/admin/categories')
        setCategories(res.data)
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
      await apiClient.delete(`/api/admin/categories/${id}`)
      setCategories(categories.filter((c: any) => c.id !== id))
    } catch (err) {
      alert('Silme başarısız')
    }
  }

  if (loading) return <div>Yükleniyor...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Kategoriler</h1>
        <Link href="/admin/categories/new" className="bg-blue-500 text-white px-4 py-2 rounded">
          Yeni Kategori
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
          {categories.map((cat: any) => (
            <tr key={cat.id}>
              <td className="border p-2">{cat.name}</td>
              <td className="border p-2">{cat.slug}</td>
              <td className="border p-2 space-x-2">
                <Link href={`/admin/categories/${cat.id}/edit`} className="text-blue-500">
                  Düzenle
                </Link>
                <button onClick={() => handleDelete(cat.id)} className="text-red-500">
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
