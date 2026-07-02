import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getApiBase } from '@/lib/utils'
import { PostCard, type PostPreview } from '@/components/PostCard'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Ana Sayfa',
  description: 'Blog yazıları',
}

async function getLatestPosts(): Promise<PostPreview[]> {
  try {
    const res = await fetch(`${getApiBase()}/api/posts`, { next: { revalidate: 60 } })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function Home() {
  const posts = await getLatestPosts()
  const featured = posts.slice(0, 3)

  return (
    <>
      <section className="gradient-hero border-b border-slate-200/60">
        <div className="container-page py-16 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Blog
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Yazıları oku, admin panelinden yeni içerik ekle.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/blog">
                  Yazılara git
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Giriş</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold text-slate-900">Son yazılar</h2>
          {posts.length > 0 && (
            <Link href="/blog" className="text-sm text-brand-600 hover:underline">
              Tümü
            </Link>
          )}
        </div>

        {featured.length === 0 ? (
          <p className="text-center text-slate-500 py-12">
            Henüz yazı yok.{' '}
            <Link href="/login" className="text-brand-600 hover:underline">
              Giriş yapıp
            </Link>{' '}
            ilk yazıyı ekleyebilirsin.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
