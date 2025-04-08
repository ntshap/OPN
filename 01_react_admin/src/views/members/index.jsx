"use client"

import { useState, useEffect } from "react"
import { Row, Col, Card, Table, Button, Form, InputGroup, Badge, Modal, Spinner, Alert } from "react-bootstrap"
import { Search, UserPlus, Edit, Trash2, Eye, Filter, X, UserCheck, UserX } from "lucide-react"
import MainCard from "../../components/Card/MainCard"

const Members = () => {
  const [members, setMembers] = useState([])
  const [filteredMembers, setFilteredMembers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState({ show: false, variant: "", message: "" })
  const [selectedMember, setSelectedMember] = useState(null)

  // Form states
  const [memberForm, setMemberForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "member",
    status: "active",
    joinDate: "",
    address: "",
    notes: "",
  })

  // Filter states
  const [filters, setFilters] = useState({
    role: "all",
    status: "all",
    joinDateFrom: "",
    joinDateTo: "",
  })

  // Load mock member data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockData = [
        {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          phone: "(123) 456-7890",
          role: "admin",
          status: "active",
          joinDate: "2023-01-15",
          address: "123 Main St, Anytown, USA",
          notes: "Founding member",
        },
        {
          id: 2,
          firstName: "Jane",
          lastName: "Smith",
          email: "jane.smith@example.com",
          phone: "(456) 789-0123",
          role: "member",
          status: "active",
          joinDate: "2023-02-20",
          address: "456 Oak Ave, Somewhere, USA",
          notes: "Volunteer coordinator",
        },
        {
          id: 3,
          firstName: "Robert",
          lastName: "Johnson",
          email: "robert.j@example.com",
          phone: "(789) 012-3456",
          role: "treasurer",
          status: "active",
          joinDate: "2023-01-10",
          address: "789 Pine St, Nowhere, USA",
          notes: "Handles financial matters",
        },
        {
          id: 4,
          firstName: "Emily",
          lastName: "Davis",
          email: "emily.d@example.com",
          phone: "(321) 654-9870",
          role: "secretary",
          status: "active",
          joinDate: "2023-03-05",
          address: "321 Elm St, Elsewhere, USA",
          notes: "Takes meeting minutes",
        },
        {
          id: 5,
          firstName: "Michael",
          lastName: "Wilson",
          email: "michael.w@example.com",
          phone: "(654) 321-0987",
          role: "member",
          status: "inactive",
          joinDate: "2023-01-25",
          address: "654 Maple Dr, Anywhere, USA",
          notes: "On leave of absence",
        },
      ]

      setMembers(mockData)
      setFilteredMembers(mockData)
      setLoading(false)
    }, 1000)
  }, [])

  // Handle search
  useEffect(() => {
    const results = members.filter(
      (member) =>
        `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone.includes(searchTerm),
    )
    setFilteredMembers(results)
  }, [searchTerm, members])

  // Handle filters
  const applyFilters = () => {
    let results = [...members]

    if (filters.role !== "all") {
      results = results.filter((member) => member.role === filters.role)
    }

    if (filters.status !== "all") {
      results = results.filter((member) => member.status === filters.status)
    }

    if (filters.joinDateFrom) {
      results = results.filter((member) => member.joinDate >= filters.joinDateFrom)
    }

    if (filters.joinDateTo) {
      results = results.filter((member) => member.joinDate <= filters.joinDateTo)
    }

    setFilteredMembers(results)
    setShowFilters(false)
  }

  const resetFilters = () => {
    setFilters({
      role: "all",
      status: "all",
      joinDateFrom: "",
      joinDateTo: "",
    })
    setFilteredMembers(members)
    setShowFilters(false)
  }

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setMemberForm({
      ...memberForm,
      [name]: value,
    })
  }

  const handleAddMember = () => {
    // Basic validation
    if (!memberForm.firstName || !memberForm.lastName || !memberForm.email) {
      setAlert({
        show: true,
        variant: "danger",
        message: "Please fill in all required fields",
      })
      return
    }

    // Create new member
    const newMember = {
      id: members.length + 1,
      ...memberForm,
      joinDate: memberForm.joinDate || new Date().toISOString().split("T")[0],
    }

    // Add to members
    const updatedMembers = [...members, newMember]
    setMembers(updatedMembers)
    setFilteredMembers(updatedMembers)

    // Reset form and close modal
    setMemberForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "member",
      status: "active",
      joinDate: "",
      address: "",
      notes: "",
    })
    setShowAddModal(false)

    // Show success message
    setAlert({
      show: true,
      variant: "success",
      message: "Member added successfully!",
    })

    // Hide alert after 3 seconds
    setTimeout(() => {
      setAlert({ show: false, variant: "", message: "" })
    }, 3000)
  }

  const handleEditMember = () => {
    if (!selectedMember) return

    // Update member
    const updatedMembers = members.map((member) =>
      member.id === selectedMember.id ? { ...memberForm, id: member.id } : member,
    )

    setMembers(updatedMembers)
    setFilteredMembers(updatedMembers)
    setShowEditModal(false)

    // Show success message
    setAlert({
      show: true,
      variant: "success",
      message: "Member updated successfully!",
    })

    setTimeout(() => {
      setAlert({ show: false, variant: "", message: "" })
    }, 3000)
  }

  const handleDeleteMember = () => {
    if (!selectedMember) return

    // Delete member
    const updatedMembers = members.filter((member) => member.id !== selectedMember.id)
    setMembers(updatedMembers)
    setFilteredMembers(updatedMembers)
    setShowDeleteModal(false)

    // Show success message
    setAlert({
      show: true,
      variant: "success",
      message: "Member deleted successfully!",
    })

    setTimeout(() => {
      setAlert({ show: false, variant: "", message: "" })
    }, 3000)
  }

  const handleViewMember = (member) => {
    setSelectedMember(member)
    setShowViewModal(true)
  }

  const handleEditClick = (member) => {
    setSelectedMember(member)
    setMemberForm({ ...member })
    setShowEditModal(true)
  }

  const handleDeleteClick = (member) => {
    setSelectedMember(member)
    setShowDeleteModal(true)
  }

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return <Badge bg="primary">Admin</Badge>
      case "treasurer":
        return <Badge bg="info">Treasurer</Badge>
      case "secretary":
        return <Badge bg="warning">Secretary</Badge>
      default:
        return <Badge bg="secondary">Member</Badge>
    }
  }

  const getStatusBadge = (status) => {
    return status === "active" ? <Badge bg="success">Active</Badge> : <Badge bg="danger">Inactive</Badge>
  }

  return (
    <>
      <MainCard title="Member Management">
        {alert.show && (
          <Alert
            variant={alert.variant}
            onClose={() => setAlert({ show: false, variant: "", message: "" })}
            dismissible
            className="mb-4"
          >
            {alert.message}
          </Alert>
        )}

        <Row className="mb-3">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text>
                <Search size={18} />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search by name, email or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={6} className="d-flex justify-content-end gap-2">
            <Button variant="outline-secondary" onClick={() => setShowFilters(!showFilters)}>
              <Filter size={18} className="me-1" /> Filters
            </Button>
            <Button variant="primary" onClick={() => setShowAddModal(true)}>
              <UserPlus size={18} className="me-1" /> Add Member
            </Button>
          </Col>
        </Row>

        {showFilters && (
          <Card className="mb-3">
            <Card.Body>
              <Row>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Role</Form.Label>
                    <Form.Select
                      value={filters.role}
                      onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                    >
                      <option value="all">All Roles</option>
                      <option value="admin">Admin</option>
                      <option value="member">Member</option>
                      <option value="treasurer">Treasurer</option>
                      <option value="secretary">Secretary</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                      <option value="all">All Statuses</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Join Date From</Form.Label>
                    <Form.Control
                      type="date"
                      value={filters.joinDateFrom}
                      onChange={(e) => setFilters({ ...filters, joinDateFrom: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Join Date To</Form.Label>
                    <Form.Control
                      type="date"
                      value={filters.joinDateTo}
                      onChange={(e) => setFilters({ ...filters, joinDateTo: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <div className="d-flex justify-content-end gap-2">
                <Button variant="outline-secondary" onClick={resetFilters}>
                  <X size={14} className="me-1" /> Reset
                </Button>
                <Button variant="primary" onClick={applyFilters}>
                  Apply Filters
                </Button>
              </div>
            </Card.Body>
          </Card>
        )}

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Loading members...</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <Card className="text-center py-5">
            <Card.Body>
              <UserX size={48} className="text-muted mb-3" />
              <h5>No members found</h5>
              <p className="text-muted">
                {searchTerm ||
                filters.role !== "all" ||
                filters.status !== "all" ||
                filters.joinDateFrom ||
                filters.joinDateTo
                  ? "Try adjusting your search or filters"
                  : "Start by adding a member"}
              </p>
              <Button variant="primary" onClick={() => setShowAddModal(true)}>
                <UserPlus size={18} className="me-1" /> Add Member
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <Table responsive hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Join Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member.id}>
                  <td>{`${member.firstName} ${member.lastName}`}</td>
                  <td>{member.email}</td>
                  <td>{member.phone}</td>
                  <td>{getRoleBadge(member.role)}</td>
                  <td>{getStatusBadge(member.status)}</td>
                  <td>{member.joinDate}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button variant="outline-primary" size="sm" onClick={() => handleViewMember(member)}>
                        <Eye size={16} />
                      </Button>
                      <Button variant="outline-warning" size="sm" onClick={() => handleEditClick(member)}>
                        <Edit size={16} />
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDeleteClick(member)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </MainCard>

      {/* Add Member Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    First Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={memberForm.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Last Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={memberForm.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Email <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={memberForm.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control type="tel" name="phone" value={memberForm.phone} onChange={handleInputChange} />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select name="role" value={memberForm.role} onChange={handleInputChange}>
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                    <option value="treasurer">Treasurer</option>
                    <option value="secretary">Secretary</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select name="status" value={memberForm.status} onChange={handleInputChange}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Join Date</Form.Label>
                  <Form.Control type="date" name="joinDate" value={memberForm.joinDate} onChange={handleInputChange} />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control type="text" name="address" value={memberForm.address} onChange={handleInputChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control as="textarea" rows={3} name="notes" value={memberForm.notes} onChange={handleInputChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddMember}>
            Add Member
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Member Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    First Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={memberForm.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Last Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={memberForm.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Email <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={memberForm.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control type="tel" name="phone" value={memberForm.phone} onChange={handleInputChange} />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select name="role" value={memberForm.role} onChange={handleInputChange}>
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                    <option value="treasurer">Treasurer</option>
                    <option value="secretary">Secretary</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select name="status" value={memberForm.status} onChange={handleInputChange}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Join Date</Form.Label>
                  <Form.Control type="date" name="joinDate" value={memberForm.joinDate} onChange={handleInputChange} />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control type="text" name="address" value={memberForm.address} onChange={handleInputChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control as="textarea" rows={3} name="notes" value={memberForm.notes} onChange={handleInputChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditMember}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View Member Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Member Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMember && (
            <div>
              <div className="text-center mb-4">
                <div className="d-inline-flex align-items-center justify-content-center bg-light rounded-circle p-3 mb-3">
                  <UserCheck size={48} className="text-primary" />
                </div>
                <h4>{`${selectedMember.firstName} ${selectedMember.lastName}`}</h4>
                <p className="mb-0">{getRoleBadge(selectedMember.role)}</p>
              </div>

              <Row className="mb-2">
                <Col sm={4} className="text-muted">
                  Email:
                </Col>
                <Col sm={8}>{selectedMember.email}</Col>
              </Row>
              <Row className="mb-2">
                <Col sm={4} className="text-muted">
                  Phone:
                </Col>
                <Col sm={8}>{selectedMember.phone}</Col>
              </Row>
              <Row className="mb-2">
                <Col sm={4} className="text-muted">
                  Status:
                </Col>
                <Col sm={8}>{getStatusBadge(selectedMember.status)}</Col>
              </Row>
              <Row className="mb-2">
                <Col sm={4} className="text-muted">
                  Join Date:
                </Col>
                <Col sm={8}>{selectedMember.joinDate}</Col>
              </Row>
              <Row className="mb-2">
                <Col sm={4} className="text-muted">
                  Address:
                </Col>
                <Col sm={8}>{selectedMember.address || "Not provided"}</Col>
              </Row>

              <div className="mt-3">
                <h6>Notes</h6>
                <p className="bg-light p-3 rounded">{selectedMember.notes || "No notes available"}</p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
          <Button
            variant="warning"
            onClick={() => {
              setShowViewModal(false)
              handleEditClick(selectedMember)
            }}
          >
            <Edit size={16} className="me-1" /> Edit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this member?</p>
          {selectedMember && (
            <div className="bg-light p-3 rounded">
              <p>
                <strong>Name:</strong> {`${selectedMember.firstName} ${selectedMember.lastName}`}
              </p>
              <p>
                <strong>Email:</strong> {selectedMember.email}
              </p>
              <p>
                <strong>Role:</strong> {selectedMember.role}
              </p>
            </div>
          )}
          <p className="text-danger mt-3">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteMember}>
            Delete Member
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Members

