import { lazy, Suspense } from "react"
import { Route, Routes, Navigate } from "react-router-dom"
import PrivateRoutes from "./PrivateRoutes"
import AdminLayout from "./layouts/AdminLayout"
import Loader from "./components/Loader/Loader"

// Authentication pages
const SignIn1 = lazy(() => import("./views/auth/signin/SignIn1"))
const SignUp1 = lazy(() => import("./views/auth/signup/SignUp1"))

// Dashboard pages
const Dashboard = lazy(() => import("./views/dashboard/index"))

// Feature pages
const Events = lazy(() => import("./views/Events/index"))
const Finance = lazy(() => import("./views/finance/index"))
const Reports = lazy(() => import("./views/reports/index"))
const Members = lazy(() => import("./views/members/index"))
const Attendance = lazy(() => import("./views/attendance/index"))
const Messages = lazy(() => import("./views/messages/index"))
const Settings = lazy(() => import("./views/settings/index"))
const Analytics = lazy(() => import("./views/analytics/index"))
const AdminUsers = lazy(() => import("./views/admin/users/index"))

// Sample pages for testing
const SamplePage = lazy(() => import("./views/extra/SamplePage"))

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<SignIn1 />} />
        <Route path="/auth/signin-1" element={<SignIn1 />} />
        <Route path="/auth/signin" element={<SignIn1 />} />
        <Route path="/auth/signup-1" element={<SignUp1 />} />
        <Route path="/auth/signup" element={<SignUp1 />} />

        {/* Protected routes */}
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="app/dashboard/default" element={<Dashboard />} />

            {/* Feature routes */}
            <Route path="events" element={<Events />} />
            <Route path="app/events" element={<Events />} />
            <Route path="events/edit/:id" element={<Events />} />
            <Route path="events/:id" element={<Events />} />

            <Route path="finance" element={<Finance />} />
            <Route path="app/finance" element={<Finance />} />

            <Route path="reports" element={<Reports />} />
            <Route path="app/reports" element={<Reports />} />
            <Route path="reports/:id" element={<Reports />} />

            <Route path="members" element={<Members />} />
            <Route path="app/members" element={<Members />} />
            <Route path="members/add" element={<Members />} />
            <Route path="members/:id" element={<Members />} />

            <Route path="attendance" element={<Attendance />} />
            <Route path="app/attendance" element={<Attendance />} />

            <Route path="messages" element={<Messages />} />
            <Route path="app/messages" element={<Messages />} />

            <Route path="settings" element={<Settings />} />
            <Route path="app/settings" element={<Settings />} />

            <Route path="analytics" element={<Analytics />} />
            <Route path="app/analytics" element={<Analytics />} />

            <Route path="admin/users" element={<AdminUsers />} />
            <Route path="app/admin/users" element={<AdminUsers />} />

            {/* Sample page */}
            <Route path="sample-page" element={<SamplePage />} />
          </Route>
        </Route>

        {/* Fallback for 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes

