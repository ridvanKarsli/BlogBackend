import Link from 'next/link'
import { ArrowRight, Sparkles, Search, PenLine } from 'lucide-react'
import { getApiBase } from '@/lib/utils'
import { PostCard, type PostPreview } from '@/components/PostCard'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Ana Sayfa',
  description: 'Fikirler, hikayeler ve içgörüler — modern blog deneyimi.',
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
      {/* Hero */}
      <section className="gradient-hero border-b border-slate-200/60">
        <div className="container-page py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center animate-fade-in">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
              <Sparkles className="h-4 w-4" />
              Yeni nesil blog deneyimi
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Okumak, keşfetmek ve{' '}
              <span className="bg-gradient-to-r from-brand-600 to-violet-600 bg-clip-text text-transparent">
                ilham almak
              </span>{' '}
              için
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-600 sm:text-xl">
              Teknoloji, yaşam ve daha fazlası hakkında özenle hazırlanmış yazılar. Aradığınızı bulun, okuyun, paylaşın.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/blog">
                  Yazıları Keşfet
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Yazar Girişi</Link>
              </Button>
            </div>
          </div>

          {/* Feature pills */}
          <div className="mx-auto mt-16 grid max-w-4xl gap-4 sm:grid-cols-3">
            {[
              { icon: Search, title: 'Akıllı Arama', desc: 'PostgreSQL ile hızlı tam metin arama' },
              { icon: PenLine, title: 'Kolay Yönetim', desc: 'Admin panelinden yazı, kategori ve medya' },
              { icon: Sparkles, title: 'SEO Dostu', desc: 'Her yazı için özelleştirilebilir meta veriler' },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 text-center shadow-sm backdrop-blur-sm">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-sm font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-1 text-xs text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest posts */}
      <section className="container-page py-16 sm:py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">Son Yazılar</h2>
            <p className="mt-2 text-slate-500">En güncel içerikler burada</p>
          </div>
          {posts.length > 0 && (
            <Link href="/blog" className="hidden text-sm font-medium text-brand-600 hover:text-brand-700 sm:inline-flex sm:items-center sm:gap-1">
              Tümünü gör <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {featured.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
            <p className="text-slate-500">Henüz yayınlanmış yazı yok. İlk yazıyı admin panelinden ekleyebilirsiniz.</p>
            <Button className="mt-4" asChild>
              <Link href="/login">Admin Girişi</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {posts.length > 3 && (
          <div className="mt-10 text-center sm:hidden">
            <Button variant="outline" asChild>
              <Link href="/blog">Tüm Yazıları Gör</Link>
            </Button>
          </div>
        )}
      </section>
    </>
  )
}
