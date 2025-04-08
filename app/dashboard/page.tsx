"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, DollarSign, FileText, Users, Eye, Trash2 } from "lucide-react"
import { format, parseISO } from "date-fns"
import type { Event } from "@/lib/api"
import { eventApi } from "@/lib/api"
import { useEventMutations } from "@/hooks/useEvents"
import { formatRupiah } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

import { StatCard } from "@/components/dashboard/stat-card"
import { FinanceCard } from "./components/finance-card"
import { RealStats } from "./components/real-stats"
import { RealUpcomingEvents } from "./components/real-upcoming-events"
import { EventDetailModal } from "@/components/dashboard/event-detail-modal"
import { UploadDocumentModal } from "@/components/dashboard/upload-document-modal"
import { DeleteConfirmationDialog } from "@/components/dashboard/delete-confirmation-dialog"
import { QuickActions } from "./components/quick-actions"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { deleteEvent } = useEventMutations()

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Events data is now handled by the BackendEvents component

  // Events loading error is now handled directly in the fetch function

  // No longer using search events

  // Finance summary data is now handled by the BackendFinance component

  // Finance data loaded

  // No longer using search error handling

  // Finance error is now handled directly in the fetch function

  // No longer using debounced search

  // Sample events for the dashboard functionality
  const events = [
    {
      id: 1,
      title: "Rapat Anggota Tahunan",
      description: "Rapat tahunan untuk membahas perkembangan organisasi",
      date: "2025-04-15",
      location: "Aula Utama",
      status: "akan datang",
      created_at: "2023-01-01",
      updated_at: "2023-01-01",
      photos: []
    },
    {
      id: 2,
      title: "Workshop Pengembangan Diri",
      description: "Workshop untuk meningkatkan soft skill anggota",
      date: "2025-04-20",
      location: "Ruang Pelatihan",
      status: "akan datang",
      created_at: "2023-01-02",
      updated_at: "2023-01-02",
      photos: []
    }
  ] as Event[]

  // Loading states
  const isLoading = false
  const isLoadingStats = false

  // Calculate stats
  const totalEvents = events.length
  const activeEvents = events.filter((e: Event) => e.status === "akan datang").length
  const completedEvents = events.filter((e: Event) => e.status === "selesai").length
  const totalPhotos = events.reduce((acc: number, e: Event) => acc + (e.photos?.length || 0), 0)

  // Sample finance data
  const totalIncome = "15000000"
  const totalExpense = "7500000"
  const currentBalance = "7500000"

  // Calculate net income
  const netIncome = Number(currentBalance)

  // Finance data extracted

  // Event handlers
  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event)
    setShowDetailModal(true)
  }

  const handleEditEvent = (event: Event) => {
    router.push(`/dashboard/events/edit/${event.id}`)
  }

  const handleDeleteEvent = (event: Event) => {
    setSelectedEvent(event)
    setShowDeleteDialog(true)
  }

  const handleCloseDetailModal = () => {
    // If we have a selected event, refresh its data before closing the modal
    if (selectedEvent) {
      console.log("[Dashboard] Refreshing event data for ID:", selectedEvent.id);
      // Fetch the latest event data directly from the API
      fetch(`https://backend-project-pemuda.onrender.com/api/v1/events/${selectedEvent.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
          }
          return response.json();
        })
        .then(updatedEvent => {
          console.log('[Dashboard] Fetched updated event data:', updatedEvent);

          // Update the events list with the refreshed data
          const updatedEvents = events.map(e =>
            e.id === updatedEvent.id ? updatedEvent : e
          );

          // Update the events data
          setEventsData(updatedEvents);
        })
        .catch(error => {
          console.error('[Dashboard] Error fetching updated event data:', error);
        })
        .finally(() => {
          // Clear the selected event and close the modal
          setSelectedEvent(null);
          setShowDetailModal(false);
        });
    } else {
      // If no selected event, just close the modal
      setSelectedEvent(null);
      setShowDetailModal(false);
    }
  }

  const handleCloseDeleteDialog = () => {
    setSelectedEvent(null)
    setShowDeleteDialog(false)
  }

  const handleConfirmDelete = async () => {
    if (!selectedEvent) return

    try {
      await deleteEvent.mutateAsync(selectedEvent.id)
      handleCloseDeleteDialog()
      toast({
        title: "Acara dihapus",
        description: "Acara telah berhasil dihapus.",
      })
    } catch (error) {
      toast({
        title: "Kesalahan",
        description: "Gagal menghapus acara. Silakan coba lagi.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dasbor</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <RealStats />
        <FinanceCard />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Upcoming Events */}
      <RealUpcomingEvents />

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          show={showDetailModal}
          onClose={handleCloseDetailModal}
          onUpdate={(updatedEvent) => {
            // Update the selected event with the new data
            setSelectedEvent(updatedEvent)

            // Also update the event in the events list
            const updatedEvents = events.map(e =>
              e.id === updatedEvent.id ? updatedEvent : e
            )
            // If we're using search results, update those too
            if (searchTerm) {
              setSearchResults(updatedEvents)
            }
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {selectedEvent && (
        <DeleteConfirmationDialog
          show={showDeleteDialog}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleConfirmDelete}
          title="Hapus Acara"
          description={`Apakah Anda yakin ingin menghapus "${selectedEvent.title}"? Tindakan ini tidak dapat dibatalkan.`}
        />
      )}
    </div>
  )
}
