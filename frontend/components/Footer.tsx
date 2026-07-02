import Link from 'next/link'
import { BookOpen, Rss } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white">
      <div className="container-page py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
                <BookOpen className="h-4 w-4" />
              </span>
              Blog
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500">
              Fikirler, hikayeler ve içgörüler. Okumak, keşfetmek ve paylaşmak için modern bir blog deneyimi.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">Keşfet</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><Link href="/blog" className="transition hover:text-brand-600">Tüm Yazılar</Link></li>
              <li><Link href="/login" className="transition hover:text-brand-600">Giriş Yap</Link></li>
              <li><Link href="/register" className="transition hover:text-brand-600">Kayıt Ol</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">Site</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <a href="/sitemap.xml" className="inline-flex items-center gap-1.5 transition hover:text-brand-600">
                  <Rss className="h-3.5 w-3.5" />
                  Sitemap
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-100 pt-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Blog. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  )
}
