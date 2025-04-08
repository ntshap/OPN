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
import type { Event } from "@/lib/api"
import { format, parse, isValid } from "date-fns"

interface EventFormData {
  title: string
  description: string
  date: string
  time: string
  location: string
  status?: 'akan datang' | 'selesai'
  minutes?: string
}

interface EventFormProps {
  event?: Event
  isEditing?: boolean
  onSuccess?: () => void
}

export function EventFormClient({ event, isEditing = false, onSuccess }: EventFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  // Form state
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "08:00",
    location: "",
    status: "akan datang",
    minutes: ""
  })

  // Attendees state
  const [attendees, setAttendees] = useState([
    { id: 1, name: "John Doe", division: "Pengurus Inti", status: "Present", notes: "Arrived on time" },
    { id: 2, name: "Jane Smith", division: "Sekretariat", status: "Present", notes: "Volunteered to help" },
    { id: 3, name: "Robert Johnson", division: "Bendahara", status: "Absent", notes: "Called in sick" },
    { id: 4, name: "Emily Williams", division: "Humas", status: "Present", notes: "" },
  ])

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
        minutes: event.minutes || ""
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

  // Validate form data
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Judul diperlukan"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Deskripsi diperlukan"
    }

    if (!formData.date) {
      newErrors.date = "Tanggal diperlukan"
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
      newErrors.time = "Waktu diperlukan"
    } else if (!/^\d{2}:\d{2}$/.test(formData.time)) {
      newErrors.time = "Format waktu tidak valid (JJ:MM)"
    }

    if (!formData.location.trim()) {
      newErrors.location = "Lokasi diperlukan"
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

    setIsSubmitting(true)

    try {
      // Format data for API
      const formattedData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: `${formData.date}T${formData.time}:00.000Z`, // Format as ISO string
        time: `${formData.time}:00.000Z`, // Format time with seconds and timezone
        location: formData.location.trim(),
        status: formData.status || "akan datang"
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (isEditing && event) {
        console.log('Event updated:', { id: event.id, ...formattedData })
      } else {
        console.log('Event created:', formattedData)
      }

      // Simulate success
      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      setErrorMessage("Terjadi kesalahan saat menyimpan acara. Silakan coba lagi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <div className="space-y-6">
          <div>
            <Label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Event Name</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full border-gray-300 rounded-md shadow-sm ${errors.title ? "border-red-500" : ""}`}
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
            <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`w-full border-gray-300 rounded-md shadow-sm ${errors.description ? "border-red-500" : ""}`}
              rows={2}
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
              <Label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</Label>
              <div className="relative">
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`w-full border-gray-300 rounded-md shadow-sm ${errors.date ? "border-red-500" : ""}`}
                  aria-invalid={!!errors.date}
                  aria-describedby={errors.date ? "date-error" : undefined}
                />
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              {errors.date && (
                <p id="date-error" className="text-sm text-red-500 mt-1">
                  {errors.date}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Time</Label>
              <div className="relative">
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                  className={`w-full border-gray-300 rounded-md shadow-sm ${errors.time ? "border-red-500" : ""}`}
                  aria-invalid={!!errors.time}
                  aria-describedby={errors.time ? "time-error" : undefined}
                />
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              {errors.time && (
                <p id="time-error" className="text-sm text-red-500 mt-1">
                  {errors.time}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`w-full border-gray-300 rounded-md shadow-sm ${errors.location ? "border-red-500" : ""}`}
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
            <Label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</Label>
            <div className="relative">
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border-gray-300 rounded-md shadow-sm p-2 pr-8 appearance-none"
              >
                <option value="akan datang">Akan Datang</option>
                <option value="selesai">Selesai</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="minutes" className="block text-sm font-medium text-gray-700 mb-1">Notulensi</Label>
            <div className="border border-gray-300 rounded-md">
              <div className="flex items-center gap-1 p-1 border-b bg-gray-50">
                <div className="relative">
                  <select className="text-sm border-0 bg-transparent focus:ring-0 py-1 px-2 rounded appearance-none pr-6">
                    <option>Normal</option>
                    <option>Heading 1</option>
                    <option>Heading 2</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
                <div className="h-4 w-px bg-gray-300 mx-1"></div>
                <button type="button" className="p-1 hover:bg-gray-200 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12V6h8v6M4 12v6h8v-6"></path><path d="M16 6h4v12h-4"></path></svg>
                </button>
                <button type="button" className="p-1 hover:bg-gray-200 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 4h4v12h-4z"></path><path d="M4 7h4"></path><path d="M16 7h4"></path><path d="M4 12h4"></path><path d="M16 12h4"></path><path d="M4 17h16"></path></svg>
                </button>
                <button type="button" className="p-1 hover:bg-gray-200 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16"></path><path d="M4 12h16"></path><path d="M4 17h16"></path></svg>
                </button>
                <button type="button" className="p-1 hover:bg-gray-200 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6h13"></path><path d="M8 12h13"></path><path d="M8 18h13"></path><path d="M3 6h.01"></path><path d="M3 12h.01"></path><path d="M3 18h.01"></path></svg>
                </button>
                <button type="button" className="p-1 hover:bg-gray-200 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4h10"></path><path d="M11 9h10"></path><path d="M11 14h10"></path><path d="M11 19h10"></path><path d="M3 5l3 3-3 3"></path><path d="M3 14l3 3-3 3"></path></svg>
                </button>
              </div>
              <textarea
                id="minutes"
                name="minutes"
                value={formData.minutes}
                onChange={handleChange}
                className="w-full p-4 min-h-[100px] focus:outline-none resize-none border-0"
                placeholder="Tulis notulensi rapat di sini..."
              ></textarea>
            </div>
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">Daftar Hadir</Label>
            <div className="border border-gray-300 rounded-md mt-2">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-2 font-medium text-sm">Nama</th>
                    <th className="text-left p-2 font-medium text-sm">Divisi</th>
                    <th className="text-left p-2 font-medium text-sm">Status</th>
                    <th className="text-left p-2 font-medium text-sm">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {attendees.map((attendee) => (
                    <tr key={attendee.id} className="border-b last:border-b-0">
                      <td className="p-2">{attendee.name}</td>
                      <td className="p-2">{attendee.division}</td>
                      <td className="p-2">
                        <select
                          className="border border-gray-300 rounded p-1 text-sm w-full"
                          value={attendee.status}
                          onChange={(e) => {
                            const newAttendees = [...attendees];
                            const index = newAttendees.findIndex(a => a.id === attendee.id);
                            newAttendees[index] = {...newAttendees[index], status: e.target.value};
                            setAttendees(newAttendees);
                          }}
                        >
                          <option value="Hadir">Hadir</option>
                          <option value="Izin">Izin</option>
                          <option value="Alfa">Alfa</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          className="border border-gray-300 rounded p-1 text-sm w-full"
                          value={attendee.notes}
                          onChange={(e) => {
                            const newAttendees = [...attendees];
                            const index = newAttendees.findIndex(a => a.id === attendee.id);
                            newAttendees[index] = {...newAttendees[index], notes: e.target.value};
                            setAttendees(newAttendees);
                          }}
                          placeholder="Tambahkan keterangan"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting} className="bg-gray-200 hover:bg-gray-300 text-gray-800">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="bg-blue-500 hover:bg-blue-600 text-white">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Saving..." : "Creating..."}
            </>
          ) : isEditing ? (
            "Save Changes"
          ) : (
            "Create Event"
          )}
        </Button>
      </div>
    </form>
  )
}
