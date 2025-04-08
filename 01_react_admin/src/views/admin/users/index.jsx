"use client"

import { useState, useEffect } from "react"
import { Card, Table, Button, Badge, Form, InputGroup, Modal, Row, Col, Spinner, Pagination } from "react-bootstrap"
import { Search, Plus, Edit, Trash2, Eye, Download, RefreshCw } from "lucide-react"

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [filterRole, setFilterRole] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "member",
    status: "active",
    phone: "",
    department: "",
  })

  // Sample user data - in a real app, this would come from an API
  const sampleUsers = [
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      role: "admin",
      status: "active",
      lastLogin: "2023-03-15 09:45",
      phone: "(555) 123-4567",
      department: "Management",
    },
    {
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      role: "editor",
      status: "active",
      lastLogin: "2023-03-14 14:30",
      phone: "(555) 234-5678",
      department: "Content",
    },
    {
      id: 3,
      firstName: "Robert",
      lastName: "Johnson",
      email: "robert.j@example.com",
      role: "member",
      status: "inactive",
      lastLogin: "2023-02-28 10:15",
      phone: "(555) 345-6789",
      department: "Support",
    },
    {
      id: 4,
      firstName: "Emily",
      lastName: "Williams",
      email: "emily.w@example.com",
      role: "member",
      status: "active",
      lastLogin: "2023-03-15 11:20",
      phone: "(555) 456-7890",
      department: "Marketing",
    },
    {
      id: 5,
      firstName: "Michael",
      lastName: "Brown",
      email: "michael.b@example.com",
      role: "editor",
      status: "active",
      lastLogin: "2023-03-13 16:45",
      phone: "(555) 567-8901",
      department: "Content",
    },
    {
      id: 6,
      firstName: "Sarah",
      lastName: "Davis",
      email: "sarah.d@example.com",
      role: "member",
      status: "pending",
      lastLogin: "Never",
      phone: "(555) 678-9012",
      department: "Sales",
    },
    {
      id: 7,
      firstName: "David",
      lastName: "Miller",
      email: "david.m@example.com",
      role: "member",
      status: "active",
      lastLogin: "2023-03-14 09:30",
      phone: "(555) 789-0123",
      department: "Support",
    },
    {
      id: 8,
      firstName: "Jessica",
      lastName: "Wilson",
      email: "jessica.w@example.com",
      role: "editor",
      status: "active",
      lastLogin: "2023-03-15 08:15",
      phone: "(555) 890-1234",
      department: "Content",
    },
    {
      id: 9,
      firstName: "James",
      lastName: "Taylor",
      email: "james.t@example.com",
      role: "member",
      status: "inactive",
      lastLogin: "2023-02-20 13:45",
      phone: "(555) 901-2345",
      department: "Marketing",
    },
    {
      id: 10,
      firstName: "Jennifer",
      lastName: "Anderson",
      email: "jennifer.a@example.com",
      role: "admin",
      status: "active",
      lastLogin: "2023-03-15 10:30",
      phone: "(555) 012-3456",
      department: "Management",
    },
    {
      id: 11,
      firstName: "Charles",
      lastName: "Thomas",
      email: "charles.t@example.com",
      role: "member",
      status: "active",
      lastLogin: "2023-03-14 11:15",
      phone: "(555) 123-4567",
      department: "Support",
    },
    {
      id: 12,
      firstName: "Patricia",
      lastName: "Jackson",
      email: "patricia.j@example.com",
      role: "member",
      status: "pending",
      lastLogin: "Never",
      phone: "(555) 234-5678",
      department: "Sales",
    },
  ]

  useEffect(() => {
    // Simulate loading data from an API
    setTimeout(() => {
      setUsers(sampleUsers)
      setFilteredUsers(sampleUsers)
      setIsLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    // Filter users based on search term and filters
    let result = users

    if (searchTerm) {
      result = result.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterRole !== "all") {
      result = result.filter((user) => user.role === filterRole)
    }

    if (filterStatus !== "all") {
      result = result.filter((user) => user.status === filterStatus)
    }

    setFilteredUsers(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [searchTerm, filterRole, filterStatus, users])

  // Get current users for pagination
  const indexOfLastUser = currentPage * itemsPerPage
  const indexOfFirstUser = indexOfLastUser - itemsPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  const handleAddUser = () => {
    // In a real app, this would send data to an API
    const id = users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1
    const newUserWithId = {
      ...newUser,
      id,
      lastLogin: "Never",
    }

    setUsers([...users, newUserWithId])
    setShowAddModal(false)
    setNewUser({
      firstName: "",
      lastName: "",
      email: "",
      role: "member",
      status: "active",
      phone: "",
      department: "",
    })
  }

  const handleEditUser = () => {
    // In a real app, this would send data to an API
    const updatedUsers = users.map((user) => (user.id === currentUser.id ? currentUser : user))

    setUsers(updatedUsers)
    setShowEditModal(false)
  }

  const handleDeleteUser = () => {
    // In a real app, this would send a delete request to an API
    const updatedUsers = users.filter((user) => user.id !== currentUser.id)
    setUsers(updatedUsers)
    setShowDeleteModal(false)
  }

  const handleViewUser = (user) => {
    setCurrentUser(user)
    setShowViewModal(true)
  }

  const handleEditClick = (user) => {
    setCurrentUser({ ...user })
    setShowEditModal(true)
  }

  const handleDeleteClick = (user) => {
    setCurrentUser(user)
    setShowDeleteModal(true)
  }

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "admin":
        return "danger"
      case "editor":
        return "warning"
      case "member":
        return "info"
      default:
        return "secondary"
    }
  }

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "active":
        return "success"
      case "inactive":
        return "secondary"
      case "pending":
        return "warning"
      default:
        return "secondary"
    }
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <span className="ms-2">Loading users...</span>
      </div>
    )
  }

  return (
    <div className="admin-users">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">User Management</h1>
        <Button variant="primary" onClick={() => setShowAddModal(true)} className="d-flex align-items-center">
          <Plus size={16} className="me-1" />
          Add New User
        </Button>
      </div>

      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex flex-column flex-md-row justify-content-between mb-3">
            <div className="d-flex mb-3 mb-md-0">
              <InputGroup className="me-2" style={{ width: "250px" }}>
                <InputGroup.Text>
                  <Search size={16} />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              <Form.Select
                className="me-2"
                style={{ width: "150px" }}
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="member">Member</option>
              </Form.Select>
              <Form.Select
                style={{ width: "150px" }}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </Form.Select>
            </div>
            <div className="d-flex">
              <Button variant="outline-secondary" size="sm" className="me-2 d-flex align-items-center">
                <Download size={16} className="me-1" />
                Export
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                className="d-flex align-items-center"
                onClick={() => {
                  setIsLoading(true)
                  setTimeout(() => {
                    setIsLoading(false)
                  }, 800)
                }}
              >
                <RefreshCw size={16} className="me-1" />
                Refresh
              </Button>
            </div>
          </div>

          <Table responsive hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>
                    {user.firstName} {user.lastName}
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <Badge bg={getRoleBadgeVariant(user.role)}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={getStatusBadgeVariant(user.status)}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </Badge>
                  </td>
                  <td>{user.lastLogin}</td>
                  <td>
                    <div className="d-flex">
                      <Button variant="light" size="sm" className="me-1" onClick={() => handleViewUser(user)}>
                        <Eye size={16} />
                      </Button>
                      <Button variant="light" size="sm" className="me-1" onClick={() => handleEditClick(user)}>
                        <Edit size={16} />
                      </Button>
                      <Button variant="light" size="sm" onClick={() => handleDeleteClick(user)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted">No users found matching your criteria.</p>
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center">
            <div>
              <small className="text-muted">
                Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
                {filteredUsers.length} users
              </small>
            </div>
            <Pagination>
              <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
              <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />

              {[...Array(totalPages).keys()].map((number) => (
                <Pagination.Item
                  key={number + 1}
                  active={number + 1 === currentPage}
                  onClick={() => paginate(number + 1)}
                >
                  {number + 1}
                </Pagination.Item>
              ))}

              <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
              <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
            </Pagination>
          </div>
        </Card.Body>
      </Card>

      {/* Add User Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  value={newUser.firstName}
                  onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  value={newUser.lastName}
                  onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              required
            />
          </Form.Group>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="member">Member</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={newUser.status}
                  onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="tel"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Department</Form.Label>
                <Form.Control
                  type="text"
                  value={newUser.department}
                  onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAddUser}
            disabled={!newUser.firstName || !newUser.lastName || !newUser.email}
          >
            Add User
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentUser && (
            <>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={currentUser.firstName}
                      onChange={(e) => setCurrentUser({ ...currentUser, firstName: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={currentUser.lastName}
                      onChange={(e) => setCurrentUser({ ...currentUser, lastName: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={currentUser.email}
                  onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                  required
                />
              </Form.Group>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Role</Form.Label>
                    <Form.Select
                      value={currentUser.role}
                      onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })}
                    >
                      <option value="admin">Admin</option>
                      <option value="editor">Editor</option>
                      <option value="member">Member</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={currentUser.status}
                      onChange={(e) => setCurrentUser({ ...currentUser, status: e.target.value })}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="tel"
                      value={currentUser.phone}
                      onChange={(e) => setCurrentUser({ ...currentUser, phone: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Department</Form.Label>
                    <Form.Control
                      type="text"
                      value={currentUser.department}
                      onChange={(e) => setCurrentUser({ ...currentUser, department: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditUser}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View User Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentUser && (
            <div>
              <div className="text-center mb-4">
                <div
                  className="d-inline-flex align-items-center justify-content-center bg-light rounded-circle"
                  style={{ width: "80px", height: "80px" }}
                >
                  <span className="h3 mb-0">
                    {currentUser.firstName.charAt(0)}
                    {currentUser.lastName.charAt(0)}
                  </span>
                </div>
                <h5 className="mt-3 mb-1">
                  {currentUser.firstName} {currentUser.lastName}
                </h5>
                <Badge bg={getRoleBadgeVariant(currentUser.role)} className="me-2">
                  {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                </Badge>
                <Badge bg={getStatusBadgeVariant(currentUser.status)}>
                  {currentUser.status.charAt(0).toUpperCase() + currentUser.status.slice(1)}
                </Badge>
              </div>

              <Table borderless size="sm">
                <tbody>
                  <tr>
                    <th style={{ width: "30%" }}>Email:</th>
                    <td>{currentUser.email}</td>
                  </tr>
                  <tr>
                    <th>Phone:</th>
                    <td>{currentUser.phone}</td>
                  </tr>
                  <tr>
                    <th>Department:</th>
                    <td>{currentUser.department}</td>
                  </tr>
                  <tr>
                    <th>Last Login:</th>
                    <td>{currentUser.lastLogin}</td>
                  </tr>
                  <tr>
                    <th>User ID:</th>
                    <td>{currentUser.id}</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowViewModal(false)
              handleEditClick(currentUser)
            }}
          >
            Edit User
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete User Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentUser && (
            <p>
              Are you sure you want to delete the user{" "}
              <strong>
                {currentUser.firstName} {currentUser.lastName}
              </strong>
              ? This action cannot be undone.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteUser}>
            Delete User
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default AdminUsers

