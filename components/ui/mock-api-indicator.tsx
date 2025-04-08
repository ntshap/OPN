"use client"

import { useState, useEffect } from "react"
import { AlertCircle, Database } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { isUsingMockApi } from "@/lib/api"

export function MockApiIndicator() {
  const [showIndicator, setShowIndicator] = useState(false)

  useEffect(() => {
    // Check if we're using the mock API every second
    const interval = setInterval(() => {
      setShowIndicator(isUsingMockApi())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (!showIndicator) return null

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-md">
      <Alert className="bg-yellow-50 border-yellow-200">
        <Database className="h-4 w-4 text-yellow-600" />
        <AlertTitle className="text-yellow-800">Mode Offline</AlertTitle>
        <AlertDescription className="text-yellow-700">
          Anda sedang menggunakan data lokal karena server tidak dapat dijangkau.
          Data yang Anda buat akan disimpan secara lokal dan akan disinkronkan
          ketika koneksi ke server tersedia kembali.
        </AlertDescription>
      </Alert>
    </div>
  )
}
