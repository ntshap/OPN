"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Card, Form, Button, Alert, Spinner } from "react-bootstrap"
import { loginUser } from "../../../utils/authUtils"

const JWTLogin = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Basic validation
    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }

    setError("")
    setLoading(true)

    try {
      await loginUser(email, password)
      navigate("/dashboard")
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-content">
        <div className="auth-bg">
          <span className="r" />
          <span className="r s" />
          <span className="r s" />
          <span className="r" />
        </div>
        <Card className="borderless">
          <div className="text-center">
            <div className="mb-4">
              <i className="feather icon-unlock auth-icon" />
            </div>
            <h3 className="mb-4">Login</h3>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <Form.Check type="checkbox" label="Remember me" id="remember-me" />
                <Link to="/auth/reset-password">Forgot password?</Link>
              </div>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mb-4" disabled={loading}>
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" className="me-2" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </Form>

          <p className="mb-0 text-center">
            Don't have an account? <Link to="/auth/signup">Sign up</Link>
          </p>

          {/* Demo credentials helper */}
          <div className="mt-3 p-2 bg-light rounded">
            <p className="mb-1 text-center">
              <small>Demo Credentials:</small>
            </p>
            <p className="mb-0 text-center">
              <small>Email: john.doe@example.com</small>
            </p>
            <p className="mb-0 text-center">
              <small>Password: admin123</small>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default JWTLogin

