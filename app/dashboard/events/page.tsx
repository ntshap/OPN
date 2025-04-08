"use client"

import type React from "react"

import { useState, useCallback, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { format, parseISO } from "date-fns"
import { Calendar, Search, Plus, Loader2, ImageIcon, Eye, Edit2, Trash2, ChevronLeft, ChevronRight, Upload } from "lucide-react"
import { USE_FALLBACK_DATA } from "@/lib/api"
import { useEvents, useSearchEvents, useEventMutations } from "@/hooks/useEvents"
import type { Event } from "@/lib/api"
import { debounce } from "lodash"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function EventsPage() {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const searchParams = useSearchParams()

  // Check for action parameter in URL
  useEffect(() => {
    const action = searchParams.get('action')
    if (action === 'upload') {
      setIsUploadModalOpen(true)
    }
  }, [searchParams])

  // Fetch events with pagination
  const { data: eventsData, isLoading, isError } = useEvents(page, 9)

  // Search events
  const { data: searchResults, isLoading: isSearching } = useSearchEvents(
    { title: searchTerm },
    { enabled: searchTerm.length > 2 },
  )

  // Event mutations
  const { deleteEvent } = useEventMutations()

  // Debounced search handler
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchTerm(value)
      }, 500),
    [],
  )

  // Handle search input change
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      debouncedSearch(e.target.value)
    },
    [debouncedSearch],
  )

  // Handle event actions
  const handleViewEvent = useCallback(
    (event: Event) => {
      router.push(`/dashboard/events/${event.id}`)
    },
    [router],
  )

  const handleEditEvent = useCallback(
    (event: Event) => {
      router.push(`/dashboard/events/edit/${event.id}`)
    },
    [router],
  )

  const handleDeleteEvent = useCallback((event: Event) => {
    setSelectedEvent(event)
    setIsDeleteDialogOpen(true)
  }, [])

  const handleUploadPhotos = useCallback((event: Event) => {
    setSelectedEvent(event)
    setIsUploadModalOpen(true)
  }, [])

  const confirmDelete = useCallback(() => {
    if (selectedEvent) {
      deleteEvent.mutate(selectedEvent.id)
      setIsDeleteDialogOpen(false)
    }
  }, [selectedEvent, deleteEvent])

  // Determine which events to display and sort by newest date first
  const displayedEvents = useMemo(() => {
    let events = [];
    if (searchTerm.length > 2 && searchResults) {
      events = [...searchResults];
    } else {
      events = eventsData ? [...eventsData] : [];
    }

    // Sort events by date (newest first)
    return events.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  }, [searchTerm, searchResults, eventsData])

  // Render loading skeletons
  if (isLoading && !eventsData) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manajemen Acara</h1>
          <Skeleton className="h-10 w-36" />
        </div>

        <Skeleton className="h-10 w-full mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="border rounded-lg overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-10 w-full mt-2" />
                </div>
              </div>
            ))}
        </div>
      </div>
    )
  }

  // Render error state
  if (isError) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manajemen Acara</h1>
          <Button onClick={() => router.push("/dashboard/events/new")}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Acara Baru
          </Button>
        </div>

        <div className="rounded-lg bg-red-50 p-6 text-center">
          <h3 className="text-lg font-medium text-red-800">Gagal memuat acara</h3>
          <p className="mt-2 text-red-600">Silakan coba muat ulang halaman atau periksa koneksi Anda.</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Muat Ulang Halaman
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Acara Terbaru</h1>
        <Button onClick={() => router.push("/dashboard/events/new")} className="bg-blue-500 hover:bg-blue-600 text-white">
          <Plus className="mr-2 h-4 w-4" /> Tambah Acara
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="Cari acara berdasarkan judul..."
          className="pl-10 max-w-xs"
          onChange={handleSearchChange}
          defaultValue={searchTerm}
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gray-500" />
        )}
      </div>

      {displayedEvents.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 rounded-lg">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Tidak ada acara ditemukan</h3>
          <p className="text-gray-500 mt-2">
            {searchTerm ? "Coba sesuaikan kata pencarian Anda." : "Mulai dengan membuat acara baru."}
          </p>
          {!searchTerm && (
            <Button variant="default" className="mt-4" onClick={() => router.push("/dashboard/events/new")}>
              <Plus className="mr-2 h-4 w-4" /> Buat Acara
            </Button>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-sm text-gray-500">
                    <th className="text-left py-3 px-4 font-medium">Nama Acara</th>
                    <th className="text-left py-3 px-4 font-medium">Tanggal</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Peserta</th>
                    <th className="text-right py-3 px-4 font-medium">Tindakan</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedEvents.map((event, index) => (
                    <tr key={event.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <a href={`/dashboard/events/${event.id}`} className="text-blue-500 hover:underline">
                          {event.title}
                        </a>
                      </td>
                      <td className="py-3 px-4">{format(new Date(event.date), "yyyy-MM-dd")}</td>
                      <td className="py-3 px-4">
                        <Badge className="bg-blue-500 hover:bg-blue-600">
                          {event.status === "akan datang" ? "Akan Datang" : "Selesai"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">0</td>
                      <td className="py-3 px-4 text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewEvent(event)}
                          className="h-8 w-8"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditEvent(event)}
                          className="h-8 w-8"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteEvent(event)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
          {displayedEvents.length > 9 && (
            <CardFooter className="flex justify-between px-6 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Sebelumnya
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={displayedEvents.length < 9}
              >
                Selanjutnya
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          )}
        </Card>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Ini akan menghapus acara secara permanen. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 text-white hover:bg-red-700">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Upload Modal */}
      <AlertDialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unggah Berkas</AlertDialogTitle>
            <AlertDialogDescription>
              Pilih acara dan unggah foto atau dokumen untuk acara tersebut.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="event-select" className="text-sm font-medium">
                Pilih Acara
              </label>
              <select
                id="event-select"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                onChange={(e) => {
                  const eventId = parseInt(e.target.value)
                  const event = eventsData ? eventsData.find(event => event.id === eventId) : null
                  setSelectedEvent(event)
                }}
              >
                <option value="">Pilih acara</option>
                {eventsData && eventsData.map(event => (
                  <option key={event.id} value={event.id}>{event.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="file-upload" className="text-sm font-medium">
                Unggah Berkas
              </label>
              <Input
                id="file-upload"
                type="file"
                accept="image/*,.pdf,.doc,.docx"
                disabled={!selectedEvent}
              />
              <p className="text-xs text-muted-foreground">
                Format yang didukung: JPG, PNG, PDF, DOC, DOCX
              </p>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <Button
              type="button"
              disabled={!selectedEvent}
              onClick={() => {
                // Simulate upload success
                setTimeout(() => {
                  setIsUploadModalOpen(false)
                  setSelectedEvent(null)

                  // Show success message
                  alert('Berkas berhasil diunggah!')
                }, 1000)
              }}
            >
              Unggah
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
