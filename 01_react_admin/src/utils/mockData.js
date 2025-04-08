/**
 * Initial mock data for the application
 * This will be used to populate localStorage when the app first loads
 */

// Users data
export const users = [
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
    password: "admin123", // In a real app, passwords would be hashed on the backend
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
    password: "editor123",
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
    password: "member123",
  },
]

// Events data
export const events = [
  {
    id: 1,
    title: "Annual General Meeting",
    description: "Yearly meeting to discuss organization goals and achievements.",
    date: "2023-06-15",
    time: "09:00",
    location: "Main Conference Hall",
    attendees: 45,
    image: "/placeholder.svg?height=200&width=300",
    documents: [
      { id: 1, name: "Agenda.pdf", size: 245000, type: "application/pdf", uploadDate: "2023-05-20" },
      {
        id: 2,
        name: "Previous Minutes.docx",
        size: 180000,
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        uploadDate: "2023-05-21",
      },
    ],
  },
  {
    id: 2,
    title: "Community Outreach Workshop",
    description: "Workshop focused on community engagement strategies.",
    date: "2023-07-10",
    time: "14:00",
    location: "Community Center",
    attendees: 30,
    image: "/placeholder.svg?height=200&width=300",
    documents: [],
  },
  {
    id: 3,
    title: "Leadership Training",
    description: "Training session for new committee members.",
    date: "2023-08-05",
    time: "10:00",
    location: "Training Room B",
    attendees: 15,
    image: "/placeholder.svg?height=200&width=300",
    documents: [
      { id: 3, name: "Training Materials.pdf", size: 3500000, type: "application/pdf", uploadDate: "2023-07-28" },
    ],
  },
]

// Members data
export const members = [
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

// Financial transactions data
export const transactions = [
  {
    id: 1,
    type: "income",
    amount: 1500,
    category: "Membership Fees",
    description: "Annual membership renewals",
    date: "2024-03-15",
  },
  {
    id: 2,
    type: "expense",
    amount: 800,
    category: "Venue Rental",
    description: "March event venue booking",
    date: "2024-03-10",
  },
  {
    id: 3,
    type: "income",
    amount: 2500,
    category: "Event Revenue",
    description: "Ticket sales for spring conference",
    date: "2024-03-22",
  },
  {
    id: 4,
    type: "expense",
    amount: 350,
    category: "Marketing",
    description: "Social media advertising",
    date: "2024-03-05",
  },
  {
    id: 5,
    type: "income",
    amount: 1000,
    category: "Donations",
    description: "Corporate sponsorship",
    date: "2024-03-18",
  },
  {
    id: 6,
    type: "expense",
    amount: 120,
    category: "Administrative",
    description: "Office supplies",
    date: "2024-03-08",
  },
  {
    id: 7,
    type: "income",
    amount: 750,
    category: "Membership Fees",
    description: "New member registrations",
    date: "2024-03-25",
  },
]

// Reports data
export const reports = [
  {
    id: 1,
    title: "Annual Organization Report 2023",
    content: "<p>This is the annual report for 2023 detailing our achievements and challenges.</p>",
    category: "Report",
    status: "Published",
    author: "Admin",
    createdAt: "2023-12-15T10:30:00Z",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    title: "New Member Orientation Guide",
    content: "<p>A comprehensive guide for new members joining our organization.</p>",
    category: "Guide",
    status: "Published",
    author: "John Doe",
    createdAt: "2024-01-10T14:45:00Z",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    title: "Upcoming Events for Q2 2024",
    content: "<p>Details about all the events scheduled for the second quarter of 2024.</p>",
    category: "Announcement",
    status: "Draft",
    author: "Jane Smith",
    createdAt: "2024-03-05T09:15:00Z",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    title: "Financial Summary - Q1 2024",
    content: "<p>A summary of our financial performance for the first quarter of 2024.</p>",
    category: "Report",
    status: "Published",
    author: "Finance Team",
    createdAt: "2024-04-02T11:20:00Z",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 5,
    title: "Member Survey Results",
    content: "<p>Results and analysis of our recent member satisfaction survey.</p>",
    category: "Report",
    status: "Draft",
    author: "Research Team",
    createdAt: "2024-02-18T15:40:00Z",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
]

// Messages data
export const messages = [
  {
    id: 1,
    sender: "John Doe",
    email: "john.doe@example.com",
    subject: "Question about upcoming event",
    message:
      "I would like to know more details about the upcoming charity event. What time does it start and is there a dress code?",
    date: "2023-05-15",
    read: true,
    priority: "medium",
  },
  {
    id: 2,
    sender: "Jane Smith",
    email: "jane.smith@example.com",
    subject: "Donation confirmation",
    message:
      "I just made a donation through the website but haven't received a confirmation email. Could you please check if my donation was processed?",
    date: "2023-05-14",
    read: false,
    priority: "high",
  },
  {
    id: 3,
    sender: "Mike Johnson",
    email: "mike.j@example.com",
    subject: "Volunteer application",
    message:
      "I submitted my volunteer application last week and was wondering about the status. I'm very excited to help with the community outreach program.",
    date: "2023-05-12",
    read: true,
    priority: "low",
  },
  {
    id: 4,
    sender: "Sarah Williams",
    email: "sarah.w@example.com",
    subject: "Website feedback",
    message:
      "I noticed that the donation page has some issues on mobile devices. The form doesn't display correctly and it's difficult to complete a donation. Just wanted to let you know!",
    date: "2023-05-10",
    read: false,
    priority: "medium",
  },
  {
    id: 5,
    sender: "Robert Brown",
    email: "robert.b@example.com",
    subject: "Partnership opportunity",
    message:
      "Our company is interested in sponsoring your next event. Could we schedule a call to discuss potential partnership opportunities? We believe our values align well with your organization.",
    date: "2023-05-08",
    read: true,
    priority: "high",
  },
]

// Notifications data
export const notifications = [
  { id: 1, message: "New member registration", time: "5 minutes ago", read: false },
  { id: 2, message: "Upcoming event: Board Meeting", time: "1 hour ago", read: false },
  { id: 3, message: "Financial report is ready", time: "3 hours ago", read: true },
  { id: 4, message: "System maintenance scheduled", time: "1 day ago", read: true },
]

// Initialize all data in localStorage
export const initializeLocalStorage = () => {
  const keys = {
    users: "admin_users",
    events: "admin_events",
    members: "admin_members",
    transactions: "admin_transactions",
    reports: "admin_reports",
    messages: "admin_messages",
    notifications: "admin_notifications",
  }

  // Only initialize if data doesn't exist
  if (!localStorage.getItem(keys.users)) {
    localStorage.setItem(keys.users, JSON.stringify(users))
  }

  if (!localStorage.getItem(keys.events)) {
    localStorage.setItem(keys.events, JSON.stringify(events))
  }

  if (!localStorage.getItem(keys.members)) {
    localStorage.setItem(keys.members, JSON.stringify(members))
  }

  if (!localStorage.getItem(keys.transactions)) {
    localStorage.setItem(keys.transactions, JSON.stringify(transactions))
  }

  if (!localStorage.getItem(keys.reports)) {
    localStorage.setItem(keys.reports, JSON.stringify(reports))
  }

  if (!localStorage.getItem(keys.messages)) {
    localStorage.setItem(keys.messages, JSON.stringify(messages))
  }

  if (!localStorage.getItem(keys.notifications)) {
    localStorage.setItem(keys.notifications, JSON.stringify(notifications))
  }
}

