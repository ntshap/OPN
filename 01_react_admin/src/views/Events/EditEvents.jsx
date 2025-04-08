"use client"

import { useState, useEffect } from "react"
import { Card, Form, Button, Row, Col, Spinner, Alert } from "react-bootstrap"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import moment from "moment"
import { Save, ArrowLeft } from "lucide-react"

const EditEvents = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()

  const [event, setEvent] = useState({
    title: "",
    description: "",
    date: new Date(),
    time: "08:00",
    location: "",
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [validated, setValidated] = useState(false)

  useEffect(() => {
    fetchEventDetails()
  }, [eventId])

  const fetchEventDetails = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/login")
        return
      }

      const response = await axios.get(`https://backend-project-pemuda.onrender.com/api/v1/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })

      if (response.data) {
        // Format date and time from API response
        const eventData = response.data
        const date = eventData.date ? new Date(eventData.date) : new Date()

        // Extract time from the time field (format: "HH:MM:SS.sssZ")
        let time = "08:00"
        if (eventData.time) {
          const timeMatch = eventData.time.match(/(\d{2}):(\d{2})/)
          if (timeMatch) {
            time = `${timeMatch[1]}:${timeMatch[2]}`
          }
        }

        setEvent({
          title: eventData.title || "",
          description: eventData.description || "",
          date,
          time,
          location: eventData.location || "",
        })
      }
    } catch (err) {
      console.error("Error fetching event details:", err)
      setError("Failed to load event details. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget

    if (form.checkValidity() === false) {
      e.stopPropagation()
      setValidated(true)
      return
    }

    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const token = localStorage.getItem("token")

      // Format date and time according to the API requirements
      const formattedDate = moment(event.date).format("YYYY-MM-DD")
      const formattedTime = event.time + ":00" // Add seconds to match API format

      const eventData = {
        title: event.title,
        description: event.description,
        date: `${formattedDate}T${formattedTime}.000Z`,
        time: `${formattedTime}.000Z`,
        location: event.location,
      }

      await axios.put(`https://backend-project-pemuda.onrender.com/api/v1/events/${eventId}`, eventData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      setSuccess("Event updated successfully!")

      // Redirect after a short delay
      setTimeout(() => {
        navigate("/app/dashboard/default")
      }, 2000)
    } catch (err) {
      console.error("Error updating event:", err)
      setError(err.response?.data?.message || "Failed to update event. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Loading event details...</span>
      </div>
    )
  }

  return (
    <div className="edit-event-container">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <Button variant="link" className="text-white p-0 me-3" onClick={() => navigate("/app/dashboard/default")}>
              <ArrowLeft size={20} />
            </Button>
            <Card.Title className="mb-0">Edit Event</Card.Title>
          </div>
        </Card.Header>

        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Event Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter event title"
                    value={event.title}
                    onChange={(e) => setEvent({ ...event, title: e.target.value })}
                    required
                  />
                  <Form.Control.Feedback type="invalid">Title is required</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Enter event description"
                    value={event.description}
                    onChange={(e) => setEvent({ ...event, description: e.target.value })}
                    required
                  />
                  <Form.Control.Feedback type="invalid">Description is required</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <DatePicker
                    selected={event.date}
                    onChange={(date) => setEvent({ ...event, date })}
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
                    value={event.time}
                    onChange={(e) => setEvent({ ...event, time: e.target.value })}
                    required
                  />
                  <Form.Control.Feedback type="invalid">Time is required</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter event location"
                    value={event.location}
                    onChange={(e) => setEvent({ ...event, location: e.target.value })}
                    required
                  />
                  <Form.Control.Feedback type="invalid">Location is required</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end mt-4">
              <Button
                variant="secondary"
                className="me-2"
                onClick={() => navigate("/app/dashboard/default")}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} className="me-2" /> Save Changes
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  )
}

export default EditEvents

