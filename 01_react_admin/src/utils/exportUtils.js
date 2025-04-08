/**
 * Utility functions for exporting data in various formats
 */

// Function to export data as CSV
export const exportToCSV = (data, filename = "export.csv") => {
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

// Function to export data as JSON
export const exportToJSON = (data, filename = "export.json") => {
  if (!data) {
    console.error("No data to export")
    return
  }

  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: "application/json" })
  const link = document.createElement("a")

  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Function to print data as a table
export const printData = (data, title = "Data Report") => {
  if (!data || !data.length) {
    console.error("No data to print")
    return
  }

  // Create a new window for printing
  const printWindow = window.open("", "_blank")

  // Get headers from first object
  const headers = Object.keys(data[0])

  // Create HTML table
  const tableHTML = `
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .print-date { text-align: right; margin-top: 10px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="print-date">Generated on: ${new Date().toLocaleString()}</div>
        <table>
          <thead>
            <tr>
              ${headers.map((header) => `<th>${header}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${data
              .map(
                (row) => `
              <tr>
                ${headers.map((header) => `<td>${row[header] !== undefined && row[header] !== null ? row[header] : ""}</td>`).join("")}
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </body>
    </html>
  `

  // Write to the new window and print
  printWindow.document.open()
  printWindow.document.write(tableHTML)
  printWindow.document.close()

  // Wait for content to load before printing
  printWindow.onload = () => {
    printWindow.print()
  }
}

// Function to export data as Excel (simplified version using CSV)
// Note: For a real Excel export, you would use a library like xlsx or exceljs
export const exportToExcel = (data, filename = "export.xls") => {
  if (!data || !data.length) {
    console.error("No data to export")
    return
  }

  // Get headers from first object
  const headers = Object.keys(data[0])

  // Create HTML table for Excel
  const tableHTML = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Sheet1</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
      </head>
      <body>
        <table>
          <thead>
            <tr>
              ${headers.map((header) => `<th>${header}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${data
              .map(
                (row) => `
              <tr>
                ${headers.map((header) => `<td>${row[header] !== undefined && row[header] !== null ? row[header] : ""}</td>`).join("")}
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </body>
    </html>
  `

  // Create and download the file
  const blob = new Blob([tableHTML], { type: "application/vnd.ms-excel" })
  const link = document.createElement("a")

  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

