"use client"

import { useState } from "react"
import { Modal, Button, Form, ProgressBar, Alert } from "react-bootstrap"
import { Upload, X, Check } from "lucide-react"
import { simulateFileUpload, formatFileSize, isImageFile } from "../../utils/fileUtils"
import { retrieveData, storeData } from "../../utils/localStorage"

const UploadDocumentModal = ({ show, onHide, eventId, fetchEvents }) => {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [error, setError] = useState("")
  const [cancelUpload, setCancelUpload] = useState(null)

  const handleFileChange = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setFiles(selectedFiles)
    }
  }

  const removeFile = (index) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
  }

  const handleUpload = async (e) => {
    e.preventDefault()

    if (files.length === 0) {
      setError("Please select at least one file to upload")
      return
    }

    setError("")
    setUploading(true)
    setUploadProgress(0)

    // Simulate file upload with progress
    const cancelFn = simulateFileUpload(
      files,
      (progress) => {
        setUploadProgress(progress)
      },
      (uploadedFiles) => {
        // On successful upload, update the event with the new documents
        const events = retrieveData("admin_events", [])
        const updatedEvents = events.map((event) => {
          if (event.id === eventId) {
            // Add the new documents to the event
            const existingDocs = event.documents || []
            return {
              ...event,
              documents: [...existingDocs, ...uploadedFiles],
            }
          }
          return event
        })

        // Save updated events to localStorage
        storeData("admin_events", updatedEvents)

        // Set success state
        setUploading(false)
        setUploadSuccess(true)
        setCancelUpload(null)

        // Refresh events list after successful upload
        if (fetchEvents) {
          setTimeout(() => {
            fetchEvents()
          }, 1000)
        }
      },
      (error) => {
        console.error("Error uploading files:", error)
        setError("Failed to upload files. Please try again.")
        setUploading(false)
        setCancelUpload(null)
      },
    )

    // Store the cancel function
    setCancelUpload(() => cancelFn)
  }

  const handleCancel = () => {
    if (cancelUpload && typeof cancelUpload === "function") {
      cancelUpload()
      setCancelUpload(null)
    }
    setUploading(false)
  }

  const handleClose = () => {
    // Cancel any in-progress upload
    if (uploading && cancelUpload) {
      cancelUpload()
    }

    // Reset state when modal is closed
    setFiles([])
    setUploadProgress(0)
    setUploading(false)
    setUploadSuccess(false)
    setError("")
    setCancelUpload(null)
    onHide()
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Upload Event Documentation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {uploadSuccess ? (
          <div className="text-center py-4">
            <div className="mb-3 d-flex justify-content-center">
              <div
                className="rounded-circle bg-success d-flex align-items-center justify-content-center"
                style={{ width: "60px", height: "60px" }}
              >
                <Check className="text-white" size={30} />
              </div>
            </div>
            <h5 className="mb-2">Upload Successful!</h5>
            <p className="text-muted">Your files have been uploaded successfully.</p>
            <Button variant="primary" onClick={handleClose} className="mt-3">
              Close
            </Button>
          </div>
        ) : (
          <Form onSubmit={handleUpload}>
            {error && <Alert variant="danger">{error}</Alert>}

            <div
              className={`border-2 border-dashed rounded p-4 text-center mb-3 ${files.length > 0 ? "border-primary bg-primary-light" : "border-gray-300"}`}
              style={{
                borderStyle: "dashed",
                backgroundColor: files.length > 0 ? "rgba(13, 110, 253, 0.05)" : "transparent",
                borderColor: files.length > 0 ? "#0d6efd" : "#dee2e6",
              }}
            >
              <div className="mb-3">
                <Upload size={40} className="text-primary mx-auto d-block mb-2" />
                <h5>Drag & Drop Files Here</h5>
                <p className="text-muted">or click to browse from your computer</p>
              </div>

              <Form.Group>
                <Form.Control
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                  onChange={handleFileChange}
                  className="d-none"
                  id="fileUpload"
                />
                <Button
                  variant="outline-primary"
                  onClick={() => document.getElementById("fileUpload").click()}
                  disabled={uploading}
                >
                  Browse Files
                </Button>
              </Form.Group>

              <small className="d-block mt-2 text-muted">
                Supported formats: JPG, PNG, GIF, PDF, DOC, XLS, PPT (Max 10MB per file)
              </small>
            </div>

            {files.length > 0 && (
              <div className="mb-3">
                <h6 className="mb-2">Selected Files ({files.length})</h6>
                <div className="border rounded p-2" style={{ maxHeight: "200px", overflowY: "auto" }}>
                  {files.map((file, index) => (
                    <div key={index} className="d-flex align-items-center justify-content-between p-2 border-bottom">
                      <div className="d-flex align-items-center">
                        {isImageFile(file) ? (
                          <div className="me-2" style={{ width: "40px", height: "40px" }}>
                            <img
                              src={URL.createObjectURL(file) || "/placeholder.svg"}
                              alt="Preview"
                              className="img-fluid rounded"
                              style={{ width: "40px", height: "40px", objectFit: "cover" }}
                            />
                          </div>
                        ) : (
                          <div
                            className="me-2 bg-light rounded d-flex align-items-center justify-content-center"
                            style={{ width: "40px", height: "40px" }}
                          >
                            <span className="text-muted small">{file.name.split(".").pop().toUpperCase()}</span>
                          </div>
                        )}
                        <div>
                          <p className="mb-0 text-truncate" style={{ maxWidth: "200px" }}>
                            {file.name}
                          </p>
                          <small className="text-muted">{formatFileSize(file.size)}</small>
                        </div>
                      </div>
                      <Button
                        variant="link"
                        className="text-danger p-0"
                        onClick={() => removeFile(index)}
                        disabled={uploading}
                      >
                        <X size={18} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uploading && (
              <div className="mb-3">
                <p className="mb-1 d-flex justify-content-between">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </p>
                <ProgressBar now={uploadProgress} animated />
              </div>
            )}

            <div className="d-flex justify-content-end gap-2 mt-4">
              {uploading ? (
                <Button variant="secondary" onClick={handleCancel}>
                  Cancel Upload
                </Button>
              ) : (
                <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
              )}
              <Button variant="primary" type="submit" disabled={files.length === 0 || uploading}>
                {uploading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Uploading...
                  </>
                ) : (
                  "Upload Files"
                )}
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default UploadDocumentModal

