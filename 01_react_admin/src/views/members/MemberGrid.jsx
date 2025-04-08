"use client"

import { useState } from "react"
import { Row, Col, Button } from "react-bootstrap"
import { Grid, List } from "lucide-react"
import MemberCard from "../../components/common/MemberCard"

const MemberGrid = ({ members, onView, onEdit, onDelete }) => {
  const [viewMode, setViewMode] = useState("grid")

  return (
    <div>
      <div className="d-flex justify-content-end mb-3">
        <div className="btn-group">
          <Button
            variant={viewMode === "grid" ? "primary" : "outline-primary"}
            onClick={() => setViewMode("grid")}
            className="d-flex align-items-center"
          >
            <Grid size={16} className="me-1" />
            Grid
          </Button>
          <Button
            variant={viewMode === "list" ? "primary" : "outline-primary"}
            onClick={() => setViewMode("list")}
            className="d-flex align-items-center"
          >
            <List size={16} className="me-1" />
            List
          </Button>
        </div>
      </div>

      <Row className="g-3">
        {members.map((member) => (
          <Col key={member.id} xs={12} md={viewMode === "grid" ? 6 : 12} lg={viewMode === "grid" ? 4 : 12}>
            <MemberCard member={member} onView={onView} onEdit={onEdit} onDelete={onDelete} />
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default MemberGrid

