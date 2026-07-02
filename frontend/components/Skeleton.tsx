import { cn } from '@/lib/utils'

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-lg bg-slate-200/80', className)} />
}

export function PostCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card">
      <Skeleton className="mb-3 h-5 w-20" />
      <Skeleton className="mb-2 h-7 w-3/4" />
      <Skeleton className="mb-1 h-4 w-full" />
      <Skeleton className="mb-1 h-4 w-5/6" />
      <Skeleton className="mt-5 h-4 w-24" />
    </div>
  )
}

export function PageLoader({ text = 'Yükleniyor...' }: { text?: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-brand-600" />
      <p className="text-sm text-slate-500">{text}</p>
    </div>
  )
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
      <h3 className="font-display text-lg font-semibold text-slate-900">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
