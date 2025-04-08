import {
  IconDashboard,
  IconCalendarEvent,
  IconUsers,
  IconReportAnalytics,
  IconCoin,
  IconChecklist,
  IconSettings,
  IconMessage,
} from "@tabler/icons-react"

const menuItems = {
  items: [
    {
      id: "dashboard",
      title: "Dashboard",
      type: "item",
      url: "/dashboard",
      icon: IconDashboard,
      breadcrumbs: false,
    },
    {
      id: "events",
      title: "Events",
      type: "item",
      url: "/events",
      icon: IconCalendarEvent,
      breadcrumbs: false,
    },
    {
      id: "members",
      title: "Members",
      type: "item",
      url: "/members",
      icon: IconUsers,
      breadcrumbs: false,
    },
    {
      id: "attendance",
      title: "Attendance",
      type: "item",
      url: "/attendance",
      icon: IconChecklist,
      breadcrumbs: false,
    },
    {
      id: "finance",
      title: "Finance",
      type: "item",
      url: "/finance",
      icon: IconCoin,
      breadcrumbs: false,
    },
    {
      id: "reports",
      title: "Reports",
      type: "item",
      url: "/reports",
      icon: IconReportAnalytics,
      breadcrumbs: false,
    },
    {
      id: "messages",
      title: "Messages",
      type: "item",
      url: "/messages",
      icon: IconMessage,
      breadcrumbs: false,
    },
    {
      id: "settings",
      title: "Settings",
      type: "item",
      url: "/settings",
      icon: IconSettings,
      breadcrumbs: false,
    },
  ],
}

export default menuItems

