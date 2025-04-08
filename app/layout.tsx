import type React from "react"
import "@/app/globals.css"
import "@/styles/tiptap.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Providers } from "@/app/providers"
import { RegisterServiceWorker } from "@/app/register-sw"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "OPN - Sistem Manajemen Acara",
  description: "Kelola acara dan aktivitas organisasi Anda",
  icons: {
    icon: [
      { url: "/images/opn-logo.png", type: "image/png" },
    ],
  },
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <RegisterServiceWorker />
          {children}
        </Providers>
      </body>
    </html>
  )
}
