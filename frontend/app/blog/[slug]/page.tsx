import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, User, ArrowLeft, Clock } from 'lucide-react'
import { getApiBase } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

type Post = {
  id: number
  title: string
  content: string
  slug: string
  seoTitle: string
  seoDescription: string
  canonicalUrl: string
  ogImage: string
  publishedAt: string
  excerpt: string
  author: { email: string }
  categories: { name: string; slug: string }[]
  tags: { name: string; slug: string }[]
}

async function fetchPost(slug: string): Promise<Post | null> {
  const res = await fetch(`${getApiBase()}/api/posts/${slug}`, { next: { revalidate: 60 } })
  if (!res.ok) return null
  return res.json()
}

function formatDate(date?: string) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function estimateReadingTime(html: string) {
  const text = html.replace(/<[^>]*>/g, '')
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await fetchPost(params.slug)
  if (!post) return { title: 'Yazı bulunamadı' }

  const title = post.seoTitle || post.title
  const description = post.seoDescription || post.excerpt

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: post.ogImage ? [{ url: post.ogImage }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.ogImage ? [post.ogImage] : [],
    },
    alternates: post.canonicalUrl ? { canonical: post.canonicalUrl } : undefined,
  }
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const post = await fetchPost(params.slug)
  if (!post) notFound()

  const readingTime = estimateReadingTime(post.content)
  const authorName = post.author?.email?.split('@')[0] || 'Yazar'

  return (
    <article className="container-page py-10 sm:py-14">
      {/* Back link */}
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-brand-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Tüm yazılara dön
      </Link>

      {/* Article header */}
      <header className="mx-auto max-w-3xl animate-slide-up">
        {post.categories.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {post.categories.map((category) => (
              <Badge key={category.slug} variant="brand">
                {category.name}
              </Badge>
            ))}
          </div>
        )}

        <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="mt-4 text-lg leading-relaxed text-slate-600">{post.excerpt}</p>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-4 border-b border-slate-200 pb-8 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            {authorName}
          </span>
          {post.publishedAt && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatDate(post.publishedAt)}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {readingTime} dk okuma
          </span>
        </div>
      </header>

      {/* OG image */}
      {post.ogImage && (
        <div className="mx-auto mt-8 max-w-3xl">
          <img src={post.ogImage} alt={post.title} className="w-full rounded-2xl shadow-card" />
        </div>
      )}

      {/* Content */}
      <div
        className="prose-blog mx-auto mt-10 max-w-3xl"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Tags */}
      {post.tags.length > 0 && (
        <footer className="mx-auto mt-12 max-w-3xl border-t border-slate-200 pt-8">
          <p className="mb-3 text-sm font-medium text-slate-700">Etiketler</p>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag.slug} variant="default">
                #{tag.name}
              </Badge>
            ))}
          </div>
        </footer>
      )}
    </article>
  )
}
