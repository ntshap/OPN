"use client"

import { useState, useEffect } from "react"
import { Card, Button, Modal, Form, Row, Col, Alert } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import DatePicker from "react-datepicker"
import { Calendar, MapPin, Clock, Users, ImageIcon, Trash2, Edit2, Eye, Upload, Search } from "lucide-react"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import "react-datepicker/dist/react-datepicker.css"
import axios from "axios"
import moment from "moment"
import UploadDocumentModal from "../dashboard/UploadDocumentModal"

const EventCard = ({ event, onView, onEdit, onDelete, onUpload }) => {
  // Format date for display
  const formattedDate = event.date ? new Date(event.date).toLocaleDateString() : ""
  const formattedTime = event.time ? event.time.slice(0, 5) : ""

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="relative">
        {event.photos && event.photos.length > 0 ? (
          <img
            src={event.photos[0].photo_url || "/placeholder.svg"}
            alt={event.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-2">
          <Button
            variant="light"
            size="sm"
            className="rounded-full w-8 h-8 flex items-center justify-center bg-white/90 hover:bg-white"
            onClick={() => onUpload(event)}
          >
            <Upload className="w-4 h-4" />
          </Button>
          <Button
            variant="light"
            size="sm"
            className="rounded-full w-8 h-8 flex items-center justify-center bg-white/90 hover:bg-white"
            onClick={() => onEdit(event)}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="light"
            size="sm"
            className="rounded-full w-8 h-8 flex items-center justify-center bg-white/90 hover:bg-white"
            onClick={() => onDelete(event)}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </div>

      <Card.Body>
        <h5 className="font-semibold mb-2">{event.title}</h5>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            {formattedDate}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-2" />
            {formattedTime}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-2" />
            {event.location}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Users className="w-4 h-4 mr-2" />
            {event.attendees || 0} Attendees
          </div>
        </div>

        <Button variant="primary" className="w-full mt-4" onClick={() => onView(event)}>
          <Eye className="w-4 h-4 mr-2" /> View Details
        </Button>
      </Card.Body>
    </Card>
  )
}

const EventsPage = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: new Date(),
    time: "08:00",
    location: "",
  })

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/login")
        return
      }

      const response = await axios.get("https://backend-project-pemuda.onrender.com/api/v1/events/", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })

      setEvents(response.data)
    } catch (err) {
      console.error("Error fetching events:", err)
      setError("Failed to load events. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchEvents()
      return
    }

    setLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/login")
        return
      }

      const response = await axios.get(
        `https://backend-project-pemuda.onrender.com/api/v1/events/search?title=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      )

      setEvents(response.data)
    } catch (err) {
      console.error("Error searching events:", err)
      setError("Failed to search events. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleAddEvent = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/login")
        return
      }

      // Format date and time according to the API requirements
      const formattedDate = moment(newEvent.date).format("YYYY-MM-DD")
      const formattedTime = newEvent.time + ":00" // Add seconds to match API format

      const eventData = {
        title: newEvent.title,
        description: newEvent.description,
        date: `${formattedDate}T${formattedTime}.000Z`,
        time: `${formattedTime}.000Z`,
        location: newEvent.location,
      }

      await axios.post("https://backend-project-pemuda.onrender.com/api/v1/events/", eventData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      // Refresh events list
      fetchEvents()

      // Reset form and close modal
      setNewEvent({
        title: "",
        description: "",
        date: new Date(),
        time: "08:00",
        location: "",
      })
      setShowModal(false)
    } catch (err) {
      console.error("Error creating event:", err)
      setError(err.response?.data?.message || "Failed to create event. Please try again.")
    }
  }

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/login")
        return
      }

      await axios.delete(`https://backend-project-pemuda.onrender.com/api/v1/events/${selectedEvent.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // Refresh events list
      fetchEvents()
      setShowDeleteModal(false)
      setSelectedEvent(null)
    } catch (err) {
      console.error("Error deleting event:", err)
      setError(err.response?.data?.message || "Failed to delete event. Please try again.")
    }
  }

  if (loading && events.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="border-0 shadow-sm">
            <Skeleton height={200} />
            <Card.Body>
              <Skeleton height={20} width="60%" className="mb-2" />
              <Skeleton height={40} className="mb-3" />
              <Skeleton height={15} className="mb-2" />
              <Skeleton height={15} className="mb-2" />
              <Skeleton height={15} className="mb-2" />
              <Skeleton height={35} className="mt-4" />
            </Card.Body>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Events Management</h1>
        <Button variant="primary" onClick={() => setShowModal(true)} className="flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          Add New Event
        </Button>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <div className="mb-6 flex gap-2">
        <div className="flex-grow">
          <Form.Control
            type="text"
            placeholder="Search events by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button variant="outline-primary" onClick={handleSearch}>
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
        <Button variant="outline-secondary" onClick={fetchEvents}>
          Reset
        </Button>
      </div>

      {events.length === 0 && !loading ? (
        <div className="text-center p-10 bg-gray-50 rounded-lg">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No events found</h3>
          <p className="text-gray-500 mt-2">Get started by creating a new event.</p>
          <Button variant="primary" className="mt-4" onClick={() => setShowModal(true)}>
            <Calendar className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onView={(event) => navigate(`/events/${event.id}`)}
              onEdit={(event) => navigate(`/events/edit/${event.id}`)}
              onDelete={(event) => {
                setSelectedEvent(event)
                setShowDeleteModal(true)
              }}
              onUpload={(event) => {
                setSelectedEvent(event)
                setShowUploadModal(true)
              }}
            />
          ))}
        </div>
      )}

      {/* Add Event Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}
          <Form onSubmit={handleAddEvent}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <DatePicker
                    selected={newEvent.date}
                    onChange={(date) => setNewEvent({ ...newEvent, date })}
                    className="form-control"
                    dateFormat="yyyy-MM-dd"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                required
              />
            </Form.Group>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Create Event
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete "{selectedEvent?.title}"?</p>
          <p className="text-sm text-gray-500">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteEvent}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Upload Modal */}
      {selectedEvent && (
        <UploadDocumentModal
          show={showUploadModal}
          onHide={() => setShowUploadModal(false)}
          eventId={selectedEvent.id}
          fetchEvents={fetchEvents}
        />
      )}
    </div>
  )
}

export default EventsPage

