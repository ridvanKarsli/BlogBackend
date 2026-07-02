import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type PostPreview = {
  id: number
  slug: string
  title: string
  excerpt?: string
  publishedAt?: string
  categories?: { name: string; slug: string }[]
  tags?: { name: string; slug: string }[]
}

function formatDate(date?: string) {
  if (!date) return null
  return new Date(date).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function PostCard({ post, className }: { post: PostPreview; className?: string }) {
  return (
    <article
      className={cn(
        'group flex flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-soft',
        className
      )}
    >
      {post.categories && post.categories.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {post.categories.slice(0, 2).map((cat) => (
            <Badge key={cat.slug} variant="brand">
              {cat.name}
            </Badge>
          ))}
        </div>
      )}

      <Link href={`/blog/${post.slug}`} className="block flex-1">
        <h2 className="font-display text-xl font-semibold leading-snug text-slate-900 transition group-hover:text-brand-600 sm:text-2xl">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">{post.excerpt}</p>
        )}
      </Link>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        {post.publishedAt ? (
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(post.publishedAt)}
          </span>
        ) : (
          <span />
        )}
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 transition hover:gap-2"
        >
          Oku
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  )
}
