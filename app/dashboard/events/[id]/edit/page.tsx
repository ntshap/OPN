"use client"

import { useParams } from "next/navigation"
import { EventFormClient } from "@/components/events/event-form-client"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import type { Event } from "@/lib/api"

// Mock data for the event
const mockEvent: Event & { minutes?: string } = {
  id: 6,
  title: "string",
  description: "Sixth test event",
  date: "2023-03-23",
  time: "13:00",
  location: "Sixth location",
  status: "akan datang",
  attendees: 65,
  created_by: 1,
  created_at: "2024-03-22T15:30:00Z",
  updated_at: "2024-03-22T15:30:00Z",
  photos: [],
  minutes: "Tulis notulensi rapat di sini..."
};

export default function EditEventPage() {
  const params = useParams<{ id: string }>()
  const eventId = params.id

  // Use client-side state to avoid hydration issues
  const [event, setEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Simulate API call on the client side only
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      if (eventId === "6") {
        setEvent(mockEvent)
        setIsLoading(false)
      } else {
        setIsError(true)
        setError(new Error("Event not found"))
        setIsLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [eventId])

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-24" />
        </div>

        <div className="border rounded-lg p-6 space-y-4">
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-full" />

            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-32 w-full" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error ? error.message : "Failed to load event details. Please try again."}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Edit Event</h1>
      </div>

      <EventFormClient event={event!} isEditing={true} />
    </div>
  )
}
