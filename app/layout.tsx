import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Pokedex Explorer - Discover Pokemon',
  description:
    'Explore and discover Pokemon from all generations. Search, filter by type, and view detailed stats for every Pokemon.',
  generator: 'v0.app',
  keywords: ['Pokemon', 'Pokedex', 'PokeAPI', 'Pokemon Stats', 'Pokemon Types'],
  icons: {
    icon: [
      {
        url: '/pokeball-favicon.png',
        type: 'image/png',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="font-sans antialiased" suppressHydrationWarning={true}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
