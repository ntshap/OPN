"use client"
import { Card, Badge, Button } from "react-bootstrap"
import { Mail, Phone, Calendar, MapPin, Edit, Trash2, Eye } from "lucide-react"

const MemberCard = ({ member, onView, onEdit, onDelete }) => {
  return (
    <Card className="h-100 border-0 shadow-sm">
      <Card.Body className="p-0">
        <div className="p-4 text-center bg-light border-bottom">
          <div
            className="avatar-initial rounded-circle bg-primary text-white mx-auto mb-3"
            style={{
              width: "70px",
              height: "70px",
              fontSize: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {member.name.charAt(0).toUpperCase()}
          </div>
          <h5 className="mb-1">{member.name}</h5>
          <p className="text-muted mb-2">{member.role.charAt(0).toUpperCase() + member.role.slice(1)}</p>
          <Badge bg={member.status === "active" ? "success" : "secondary"} className="mb-2">
            {member.status === "active" ? "Active" : "Inactive"}
          </Badge>
        </div>

        <div className="p-4">
          <div className="d-flex align-items-center mb-3">
            <Mail size={16} className="text-primary me-2" />
            <div className="text-truncate">{member.email}</div>
          </div>

          <div className="d-flex align-items-center mb-3">
            <Phone size={16} className="text-primary me-2" />
            <div>{member.phone}</div>
          </div>

          <div className="d-flex align-items-center mb-3">
            <Calendar size={16} className="text-primary me-2" />
            <div>{new Date(member.joinDate).toLocaleDateString()}</div>
          </div>

          <div className="d-flex align-items-start mb-3">
            <MapPin size={16} className="text-primary me-2 mt-1" />
            <div className="text-truncate">{member.address}</div>
          </div>
        </div>
      </Card.Body>

      <Card.Footer className="bg-white border-top p-3">
        <div className="d-flex justify-content-between">
          <Button variant="outline-info" size="sm" onClick={() => onView(member)} className="d-flex align-items-center">
            <Eye size={14} className="me-1" />
            View
          </Button>

          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => onEdit(member)}
            className="d-flex align-items-center"
          >
            <Edit size={14} className="me-1" />
            Edit
          </Button>

          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => onDelete(member)}
            className="d-flex align-items-center"
          >
            <Trash2 size={14} className="me-1" />
            Delete
          </Button>
        </div>
      </Card.Footer>
    </Card>
  )
}

export default MemberCard

