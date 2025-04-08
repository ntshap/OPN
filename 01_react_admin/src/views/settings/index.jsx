"use client"

import { useState } from "react"
import { Card, Tab, Nav, Form, Button, Row, Col, Alert, Spinner } from "react-bootstrap"
import { User, Lock, Bell, Palette, Globe, Shield, Save } from "lucide-react"

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile")
  const [isLoading, setIsLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [formData, setFormData] = useState({
    // Profile settings
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    bio: "Administrator with 5+ years of experience.",

    // Security settings
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: true,

    // Notification settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyDigest: true,

    // Appearance settings
    theme: "light",
    fontSize: "medium",
    colorScheme: "blue",

    // Regional settings
    language: "en",
    timeZone: "UTC-5",
    dateFormat: "MM/DD/YYYY",

    // Privacy settings
    profileVisibility: "all",
    activityVisibility: "members",
    contactInfoVisibility: "admin",
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setSaveSuccess(true)

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    }, 1000)
  }

  return (
    <div className="settings-page">
      <h1 className="h3 mb-4">Settings</h1>

      {saveSuccess && (
        <Alert variant="success" onClose={() => setSaveSuccess(false)} dismissible>
          Settings saved successfully!
        </Alert>
      )}

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
            <Row className="g-0">
              <Col md={3} className="border-end">
                <Nav variant="pills" className="flex-column p-3">
                  <Nav.Item>
                    <Nav.Link eventKey="profile" className="d-flex align-items-center">
                      <User size={18} className="me-2" />
                      Profile
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="security" className="d-flex align-items-center">
                      <Lock size={18} className="me-2" />
                      Security
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="notifications" className="d-flex align-items-center">
                      <Bell size={18} className="me-2" />
                      Notifications
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="appearance" className="d-flex align-items-center">
                      <Palette size={18} className="me-2" />
                      Appearance
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="regional" className="d-flex align-items-center">
                      <Globe size={18} className="me-2" />
                      Regional
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="privacy" className="d-flex align-items-center">
                      <Shield size={18} className="me-2" />
                      Privacy
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col md={9}>
                <Tab.Content className="p-4">
                  <Tab.Pane eventKey="profile">
                    <h4 className="mb-4">Profile Settings</h4>
                    <Form onSubmit={handleSubmit}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="email" value={formData.email} onChange={handleInputChange} />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleInputChange} />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Bio</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <div className="d-flex justify-content-end">
                        <Button
                          type="submit"
                          variant="primary"
                          disabled={isLoading}
                          className="d-flex align-items-center"
                        >
                          {isLoading ? (
                            <>
                              <Spinner size="sm" className="me-2" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save size={16} className="me-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </Form>
                  </Tab.Pane>

                  <Tab.Pane eventKey="security">
                    <h4 className="mb-4">Security Settings</h4>
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label>Current Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Confirm New Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="switch"
                          id="two-factor"
                          label="Enable Two-Factor Authentication"
                          name="twoFactorEnabled"
                          checked={formData.twoFactorEnabled}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <div className="d-flex justify-content-end">
                        <Button
                          type="submit"
                          variant="primary"
                          disabled={isLoading}
                          className="d-flex align-items-center"
                        >
                          {isLoading ? (
                            <>
                              <Spinner size="sm" className="me-2" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save size={16} className="me-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </Form>
                  </Tab.Pane>

                  <Tab.Pane eventKey="notifications">
                    <h4 className="mb-4">Notification Settings</h4>
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="switch"
                          id="email-notifications"
                          label="Email Notifications"
                          name="emailNotifications"
                          checked={formData.emailNotifications}
                          onChange={handleInputChange}
                        />
                        <Form.Text className="text-muted">Receive notifications via email</Form.Text>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="switch"
                          id="sms-notifications"
                          label="SMS Notifications"
                          name="smsNotifications"
                          checked={formData.smsNotifications}
                          onChange={handleInputChange}
                        />
                        <Form.Text className="text-muted">Receive notifications via SMS</Form.Text>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="switch"
                          id="push-notifications"
                          label="Push Notifications"
                          name="pushNotifications"
                          checked={formData.pushNotifications}
                          onChange={handleInputChange}
                        />
                        <Form.Text className="text-muted">Receive push notifications</Form.Text>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="switch"
                          id="weekly-digest"
                          label="Weekly Digest"
                          name="weeklyDigest"
                          checked={formData.weeklyDigest}
                          onChange={handleInputChange}
                        />
                        <Form.Text className="text-muted">Receive a weekly summary of activities</Form.Text>
                      </Form.Group>
                      <div className="d-flex justify-content-end">
                        <Button
                          type="submit"
                          variant="primary"
                          disabled={isLoading}
                          className="d-flex align-items-center"
                        >
                          {isLoading ? (
                            <>
                              <Spinner size="sm" className="me-2" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save size={16} className="me-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </Form>
                  </Tab.Pane>

                  <Tab.Pane eventKey="appearance">
                    <h4 className="mb-4">Appearance Settings</h4>
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label>Theme</Form.Label>
                        <Form.Select name="theme" value={formData.theme} onChange={handleInputChange}>
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="system">System Default</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Font Size</Form.Label>
                        <Form.Select name="fontSize" value={formData.fontSize} onChange={handleInputChange}>
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>
                          <option value="large">Large</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Color Scheme</Form.Label>
                        <Form.Select name="colorScheme" value={formData.colorScheme} onChange={handleInputChange}>
                          <option value="blue">Blue</option>
                          <option value="green">Green</option>
                          <option value="purple">Purple</option>
                          <option value="orange">Orange</option>
                        </Form.Select>
                      </Form.Group>
                      <div className="d-flex justify-content-end">
                        <Button
                          type="submit"
                          variant="primary"
                          disabled={isLoading}
                          className="d-flex align-items-center"
                        >
                          {isLoading ? (
                            <>
                              <Spinner size="sm" className="me-2" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save size={16} className="me-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </Form>
                  </Tab.Pane>

                  <Tab.Pane eventKey="regional">
                    <h4 className="mb-4">Regional Settings</h4>
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label>Language</Form.Label>
                        <Form.Select name="language" value={formData.language} onChange={handleInputChange}>
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Time Zone</Form.Label>
                        <Form.Select name="timeZone" value={formData.timeZone} onChange={handleInputChange}>
                          <option value="UTC-12">UTC-12:00</option>
                          <option value="UTC-11">UTC-11:00</option>
                          <option value="UTC-10">UTC-10:00</option>
                          <option value="UTC-9">UTC-09:00</option>
                          <option value="UTC-8">UTC-08:00</option>
                          <option value="UTC-7">UTC-07:00</option>
                          <option value="UTC-6">UTC-06:00</option>
                          <option value="UTC-5">UTC-05:00</option>
                          <option value="UTC-4">UTC-04:00</option>
                          <option value="UTC-3">UTC-03:00</option>
                          <option value="UTC-2">UTC-02:00</option>
                          <option value="UTC-1">UTC-01:00</option>
                          <option value="UTC+0">UTC+00:00</option>
                          <option value="UTC+1">UTC+01:00</option>
                          <option value="UTC+2">UTC+02:00</option>
                          <option value="UTC+3">UTC+03:00</option>
                          <option value="UTC+4">UTC+04:00</option>
                          <option value="UTC+5">UTC+05:00</option>
                          <option value="UTC+6">UTC+06:00</option>
                          <option value="UTC+7">UTC+07:00</option>
                          <option value="UTC+8">UTC+08:00</option>
                          <option value="UTC+9">UTC+09:00</option>
                          <option value="UTC+10">UTC+10:00</option>
                          <option value="UTC+11">UTC+11:00</option>
                          <option value="UTC+12">UTC+12:00</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Date Format</Form.Label>
                        <Form.Select name="dateFormat" value={formData.dateFormat} onChange={handleInputChange}>
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </Form.Select>
                      </Form.Group>
                      <div className="d-flex justify-content-end">
                        <Button
                          type="submit"
                          variant="primary"
                          disabled={isLoading}
                          className="d-flex align-items-center"
                        >
                          {isLoading ? (
                            <>
                              <Spinner size="sm" className="me-2" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save size={16} className="me-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </Form>
                  </Tab.Pane>

                  <Tab.Pane eventKey="privacy">
                    <h4 className="mb-4">Privacy Settings</h4>
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label>Profile Visibility</Form.Label>
                        <Form.Select
                          name="profileVisibility"
                          value={formData.profileVisibility}
                          onChange={handleInputChange}
                        >
                          <option value="all">Everyone</option>
                          <option value="members">Members Only</option>
                          <option value="admin">Administrators Only</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Activity Visibility</Form.Label>
                        <Form.Select
                          name="activityVisibility"
                          value={formData.activityVisibility}
                          onChange={handleInputChange}
                        >
                          <option value="all">Everyone</option>
                          <option value="members">Members Only</option>
                          <option value="admin">Administrators Only</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Contact Information Visibility</Form.Label>
                        <Form.Select
                          name="contactInfoVisibility"
                          value={formData.contactInfoVisibility}
                          onChange={handleInputChange}
                        >
                          <option value="all">Everyone</option>
                          <option value="members">Members Only</option>
                          <option value="admin">Administrators Only</option>
                        </Form.Select>
                      </Form.Group>
                      <div className="d-flex justify-content-end">
                        <Button
                          type="submit"
                          variant="primary"
                          disabled={isLoading}
                          className="d-flex align-items-center"
                        >
                          {isLoading ? (
                            <>
                              <Spinner size="sm" className="me-2" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save size={16} className="me-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </Form>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Card.Body>
      </Card>
    </div>
  )
}

export default Settings

