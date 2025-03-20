import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/auth';

const Login = () => {
  const [accessKey, setAccessKey] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!accessKey.trim() || !password.trim()) {
      setError('Access key and password are required');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const { token } = await authService.login(accessKey, password);
      login(token);
      
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-page">
      <Card className="auth-card">
        <Card.Header className="bg-primary text-white text-center">
          <h4>Kings Admin Login</h4>
        </Card.Header>
        <Card.Body className="p-4">
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Access Key</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your access key"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                disabled={loading}
              />
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </Form.Group>
            
            <Button 
              variant="primary" 
              type="submit" 
              className="w-100" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Logging in...
                </>
              ) : 'Login'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
