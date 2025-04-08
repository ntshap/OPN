"use client"

import { useState, useEffect } from "react"
import { Modal, Button, Form, Alert } from "react-bootstrap"
import axios from "axios"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"

const ReportModal = ({ show, onHide, report, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "News",
    status: "Draft",
    image: null,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [imagePreview, setImagePreview] = useState("")

  useEffect(() => {
    if (report) {
      setFormData({
        title: report.title || "",
        content: report.content || "",
        category: report.category || "News",
        status: report.status || "Draft",
        image: null,
      })
      setImagePreview(report.imageUrl || "")
    } else {
      resetForm()
    }
  }, [report])

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      category: "News",
      status: "Draft",
      image: null,
    })
    setImagePreview("")
    setError("")
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleContentChange = (content) => {
    setFormData((prev) => ({
      ...prev,
      content,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should not exceed 5MB")
        return
      }
      setFormData((prev) => ({
        ...prev,
        image: file,
      }))
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      const formDataToSend = new FormData()
      Object.keys(formData).forEach((key) => {
        if (key === "image" && formData[key]) {
          formDataToSend.append("image", formData[key])
        } else if (formData[key]) {
          formDataToSend.append(key, formData[key])
        }
      })

      if (report) {
        await axios.put(`http://localhost:3001/admin/api/v1/reports/${report.id}`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
      } else {
        await axios.post("http://localhost:3001/admin/api/v1/reports", formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
      }

      onSuccess()
      onHide()
      resetForm()
    } catch (error) {
      console.error("Error saving report:", error)
      setError(error.response?.data?.message || "Error saving report")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} size="lg" className="datta-modal">
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="h5">{report ? "Edit Report" : "Add New Report"}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="px-4">
          {error && (
            <Alert variant="danger" className="py-2">
              {error}
            </Alert>
          )}

          <Form.Group className="mb-4">
            <Form.Label className="mb-2 text-muted">Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="form-control-lg border-0 bg-light"
              placeholder="Enter report title"
            />
          </Form.Group>

          <div className="row mb-4">
            <div className="col-md-6">
              <Form.Group>
                <Form.Label className="mb-2 text-muted">Category</Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="form-control-lg border-0 bg-light"
                >
                  <option value="News">News</option>
                  <option value="Report">Report</option>
                  <option value="Announcement">Announcement</option>
                </Form.Select>
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group>
                <Form.Label className="mb-2 text-muted">Status</Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="form-control-lg border-0 bg-light"
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                  <option value="Archived">Archived</option>
                </Form.Select>
              </Form.Group>
            </div>
          </div>

          <Form.Group className="mb-4">
            <Form.Label className="mb-2 text-muted">Content</Form.Label>
            <div className="bg-light rounded">
              <ReactQuill
                value={formData.content}
                onChange={handleContentChange}
                className="bg-white border-0"
                style={{ height: "200px" }}
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link", "image"],
                    ["clean"],
                  ],
                }}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="mb-2 text-muted">Image</Form.Label>
            <div className="custom-file-upload">
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="form-control-lg border-0 bg-light"
              />
              {imagePreview && (
                <div className="mt-3 position-relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="rounded"
                    style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "cover" }}
                  />
                </div>
              )}
            </div>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-0 px-4 pb-4">
          <Button variant="light" onClick={onHide} className="btn-lg px-4">
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading} className="btn-lg px-4">
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default ReportModal

