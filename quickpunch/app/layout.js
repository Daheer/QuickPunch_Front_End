import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import CircleStdFont from "next/font/local"
import { Toaster } from "react-hot-toast";

export const CircleStdFontStyle = CircleStdFont({ src: '../font/CircularStd-Book.ttf' })

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'QuickPunch',
  description: 'Get summaries of your daily Nigerian news in Deedax style!',
  creator: 'Dahiru Ibrahim',
  icons: {
    'icon': '/quickpunch.jpeg',
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className='dark'>
      <Providers>
        <body className={CircleStdFontStyle.className}>
          <Toaster position="top-center" />
          {children}
        </body>
      </Providers>
    </html>
  )
}
