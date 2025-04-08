"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { meetingMinutesApi, type MeetingMinutes, type MeetingMinutesFormData } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

// Query keys for meeting minutes
export const meetingMinutesKeys = {
  all: ['meeting-minutes'] as const,
  lists: () => [...meetingMinutesKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...meetingMinutesKeys.lists(), filters] as const,
  details: () => [...meetingMinutesKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...meetingMinutesKeys.details(), id] as const,
}

// Hook for fetching all meeting minutes
export function useMeetingMinutes() {
  const { toast } = useToast()

  return useQuery({
    queryKey: meetingMinutesKeys.lists(),
    queryFn: async ({ signal }) => {
      try {
        return await meetingMinutesApi.getMeetingMinutes(signal)
      } catch (error) {
        // Handle specific error cases
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 403) {
            console.log('Permission denied for meeting minutes. Returning empty array.')
            return [] // Return empty array for 403 errors
          }

          // Handle timeout errors
          if (error.code === 'ECONNABORTED') {
            console.log('Timeout error fetching meeting minutes. Returning empty array.')
            toast({
              title: "Waktu permintaan habis",
              description: "Tidak dapat memuat data notulensi. Silakan coba lagi nanti.",
              variant: "destructive",
            })
            return [] // Return empty array for timeout errors
          }
        }

        // For all other errors, return empty array to prevent UI from breaking
        console.error('Error fetching meeting minutes:', error)
        return []
      }
    },
    retry: (failureCount, error) => {
      // Don't retry if the request was canceled
      if (axios.isCancel(error)) {
        return false
      }
      // Don't retry 403 errors
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        return false
      }
      // Don't retry timeout errors after 1 attempt
      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED' && failureCount >= 1) {
        return false
      }
      // Retry up to 2 times for other errors
      return failureCount < 2
    },
    // Return a default value on error to prevent UI from breaking
    onError: (error) => {
      console.error('Error in useMeetingMinutes:', error)
    },
    // Important: We want to return the error so components can handle it
    throwOnError: false,
    // Increase stale time to reduce unnecessary refetches
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook for fetching meeting minutes by event ID
export function useMeetingMinutesByEvent(eventId: number | string) {
  const { data: allMinutes, isLoading, error, refetch } = useMeetingMinutes()
  const { toast } = useToast()

  // Handle errors gracefully
  if (error) {
    console.error(`Error in useMeetingMinutesByEvent(${eventId}):`, error)

    // Check if it's a 403 error (permission denied)
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      console.log('Permission denied for meeting minutes. Returning empty array.')
      return {
        data: [],
        isLoading: false,
        error,
        refetch
      }
    }

    // Check if it's a timeout error
    if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
      console.log('Timeout error fetching meeting minutes. Returning empty array.')
      toast({
        title: "Waktu permintaan habis",
        description: "Tidak dapat memuat data notulensi. Silakan coba lagi nanti.",
        variant: "destructive",
      })
      return {
        data: [],
        isLoading: false,
        error,
        refetch
      }
    }
  }

  // Filter minutes by event ID
  const filteredMinutes = allMinutes?.filter(minutes => minutes.event_id === Number(eventId)) || []

  return {
    data: filteredMinutes,
    isLoading,
    error,
    refetch
  }
}

// Hook for fetching a single meeting minutes item
export function useMeetingMinutesItem(id: number | string) {
  const { toast } = useToast()

  return useQuery({
    queryKey: meetingMinutesKeys.detail(id),
    queryFn: async ({ signal }) => {
      try {
        // This will now always return data, even in error cases
        return await meetingMinutesApi.getMeetingMinutesById(id, signal)
      } catch (error) {
        // This should never happen since the API function handles all errors internally
        // But just in case, we'll handle it here too
        console.error(`Unexpected error in useMeetingMinutesItem(${id}):`, error);

        // Create a default fallback object
        const fallbackData = {
          id: Number(id),
          title: 'Error Tidak Terduga',
          description: 'Terjadi kesalahan yang tidak terduga saat memuat data notulensi. Silakan coba lagi nanti.',
          date: new Date().toISOString().split('T')[0],
          document_url: '',
          event_id: Number(id),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        // Show toast notification
        toast({
          title: "Terjadi kesalahan",
          description: "Tidak dapat memuat data notulensi. Menggunakan data cadangan.",
          variant: "destructive",
        });

        return fallbackData;
      }
    },
    enabled: !!id,
    retry: (failureCount, error) => {
      // Don't retry if the request was canceled
      if (axios.isCancel(error)) {
        return false
      }
      // Don't retry timeout errors after 1 attempt
      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED' && failureCount >= 1) {
        return false
      }
      // Retry up to 2 times for other errors
      return failureCount < 2
    },
    // Return a default value on error to prevent UI from breaking
    onError: (error) => {
      console.error(`Error in useMeetingMinutesItem(${id}):`, error)
    },
    // Increase stale time to reduce unnecessary refetches
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook for meeting minutes mutations (create, update, delete)
export function useMeetingMinutesMutations() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const createMeetingMinutes = useMutation({
    mutationFn: (data: MeetingMinutesFormData) => meetingMinutesApi.createMeetingMinutes(data),
    onSuccess: () => {
      // Invalidate all meeting minutes queries to refetch the list
      queryClient.invalidateQueries({ queryKey: meetingMinutesKeys.lists() })

      // Show success toast
      toast({
        title: "Berhasil",
        description: "Notulensi berhasil dibuat",
      })
    },
    onError: (error) => {
      console.error("Error creating meeting minutes:", error)

      // Show more specific error messages based on the error type
      let errorMessage = "Terjadi kesalahan saat membuat notulensi";

      if (error instanceof Error) {
        // Use the error message from the API if available
        errorMessage = error.message;
      }

      // Show error toast with the appropriate message
      toast({
        title: "Gagal",
        description: errorMessage,
        variant: "destructive",
      })
    }
  })

  const updateMeetingMinutes = useMutation({
    mutationFn: ({ id, data }: { id: number | string, data: Partial<MeetingMinutesFormData> }) =>
      meetingMinutesApi.updateMeetingMinutes(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific meeting minutes item and list
      queryClient.invalidateQueries({ queryKey: meetingMinutesKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: meetingMinutesKeys.lists() })

      // Show success toast
      toast({
        title: "Berhasil",
        description: "Notulensi berhasil diperbarui",
      })
    },
    onError: (error) => {
      console.error("Error updating meeting minutes:", error)

      // Show more specific error messages based on the error type
      let errorMessage = "Terjadi kesalahan saat memperbarui notulensi";

      if (error instanceof Error) {
        // Use the error message from the API if available
        errorMessage = error.message;
      }

      // Show error toast with the appropriate message
      toast({
        title: "Gagal",
        description: errorMessage,
        variant: "destructive",
      })
    }
  })

  const deleteMeetingMinutes = useMutation({
    mutationFn: (id: number | string) => meetingMinutesApi.deleteMeetingMinutes(id),
    onSuccess: (_, id) => {
      // Invalidate all meeting minutes queries
      queryClient.invalidateQueries({ queryKey: meetingMinutesKeys.lists() })

      // Show success toast
      toast({
        title: "Berhasil",
        description: "Notulensi berhasil dihapus",
      })
    },
    onError: (error) => {
      console.error("Error deleting meeting minutes:", error)

      // Show more specific error messages based on the error type
      let errorMessage = "Terjadi kesalahan saat menghapus notulensi";

      if (error instanceof Error) {
        // Use the error message from the API if available
        errorMessage = error.message;
      }

      // Show error toast with the appropriate message
      toast({
        title: "Gagal",
        description: errorMessage,
        variant: "destructive",
      })
    }
  })

  return {
    createMeetingMinutes,
    updateMeetingMinutes,
    deleteMeetingMinutes,
  }
}
