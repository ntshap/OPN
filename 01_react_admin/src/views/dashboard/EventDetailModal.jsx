"use client"

import { useState, useEffect } from "react"
import { Modal, Button, Tabs, Tab, Badge, Spinner, Row, Col } from "react-bootstrap"
import axios from "axios"
import { Calendar, Clock, MapPin, Users, Image, Download, Edit } from "lucide-react"

const EventDetailModal = ({ show, onHide, eventId }) => {
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("details")
  const [attendees, setAttendees] = useState([])
  const [photos, setPhotos] = useState([])
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  useEffect(() => {
    if (show && eventId) {
      fetchEventDetails()
    }
  }, [show, eventId])

  const fetchEventDetails = async () => {
    setLoading(true)
    setError("")

    try {
      // If eventId is already an object with all the data we need
      if (typeof eventId === "object" && eventId !== null) {
        setEvent(eventId)
        setLoading(false)

        // Mock attendees and photos data
        generateMockData()
        return
      }

      // Otherwise fetch from API
      const token = localStorage.getItem("token")
      const response = await axios.get(`https://backend-project-pemuda.onrender.com/api/v1/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })

      if (response.data) {
        setEvent(response.data)

        // Mock attendees and photos data
        generateMockData()
      } else {
        throw new Error("No event data found")
      }
    } catch (err) {
      console.error("Error fetching event details:", err)
      setError("Failed to load event details. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const generateMockData = () => {
    // Generate mock attendees
    const mockAttendees = [
      { id: 1, name: "John Doe", status: "Present", notes: "Arrived on time" },
      { id: 2, name: "Jane Smith", status: "Present", notes: "Volunteered to help" },
      { id: 3, name: "Robert Johnson", status: "Absent", notes: "Called in sick" },
      { id: 4, name: "Emily Williams", status: "Present", notes: "" },
      { id: 5, name: "Michael Brown", status: "Late", notes: "Arrived 15 minutes late" },
    ]
    setAttendees(mockAttendees)

    // Generate mock photos
    const mockPhotos = [
      { id: 1, url: "https://source.unsplash.com/random/300x200?event=1", caption: "Opening ceremony" },
      { id: 2, url: "https://source.unsplash.com/random/300x200?event=2", caption: "Group discussion" },
      { id: 3, url: "https://source.unsplash.com/random/300x200?event=3", caption: "Presentation" },
      { id: 4, url: "https://source.unsplash.com/random/300x200?event=4", caption: "Networking session" },
    ]
    setPhotos(mockPhotos)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Present":
        return <Badge bg="success">{status}</Badge>
      case "Absent":
        return <Badge bg="danger">{status}</Badge>
      case "Late":
        return <Badge bg="warning">{status}</Badge>
      default:
        return <Badge bg="secondary">{status}</Badge>
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString()
  }

  const formatTime = (timeString) => {
    if (!timeString) return "-"
    return timeString.slice(0, 5)
  }

  if (loading) {
    return (
      <Modal show={show} onHide={onHide} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Event Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading event details...</p>
        </Modal.Body>
      </Modal>
    )
  }

  if (error) {
    return (
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <div className="text-danger mb-3">
            <i className="feather icon-alert-circle" style={{ fontSize: "3rem" }}></i>
          </div>
          <p>{error}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button variant="primary" onClick={fetchEventDetails}>
            Retry
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  return (
    <Modal show={show} onHide={onHide} centered size="lg" className="modal-event-detail">
      <Modal.Header closeButton>
        <Modal.Title>{event?.title || "Event Details"}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-0" fill>
          <Tab eventKey="details" title="Details">
            <div className="p-4">
              <Row>
                <Col md={6}>
                  <h5 className="mb-3">Event Information</h5>
                  <div className="mb-3 d-flex align-items-center">
                    <Calendar className="me-2 text-primary" size={18} />
                    <div>
                      <small className="text-muted d-block">Date</small>
                      <span>{formatDate(event?.date)}</span>
                    </div>
                  </div>
                  <div className="mb-3 d-flex align-items-center">
                    <Clock className="me-2 text-primary" size={18} />
                    <div>
                      <small className="text-muted d-block">Time</small>
                      <span>{formatTime(event?.time)}</span>
                    </div>
                  </div>
                  <div className="mb-3 d-flex align-items-center">
                    <MapPin className="me-2 text-primary" size={18} />
                    <div>
                      <small className="text-muted d-block">Location</small>
                      <span>{event?.location || "-"}</span>
                    </div>
                  </div>
                  <div className="mb-3 d-flex align-items-center">
                    <Users className="me-2 text-primary" size={18} />
                    <div>
                      <small className="text-muted d-block">Attendees</small>
                      <span>{attendees.length} participants</span>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <h5 className="mb-3">Description</h5>
                  <p className="text-muted">{event?.description || "No description available."}</p>

                  <h5 className="mt-4 mb-3">Status</h5>
                  <Badge bg={event?.status === "Completed" ? "success" : "primary"} className="px-3 py-2">
                    {event?.status || "Upcoming"}
                  </Badge>
                </Col>
              </Row>
            </div>
          </Tab>

          <Tab eventKey="attendance" title="Attendance">
            <div className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0">Attendance List</h5>
                <div>
                  <Button variant="outline-primary" size="sm" className="me-2">
                    <Download size={14} className="me-1" /> Export
                  </Button>
                  <Button variant="primary" size="sm">
                    <Edit size={14} className="me-1" /> Edit
                  </Button>
                </div>
              </div>

              {attendees.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendees.map((attendee) => (
                        <tr key={attendee.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div
                                className="rounded-circle bg-light d-flex align-items-center justify-content-center me-2"
                                style={{ width: "36px", height: "36px" }}
                              >
                                <span className="text-primary fw-bold">
                                  {attendee.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </span>
                              </div>
                              <span>{attendee.name}</span>
                            </div>
                          </td>
                          <td>{getStatusBadge(attendee.status)}</td>
                          <td>{attendee.notes || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Users size={40} className="text-muted mb-2" />
                  <p>No attendance data available</p>
                </div>
              )}
            </div>
          </Tab>

          <Tab eventKey="gallery" title="Gallery">
            <div className="p-4">
              {selectedPhoto ? (
                <div className="text-center mb-4">
                  <div className="position-relative mb-3">
                    <img
                      src={selectedPhoto.url || "/placeholder.svg"}
                      alt={selectedPhoto.caption}
                      className="img-fluid rounded"
                      style={{ maxHeight: "400px" }}
                    />
                    <Button
                      variant="light"
                      size="sm"
                      className="position-absolute top-0 end-0 m-2 rounded-circle"
                      onClick={() => setSelectedPhoto(null)}
                    >
                      <i className="feather icon-x"></i>
                    </Button>
                  </div>
                  <p className="text-muted">{selectedPhoto.caption}</p>
                  <Button variant="outline-primary" size="sm">
                    <Download size={14} className="me-1" /> Download
                  </Button>
                </div>
              ) : (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0">Event Photos</h5>
                    <div>
                      <Button variant="outline-primary" size="sm" className="me-2">
                        <Download size={14} className="me-1" /> Download All
                      </Button>
                      <Button variant="primary" size="sm">
                        <Image size={14} className="me-1" /> Add Photos
                      </Button>
                    </div>
                  </div>

                  {photos.length > 0 ? (
                    <Row className="g-3">
                      {photos.map((photo) => (
                        <Col key={photo.id} md={4} sm={6}>
                          <div
                            className="position-relative rounded overflow-hidden cursor-pointer"
                            onClick={() => setSelectedPhoto(photo)}
                            style={{ height: "150px" }}
                          >
                            <img
                              src={photo.url || "/placeholder.svg"}
                              alt={photo.caption}
                              className="img-fluid w-100 h-100 object-fit-cover"
                            />
                            <div className="position-absolute bottom-0 start-0 end-0 p-2 bg-dark bg-opacity-50 text-white">
                              <small>{photo.caption}</small>
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <div className="text-center py-4">
                      <Image size={40} className="text-muted mb-2" />
                      <p>No photos available</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </Tab>
        </Tabs>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary">
          <Edit size={14} className="me-1" /> Edit Event
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default EventDetailModal

