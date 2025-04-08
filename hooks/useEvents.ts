"use client"

import { useCallback, useState } from "react"
import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from "@tanstack/react-query"
import axios from "axios"
import { eventApi, type Event, type EventFormData, type PaginatedResponse, type Attendee, extractErrorMessage } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

// Query keys
export const eventKeys = {
  all: ["events"] as const,
  lists: () => [...eventKeys.all, "list"] as const,
  list: (filters: Record<string, any>) => [...eventKeys.lists(), filters] as const,
  details: () => [...eventKeys.all, "detail"] as const,
  detail: (id: number | string) => [...eventKeys.details(), id] as const,
  attendance: (eventId: number | string) => [...eventKeys.detail(eventId), "attendance"] as const,
}

// Hook for fetching events with pagination
export function useEvents(
  page = 1,
  limit = 10,
  options?: Omit<UseQueryOptions<Event[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Event[], Error>({
    queryKey: eventKeys.list({ page, limit }),
    queryFn: ({ signal }) => eventApi.getEvents(page, limit, signal),
    retry: 1,
    staleTime: 30000,
    refetchOnWindowFocus: false,
    ...options,
  })
}

// Hook for searching events
export function useSearchEvents(
  searchParams: Record<string, any>,
  options?: Omit<UseQueryOptions<Event[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Event[], Error>({
    queryKey: eventKeys.list(searchParams),
    queryFn: ({ signal }) => eventApi.searchEvents(searchParams, signal),
    enabled: Object.values(searchParams).some((value) => !!value),
    retry: 1,
    staleTime: 30000,
    refetchOnWindowFocus: false,
    ...options,
  })
}

// Hook for fetching a single event
export function useEvent(id: number | string, options?: UseQueryOptions<Event>) {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: ({ signal }) => eventApi.getEvent(id, signal),
    retry: (failureCount, error) => {
      // Don't retry if the request was canceled
      if (axios.isCancel(error)) {
        return false
      }
      // Otherwise retry up to 2 times
      return failureCount < 2
    },
    ...options,
  })
}

// Hook for fetching event attendance
export function useEventAttendance(
  eventId: number | string,
  options?: Omit<UseQueryOptions<Attendee[], Error, Attendee[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Attendee[], Error>({
    queryKey: eventKeys.attendance(eventId),
    queryFn: ({ signal }) => eventApi.getEventAttendance(eventId, signal),
    retry: (failureCount, error) => {
      // Don't retry if the request was canceled
      if (axios.isCancel(error)) {
        return false
      }
      // Otherwise retry up to 2 times
      return failureCount < 2
    },
    ...options,
  })
}

// Hook for attendance mutations
export function useAttendanceMutations(eventId: number | string) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const createOrUpdateAttendance = useMutation({
    mutationFn: (attendanceData: Array<{ member_id: number; status: string; notes: string }>) =>
      eventApi.createOrUpdateAttendance(eventId, attendanceData),
    onSuccess: () => {
      // Invalidate attendance queries to refetch the list
      queryClient.invalidateQueries({ queryKey: eventKeys.attendance(eventId) })

      // Show success toast
      toast({
        title: "Berhasil",
        description: "Data kehadiran berhasil disimpan",
      })
    },
    onError: (error) => {
      // Show error toast
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menyimpan data kehadiran",
        variant: "destructive",
      })
      console.error("Error saving attendance:", error)
    }
  })

  return {
    createOrUpdateAttendance
  }
}

// Hook for creating, updating, and deleting events
export function useEventMutations() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Create event mutation
  const createEvent = useMutation({
    mutationFn: (data: EventFormData) => eventApi.createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() })
      toast({
        title: "Berhasil",
        description: "Acara berhasil dibuat",
      })
    },
    onError: (error: unknown) => {
      let errorMessage = "Gagal membuat acara"

      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === "object" && error !== null) {
        // Handle validation errors or other structured error responses
        const errorObj = error as Record<string, any>
        if (errorObj.response?.data?.detail) {
          const detail = errorObj.response.data.detail
          if (Array.isArray(detail)) {
            errorMessage = detail.join(", ")
          } else if (typeof detail === "object") {
            errorMessage = Object.values(detail).flat().join(", ")
          } else {
            errorMessage = String(detail)
          }
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    },
  })

  // Update event mutation
  const updateEvent = useMutation({
    mutationFn: async ({ id, data }: { id: number | string; data: Partial<EventFormData> }) => {
      try {
        // Log the data being sent to the API
        console.log('Sending update data to API:', { id, data })
        return await eventApi.updateEvent(id, data)
      } catch (error) {
        // Log the error for debugging
        console.error('Error in updateEvent mutation:', error)
        throw error
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(data.id) })
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() })
      toast({
        title: "Berhasil",
        description: "Acara berhasil diperbarui",
      })
    },
    onError: (error) => {
      console.error('Error updating event:', error)
      let errorMessage = "Gagal memperbarui acara"

      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === "object" && error !== null) {
        // Handle validation errors or other structured error responses
        const errorObj = error as Record<string, any>
        if (errorObj.response?.data?.detail) {
          const detail = errorObj.response.data.detail
          if (Array.isArray(detail)) {
            errorMessage = detail.join(", ")
          } else if (typeof detail === "object") {
            errorMessage = Object.values(detail).flat().join(", ")
          } else {
            errorMessage = String(detail)
          }
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    },
  })

  // Delete event mutation with optimistic update
  const deleteEvent = useMutation({
    mutationFn: (id: number | string) => eventApi.deleteEvent(id),
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: eventKeys.lists() })

      // Snapshot the previous value
      const previousEvents = queryClient.getQueryData(eventKeys.lists())

      // Optimistically update to the new value
      queryClient.setQueryData(eventKeys.lists(), (old: any) => {
        if (!old) return old
        return {
          ...old,
          data: old.data.filter((event: Event) => event.id !== id),
        }
      })

      return { previousEvents }
    },
    onSuccess: () => {
      toast({
        title: "Berhasil",
        description: "Acara berhasil dihapus",
      })
    },
    onError: (error, _, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousEvents) {
        queryClient.setQueryData(eventKeys.lists(), context.previousEvents)
      }

      toast({
        title: "Error",
        description: extractErrorMessage(error),
        variant: "destructive",
      })
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() })
    },
  })

  // Upload photos mutation
  const uploadPhotos = useMutation({
    mutationFn: ({
      eventId,
      files,
      onProgress,
    }: {
      eventId: number | string
      files: File[]
      onProgress?: (percentage: number) => void
    }) => eventApi.uploadEventPhotos(eventId, files, onProgress),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) })
      toast({
        title: "Berhasil",
        description: "Foto berhasil diunggah",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: extractErrorMessage(error),
        variant: "destructive",
      })
    },
  })

  return {
    createEvent,
    updateEvent,
    deleteEvent,
    uploadPhotos,
  }
}

// Hook for optimistic event operations
export function useOptimisticEvent(eventId: number | string) {
  const queryClient = useQueryClient()
  const [isOptimistic, setIsOptimistic] = useState(false)

  // Get the current event data
  const currentEvent = queryClient.getQueryData<Event>(eventKeys.detail(eventId))

  // Optimistically update the event
  const optimisticallyUpdateEvent = useCallback(
    (updatedFields: Partial<Event>) => {
      if (!currentEvent) return

      setIsOptimistic(true)

      // Update the event in the cache
      queryClient.setQueryData(eventKeys.detail(eventId), {
        ...currentEvent,
        ...updatedFields,
        // Mark as optimistic update
        _optimistic: true,
      })

      return () => {
        // Revert function
        queryClient.setQueryData(eventKeys.detail(eventId), currentEvent)
        setIsOptimistic(false)
      }
    },
    [currentEvent, eventId, queryClient],
  )

  return {
    isOptimistic,
    optimisticallyUpdateEvent,
  }
}


