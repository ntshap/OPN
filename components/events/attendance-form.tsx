"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, Download, Edit } from "lucide-react"
import { useAttendanceMutations } from "@/hooks/useEvents"

interface Attendee {
  id: number
  member_id: number
  name: string
  division?: string
  status: string
  notes: string
  avatar?: string
}

interface AttendanceFormProps {
  eventId: string | number
  attendees: Attendee[]
  onRefresh: () => void
}

export function AttendanceForm({ eventId, attendees, onRefresh }: AttendanceFormProps) {
  const [selectedAttendee, setSelectedAttendee] = useState<number | null>(null)
  const [attendanceForm, setAttendanceForm] = useState({
    status: "Hadir",
    notes: ""
  })

  const { updateAttendance } = useAttendanceMutations(eventId)

  // Get the selected attendee data
  const getSelectedAttendee = () => {
    return attendees.find(a => a.id === selectedAttendee)
  }

  // Initialize form when selecting an attendee
  const handleSelectAttendee = (id: number) => {
    const attendee = attendees.find(a => a.id === id)
    if (attendee) {
      setAttendanceForm({
        status: attendee.status,
        notes: attendee.notes
      })
      setSelectedAttendee(id)
    }
  }

  // Handle saving attendance
  const handleSaveAttendance = async () => {
    const attendee = getSelectedAttendee()
    if (!attendee) return

    try {
      await updateAttendance.mutateAsync({
        memberId: attendee.member_id,
        data: {
          status: attendanceForm.status,
          notes: attendanceForm.notes
        }
      })
      
      // Close the form and refresh data
      setSelectedAttendee(null)
      onRefresh()
    } catch (error) {
      console.error("Error updating attendance:", error)
    }
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "hadir":
        return "success"
      case "izin":
        return "warning"
      case "alfa":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Daftar Kehadiran</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Ekspor
          </Button>
          <Button size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Ubah Semua
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground mb-4">
          {attendees.filter(a => a.status.toLowerCase() === "hadir").length} dari {attendees.length} anggota hadir
        </div>

        <ScrollArea className="h-[400px]">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Divisi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Keterangan</TableHead>
                  <TableHead className="text-right">Tindakan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendees.map((attendee) => (
                  <TableRow key={attendee.id} className="hover:bg-slate-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(attendee.name)}&background=c7d2fe&color=4f46e5`}
                          />
                          <AvatarFallback>{attendee.avatar || attendee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{attendee.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{attendee.division || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(attendee.status)}>{attendee.status}</Badge>
                    </TableCell>
                    <TableCell>{attendee.notes || "-"}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleSelectAttendee(attendee.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>

        {selectedAttendee && (
          <div className="mt-6 border-t pt-6">
            <h3 className="text-base font-semibold mb-4">Update Kehadiran</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="attendance-status">Status</Label>
                <Select
                  value={attendanceForm.status}
                  onValueChange={(value) => setAttendanceForm({...attendanceForm, status: value})}
                >
                  <SelectTrigger id="attendance-status">
                    <SelectValue placeholder="Pilih status kehadiran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hadir">Hadir</SelectItem>
                    <SelectItem value="Izin">Izin</SelectItem>
                    <SelectItem value="Alfa">Alfa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="attendance-notes">Keterangan</Label>
                <Input
                  id="attendance-notes"
                  placeholder="Tambahkan keterangan (opsional)"
                  value={attendanceForm.notes}
                  onChange={(e) => setAttendanceForm({...attendanceForm, notes: e.target.value})}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setSelectedAttendee(null)}>Batal</Button>
              <Button onClick={handleSaveAttendance} disabled={updateAttendance.isPending}>
                {updateAttendance.isPending ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Menyimpan...
                  </span>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Simpan
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
