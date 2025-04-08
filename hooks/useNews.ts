"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { newsApi, type NewsItem, type NewsFormData } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

// Query keys for news
export const newsKeys = {
  all: ['news'] as const,
  lists: () => [...newsKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...newsKeys.lists(), filters] as const,
  details: () => [...newsKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...newsKeys.details(), id] as const,
}

// Hook for fetching news with filters
export function useNews(params?: {
  skip?: number
  limit?: number
  is_published?: boolean
  search?: string
}) {
  const { toast } = useToast()

  return useQuery({
    queryKey: newsKeys.list(params || {}),
    queryFn: ({ signal }) => newsApi.getNews(params, signal),
    retry: (failureCount, error) => {
      // Don't retry if the request was canceled
      if (axios.isCancel(error)) {
        return false
      }
      // Only retry once for other errors
      return failureCount < 1
    },
    // Better error handling
    onError: (error) => {
      console.error('Error in useNews:', error)

      // Show toast only for non-canceled requests
      if (!axios.isCancel(error)) {
        toast({
          title: "Gagal memuat daftar berita",
          description: "Menggunakan data cadangan",
          variant: "destructive"
        })
      }
    },
    // Reduce stale time and cache time
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  })
}

// Hook for fetching a single news item
export function useNewsItem(id: number | string) {
  const { toast } = useToast()

  return useQuery({
    queryKey: newsKeys.detail(id),
    queryFn: ({ signal }) => newsApi.getNewsItem(id, signal),
    enabled: !!id,
    retry: (failureCount, error) => {
      // Don't retry if the request was canceled
      if (axios.isCancel(error)) {
        return false
      }
      // Only retry once for other errors
      return failureCount < 1
    },
    // Better error handling
    onError: (error) => {
      console.error(`Error in useNewsItem(${id}):`, error)

      // Show toast only for non-canceled requests
      if (!axios.isCancel(error)) {
        toast({
          title: "Gagal memuat detail berita",
          description: "Menggunakan data cadangan",
          variant: "destructive"
        })
      }
    },
    // Reduce stale time and cache time
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  })
}

// Hook for news mutations (create, update, delete)
export function useNewsMutations() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const createNews = useMutation({
    mutationFn: (data: NewsFormData) => newsApi.createNews(data),
    onSuccess: () => {
      // Invalidate all news queries to refetch the list
      queryClient.invalidateQueries({ queryKey: newsKeys.lists() })

      // Show success toast
      toast({
        title: "Berhasil",
        description: "Berita berhasil dibuat",
      })
    },
    onError: (error) => {
      // Show error toast
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat membuat berita",
        variant: "destructive",
      })
      console.error("Error creating news:", error)
    }
  })

  const updateNews = useMutation({
    mutationFn: ({ id, data }: { id: number | string, data: Partial<NewsFormData> }) =>
      newsApi.updateNews(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific news item and list
      queryClient.invalidateQueries({ queryKey: newsKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: newsKeys.lists() })

      // Show success toast
      toast({
        title: "Berhasil",
        description: "Berita berhasil diperbarui",
      })
    },
    onError: (error) => {
      // Show error toast
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat memperbarui berita",
        variant: "destructive",
      })
      console.error("Error updating news:", error)
    }
  })

  const deleteNews = useMutation({
    mutationFn: (id: number | string) => newsApi.deleteNews(id),
    onSuccess: (_, id) => {
      // Invalidate all news queries
      queryClient.invalidateQueries({ queryKey: newsKeys.lists() })

      // Show success toast
      toast({
        title: "Berhasil",
        description: "Berita berhasil dihapus",
      })
    },
    onError: (error) => {
      // Show error toast
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menghapus berita",
        variant: "destructive",
      })
      console.error("Error deleting news:", error)
    }
  })

  const uploadNewsPhoto = useMutation({
    mutationFn: ({ id, file }: { id: number | string, file: File }) =>
      newsApi.uploadNewsPhoto(id, file),
    onSuccess: (_, variables) => {
      // Invalidate specific news item
      queryClient.invalidateQueries({ queryKey: newsKeys.detail(variables.id) })

      // Show success toast
      toast({
        title: "Berhasil",
        description: "Foto berhasil diunggah",
      })
    },
    onError: (error) => {
      // Show error toast
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat mengunggah foto",
        variant: "destructive",
      })
      console.error("Error uploading photo:", error)
    }
  })

  return {
    createNews,
    updateNews,
    deleteNews,
    uploadNewsPhoto,
  }
}
