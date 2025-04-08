"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { TipTapEditor } from "@/components/ui/tiptap-editor"
import type { EventFormData, Event } from "@/lib/api"
import { useEventMutations, useAttendanceMutations } from "@/hooks/useEvents"
import { format, parse, isValid } from "date-fns"
import { MemberAttendanceForm } from "@/components/events/member-attendance-form"

interface EventFormProps {
  event?: Event
  isEditing?: boolean
  onSuccess?: () => void
}

export function EventForm({ event, isEditing = false, onSuccess }: EventFormProps) {
  const router = useRouter()
  const { createEvent, updateEvent } = useEventMutations()

  // Form state
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "08:00",
    location: "",
    status: "akan datang", // Using the backend default status
    minutes: "", // For meeting minutes
  })

  // Attendance records state
  const [attendanceRecords, setAttendanceRecords] = useState<Array<{ member_id: number; status: string; notes: string }>>([]);
  const { createOrUpdateAttendance } = useAttendanceMutations(event?.id || 0)

  // Initialize form with event data if editing
  useEffect(() => {
    if (event && isEditing) {
      // Format date for input field (YYYY-MM-DD)
      let formattedDate = format(new Date(), "yyyy-MM-dd")
      if (event.date) {
        // Handle ISO date format (YYYY-MM-DDTHH:MM:SS.sssZ)
        const dateObj = new Date(event.date)
        if (!isNaN(dateObj.getTime())) {
          formattedDate = format(dateObj, "yyyy-MM-dd")
        } else {
          console.error("Invalid date format:", event.date)
        }
      }

      // Format time for input field (HH:MM)
      let formattedTime = "08:00"
      if (event.time) {
        // Handle time format (HH:MM:SS.sssZ)
        const timeMatch = event.time.match(/(\d{2}):(\d{2})/)
        if (timeMatch) {
          formattedTime = `${timeMatch[1]}:${timeMatch[2]}`
        }
      }

      setFormData({
        title: event.title,
        description: event.description,
        date: formattedDate,
        time: formattedTime,
        location: event.location,
        status: event.status,
        minutes: event.minutes || "", // Include meeting minutes
      })
    }
  }, [event, isEditing])

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Handle minutes content change from TipTap editor
  const handleMinutesChange = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      minutes: content,
    }))

    // Clear error for minutes field
    if (errors.minutes) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.minutes
        return newErrors
      })
    }
  }

  // Validate form data
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Nama acara harus diisi"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Deskripsi harus diisi"
    }

    if (!formData.date) {
      newErrors.date = "Tanggal harus diisi"
    } else {
      try {
        const date = parse(formData.date, "yyyy-MM-dd", new Date())
        if (!isValid(date)) {
          newErrors.date = "Format tanggal tidak valid"
        }
      } catch (e) {
        newErrors.date = "Format tanggal tidak valid"
      }
    }

    if (!formData.time) {
      newErrors.time = "Waktu harus diisi"
    } else if (!/^\d{2}:\d{2}$/.test(formData.time)) {
      newErrors.time = "Format waktu tidak valid (JJ:MM)"
    }

    if (!formData.location.trim()) {
      newErrors.location = "Lokasi harus diisi"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      // For editing, only send the fields that have changed
      if (isEditing && event) {
        // Create a partial update with only the changed fields
        const changedFields: Partial<EventFormData> = {}

        // Check which fields have changed
        if (formData.title !== event.title) changedFields.title = formData.title
        if (formData.description !== event.description) changedFields.description = formData.description
        if (formData.date !== event.date.split('T')[0]) changedFields.date = formData.date
        if (formData.time !== event.time) changedFields.time = formData.time
        if (formData.location !== event.location) changedFields.location = formData.location
        if (formData.status !== event.status) changedFields.status = formData.status
        if (formData.minutes !== event.minutes) changedFields.minutes = formData.minutes

        // Log the changed fields
        console.log('Changed fields:', changedFields)

        // Only proceed if there are changes
        if (Object.keys(changedFields).length > 0) {
          updateEvent.mutate(
            { id: event.id, data: changedFields },
            {
              onSuccess: async () => {
                // Save attendance records if available
                if (attendanceRecords.length > 0) {
                  try {
                    await createOrUpdateAttendance.mutateAsync(attendanceRecords)
                    console.log('Attendance records saved successfully')
                  } catch (error) {
                    console.error('Error saving attendance records:', error)
                  }
                }

                if (onSuccess) {
                  onSuccess()
                } else {
                  router.push(`/dashboard/events/${event.id}`)
                }
              },
            },
          )
        } else {
          console.log('No changes detected in event data')

          // Still save attendance records if available
          if (attendanceRecords.length > 0) {
            try {
              await createOrUpdateAttendance.mutateAsync(attendanceRecords)
              console.log('Attendance records saved successfully')
            } catch (error) {
              console.error('Error saving attendance records:', error)
            }
          }

          // Then redirect
          if (onSuccess) {
            onSuccess()
          } else {
            router.push(`/dashboard/events/${event.id}`)
          }
        }
      } else {
        // For new events, send all the data
        createEvent.mutate(formData, {
          onSuccess: (newEvent) => {
            if (onSuccess) {
              onSuccess()
            } else {
              router.push(`/dashboard/events/${newEvent?.id ?? ''}`)
            }
          },
        })
      }
    } catch (error) {
      console.error('Error in form submission:', error)
    }
  }

  const isSubmitting = createEvent.isPending || updateEvent.isPending
  const errorMessage = createEvent.error || updateEvent.error ? (createEvent.error || updateEvent.error).toString() : ""

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <div className="border rounded-lg p-6 space-y-4">
        <div className="grid gap-4">
          <div>
            <Label htmlFor="title">Nama Acara</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? "border-red-500" : ""}
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "title-error" : undefined}
            />
            {errors.title && (
              <p id="title-error" className="text-sm text-red-500 mt-1">
                {errors.title}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? "border-red-500" : ""}
              rows={4}
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? "description-error" : undefined}
            />
            {errors.description && (
              <p id="description-error" className="text-sm text-red-500 mt-1">
                {errors.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Tanggal</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className={errors.date ? "border-red-500" : ""}
                aria-invalid={!!errors.date}
                aria-describedby={errors.date ? "date-error" : undefined}
              />
              {errors.date && (
                <p id="date-error" className="text-sm text-red-500 mt-1">
                  {errors.date}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="time">Waktu</Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                className={errors.time ? "border-red-500" : ""}
                aria-invalid={!!errors.time}
                aria-describedby={errors.time ? "time-error" : undefined}
              />
              {errors.time && (
                <p id="time-error" className="text-sm text-red-500 mt-1">
                  {errors.time}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="location">Lokasi</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={errors.location ? "border-red-500" : ""}
              aria-invalid={!!errors.location}
              aria-describedby={errors.location ? "location-error" : undefined}
            />
            {errors.location && (
              <p id="location-error" className="text-sm text-red-500 mt-1">
                {errors.location}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            >
              <option value="akan datang">Akan Datang</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>

          <div>
            <Label htmlFor="minutes">Notulensi Rapat</Label>
            <div className={errors.minutes ? "border border-red-500 rounded-md" : "border rounded-md"}>
              <TipTapEditor
                content={formData.minutes || ""}
                onChange={handleMinutesChange}
                placeholder="Masukkan notulensi rapat atau catatan penting dari acara ini"
              />
            </div>
            {errors.minutes && (
              <p id="minutes-error" className="text-sm text-red-500 mt-1">
                {errors.minutes}
              </p>
            )}
          </div>
        </div>
      </div>

      {isEditing && event?.id && (
        <div className="border rounded-lg p-6 space-y-4 mt-6">
          <h2 className="text-lg font-semibold">Daftar Hadir</h2>
          <MemberAttendanceForm
            eventId={event.id}
            onAttendanceChange={setAttendanceRecords}
          />
        </div>
      )}

      <div className="flex justify-end space-x-4 mt-6">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
          Batal
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Menyimpan..." : "Membuat..."}
            </>
          ) : isEditing ? (
            "Simpan Perubahan"
          ) : (
            "Buat Acara"
          )}
        </Button>
      </div>
    </form>
  )
}
