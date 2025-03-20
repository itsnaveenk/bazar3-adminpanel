import React from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { FiLogOut } from 'react-icons/fi';

const AdminNavbar = () => {
  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <Navbar className="admin-navbar py-2" expand="lg">
      <Container fluid>
        <Navbar.Brand>Kings Admin Panel</Navbar.Brand>
        <div className="ms-auto">
          <Button variant="outline-secondary" onClick={handleLogout}>
            <FiLogOut className="me-1" /> Logout
          </Button>
        </div>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;
