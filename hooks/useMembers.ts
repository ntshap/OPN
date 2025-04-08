"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { memberApi, type Member, type MemberFormData, type MemberResponse } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

// Query keys for members
export const memberKeys = {
  all: ['members'] as const,
  lists: () => [...memberKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...memberKeys.lists(), filters] as const,
}

// Hook for fetching all members
export function useMembers() {
  return useQuery({
    queryKey: memberKeys.lists(),
    queryFn: ({ signal }) => memberApi.getMembers(signal),
    retry: (failureCount, error) => {
      // Don't retry if the request was canceled
      if (axios.isCancel(error)) {
        return false
      }
      // Retry up to 3 times for other errors
      return failureCount < 3
    },
    // Return a default value on error to prevent UI from breaking
    onError: (error) => {
      console.error('Error in useMembers:', error)
    }
  })
}

// Hook for member mutations (create, update, delete)
export function useMemberMutations() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const createMember = useMutation({
    mutationFn: (data: MemberFormData) => memberApi.createMemberBiodata(data),
    onSuccess: () => {
      // Invalidate all member queries to refetch the list
      queryClient.invalidateQueries({ queryKey: memberKeys.lists() })
      
      // Show success toast
      toast({
        title: "Berhasil",
        description: "Anggota berhasil ditambahkan",
      })
    },
    onError: (error) => {
      // Show error toast
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menambahkan anggota",
        variant: "destructive",
      })
      console.error("Error creating member:", error)
    }
  })

  const updateMember = useMutation({
    mutationFn: (data: MemberFormData) => memberApi.updateMemberBiodata(data),
    onSuccess: () => {
      // Invalidate all member queries to refetch the list
      queryClient.invalidateQueries({ queryKey: memberKeys.lists() })
      
      // Show success toast
      toast({
        title: "Berhasil",
        description: "Data anggota berhasil diperbarui",
      })
    },
    onError: (error) => {
      // Show error toast
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat memperbarui data anggota",
        variant: "destructive",
      })
      console.error("Error updating member:", error)
    }
  })

  const deleteMember = useMutation({
    mutationFn: (userId: number | string) => memberApi.deleteUser(userId),
    onSuccess: () => {
      // Invalidate all member queries to refetch the list
      queryClient.invalidateQueries({ queryKey: memberKeys.lists() })
      
      // Show success toast
      toast({
        title: "Berhasil",
        description: "Anggota berhasil dihapus",
      })
    },
    onError: (error) => {
      // Show error toast
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menghapus anggota",
        variant: "destructive",
      })
      console.error("Error deleting member:", error)
    }
  })

  return {
    createMember,
    updateMember,
    deleteMember,
  }
}
