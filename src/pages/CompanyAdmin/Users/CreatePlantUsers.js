import React, { useState } from "react";
import { Alert, Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Phone, Building, Eye, EyeOff, Users } from 'lucide-react';

function CreatePlantUsers() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [plant, setPlant] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const BASE_URL = process.env.REACT_APP_BASE_URL;


  // Rest of your existing validation and form handling code remains the same
  const validateForm = () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
      setError("Password must be at least 8 characters long and contain at least one letter, one number, and one special character");
      return false;
    }
    if (!/^\d{10}$/.test(phone)) {
      setError("Phone number must be 10 digits");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Invalid email address");
      return false;
    }
    if (role === "plant user" && !plant) {
      setError("Please select a plant");
      return false;
    }
    return true;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    try {
      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          confirmPassword,
          phone,
          role,
          plant: role === "plant user" ? plant : " ",
        }),
      });
  
      const data = await response.json();
  
      if (response.ok && data.message === "User registered successfully") {
        setShowSuccessAlert(true);
        setTimeout(() => {
          navigate("/manageusers");         
        }, 1500);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setError("Registration failed");
    }
  };

  return (
    <div 
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center'
      }}>
      <Container className="d-flex justify-content-center align-items-center">
        <div className="card shadow-lg" 
          style={{ 
            maxWidth: '500px', 
            width: '100%', 
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderRadius: '15px',
            padding: '30px'
          }}>
          <h2 className="text-center text-primary mb-4">Register Users</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleRegister}>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <User size={20} />
                </span>
                <Form.Control 
                  type="text" 
                  placeholder="Enter username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                />
              </div>
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <Mail size={20} />
                </span>
                <Form.Control 
                  type="email" 
                  placeholder="Enter email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <Lock size={20} />
                </span>
                <Form.Control 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
                <button
                  type="button"
                  className="input-group-text"
                  onClick={togglePasswordVisibility}
                  style={{ cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </Form.Group>

            <Form.Group controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <Lock size={20} />
                </span>
                <Form.Control 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="Confirm password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                />
                <button
                  type="button"
                  className="input-group-text"
                  onClick={toggleConfirmPasswordVisibility}
                  style={{ cursor: 'pointer' }}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </Form.Group>

            <Form.Group controlId="phone">
              <Form.Label>Phone Number</Form.Label>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <Phone size={20} />
                </span>
                <Form.Control 
                  type="tel" 
                  placeholder="Enter phone number" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  required 
                />
              </div>
            </Form.Group>

            <Form.Group controlId="role">
              <Form.Label>Role</Form.Label>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <Users size={20} />
                </span>
                <Form.Control 
                  as="select" 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)} 
                  required
                >
                  <option value="">Select Role</option>
                  <option value="plant user">Plant User</option>
                  <option value="cut in">Cut In</option>
                </Form.Control>
              </div>
            </Form.Group>

            {role === "plant user" && (
              <Form.Group controlId="plant">
                <Form.Label>Plant</Form.Label>
                <div className="input-group mb-3">
                  <span className="input-group-text">
                    <Building size={20} />
                  </span>
                  <Form.Control 
                    as="select" 
                    value={plant} 
                    onChange={(e) => setPlant(e.target.value)} 
                    required
                  >
                    <option value="">Select Plant</option>
                    <option value="CTM-D">CTM-D</option>
                    <option value="CTM-P">CTM-P</option>
                    <option value="CTM-M">CTM-M</option>
                  </Form.Control>
                </div>
              </Form.Group>
            )}

            <Button variant="primary" type="submit" className="w-100 py-2 mb-3">Register</Button>
          </Form>
        </div>
      </Container>

      <Alert show={showSuccessAlert} variant="success" className="position-absolute top-50 start-50 translate-middle">
        User created successfully
      </Alert>
    </div>
  );
}

export default CreatePlantUsers;