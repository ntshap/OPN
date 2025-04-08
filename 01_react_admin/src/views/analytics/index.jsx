"use client"

import { useState, useEffect } from "react"
import { Row, Col, Card, Form, Button, Table, Spinner } from "react-bootstrap"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Activity,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react"

const Analytics = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState("month")
  const [filterOpen, setFilterOpen] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Sample data - in a real app, this would come from an API
  const memberActivityData = [
    { month: "Jan", active: 65, new: 28, inactive: 12 },
    { month: "Feb", active: 59, new: 24, inactive: 13 },
    { month: "Mar", active: 80, new: 29, inactive: 11 },
    { month: "Apr", active: 81, new: 30, inactive: 10 },
    { month: "May", active: 56, new: 18, inactive: 14 },
    { month: "Jun", active: 55, new: 23, inactive: 15 },
    { month: "Jul", active: 40, new: 15, inactive: 20 },
    { month: "Aug", active: 72, new: 25, inactive: 8 },
    { month: "Sep", active: 90, new: 35, inactive: 5 },
    { month: "Oct", active: 95, new: 38, inactive: 4 },
    { month: "Nov", active: 85, new: 32, inactive: 7 },
    { month: "Dec", active: 78, new: 27, inactive: 9 },
  ]

  const eventAttendanceData = [
    { name: "Annual Meeting", attendance: 85, capacity: 100 },
    { name: "Workshop Series", attendance: 45, capacity: 50 },
    { name: "Community Outreach", attendance: 65, capacity: 80 },
    { name: "Fundraising Gala", attendance: 120, capacity: 150 },
    { name: "Leadership Training", attendance: 30, capacity: 35 },
    { name: "Volunteer Day", attendance: 55, capacity: 75 },
  ]

  const financialData = [
    { month: "Jan", income: 12500, expenses: 8700 },
    { month: "Feb", income: 9800, expenses: 7600 },
    { month: "Mar", income: 14200, expenses: 9100 },
    { month: "Apr", income: 15800, expenses: 10200 },
    { month: "May", income: 11300, expenses: 8900 },
    { month: "Jun", income: 10700, expenses: 7800 },
    { month: "Jul", income: 9500, expenses: 7200 },
    { month: "Aug", income: 13600, expenses: 9500 },
    { month: "Sep", income: 16200, expenses: 10800 },
    { month: "Oct", income: 17500, expenses: 11200 },
    { month: "Nov", income: 15300, expenses: 10500 },
    { month: "Dec", income: 14800, expenses: 10100 },
  ]

  const membershipData = [
    { name: "Regular Members", value: 120, color: "#3b82f6" },
    { name: "Premium Members", value: 45, color: "#10b981" },
    { name: "Corporate Sponsors", value: 15, color: "#6366f1" },
    { name: "Honorary Members", value: 8, color: "#f59e0b" },
  ]

  const topPerformers = [
    { id: 1, name: "John Smith", contributions: 24, events: 18, status: "active" },
    { id: 2, name: "Sarah Johnson", contributions: 22, events: 15, status: "active" },
    { id: 3, name: "Michael Brown", contributions: 19, events: 17, status: "active" },
    { id: 4, name: "Emily Davis", contributions: 18, events: 14, status: "active" },
    { id: 5, name: "David Wilson", contributions: 16, events: 12, status: "active" },
  ]

  const kpiData = [
    {
      title: "Total Members",
      value: 188,
      change: 12,
      changeType: "increase",
      icon: <Users className="h-6 w-6 text-blue-500" />,
    },
    {
      title: "Events This Month",
      value: 24,
      change: 4,
      changeType: "increase",
      icon: <Calendar className="h-6 w-6 text-purple-500" />,
    },
    {
      title: "Monthly Revenue",
      value: "$15,300",
      change: 8.5,
      changeType: "increase",
      icon: <DollarSign className="h-6 w-6 text-green-500" />,
    },
    {
      title: "Engagement Rate",
      value: "76%",
      change: 3.2,
      changeType: "decrease",
      icon: <Activity className="h-6 w-6 text-orange-500" />,
    },
  ]

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1200)

    return () => clearTimeout(timer)
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    setIsLoading(true)

    // Simulate refreshing data
    setTimeout(() => {
      setRefreshing(false)
      setIsLoading(false)
    }, 1500)
  }

  const handleExport = (format) => {
    // In a real app, this would generate and download a report
    alert(`Exporting analytics data as ${format}...`)
  }

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <span className="ms-2">Loading analytics data...</span>
      </div>
    )
  }

  return (
    <div className="analytics-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Analytics Dashboard</h1>
        <div className="d-flex gap-2">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => setFilterOpen(!filterOpen)}
            className="d-flex align-items-center"
          >
            <Filter size={16} className="me-1" />
            Filters
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="d-flex align-items-center"
          >
            <RefreshCw size={16} className={`me-1 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <div className="dropdown">
            <Button
              variant="outline-primary"
              size="sm"
              className="dropdown-toggle d-flex align-items-center"
              data-bs-toggle="dropdown"
            >
              <Download size={16} className="me-1" />
              Export
            </Button>
            <ul className="dropdown-menu">
              <li>
                <a className="dropdown-item" href="#" onClick={() => handleExport("PDF")}>
                  Export as PDF
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#" onClick={() => handleExport("Excel")}>
                  Export as Excel
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#" onClick={() => handleExport("CSV")}>
                  Export as CSV
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {filterOpen && (
        <Card className="mb-4">
          <Card.Body>
            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Date Range</Form.Label>
                  <Form.Select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                    <option value="week">Last 7 days</option>
                    <option value="month">Last 30 days</option>
                    <option value="quarter">Last 90 days</option>
                    <option value="year">Last 12 months</option>
                    <option value="custom">Custom Range</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Member Type</Form.Label>
                  <Form.Select defaultValue="all">
                    <option value="all">All Members</option>
                    <option value="regular">Regular Members</option>
                    <option value="premium">Premium Members</option>
                    <option value="corporate">Corporate Sponsors</option>
                    <option value="honorary">Honorary Members</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Event Category</Form.Label>
                  <Form.Select defaultValue="all">
                    <option value="all">All Events</option>
                    <option value="meetings">Meetings</option>
                    <option value="workshops">Workshops</option>
                    <option value="fundraising">Fundraising</option>
                    <option value="community">Community</option>
                    <option value="training">Training</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Financial Category</Form.Label>
                  <Form.Select defaultValue="all">
                    <option value="all">All Transactions</option>
                    <option value="income">Income Only</option>
                    <option value="expenses">Expenses Only</option>
                    <option value="donations">Donations</option>
                    <option value="membership">Membership Fees</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="outline-secondary" size="sm" onClick={() => setFilterOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={() => setFilterOpen(false)}>
                Apply Filters
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* KPI Cards */}
      <Row className="mb-4">
        {kpiData.map((kpi, index) => (
          <Col md={3} key={index}>
            <Card className="h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-1">{kpi.title}</h6>
                    <h3 className="mb-0">{kpi.value}</h3>
                  </div>
                  <div className="rounded-circle p-2 bg-light">{kpi.icon}</div>
                </div>
                <div className="mt-3">
                  <span
                    className={`badge ${kpi.changeType === "increase" ? "bg-success" : "bg-danger"} d-inline-flex align-items-center`}
                  >
                    {kpi.changeType === "increase" ? (
                      <TrendingUp size={14} className="me-1" />
                    ) : (
                      <TrendingDown size={14} className="me-1" />
                    )}
                    {kpi.change}%
                  </span>
                  <span className="text-muted ms-2">vs last period</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts Row 1 */}
      <Row className="mb-4">
        <Col lg={8}>
          <Card className="h-100">
            <Card.Body>
              <h5 className="card-title mb-4">Member Activity Trends</h5>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={memberActivityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="active" stackId="1" stroke="#3b82f6" fill="#3b82f6" />
                  <Area type="monotone" dataKey="new" stackId="1" stroke="#10b981" fill="#10b981" />
                  <Area type="monotone" dataKey="inactive" stackId="1" stroke="#f59e0b" fill="#f59e0b" />
                </AreaChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="h-100">
            <Card.Body>
              <h5 className="card-title mb-4">Membership Distribution</h5>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={membershipData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {membershipData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Row 2 */}
      <Row className="mb-4">
        <Col lg={6}>
          <Card className="h-100">
            <Card.Body>
              <h5 className="card-title mb-4">Event Attendance</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={eventAttendanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="attendance" fill="#3b82f6" />
                  <Bar dataKey="capacity" fill="#e5e7eb" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="h-100">
            <Card.Body>
              <h5 className="card-title mb-4">Financial Overview</h5>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={financialData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Top Performers Table */}
      <Card className="mb-4">
        <Card.Body>
          <h5 className="card-title mb-4">Top Performing Members</h5>
          <Table responsive hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Contributions</th>
                <th>Events Attended</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {topPerformers.map((member) => (
                <tr key={member.id}>
                  <td>{member.id}</td>
                  <td>{member.name}</td>
                  <td>{member.contributions}</td>
                  <td>{member.events}</td>
                  <td>
                    <span className="badge bg-success">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  )
}

export default Analytics

