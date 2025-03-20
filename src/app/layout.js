import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from '@/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Bike Booking App',
  description: 'Rent bikes easily with our booking platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}