import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'brand'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-slate-100 text-slate-700 ring-slate-200/60',
    brand: 'bg-brand-50 text-brand-700 ring-brand-200/60',
    success: 'bg-emerald-50 text-emerald-700 ring-emerald-200/60',
    warning: 'bg-amber-50 text-amber-700 ring-amber-200/60',
    destructive: 'bg-red-50 text-red-700 ring-red-200/60',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        variants[variant],
        className
      )}
      {...props}
    />
  )
}
