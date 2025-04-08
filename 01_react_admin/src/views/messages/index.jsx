"use client"

import { useState, useEffect } from "react"
import { Row, Col, Card, Table, Button, Form, InputGroup, Badge, Modal, Spinner } from "react-bootstrap"
import { Search, MessageSquare, Send, Trash2, Filter, X } from "lucide-react"
import MainCard from "../../components/Card/MainCard"
import { retrieveData, storeData } from "../../utils/localStorage"

const Messages = () => {
  const [messages, setMessages] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    priority: "all",
    readStatus: "all",
    dateFrom: "",
    dateTo: "",
  })

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = () => {
    setLoading(true)

    // Simulate API call with localStorage
    setTimeout(() => {
      const storedMessages = retrieveData("admin_messages", [])
      setMessages(storedMessages)
      setLoading(false)
    }, 800)
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const applyFilters = () => {
    setShowFilters(false)
  }

  const resetFilters = () => {
    setFilters({
      priority: "all",
      readStatus: "all",
      dateFrom: "",
      dateTo: "",
    })
    setShowFilters(false)
  }

  const filteredMessages = messages.filter((message) => {
    // Search filter
    const matchesSearch =
      message.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase())

    // Priority filter
    const matchesPriority = filters.priority === "all" || message.priority === filters.priority

    // Read status filter
    const matchesReadStatus =
      filters.readStatus === "all" ||
      (filters.readStatus === "read" && message.read) ||
      (filters.readStatus === "unread" && !message.read)

    // Date filters
    let matchesDateFrom = true
    let matchesDateTo = true

    if (filters.dateFrom) {
      matchesDateFrom = new Date(message.date) >= new Date(filters.dateFrom)
    }

    if (filters.dateTo) {
      matchesDateTo = new Date(message.date) <= new Date(filters.dateTo)
    }

    return matchesSearch && matchesPriority && matchesReadStatus && matchesDateFrom && matchesDateTo
  })

  const handleViewMessage = (message) => {
    // Mark as read
    const updatedMessages = messages.map((m) => (m.id === message.id ? { ...m, read: true } : m))
    setMessages(updatedMessages)
    storeData("admin_messages", updatedMessages)

    setSelectedMessage(message)
    setShowMessageModal(true)
  }

  const handleCloseModal = () => {
    setShowMessageModal(false)
    setReplyText("")
  }

  const handleReply = () => {
    if (replyText.trim() === "") return

    // In a real app, you would send this reply to an API
    // For now, just show a success message
    alert(`Reply sent to ${selectedMessage.sender}: ${replyText}`)
    setReplyText("")
    handleCloseModal()
  }

  const handleDeleteMessage = (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      const updatedMessages = messages.filter((message) => message.id !== id)
      setMessages(updatedMessages)
      storeData("admin_messages", updatedMessages)

      if (selectedMessage && selectedMessage.id === id) {
        handleCloseModal()
      }
    }
  }

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return <Badge bg="danger">High</Badge>
      case "medium":
        return <Badge bg="warning">Medium</Badge>
      case "low":
        return <Badge bg="success">Low</Badge>
      default:
        return <Badge bg="secondary">Normal</Badge>
    }
  }

  return (
    <>
      <MainCard title="Messages">
        <Row className="mb-3">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text>
                <Search size={18} />
              </InputGroup.Text>
              <Form.Control placeholder="Search messages..." value={searchTerm} onChange={handleSearch} />
            </InputGroup>
          </Col>
          <Col md={6} className="d-flex justify-content-end gap-2">
            <Button variant="outline-secondary" onClick={() => setShowFilters(!showFilters)}>
              <Filter size={18} className="me-1" /> Filters
            </Button>
          </Col>
        </Row>

        {showFilters && (
          <Card className="mb-3">
            <Card.Body>
              <Row>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Priority</Form.Label>
                    <Form.Select
                      value={filters.priority}
                      onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                    >
                      <option value="all">All Priorities</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={filters.readStatus}
                      onChange={(e) => setFilters({ ...filters, readStatus: e.target.value })}
                    >
                      <option value="all">All Messages</option>
                      <option value="read">Read</option>
                      <option value="unread">Unread</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date From</Form.Label>
                    <Form.Control
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date To</Form.Label>
                    <Form.Control
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <div className="d-flex justify-content-end gap-2">
                <Button variant="outline-secondary" onClick={resetFilters}>
                  <X size={14} className="me-1" /> Reset
                </Button>
                <Button variant="primary" onClick={applyFilters}>
                  Apply Filters
                </Button>
              </div>
            </Card.Body>
          </Card>
        )}

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Loading messages...</p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <Card className="text-center py-5">
            <Card.Body>
              <MessageSquare size={48} className="text-muted mb-3" />
              <h5>No messages found</h5>
              <p className="text-muted">
                {searchTerm ||
                filters.priority !== "all" ||
                filters.readStatus !== "all" ||
                filters.dateFrom ||
                filters.dateTo
                  ? "Try adjusting your search or filters"
                  : "You have no messages at this time"}
              </p>
            </Card.Body>
          </Card>
        ) : (
          <Table responsive hover>
            <thead>
              <tr>
                <th style={{ width: "5%" }}></th>
                <th style={{ width: "20%" }}>Sender</th>
                <th style={{ width: "40%" }}>Subject</th>
                <th style={{ width: "15%" }}>Date</th>
                <th style={{ width: "10%" }}>Priority</th>
                <th style={{ width: "10%" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.map((message) => (
                <tr key={message.id} className={message.read ? "" : "fw-bold bg-light"} style={{ cursor: "pointer" }}>
                  <td>
                    {!message.read && (
                      <span className="position-relative">
                        <span className="position-absolute top-50 start-50 translate-middle p-1 bg-primary rounded-circle">
                          <span className="visually-hidden">New message</span>
                        </span>
                      </span>
                    )}
                  </td>
                  <td onClick={() => handleViewMessage(message)}>{message.sender}</td>
                  <td onClick={() => handleViewMessage(message)}>{message.subject}</td>
                  <td onClick={() => handleViewMessage(message)}>{message.date}</td>
                  <td onClick={() => handleViewMessage(message)}>{getPriorityBadge(message.priority)}</td>
                  <td>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDeleteMessage(message.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </MainCard>

      {/* Message Detail Modal */}
      <Modal show={showMessageModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedMessage?.subject}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMessage && (
            <>
              <div className="d-flex justify-content-between mb-3">
                <div>
                  <strong>From:</strong> {selectedMessage.sender} ({selectedMessage.email})
                </div>
                <div>
                  <strong>Date:</strong> {selectedMessage.date}
                </div>
              </div>
              <div className="mb-4 p-3 border rounded">{selectedMessage.message}</div>
              <hr />
              <h6>Reply</h6>
              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleReply} disabled={!replyText.trim()}>
            <Send size={16} className="me-1" /> Send Reply
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Messages

