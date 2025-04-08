"use client"

import { useState, useEffect } from "react"
import { Card, Row, Col, Table, Button, Badge, Spinner, Alert } from "react-bootstrap"
import { Search, Calendar, UserCheck, Filter, Download, Plus, Edit, Trash, CheckSquare, X } from "lucide-react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

const AttendancePage = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showAddModal, setShowAddModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage] = useState(10)
  const [totalRecords, setTotalRecords] = useState(0)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Mock data for attendance
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockAttendance = [
        {
          id: 1,
          memberName: "John Doe",
          memberId: "MEM001",
          eventName: "Monthly Meeting",
          date: "2023-05-15",
          timeIn: "09:00",
          timeOut: "12:30",
          status: "present",
          notes: "Arrived on time",
        },
        {
          id: 2,
          memberName: "Jane Smith",
          memberId: "MEM002",
          eventName: "Monthly Meeting",
          date: "2023-05-15",
          timeIn: "09:15",
          timeOut: "12:30",
          status: "late",
          notes: "Arrived 15 minutes late",
        },
        {
          id: 3,
          memberName: "Mike Johnson",
          memberId: "MEM003",
          eventName: "Monthly Meeting",
          date: "2023-05-15",
          timeIn: "",
          timeOut: "",
          status: "absent",
          notes: "Called in sick",
        },
        {
          id: 4,
          memberName: "Sarah Williams",
          memberId: "MEM004",
          eventName: "Monthly Meeting",
          date: "2023-05-15",
          timeIn: "09:05",
          timeOut: "12:30",
          status: "present",
          notes: "",
        },
        {
          id: 5,
          memberName: "Robert Brown",
          memberId: "MEM005",
          eventName: "Monthly Meeting",
          date: "2023-05-15",
          timeIn: "09:30",
          timeOut: "12:30",
          status: "late",
          notes: "Traffic delay",
        },
        {
          id: 6,
          memberName: "Emily Davis",
          memberId: "MEM006",
          eventName: "Monthly Meeting",
          date: "2023-05-15",
          timeIn: "09:00",
          timeOut: "12:30",
          status: "present",
          notes: "",
        },
        {
          id: 7,
          memberName: "David Wilson",
          memberId: "MEM007",
          eventName: "Monthly Meeting",
          date: "2023-05-15",
          timeIn: "",
          timeOut: "",
          status: "absent",
          notes: "Out of town",
        },
        {
          id: 8,
          memberName: "Lisa Martinez",
          memberId: "MEM008",
          eventName: "Monthly Meeting",
          date: "2023-05-15",
          timeIn: "09:00",
          timeOut: "12:30",
          status: "present",
          notes: "",
        },
        {
          id: 9,
          memberName: "James Taylor",
          memberId: "MEM009",
          eventName: "Monthly Meeting",
          date: "2023-05-15",
          timeIn: "09:10",
          timeOut: "12:30",
          status: "late",
          notes: "Slight delay",
        },
        {
          id: 10,
          memberName: "Patricia Anderson",
          memberId: "MEM010",
          eventName: "Monthly Meeting",
          date: "2023-05-15",
          timeIn: "09:00",
          timeOut: "12:30",
          status: "present",
          notes: "",
        },
      ]

      setAttendanceRecords(mockAttendance)
      setTotalRecords(mockAttendance.length)
      setLoading(false)
    }, 1000)
  }, [])

  // Filter records based on search term
  const filteredRecords = attendanceRecords.filter(
    (record) =>
      record.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.eventName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Pagination
  const indexOfLastRecord = currentPage * recordsPerPage
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord)
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage)

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleDateChange = (date) => {
    setSelectedDate(date)
    // In a real app, you would fetch attendance for this date
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "present":
        return <Badge bg="success">Present</Badge>
      case "late":
        return <Badge bg="warning">Late</Badge>
      case "absent":
        return <Badge bg="danger">Absent</Badge>
      default:
        return <Badge bg="secondary">Unknown</Badge>
    }
  }

  const handleExport = () => {
    // In a real app, this would generate a CSV file
    setSuccess("Attendance report exported successfully!")
    setTimeout(() => setSuccess(""), 3000)
  }

  return (
    <div className="p-6">
      {success && (
        <Alert variant="success" onClose={() => setSuccess("")} dismissible className="mb-4">
          {success}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" onClose={() => setError("")} dismissible className="mb-4">
          {error}
        </Alert>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Attendance Tracking</h1>
        <div className="flex gap-3">
          <Button variant="outline-secondary" className="flex items-center" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="primary" className="flex items-center" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Record Attendance
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="mb-6">
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <UserCheck className="w-5 h-5 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-1">75%</h3>
              <p className="text-gray-600 text-sm">Overall Attendance Rate</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <CheckSquare className="w-5 h-5 text-success" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-1">7</h3>
              <p className="text-gray-600 text-sm">Present Today</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <Calendar className="w-5 h-5 text-warning" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-1">3</h3>
              <p className="text-gray-600 text-sm">Late Today</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-danger/10 rounded-lg">
                  <X className="w-5 h-5 text-danger" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-1">2</h3>
              <p className="text-gray-600 text-sm">Absent Today</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="border-0 shadow-sm mb-6">
        <Card.Body>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search members..."
                  className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>

            <div className="w-[200px]">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                className="form-control"
                dateFormat="MM/dd/yyyy"
              />
            </div>

            <Button variant="outline-secondary" className="flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Attendance Table */}
      <Card className="border-0 shadow-sm">
        <Card.Body>
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading attendance records...</p>
            </div>
          ) : (
            <>
              <Table responsive hover className="mb-0">
                <thead>
                  <tr>
                    <th>Member ID</th>
                    <th>Name</th>
                    <th>Event</th>
                    <th>Time In</th>
                    <th>Time Out</th>
                    <th>Status</th>
                    <th>Notes</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.map((record) => (
                    <tr key={record.id}>
                      <td>{record.memberId}</td>
                      <td>{record.memberName}</td>
                      <td>{record.eventName}</td>
                      <td>{record.timeIn || "-"}</td>
                      <td>{record.timeOut || "-"}</td>
                      <td>{getStatusBadge(record.status)}</td>
                      <td>{record.notes || "-"}</td>
                      <td className="text-center">
                        <Button variant="light" size="sm" className="me-2">
                          <Edit size={16} />
                        </Button>
                        <Button variant="light" size="sm">
                          <Trash size={16} className="text-danger" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <div className="text-muted">
                    Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredRecords.length)} of{" "}
                    {filteredRecords.length} records
                  </div>
                  <ul className="pagination mb-0">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <Button
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="page-link"
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                    </li>
                    {[...Array(totalPages)].map((_, index) => (
                      <li key={index + 1} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                        <Button onClick={() => handlePageChange(index + 1)} className="page-link">
                          {index + 1}
                        </Button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                      <Button
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="page-link"
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </li>
                  </ul>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  )
}

export default AttendancePage

