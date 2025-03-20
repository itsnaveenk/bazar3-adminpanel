import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Alert, Spinner } from 'react-bootstrap';
import resultsService from '../services/results';
import teamsService from '../services/teams';
import { formatDateTimeDisplay } from '../utils/dateUtils';

const Dashboard = () => {
  const [todayResults, setTodayResults] = useState([]);
  const [teamCount, setTeamCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Get today's results
        const results = await resultsService.getTodayResults();
        setTodayResults(results);
        
        // Get team count
        const teams = await teamsService.getAll();
        setTeamCount(teams.length);
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading dashboard data...</p>
      </div>
    );
  }
  
  return (
    <div className="dashboard-container">
      <h2 className="mb-4">Dashboard</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Row className="mb-4">
        <Col md={6}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Team Statistics</Card.Title>
              <div className="d-flex align-items-center justify-content-center" style={{ height: "150px" }}>
                <div className="text-center">
                  <h1 className="display-1 text-primary">{teamCount}</h1>
                  <p className="lead">Total Teams</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Today's Results</Card.Title>
              <div className="d-flex align-items-center justify-content-center" style={{ height: "150px" }}>
                <div className="text-center">
                  <h1 className="display-1 text-primary">{todayResults.length}</h1>
                  <p className="lead">Results Published Today</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Card>
        <Card.Body>
          <Card.Title>Today's Results</Card.Title>
          
          {todayResults.length === 0 ? (
            <Alert variant="info">No results available for today.</Alert>
          ) : (
            <Row className="g-3">
              {todayResults.map((result) => (
                <Col key={result.id} md={4}>
                  <Card className="result-card">
                    <Card.Body>
                      <h5 className="card-title">{result.team}</h5>
                      <p className="mb-1">
                        <strong>Result:</strong>{' '}
                        {result.visible_result === '-1' 
                          ? 'Pending'
                          : <span className="text-success fw-bold">{result.visible_result}</span>
                        }
                      </p>
                      <p className="mb-0 text-muted small">
                        <strong>Time:</strong> {formatDateTimeDisplay(result.result_time)}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Dashboard;
