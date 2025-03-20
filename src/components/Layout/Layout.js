import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="admin-layout">
      <Row className="g-0">
        <Col md={2} className="sidebar">
          <Sidebar />
        </Col>
        <Col md={10}>
          <Navbar />
          <Container fluid className="content-area">
            <Outlet />
          </Container>
        </Col>
      </Row>
    </div>
  );
};

export default Layout;
