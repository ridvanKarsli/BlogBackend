'use client'

import { useState, useEffect, ChangeEvent } from 'react'
import apiClient from '@/lib/apiClient'

interface MediaFile {
  id: number
  fileName: string
  fileUrl: string
}

export default function MediaPage() {
  const [media, setMedia] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await apiClient.get('/api/admin/media')
        setMedia(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const handleUploadFile = async (file: File) => {
    setUploading(true)
    setProgress(0)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await apiClient.post('/api/admin/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (p) => {
          if (p.total) setProgress(Math.round((p.loaded * 100) / p.total))
        },
      })
      setMedia((prev) => [...prev, res.data])
    } catch (err) {
      alert('Yükleme başarısız')
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    handleUploadFile(file)
  }

  // drag and drop
  const handleDrop = (ev: React.DragEvent<HTMLDivElement>) => {
    ev.preventDefault()
    const file = ev.dataTransfer.files?.[0]
    if (!file) return
    handleUploadFile(file)
  }

  const handleDragOver = (ev: React.DragEvent<HTMLDivElement>) => {
    ev.preventDefault()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Silmek istediğinizden emin misiniz?')) return
    try {
      await apiClient.delete(`/api/admin/media/${id}`)
      setMedia(media.filter((m: any) => m.id !== id))
    } catch (err) {
      alert('Silme başarısız')
    }
  }

  if (loading) return <div>Yükleniyor...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Medya</h1>
      <div className="mb-6">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-dashed border-2 border-gray-300 rounded p-6 text-center cursor-pointer"
        >
          <p>Dosyayı buraya sürükleyin veya</p>
          <input type="file" onChange={handleUpload} disabled={uploading} className="mt-3" />
          {uploading && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded h-2">
                <div className="bg-blue-500 h-2 rounded" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-sm text-gray-600 mt-1">Yükleme: {progress}%</p>
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {media.map((m: any) => (
          <div key={m.id} className="border p-4">
            <img src={m.fileUrl} alt={m.fileName} className="w-full h-40 object-cover" />
            <p className="text-sm mt-2">{m.fileName}</p>
            <button onClick={() => handleDelete(m.id)} className="text-red-500 text-sm">
              Sil
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
