

import React from "react";
import { Button, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const CadminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="py-3 sticky-top">
      <Navbar.Brand as={Link} to="/cadmindashboard">Admin Panel</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          <Link to="/cadmindashboard">
            <button type="button" className="btn btn-dark me-2">Dashboard</button>
          </Link>

          {/* Users Dropdown */}
          <NavDropdown title="Users" id="users-dropdown" className="me-2">
            <NavDropdown.Item as={Link} to="/manageusers">Manage Users</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/createusers">Create Users</NavDropdown.Item>
          </NavDropdown>

          <Button variant="outline-light me-2" onClick={handleLogout}>
            Logout
          </Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default CadminNavbar;

