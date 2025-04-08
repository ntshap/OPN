"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Snackbar,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { Calendar, Clock, MapPin, Users, Activity, Plus, Edit, Eye } from "lucide-react"
import MainCard from "../../components/Card/MainCard"
import EventDetailModal from "./EventDetailModal"
import UploadDocumentModal from "./UploadDocumentModal"
import DashboardSummary from "../../components/dashboard/DashboardSummary"

const StyledEventCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  transition: "transform 0.2s",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[3],
  },
}))

const IconText = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(1),
  "& svg": {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  },
}))

const StyledStatsCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(2),
  transition: "transform 0.2s",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[3],
  },
}))

const Dashboard = () => {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })
  const [stats, setStats] = useState({
    totalMembers: 256,
    totalEvents: 45,
    totalIncome: "$15,000",
    totalDocuments: 78,
  })

  useEffect(() => {
    // Fetch events from API
    const fetchEvents = async () => {
      try {
        // Simulating API call with timeout
        setTimeout(() => {
          const mockEvents = [
            {
              id: 1,
              title: "Monthly Board Meeting",
              description: "Regular meeting to discuss organization progress and plans",
              date: "2025-03-25",
              time: "14:00",
              location: "Main Conference Room",
              attendees: 12,
            },
            {
              id: 2,
              title: "Annual General Meeting",
              description: "Yearly meeting with all members to review annual performance",
              date: "2025-04-15",
              time: "10:00",
              location: "Grand Hall",
              attendees: 45,
            },
            {
              id: 3,
              title: "New Member Orientation",
              description: "Introduction session for new organization members",
              date: "2025-03-28",
              time: "09:30",
              location: "Training Room B",
              attendees: 8,
            },
          ]
          setEvents(mockEvents)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching events:", error)
        setLoading(false)
        showSnackbar("Failed to load events", "error")
      }
    }

    fetchEvents()
  }, [])

  const handleEventClick = (event) => {
    setSelectedEvent(event)
    setIsEventModalOpen(true)
  }

  const handleCloseEventModal = () => {
    setIsEventModalOpen(false)
    setSelectedEvent(null)
  }

  const handleOpenUploadModal = () => {
    setIsUploadModalOpen(true)
  }

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false)
    showSnackbar("Document uploaded successfully")
  }

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    })
  }

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    })
  }

  const handleQuickAction = (action) => {
    switch (action) {
      case "addMember":
        navigate("/members/add")
        break
      case "scheduleEvent":
        navigate("/events")
        break
      case "recordTransaction":
        navigate("/finance")
        break
      case "uploadDocument":
        handleOpenUploadModal()
        break
      case "generateReport":
        navigate("/reports")
        break
      default:
        break
    }
  }

  const handleViewMember = (memberId) => {
    navigate(`/members/${memberId}`)
  }

  // Sort events by date (most recent first)
  const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date))
  const upcomingEvents = sortedEvents.filter((event) => new Date(event.date) >= new Date())

  return (
    <>
      <MainCard title="Dashboard">
        {/* Stats Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StyledStatsCard onClick={() => navigate("/members")}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Total Members
              </Typography>
              <Typography variant="h4">{stats.totalMembers}</Typography>
            </StyledStatsCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StyledStatsCard onClick={() => navigate("/events")}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Total Events
              </Typography>
              <Typography variant="h4">{stats.totalEvents}</Typography>
            </StyledStatsCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StyledStatsCard onClick={() => navigate("/finance")}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Total Income
              </Typography>
              <Typography variant="h4">{stats.totalIncome}</Typography>
            </StyledStatsCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StyledStatsCard onClick={() => navigate("/reports")}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Documents
              </Typography>
              <Typography variant="h4">{stats.totalDocuments}</Typography>
            </StyledStatsCard>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Module Cards */}
        <Typography variant="h5" component="h2" gutterBottom>
          Quick Access
        </Typography>
        <Box sx={{ mb: 4 }}>
          <DashboardSummary />
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Recent Events & All Events Section */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h5" component="h2" gutterBottom>
              Upcoming Events
            </Typography>

            {loading ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography>Loading events...</Typography>
              </Box>
            ) : upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <StyledEventCard key={event.id}>
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {event.title}
                    </Typography>

                    <IconText>
                      <Calendar size={18} />
                      <Typography variant="body2">{new Date(event.date).toLocaleDateString()}</Typography>
                    </IconText>

                    <IconText>
                      <Clock size={18} />
                      <Typography variant="body2">{event.time}</Typography>
                    </IconText>

                    <IconText>
                      <MapPin size={18} />
                      <Typography variant="body2">{event.location}</Typography>
                    </IconText>

                    <IconText>
                      <Users size={18} />
                      <Typography variant="body2">{event.attendees} attendees</Typography>
                    </IconText>

                    <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                      <Button variant="outlined" color="primary" onClick={() => handleEventClick(event)}>
                        <Eye size={16} sx={{ mr: 1 }} /> View Details
                      </Button>
                      <Button variant="outlined" color="secondary" onClick={() => navigate(`/events/edit/${event.id}`)}>
                        <Edit size={16} sx={{ mr: 1 }} /> Edit
                      </Button>
                    </Box>
                  </CardContent>
                </StyledEventCard>
              ))
            ) : (
              <Box sx={{ textAlign: "center", py: 4, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                <Activity size={40} color="#9e9e9e" style={{ marginBottom: 16 }} />
                <Typography variant="body1" color="textSecondary">
                  No upcoming events scheduled
                </Typography>
                <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => navigate("/events")}>
                  <Plus size={16} sx={{ mr: 1 }} /> Create New Event
                </Button>
              </Box>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Quick Actions
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
                  <Button variant="contained" color="primary" fullWidth onClick={() => handleQuickAction("addMember")}>
                    Add New Member
                  </Button>

                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleQuickAction("scheduleEvent")}
                  >
                    Schedule Event
                  </Button>

                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleQuickAction("recordTransaction")}
                  >
                    Record Transaction
                  </Button>

                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleQuickAction("uploadDocument")}
                  >
                    Upload Document
                  </Button>

                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleQuickAction("generateReport")}
                  >
                    Generate Report
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* All Members Table */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 0 }}>
            Recent Members
          </Typography>
          <Button variant="outlined" color="primary" onClick={() => navigate("/members")} startIcon={<Eye size={16} />}>
            View All
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="members table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Join Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                { id: 1, name: "John Doe", email: "john@example.com", joinDate: "2024-01-10", status: "Active" },
                { id: 2, name: "Jane Smith", email: "jane@example.com", joinDate: "2024-02-15", status: "Active" },
                {
                  id: 3,
                  name: "Robert Johnson",
                  email: "robert@example.com",
                  joinDate: "2024-03-05",
                  status: "Pending",
                },
              ].map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.id}</TableCell>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.joinDate}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        bgcolor: member.status === "Active" ? "success.light" : "warning.light",
                        color: member.status === "Active" ? "success.dark" : "warning.dark",
                        py: 0.5,
                        px: 1,
                        borderRadius: 1,
                        display: "inline-block",
                      }}
                    >
                      {member.status}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Button size="small" variant="outlined" onClick={() => handleViewMember(member.id)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </MainCard>

      {selectedEvent && (
        <EventDetailModal show={isEventModalOpen} onHide={handleCloseEventModal} eventId={selectedEvent} />
      )}

      <UploadDocumentModal
        show={isUploadModalOpen}
        onHide={handleCloseUploadModal}
        eventId={1}
        fetchEvents={() => {
          showSnackbar("Document uploaded successfully")
        }}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default Dashboard

