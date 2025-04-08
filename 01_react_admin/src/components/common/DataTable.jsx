"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  InputAdornment,
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material"
import { Search, Edit, Trash2, Eye, Download } from "lucide-react"

const DataTable = ({
  columns,
  data,
  title,
  onEdit,
  onDelete,
  onView,
  onDownload,
  searchable = true,
  pagination = true,
}) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
    setPage(0)
  }

  // Filter data based on search term
  const filteredData = data.filter((row) => {
    if (!searchTerm) return true

    return columns.some((column) => {
      const value = row[column.field]
      if (value == null) return false
      return String(value).toLowerCase().includes(searchTerm.toLowerCase())
    })
  })

  // Apply pagination
  const paginatedData = pagination
    ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : filteredData

  // Render cell content based on column type
  const renderCellContent = (column, row) => {
    const value = row[column.field]

    switch (column.type) {
      case "date":
        return value ? new Date(value).toLocaleDateString() : "-"
      case "datetime":
        return value ? new Date(value).toLocaleString() : "-"
      case "status":
        return (
          <Chip
            label={value}
            color={
              value === "Active" || value === "Completed" || value === "Paid"
                ? "success"
                : value === "Pending"
                  ? "warning"
                  : value === "Inactive" || value === "Cancelled" || value === "Unpaid"
                    ? "error"
                    : "default"
            }
            size="small"
          />
        )
      case "currency":
        return value ? `$${Number.parseFloat(value).toFixed(2)}` : "$0.00"
      default:
        return value || "-"
    }
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: 2 }}>
      <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
        {searchable && (
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} />
                </InputAdornment>
              ),
            }}
            sx={{ width: 250 }}
          />
        )}
      </Box>

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label={`${title} table`}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  align={column.align || "left"}
                  style={{ minWidth: column.minWidth, fontWeight: 600 }}
                >
                  {column.headerName}
                </TableCell>
              ))}
              {(onEdit || onDelete || onView || onDownload) && (
                <TableCell align="right" style={{ minWidth: 120, fontWeight: 600 }}>
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id || index}>
                  {columns.map((column) => (
                    <TableCell key={column.field} align={column.align || "left"}>
                      {renderCellContent(column, row)}
                    </TableCell>
                  ))}
                  {(onEdit || onDelete || onView || onDownload) && (
                    <TableCell align="right">
                      {onView && (
                        <Tooltip title="View">
                          <IconButton size="small" onClick={() => onView(row)} color="info">
                            <Eye size={18} />
                          </IconButton>
                        </Tooltip>
                      )}
                      {onEdit && (
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => onEdit(row)} color="primary">
                            <Edit size={18} />
                          </IconButton>
                        </Tooltip>
                      )}
                      {onDownload && (
                        <Tooltip title="Download">
                          <IconButton size="small" onClick={() => onDownload(row)} color="success">
                            <Download size={18} />
                          </IconButton>
                        </Tooltip>
                      )}
                      {onDelete && (
                        <Tooltip title="Delete">
                          <IconButton size="small" onClick={() => onDelete(row)} color="error">
                            <Trash2 size={18} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + (onEdit || onDelete || onView ? 1 : 0)} align="center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Paper>
  )
}

export default DataTable

