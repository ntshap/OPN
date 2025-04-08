"use client"

import PropTypes from "prop-types"
import { useContext, useEffect, useState } from "react"
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom"
import {
  Users,
  Calendar,
  DollarSign,
  FileText,
  Settings,
  MessageSquare,
  CheckSquare,
  Menu,
  Search,
  Bell,
  User,
  LogOut,
  ChevronDown,
  BarChart2,
  Shield,
} from "lucide-react"
import axios from "axios"

import useWindowSize from "../../hooks/useWindowSize"
import { ConfigContext } from "../../contexts/ConfigContext"
import * as actionType from "../../store/actions"

const Sidebar = ({ isCollapsed, toggleCollapse }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const menuItems = [
    {
      icon: <Calendar className="w-5 h-5" />,
      label: "Events & Activities",
      path: "/events",
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Member Management",
      path: "/members",
    },
    {
      icon: <CheckSquare className="w-5 h-5" />,
      label: "Attendance Tracking",
      path: "/attendance",
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      label: "Financial Management",
      path: "/finance",
    },
    {
      icon: <FileText className="w-5 h-5" />,
      label: "Meeting Minutes",
      path: "/reports",
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      label: "Messages",
      path: "/messages",
    },
    {
      icon: <BarChart2 className="w-5 h-5" />,
      label: "Analytics",
      path: "/analytics",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      label: "Admin Users",
      path: "/admin/users",
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
      path: "/settings",
    },
  ]

  const handleNavigation = (path, e) => {
    e.preventDefault()
    navigate(path)
  }

  return (
    <div
      className={`bg-[#1e3a8a] text-white h-screen ${
        isCollapsed ? "w-20" : "w-64"
      } transition-all duration-300 ease-in-out fixed left-0 top-0 z-10`}
    >
      <div className="p-6 flex items-center justify-between">
        <Link to="/" className="text-white no-underline">
          <h1 className={`text-2xl font-bold ${isCollapsed ? "hidden" : "block"}`}>eProduct</h1>
          <span className={`text-2xl font-bold ${isCollapsed ? "block" : "hidden"}`}>eP</span>
        </Link>
        <button onClick={toggleCollapse} className="p-1 rounded-md hover:bg-white/10 lg:hidden">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <nav className="mt-6">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            onClick={(e) => handleNavigation(item.path, e)}
            className={`
              flex items-center px-6 py-3.5 text-sm font-medium
              ${location.pathname.includes(item.path.split("/").pop()) ? "bg-white/10 border-l-4 border-white" : "hover:bg-white/5"}
              ${isCollapsed ? "justify-center" : "space-x-4"}
              transition-all duration-200
            `}
          >
            <div className={isCollapsed ? "mx-auto" : ""}>{item.icon}</div>
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  )
}

const Header = ({ onToggleSidebar, onLogout, username, role, isCollapsed }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const navigate = useNavigate()

  const notifications = [
    { id: 1, message: "New member registration", time: "5 minutes ago", read: false },
    { id: 2, message: "Upcoming event: Board Meeting", time: "1 hour ago", read: false },
    { id: 3, message: "Financial report is ready", time: "3 hours ago", read: true },
    { id: 4, message: "System maintenance scheduled", time: "1 day ago", read: true },
  ]

  const handleProfileClick = (path) => {
    setShowProfileMenu(false)
    navigate(path)
  }

  return (
    <header
      className={`bg-white border-b h-16 flex items-center justify-between px-6 fixed top-0 right-0 z-10 ${isCollapsed ? "left-20" : "left-64"} transition-all duration-300`}
    >
      <div className="flex items-center space-x-4">
        <button onClick={onToggleSidebar} className="p-2 rounded-lg hover:bg-gray-100 lg:hidden">
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            className="relative p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-20 border">
              <div className="px-4 py-2 border-b">
                <p className="text-sm font-medium">Notifications</p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 border-b hover:bg-gray-50 cursor-pointer ${notification.read ? "" : "bg-blue-50"}`}
                  >
                    <p className="text-sm mb-1">{notification.message}</p>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 text-center">
                <button className="text-sm text-blue-600 hover:text-blue-800">Mark all as read</button>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-3 text-gray-700 p-2 rounded-lg hover:bg-gray-100"
          >
            <div className="w-8 h-8 rounded-full bg-[#1e3a8a] flex items-center justify-center text-white">
              {username ? username.charAt(0).toUpperCase() : "A"}
            </div>
            <span className="text-sm font-medium hidden md:block">{username || "Admin User"}</span>
            <ChevronDown className="w-4 h-4 hidden md:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border">
              <div className="px-4 py-2 border-b">
                <p className="text-sm font-medium">{username || "Admin User"}</p>
                <p className="text-xs text-gray-500">{role || "Administrator"}</p>
              </div>
              <button
                onClick={() => handleProfileClick("/profile")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </div>
              </button>
              <button
                onClick={() => handleProfileClick("/settings")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </div>
              </button>
              <div className="border-t">
                <button
                  onClick={onLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [user, setUser] = useState(null)
  const windowSize = useWindowSize()
  const configContext = useContext(ConfigContext)
  const { dispatch } = configContext
  const navigate = useNavigate()

  useEffect(() => {
    // Collapse sidebar on mobile by default
    if (windowSize.width < 1024) {
      setSidebarCollapsed(true)
    }

    // Get user data from API using token instead of localStorage
    const token = localStorage.getItem("token")
    if (token) {
      // In a real implementation, this would be an API call using the token
      // For now, we'll set a placeholder user
      setUser({
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin'
      })
    }
  }, [windowSize.width])

  useEffect(() => {
    if (windowSize.width > 992 && windowSize.width <= 1024) {
      dispatch({ type: actionType.COLLAPSE_MENU })
    }

    if (windowSize.width < 992) {
      dispatch({ type: actionType.CHANGE_LAYOUT, layout: "vertical" })
    }
  }, [dispatch, windowSize])

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
    // No need to remove user as we don't store it anymore
    delete axios.defaults.headers.common["Authorization"]
    navigate("/login")
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isCollapsed={sidebarCollapsed} toggleCollapse={toggleSidebar} />

      <div className={`flex-1 flex flex-col ${sidebarCollapsed ? "ml-20" : "ml-64"} transition-all duration-300`}>
        <Header
          onToggleSidebar={toggleSidebar}
          onLogout={handleLogout}
          username={user?.username}
          role={user?.role}
          isCollapsed={sidebarCollapsed}
        />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6 mt-16">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

AdminLayout.propTypes = {
  children: PropTypes.node,
}

Sidebar.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  toggleCollapse: PropTypes.func.isRequired,
}

Header.propTypes = {
  onToggleSidebar: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  username: PropTypes.string,
  role: PropTypes.string,
  isCollapsed: PropTypes.bool.isRequired,
}

export default AdminLayout

