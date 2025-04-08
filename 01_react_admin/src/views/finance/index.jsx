"use client"

import { useState, useEffect } from "react"
import { Card, Button, Modal, Form, Row, Col, Table, Alert, Spinner } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import DatePicker from "react-datepicker"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Filter,
  Download,
  Plus,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Edit,
  Trash,
  FileText,
} from "lucide-react"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import "react-datepicker/dist/react-datepicker.css"
import moment from "moment"
import { retrieveData, storeData } from "../../utils/localStorage"
import { exportToCSV, exportToExcel } from "../../utils/exportUtils"

const StatCard = ({ title, value, trend, percentage, icon: Icon }) => {
  const isPositive = trend === "up"

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300">
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div className={`d-flex align-items-center ${isPositive ? "text-green-500" : "text-red-500"}`}>
            {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            <span className="text-sm font-medium">{percentage}%</span>
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-1">{value}</h3>
        <p className="text-gray-600 text-sm">{title}</p>
      </Card.Body>
    </Card>
  )
}

const FinancePage = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [filterDate, setFilterDate] = useState(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [transactionToDelete, setTransactionToDelete] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [transactionToEdit, setTransactionToEdit] = useState(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const [newTransaction, setNewTransaction] = useState({
    type: "income",
    amount: "",
    category: "",
    description: "",
    date: new Date(),
  })

  const stats = {
    totalIncome: {
      value: "$15,890",
      trend: "up",
      percentage: 12,
    },
    totalExpenses: {
      value: "$8,230",
      trend: "down",
      percentage: 5,
    },
    netProfit: {
      value: "$7,660",
      trend: "up",
      percentage: 8,
    },
    pendingPayments: {
      value: "$2,450",
      trend: "up",
      percentage: 15,
    },
  }

  const categories = [
    "Membership Fees",
    "Event Revenue",
    "Donations",
    "Sponsorships",
    "Equipment",
    "Venue Rental",
    "Marketing",
    "Administrative",
    "Other",
  ]

  useEffect(() => {
    fetchTransactions()
  }, [currentPage, searchTerm])

  const fetchTransactions = () => {
    setLoading(true)

    // Simulate API call with localStorage
    setTimeout(() => {
      const storedTransactions = retrieveData("admin_transactions", [])

      // Filter by search term if provided
      const filtered = searchTerm
        ? storedTransactions.filter(
            (t) =>
              t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
              t.category.toLowerCase().includes(searchTerm.toLowerCase()),
          )
        : storedTransactions

      setTransactions(filtered)
      setTotalPages(Math.ceil(filtered.length / 10))
      setLoading(false)
    }, 800)
  }

  const handleAddTransaction = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess("")

    // Validate form
    if (!newTransaction.amount || !newTransaction.category || !newTransaction.description) {
      setError("Please fill in all required fields")
      setIsSubmitting(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      try {
        // Get existing transactions
        const existingTransactions = retrieveData("admin_transactions", [])

        // Create new transaction with ID
        const newId = existingTransactions.length > 0 ? Math.max(...existingTransactions.map((t) => t.id)) + 1 : 1

        const newTransactionData = {
          id: newId,
          ...newTransaction,
          date: moment(newTransaction.date).format("YYYY-MM-DD"),
        }

        // Add to transactions array
        const updatedTransactions = [newTransactionData, ...existingTransactions]

        // Save to localStorage
        storeData("admin_transactions", updatedTransactions)

        // Update state
        setTransactions(updatedTransactions)
        setShowModal(false)
        setNewTransaction({
          type: "income",
          amount: "",
          category: "",
          description: "",
          date: new Date(),
        })
        setSuccess("Transaction added successfully!")
      } catch (error) {
        setError("Failed to add transaction. Please try again.")
      } finally {
        setIsSubmitting(false)
      }
    }, 800)
  }

  const handleEditTransaction = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess("")

    // Validate form
    if (!transactionToEdit.amount || !transactionToEdit.category || !transactionToEdit.description) {
      setError("Please fill in all required fields")
      setIsSubmitting(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      try {
        // Get existing transactions
        const existingTransactions = retrieveData("admin_transactions", [])

        // Update transaction
        const updatedTransactions = existingTransactions.map((t) =>
          t.id === transactionToEdit.id
            ? {
                ...transactionToEdit,
                date: moment(transactionToEdit.date).format("YYYY-MM-DD"),
              }
            : t,
        )

        // Save to localStorage
        storeData("admin_transactions", updatedTransactions)

        // Update state
        setTransactions(updatedTransactions)
        setShowEditModal(false)
        setTransactionToEdit(null)
        setSuccess("Transaction updated successfully!")
      } catch (error) {
        setError("Failed to update transaction. Please try again.")
      } finally {
        setIsSubmitting(false)
      }
    }, 800)
  }

  const handleDeleteTransaction = () => {
    if (!transactionToDelete) return

    setIsSubmitting(true)
    setError("")
    setSuccess("")

    // Simulate API call
    setTimeout(() => {
      try {
        // Get existing transactions
        const existingTransactions = retrieveData("admin_transactions", [])

        // Filter out the transaction to delete
        const updatedTransactions = existingTransactions.filter((t) => t.id !== transactionToDelete.id)

        // Save to localStorage
        storeData("admin_transactions", updatedTransactions)

        // Update state
        setTransactions(updatedTransactions)
        setShowDeleteModal(false)
        setTransactionToDelete(null)
        setSuccess("Transaction deleted successfully!")
      } catch (error) {
        setError("Failed to delete transaction. Please try again.")
      } finally {
        setIsSubmitting(false)
      }
    }, 800)
  }

  const handleExport = (format) => {
    // Export transactions based on format
    const filename = `financial_transactions_${new Date().toISOString().split("T")[0]}`

    switch (format) {
      case "csv":
        exportToCSV(transactions, `${filename}.csv`)
        break
      case "excel":
        exportToExcel(transactions, `${filename}.xls`)
        break
      default:
        exportToCSV(transactions, `${filename}.csv`)
    }
  }

  if (loading && transactions.length === 0) {
    return (
      <div className="p-6">
        <Row className="g-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <Col key={i} md={3}>
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <Skeleton height={20} width={100} className="mb-2" />
                  <Skeleton height={30} width={150} className="mb-2" />
                  <Skeleton height={15} width={80} />
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Card className="border-0 shadow-sm">
          <Card.Body>
            <Skeleton height={50} className="mb-4" />
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} height={40} className="mb-3" />
            ))}
          </Card.Body>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6">
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

      <div className="d-flex justify-content-between align-items-center mb-6">
        <h1 className="text-2xl font-bold">Financial Management</h1>
        <div className="d-flex gap-3">
          <div className="dropdown">
            <Button
              variant="outline-secondary"
              className="d-flex align-items-center dropdown-toggle"
              data-bs-toggle="dropdown"
            >
              <Download className="w-4 h-4 me-2" />
              Export
            </Button>
            <ul className="dropdown-menu">
              <li>
                <a className="dropdown-item" href="#" onClick={() => handleExport("csv")}>
                  Export as CSV
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#" onClick={() => handleExport("excel")}>
                  Export as Excel
                </a>
              </li>
            </ul>
          </div>
          <Button variant="primary" className="d-flex align-items-center" onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4 me-2" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <Row className="g-4 mb-6">
        <Col md={3}>
          <StatCard
            title="Total Income"
            value={stats.totalIncome.value}
            trend={stats.totalIncome.trend}
            percentage={stats.totalIncome.percentage}
            icon={DollarSign}
          />
        </Col>
        <Col md={3}>
          <StatCard
            title="Total Expenses"
            value={stats.totalExpenses.value}
            trend={stats.totalExpenses.trend}
            percentage={stats.totalExpenses.percentage}
            icon={TrendingDown}
          />
        </Col>
        <Col md={3}>
          <StatCard
            title="Net Profit"
            value={stats.netProfit.value}
            trend={stats.netProfit.trend}
            percentage={stats.netProfit.percentage}
            icon={TrendingUp}
          />
        </Col>
        <Col md={3}>
          <StatCard
            title="Pending Payments"
            value={stats.pendingPayments.value}
            trend={stats.pendingPayments.trend}
            percentage={stats.pendingPayments.percentage}
            icon={DollarSign}
          />
        </Col>
      </Row>

      {/* Filters */}
      <Card className="border-0 shadow-sm mb-6">
        <Card.Body>
          <div className="d-flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="position-relative">
                <Search
                  className="position-absolute start-3 top-50 translate-middle-y text-gray-400"
                  style={{ width: "20px", height: "20px" }}
                />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="ps-10 pe-4 py-2 border rounded-lg w-100 focus-outline-none focus-ring-2 focus-ring-primary-20"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: "40px" }}
                />
              </div>
            </div>

            <div style={{ width: "200px" }}>
              <DatePicker
                selected={filterDate}
                onChange={(date) => setFilterDate(date)}
                className="form-control"
                dateFormat="MM/yyyy"
                showMonthYearPicker
              />
            </div>

            <Button variant="outline-secondary" className="d-flex align-items-center">
              <Filter className="w-4 h-4 me-2" />
              More Filters
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Transactions Table */}
      <Card className="border-0 shadow-sm">
        <Card.Body>
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading transactions...</p>
            </div>
          ) : (
            <>
              <Table responsive hover className="mb-0">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th className="text-end">Amount</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length > 0 ? (
                    transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td>{new Date(transaction.date).toLocaleDateString()}</td>
                        <td>
                          <span
                            className={`px-2 py-1 rounded-pill text-xs
                            ${transaction.type === "income" ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"}`}
                          >
                            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                          </span>
                        </td>
                        <td>{transaction.category}</td>
                        <td>{transaction.description}</td>
                        <td className="text-end">
                          <span className={transaction.type === "income" ? "text-success" : "text-danger"}>
                            {transaction.type === "income" ? "+" : "-"}${transaction.amount}
                          </span>
                        </td>
                        <td className="text-center">
                          <Button
                            variant="light"
                            size="sm"
                            className="me-2"
                            onClick={() => {
                              setTransactionToEdit({
                                ...transaction,
                                date: new Date(transaction.date),
                              })
                              setShowEditModal(true)
                            }}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="light"
                            size="sm"
                            onClick={() => {
                              setTransactionToDelete(transaction)
                              setShowDeleteModal(true)
                            }}
                          >
                            <Trash size={16} className="text-danger" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        <FileText size={40} className="mx-auto mb-2 text-gray-400" />
                        <p>No transactions found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <div className="text-muted">
                    Showing page {currentPage} of {totalPages}
                  </div>
                  <ul className="pagination mb-0">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <Button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className="page-link"
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                    </li>
                    {[...Array(totalPages)].map((_, index) => (
                      <li key={index + 1} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                        <Button onClick={() => setCurrentPage(index + 1)} className="page-link">
                          {index + 1}
                        </Button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                      <Button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className="page-link"
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </li>
                  </ul>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      {/* Add Transaction Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddTransaction}>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <div className="d-flex gap-3">
                <Form.Check
                  type="radio"
                  label="Income"
                  name="type"
                  checked={newTransaction.type === "income"}
                  onChange={() => setNewTransaction({ ...newTransaction, type: "income" })}
                />
                <Form.Check
                  type="radio"
                  label="Expense"
                  name="type"
                  checked={newTransaction.type === "expense"}
                  onChange={() => setNewTransaction({ ...newTransaction, type: "expense" })}
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={newTransaction.category}
                onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                required
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <DatePicker
                selected={newTransaction.date}
                onChange={(date) => setNewTransaction({ ...newTransaction, date })}
                className="form-control"
                dateFormat="MM/dd/yyyy"
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button variant="secondary" onClick={() => setShowModal(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Adding...
                  </>
                ) : (
                  "Add Transaction"
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Transaction Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {transactionToEdit && (
            <Form onSubmit={handleEditTransaction}>
              <Form.Group className="mb-3">
                <Form.Label>Type</Form.Label>
                <div className="d-flex gap-3">
                  <Form.Check
                    type="radio"
                    label="Income"
                    name="type"
                    checked={transactionToEdit.type === "income"}
                    onChange={() => setTransactionToEdit({ ...transactionToEdit, type: "income" })}
                  />
                  <Form.Check
                    type="radio"
                    label="Expense"
                    name="type"
                    checked={transactionToEdit.type === "expense"}
                    onChange={() => setTransactionToEdit({ ...transactionToEdit, type: "expense" })}
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  value={transactionToEdit.amount}
                  onChange={(e) => setTransactionToEdit({ ...transactionToEdit, amount: e.target.value })}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={transactionToEdit.category}
                  onChange={(e) => setTransactionToEdit({ ...transactionToEdit, category: e.target.value })}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={transactionToEdit.description}
                  onChange={(e) => setTransactionToEdit({ ...transactionToEdit, description: e.target.value })}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <DatePicker
                  selected={transactionToEdit.date}
                  onChange={(date) => setTransactionToEdit({ ...transactionToEdit, date })}
                  className="form-control"
                  dateFormat="MM/dd/yyyy"
                  required
                />
              </Form.Group>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <Button variant="secondary" onClick={() => setShowEditModal(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Updating...
                    </>
                  ) : (
                    "Update Transaction"
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this transaction?</p>
          {transactionToDelete && (
            <div className="bg-light p-3 rounded mt-3">
              <p>
                <strong>Type:</strong> {transactionToDelete.type}
              </p>
              <p>
                <strong>Amount:</strong> ${transactionToDelete.amount}
              </p>
              <p>
                <strong>Category:</strong> {transactionToDelete.category}
              </p>
              <p>
                <strong>Description:</strong> {transactionToDelete.description}
              </p>
              <p>
                <strong>Date:</strong> {new Date(transactionToDelete.date).toLocaleDateString()}
              </p>
            </div>
          )}
          <p className="text-danger mt-3">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteTransaction} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              "Delete Transaction"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default FinancePage

