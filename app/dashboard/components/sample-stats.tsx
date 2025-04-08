"use client"

import { useState, useEffect } from "react"
import { Calendar, Users, FileText } from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"

export function SampleStats() {
  const [isLoading, setIsLoading] = useState(true)

  // Sample data exactly matching the provided data
  const sampleEvents = [
    {
      id: 1,
      title: "rapat",
      description: "Rapat organisasi",
      date: "2025-04-08",
      location: "Aula Utama",
      status: "akan datang",
      photos: []
    },
    {
      id: 2,
      title: "test123",
      description: "Test event",
      date: "2025-04-02",
      location: "Ruang Test",
      status: "akan datang",
      photos: []
    },
    {
      id: 3,
      title: "testes",
      description: "Test event",
      date: "2025-04-02",
      location: "Ruang Test",
      status: "akan datang",
      photos: []
    },
    {
      id: 4,
      title: "tambal vvelg",
      description: "Tambal velg",
      date: "2025-03-28",
      location: "Bengkel",
      status: "akan datang",
      photos: []
    },
    {
      id: 5,
      title: "string",
      description: "String event",
      date: "2025-03-23",
      location: "String location",
      status: "akan datang",
      photos: []
    },
    {
      id: 6,
      title: "string",
      description: "String event",
      date: "2025-03-23",
      location: "String location",
      status: "akan datang",
      photos: []
    },
    {
      id: 7,
      title: "string",
      description: "String event",
      date: "2025-03-23",
      location: "String location",
      status: "akan datang",
      photos: []
    },
    {
      id: 8,
      title: "Tambal Ban",
      description: "Tambal ban event",
      date: "2025-03-18",
      location: "Bengkel",
      status: "akan datang",
      photos: []
    }
  ];

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Calculate stats directly from sample data
  const totalEvents = sampleEvents.length
  const activeEvents = sampleEvents.filter(e => e.status === "akan datang").length
  const totalPhotos = sampleEvents.reduce((acc, e) => acc + (e.photos?.length || 0), 0)

  return (
    <>
      <StatCard
        title="Total Acara"
        value={totalEvents.toString()}
        description="Total acara"
        trend="up"
        percentage={0}
        icon={Calendar}
        isLoading={isLoading}
      />
      <StatCard
        title="Acara Aktif"
        value={activeEvents.toString()}
        description="Acara mendatang"
        trend="up"
        percentage={0}
        icon={Users}
        isLoading={isLoading}
      />
      <StatCard
        title="Total Foto"
        value={totalPhotos.toString()}
        description="Foto acara"
        trend="up"
        percentage={0}
        icon={FileText}
        isLoading={isLoading}
      />
    </>
  )
}
