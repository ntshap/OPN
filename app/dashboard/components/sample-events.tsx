"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Define the event structure
interface Event {
  id: number
  title: string
  description: string
  date: string
  location: string
  status: string
}

export function SampleEvents() {
  const [isLoading, setIsLoading] = useState(true)

  // Sample data exactly matching the provided data
  const sampleEvents = [
    {
      id: 1,
      title: "rapat",
      description: "Rapat organisasi",
      date: "2025-04-08",
      location: "Aula Utama",
      status: "akan datang"
    },
    {
      id: 2,
      title: "test123",
      description: "Test event",
      date: "2025-04-02",
      location: "Ruang Test",
      status: "akan datang"
    },
    {
      id: 3,
      title: "testes",
      description: "Test event",
      date: "2025-04-02",
      location: "Ruang Test",
      status: "akan datang"
    },
    {
      id: 4,
      title: "tambal vvelg",
      description: "Tambal velg",
      date: "2025-03-28",
      location: "Bengkel",
      status: "akan datang"
    },
    {
      id: 5,
      title: "string",
      description: "String event",
      date: "2025-03-23",
      location: "String location",
      status: "akan datang"
    },
    {
      id: 6,
      title: "string",
      description: "String event",
      date: "2025-03-23",
      location: "String location",
      status: "akan datang"
    },
    {
      id: 7,
      title: "string",
      description: "String event",
      date: "2025-03-23",
      location: "String location",
      status: "akan datang"
    },
    {
      id: 8,
      title: "Tambal Ban",
      description: "Tambal ban event",
      date: "2025-03-18",
      location: "Bengkel",
      status: "akan datang"
    }
  ];

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Format date function to match the required format (DD MMM YYYY)
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      // Format as "DD MMM YYYY" with the month abbreviated and first letter capitalized
      const day = date.getDate().toString().padStart(2, '0')

      // Get month abbreviation (Apr, Mar, etc.)
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const month = monthNames[date.getMonth()]

      const year = date.getFullYear()

      return `${day} ${month} ${year}`
    } catch (error) {
      console.error("Error formatting date:", error)
      return dateString
    }
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Acara Terbaru</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : sampleEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Tidak ada acara yang akan datang</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 font-medium text-gray-500">Nama Acara</th>
                <th className="text-right py-2 font-medium text-gray-500">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {sampleEvents.map((event) => (
                <tr key={event.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 font-medium">{event.title}</td>
                  <td className="py-3 text-right">{formatDate(event.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  )
}
