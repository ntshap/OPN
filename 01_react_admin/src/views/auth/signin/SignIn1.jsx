"use client"

import { useState } from "react"
import { Card, Form, Button, Alert } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { Mail, Lock, LogIn } from "lucide-react"

const SignIn1 = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Make API call to login
      const response = await axios.post("https://backend-project-pemuda.onrender.com/api/v1/auth/login", {
        email,
        password,
      })

      if (response.data && response.data.token) {
        // Store only the token in localStorage, not user data
        localStorage.setItem("token", response.data.token)

        // Set default authorization header for future requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`

        // Redirect to dashboard
        navigate("/app/dashboard/default")
      } else {
        throw new Error("Invalid response from server")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError(err.response?.data?.message || "Failed to login. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-content">
        <div className="auth-bg">
          <span className="r"></span>
          <span className="r s"></span>
          <span className="r s"></span>
          <span className="r"></span>
        </div>
        <Card className="borderless shadow-lg">
          <div className="card-body text-center">
            <div className="mb-4">
              <i className="feather icon-unlock auth-icon"></i>
            </div>
            <h3 className="mb-4">Login</h3>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <div className="input-group">
                  <span className="input-group-text">
                    <Mail size={16} />
                  </span>
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-4">
                <div className="input-group">
                  <span className="input-group-text">
                    <Lock size={16} />
                  </span>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <Form.Check type="checkbox" label="Remember me" id="remember-me" />
                  <Link to="/auth/reset-password" className="text-decoration-none">
                    Forgot password?
                  </Link>
                </div>
              </Form.Group>

              <Button variant="primary" type="submit" className="btn-block mb-4" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn size={16} className="me-2" /> Login
                  </>
                )}
              </Button>

              <p className="mb-2">
                Don't have an account?{" "}
                <Link to="/auth/signup-1" className="text-decoration-none">
                  Sign up
                </Link>
              </p>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default SignIn1

