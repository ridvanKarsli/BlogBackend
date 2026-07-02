import './globals.css'
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'
import { AuthProvider } from '@/lib/authContext'
import AppChrome from '@/components/AppChrome'

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const display = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata = {
  title: {
    default: 'Blog',
    template: '%s | Blog',
  },
  description: 'Blog yazıları',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${sans.variable} ${display.variable}`}>
      <body className="min-h-screen flex flex-col font-sans">
        <AuthProvider>
          <AppChrome>{children}</AppChrome>
        </AuthProvider>
      </body>
    </html>
  )
}
