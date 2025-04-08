/**
 * Utility functions for handling files in the frontend
 */

// Convert file size to human-readable format
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

// Get file extension from filename
export const getFileExtension = (filename) => {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2)
}

// Check if file is an image
export const isImageFile = (file) => {
  const imageTypes = ["image/jpeg", "image/png", "image/gif", "image/bmp", "image/webp"]
  return imageTypes.includes(file.type)
}

// Check if file is a document
export const isDocumentFile = (file) => {
  const docTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
  ]
  return docTypes.includes(file.type)
}

// Generate a file preview URL
export const generateFilePreview = (file) => {
  return new Promise((resolve, reject) => {
    if (isImageFile(file)) {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = (e) => reject(e)
      reader.readAsDataURL(file)
    } else {
      // For non-image files, return a generic icon based on file type
      const extension = getFileExtension(file.name).toLowerCase()

      // Map common extensions to generic icons
      const iconMap = {
        pdf: "/placeholder.svg?text=PDF",
        doc: "/placeholder.svg?text=DOC",
        docx: "/placeholder.svg?text=DOCX",
        xls: "/placeholder.svg?text=XLS",
        xlsx: "/placeholder.svg?text=XLSX",
        ppt: "/placeholder.svg?text=PPT",
        pptx: "/placeholder.svg?text=PPTX",
        txt: "/placeholder.svg?text=TXT",
      }

      resolve(iconMap[extension] || "/placeholder.svg?text=FILE")
    }
  })
}

// Simulate file upload with progress
export const simulateFileUpload = (files, onProgress, onComplete, onError) => {
  let progress = 0
  const totalSize = files.reduce((total, file) => total + file.size, 0)
  const chunkSize = totalSize / 100 // Divide into 100 chunks for percentage

  const interval = setInterval(() => {
    progress += Math.random() * 10
    if (progress > 100) progress = 100

    onProgress(Math.floor(progress))

    if (progress === 100) {
      clearInterval(interval)

      // Generate file objects with IDs and other metadata
      const uploadedFiles = files.map((file, index) => ({
        id: Date.now() + index,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString().split("T")[0],
      }))

      onComplete(uploadedFiles)
    }
  }, 300)

  // Simulate potential errors (10% chance)
  if (Math.random() < 0.1) {
    clearInterval(interval)
    onError(new Error("Simulated upload error"))
  }

  // Return a cancel function
  return () => clearInterval(interval)
}

// Generate CSV from data
export const generateCSV = (data, filename = "export.csv") => {
  if (!data || !data.length) {
    console.error("No data to export")
    return
  }

  // Get headers from first object
  const headers = Object.keys(data[0])

  // Create CSV rows
  const csvRows = [
    headers.join(","), // Header row
    ...data.map((row) =>
      headers
        .map((header) => {
          // Handle values that need quotes (contain commas, quotes, or newlines)
          const value = row[header] === null || row[header] === undefined ? "" : row[header]
          const valueStr = String(value)
          const needsQuotes = valueStr.includes(",") || valueStr.includes('"') || valueStr.includes("\n")
          return needsQuotes ? `"${valueStr.replace(/"/g, '""')}"` : valueStr
        })
        .join(","),
    ),
  ].join("\n")

  // Create and download the file
  const blob = new Blob([csvRows], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")

  // Create download link
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"

  // Append to document, click, and remove
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

