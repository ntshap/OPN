import { Grid, Card, CardContent, Typography, Box, Button } from "@mui/material"
import { styled } from "@mui/material/styles"
import { PieChart, BarChart, CalendarClock, Users, FileText } from "lucide-react"
import { Link } from "react-router-dom"

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[4],
  },
}))

const IconWrapper = styled(Box)(({ theme, color }) => ({
  backgroundColor: color,
  borderRadius: "50%",
  width: 48,
  height: 48,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(2),
  color: "#fff",
}))

const DashboardSummary = () => {
  const modules = [
    {
      title: "Member Management",
      description: "Manage organization members",
      icon: <Users size={24} />,
      color: "#1976d2",
      link: "/members",
    },
    {
      title: "Events & Activities",
      description: "Schedule and manage events",
      icon: <CalendarClock size={24} />,
      color: "#2196f3",
      link: "/events",
    },
    {
      title: "Attendance Tracking",
      description: "Track member attendance",
      icon: <BarChart size={24} />,
      color: "#42a5f5",
      link: "/attendance",
    },
    {
      title: "Financial Management",
      description: "Track income and expenses",
      icon: <PieChart size={24} />,
      color: "#64b5f6",
      link: "/finance",
    },
    {
      title: "Meeting Minutes & Reports",
      description: "Document meetings and reports",
      icon: <FileText size={24} />,
      color: "#90caf9",
      link: "/reports",
    },
  ]

  return (
    <Grid container spacing={3}>
      {modules.map((module, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <StyledCard>
            <CardContent sx={{ textAlign: "center", p: 3 }}>
              <IconWrapper color={module.color}>{module.icon}</IconWrapper>
              <Typography variant="h5" component="h2" gutterBottom>
                {module.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {module.description}
              </Typography>
              <Button component={Link} to={module.link} variant="outlined" color="primary" fullWidth>
                Access
              </Button>
            </CardContent>
          </StyledCard>
        </Grid>
      ))}
    </Grid>
  )
}

export default DashboardSummary

