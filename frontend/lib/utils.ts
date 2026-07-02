import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getApiBase(): string {
  if (typeof window === 'undefined') {
    return process.env.INTERNAL_API_BASE || process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080'
  }
  return process.env.NEXT_PUBLIC_API_BASE ?? ''
}
