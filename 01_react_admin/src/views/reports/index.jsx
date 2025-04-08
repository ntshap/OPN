"use client"

import { useState, useEffect } from "react"
import { Card, Row, Col, Button, Form, Table, Badge, Spinner, Alert, Modal } from "react-bootstrap"
import { Search, Plus, Edit2, Trash2, Eye, Download, Filter, FileText } from "lucide-react"
import ReportModal from "../../components/reports/ReportModal"

const ReportsManagement = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [filterCategory, setFilterCategory] = useState("All")

  useEffect(() => {
    fetchReports()
  }, [currentPage, searchTerm, filterCategory])

  const fetchReports = async () => {
    try {
      setLoading(true)

      // In a real application, this would be an API call
      // For now, we'll simulate with mock data
      setTimeout(() => {
        const mockReports = [
          {
            id: 1,
            title: "Annual Organization Report 2023",
            content: "<p>This is the annual report for 2023 detailing our achievements and challenges.</p>",
            category: "Report",
            status: "Published",
            author: "Admin",
            createdAt: "2023-12-15T10:30:00Z",
            imageUrl: "/placeholder.svg?height=200&width=300",
          },
          {
            id: 2,
            title: "New Member Orientation Guide",
            content: "<p>A comprehensive guide for new members joining our organization.</p>",
            category: "Guide",
            status: "Published",
            author: "John Doe",
            createdAt: "2024-01-10T14:45:00Z",
            imageUrl: "/placeholder.svg?height=200&width=300",
          },
          {
            id: 3,
            title: "Upcoming Events for Q2 2024",
            content: "<p>Details about all the events scheduled for the second quarter of 2024.</p>",
            category: "Announcement",
            status: "Draft",
            author: "Jane Smith",
            createdAt: "2024-03-05T09:15:00Z",
            imageUrl: "/placeholder.svg?height=200&width=300",
          },
          {
            id: 4,
            title: "Financial Summary - Q1 2024",
            content: "<p>A summary of our financial performance for the first quarter of 2024.</p>",
            category: "Report",
            status: "Published",
            author: "Finance Team",
            createdAt: "2024-04-02T11:20:00Z",
            imageUrl: "/placeholder.svg?height=200&width=300",
          },
          {
            id: 5,
            title: "Member Survey Results",
            content: "<p>Results and analysis of our recent member satisfaction survey.</p>",
            category: "Report",
            status: "Draft",
            author: "Research Team",
            createdAt: "2024-02-18T15:40:00Z",
            imageUrl: "/placeholder.svg?height=200&width=300",
          },
          {
            id: 6,
            title: "Strategic Plan 2024-2026",
            content: "<p>Our organization's strategic plan for the next three years.</p>",
            category: "Report",
            status: "Published",
            author: "Executive Board",
            createdAt: "2024-01-25T13:10:00Z",
            imageUrl: "/placeholder.svg?height=200&width=300",
          },
          {
            id: 7,
            title: "Community Outreach Initiative",
            content: "<p>Details about our new community outreach program launching next month.</p>",
            category: "Announcement",
            status: "Published",
            author: "Outreach Team",
            createdAt: "2024-03-12T10:00:00Z",
            imageUrl: "/placeholder.svg?height=200&width=300",
          },
        ]

        // Filter by search term if provided
        let filtered = mockReports

        if (searchTerm) {
          filtered = filtered.filter(
            (r) =>
              r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
              r.author.toLowerCase().includes(searchTerm.toLowerCase()),
          )
        }

        // Filter by category if not "All"
        if (filterCategory !== "All") {
          filtered = filtered.filter((r) => r.category === filterCategory)
        }

        setReports(filtered)
        setTotalPages(Math.ceil(filtered.length / 10))
        setLoading(false)
      }, 800)
    } catch (error) {
      console.error("Error fetching reports:", error)
      setError("Failed to load reports. Please try again.")
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleDelete = async (id) => {
    setShowDeleteModal(false)
    setIsSubmitting(true)
    setError("")
    setSuccess("")

    try {
      // In a real application, this would be an API call
      // For now, we'll simulate with a timeout
      setTimeout(() => {
        const updatedReports = reports.filter((report) => report.id !== selectedReport.id)
        setReports(updatedReports)
        setSelectedReport(null)
        setSuccess("Report deleted successfully!")
        setIsSubmitting(false)
      }, 800)
    } catch (error) {
      console.error("Error deleting report:", error)
      setError("Failed to delete report. Please try again.")
      setIsSubmitting(false)
    }
  }

  const handleEdit = (report) => {
    setSelectedReport(report)
    setShowEditModal(true)
  }

  const handleModalClose = () => {
    setShowAddModal(false)
    setShowEditModal(false)
    setSelectedReport(null)
  }

  const handleModalSuccess = (report, isEdit) => {
    if (isEdit) {
      // Update existing report
      const updatedReports = reports.map((r) => (r.id === report.id ? report : r))
      setReports(updatedReports)
      setSuccess("Report updated successfully!")
    } else {
      // Add new report with a new ID
      const newId = Math.max(...reports.map((r) => r.id), 0) + 1
      const newReport = {
        ...report,
        id: newId,
        createdAt: new Date().toISOString(),
      }
      setReports([newReport, ...reports])
      setSuccess("Report created successfully!")
    }

    handleModalClose()
  }

  return (
    <div className="main-container p-6">
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

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="stat-icon bg-primary-light">
                  <i className="feather icon-file-text text-primary" />
                </div>
                <div className="stat-content ms-3">
                  <h6 className="mb-1 text-muted">Total Reports</h6>
                  <h3 className="mb-0">45</h3>
                  <small className="text-success">
                    <i className="feather icon-trending-up me-1" />
                    15% from last month
                  </small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="stat-icon bg-success-light">
                  <i className="feather icon-check-circle text-success" />
                </div>
                <div className="stat-content ms-3">
                  <h6 className="mb-1 text-muted">Published</h6>
                  <h3 className="mb-0">32</h3>
                  <small className="text-success">
                    <i className="feather icon-trending-up me-1" />
                    8% from last month
                  </small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="stat-icon bg-warning-light">
                  <i className="feather icon-edit text-warning" />
                </div>
                <div className="stat-content ms-3">
                  <h6 className="mb-1 text-muted">Drafts</h6>
                  <h3 className="mb-0">8</h3>
                  <small className="text-danger">
                    <i className="feather icon-trending-down me-1" />
                    5% from last month
                  </small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="stat-icon bg-info-light">
                  <i className="feather icon-eye text-info" />
                </div>
                <div className="stat-content ms-3">
                  <h6 className="mb-1 text-muted">Total Views</h6>
                  <h3 className="mb-0">12.5k</h3>
                  <small className="text-success">
                    <i className="feather icon-trending-up me-1" />
                    12% from last month
                  </small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Card className="custom-card shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center bg-transparent border-bottom">
          <div>
            <h4 className="mb-0">Reports List</h4>
            <p className="text-muted mb-0">Manage all your reports and news</p>
          </div>
          <Button variant="primary" onClick={() => setShowAddModal(true)} className="d-flex align-items-center gap-2">
            <Plus size={18} />
            Add New Report
          </Button>
        </Card.Header>

        <Card.Body>
          {/* Search and Filter */}
          <div className="mb-4">
            <Row>
              <Col lg={4} md={6}>
                <div className="search-box">
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-0">
                      <Search size={18} className="text-muted" />
                    </span>
                    <Form.Control
                      type="text"
                      placeholder="Search reports..."
                      value={searchTerm}
                      onChange={handleSearch}
                      className="border-0 shadow-none"
                    />
                  </div>
                </div>
              </Col>
              <Col lg={3} md={6}>
                <Form.Select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="form-select-sm"
                >
                  <option value="All">All Categories</option>
                  <option value="Report">Reports</option>
                  <option value="Announcement">Announcements</option>
                  <option value="Guide">Guides</option>
                </Form.Select>
              </Col>
              <Col lg={5} md={12} className="text-end">
                <Button variant="outline-secondary" className="me-2">
                  <Filter size={16} className="me-2" />
                  Filter
                </Button>
                <Button variant="outline-secondary">
                  <Download size={16} className="me-2" />
                  Export
                </Button>
              </Col>
            </Row>
          </div>

          {/* Table */}
          <div className="table-responsive">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              <Table hover className="custom-table mb-0">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.length > 0 ? (
                    reports.map((report) => (
                      <tr key={report.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="report-icon bg-light rounded p-2 me-3">
                              <i className="feather icon-file-text text-primary" />
                            </div>
                            <div>
                              <h6 className="mb-1">{report.title}</h6>
                              <small className="text-muted">By {report.author || "Admin"}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <Badge
                            bg={
                              report.category === "Report"
                                ? "info"
                                : report.category === "Announcement"
                                  ? "warning"
                                  : "secondary"
                            }
                            className="badge-soft"
                          >
                            {report.category}
                          </Badge>
                        </td>
                        <td>
                          <Badge
                            bg={
                              report.status === "Published"
                                ? "success"
                                : report.status === "Draft"
                                  ? "warning"
                                  : "secondary"
                            }
                            className="badge-soft"
                          >
                            {report.status}
                          </Badge>
                        </td>
                        <td>
                          <div className="text-muted">
                            {new Date(report.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex justify-content-end gap-2">
                            <Button
                              variant="light"
                              size="sm"
                              className="btn-icon"
                              onClick={() => window.open(`/reports/${report.id}`, "_blank")}
                            >
                              <Eye size={16} className="text-primary" />
                            </Button>
                            <Button variant="light" size="sm" className="btn-icon" onClick={() => handleEdit(report)}>
                              <Edit2 size={16} className="text-warning" />
                            </Button>
                            <Button
                              variant="light"
                              size="sm"
                              className="btn-icon"
                              onClick={() => {
                                setSelectedReport(report)
                                setShowDeleteModal(true)
                              }}
                            >
                              <Trash2 size={16} className="text-danger" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        <FileText size={40} className="mx-auto mb-2 text-gray-400" />
                        <p>No reports found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-4">
              <div className="text-muted">
                Showing page {currentPage} of {totalPages}
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
        </Card.Body>
      </Card>

      {/* Modals */}
      <ReportModal
        show={showAddModal}
        onHide={handleModalClose}
        onSuccess={(report) => handleModalSuccess(report, false)}
      />

      <ReportModal
        show={showEditModal}
        onHide={handleModalClose}
        report={selectedReport}
        onSuccess={(report) => handleModalSuccess(report, true)}
      />

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this report?</p>
          {selectedReport && (
            <div className="bg-light p-3 rounded mt-3">
              <p>
                <strong>Title:</strong> {selectedReport.title}
              </p>
              <p>
                <strong>Category:</strong> {selectedReport.category}
              </p>
              <p>
                <strong>Status:</strong> {selectedReport.status}
              </p>
              <p>
                <strong>Author:</strong> {selectedReport.author}
              </p>
            </div>
          )}
          <p className="text-danger mt-3">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              "Delete Report"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default ReportsManagement

