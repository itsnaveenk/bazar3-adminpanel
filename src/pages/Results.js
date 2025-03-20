import React, { useState, useEffect, useCallback } from 'react';
import { Card, Table, Button, Form, Row, Col, Modal, Spinner, Alert } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import resultsService from '../services/results';
import teamsService from '../services/teams';
import { FiEdit, FiTrash2, FiPlus, FiFilter } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { formatMySQLDateTime, formatDateTimeDisplay } from '../utils/dateUtils';

const Results = () => {
  // Main data state
  const [results, setResults] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter state
  const [selectedTeam, setSelectedTeam] = useState('');
  
  // Form state
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    team: '',
    result: '',
    result_time: new Date()
  });
  const [editingResultId, setEditingResultId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  
  // Delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingResultId, setDeletingResultId] = useState(null);
  
  const fetchTeams = async () => {
    try {
      const data = await teamsService.getAll();
      setTeams(data);
    } catch (err) {
      console.error('Error fetching teams:', err);
    }
  };
  
  const fetchResults = async () => {
    try {
      setLoading(true);
      let data;
      
      if (selectedTeam) {
        data = await resultsService.getByTeam(selectedTeam);
      } else {
        data = await resultsService.getTodayResults();
      }
      
      setResults(data);
      setError('');
    } catch (err) {
      console.error('Error fetching results:', err);
      setError('Failed to load results. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const initData = async () => {
      await fetchTeams();
      await fetchResults();
    };
    
    initData();
  }, [selectedTeam]); // Refetch when filter changes
  
  const handleOpenCreateModal = () => {
    setEditingResultId(null);
    setFormData({
      team: '',
      result: '',
      result_time: new Date()
    });
    setShowModal(true);
  };
  
  const handleOpenEditModal = (result) => {
    const team = teams.find(t => t.name === result.team || t.name === result.team_name);
    setEditingResultId(result.id);
    setFormData({
      team: team ? team.name : '',
      result: result.result || result.visible_result,
      result_time: new Date(result.result_time)
    });
    setShowModal(true);
  };
  
  const handleOpenDeleteModal = (result) => {
    setDeletingResultId(result.id);
    setShowDeleteModal(true);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, result_time: date }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setFormLoading(true);
      
      // Format date for MySQL
      const formattedData = {
        ...formData,
        result_time: formatMySQLDateTime(formData.result_time)
      };
      
      // Validate the date format
      if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(formattedData.result_time)) {
        toast.error('Invalid date format. Should be YYYY-MM-DD HH:MM:SS');
        setFormLoading(false);
        return;
      }
      
      if (editingResultId) {
        // Update existing result
        await resultsService.update(editingResultId, formattedData);
        toast.success('Result updated successfully');
      } else {
        // Create new result
        await resultsService.publish(formattedData);
        toast.success('Result created successfully');
      }
      
      // Reset form and refresh results
      setShowModal(false);
      setFormData({
        team: '',
        result: '',
        result_time: new Date()
      });
      setEditingResultId(null);
      await fetchResults();
      
    } catch (err) {
      console.error('Error saving result:', err);
      toast.error(err.response?.data?.error || 'Failed to save result');
    } finally {
      setFormLoading(false);
    }
  };
  
  const handleDelete = async () => {
    try {
      setFormLoading(true);
      await resultsService.delete(deletingResultId);
      
      toast.success('Result deleted successfully');
      setShowDeleteModal(false);
      await fetchResults();
      
    } catch (err) {
      console.error('Error deleting result:', err);
      toast.error(err.response?.data?.error || 'Failed to delete result');
    } finally {
      setFormLoading(false);
    }
  };
  
  const handleFilterChange = useCallback((e) => {
    setSelectedTeam(e.target.value);
  }, []);
  
  if (loading && results.length === 0) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading results...</p>
      </div>
    );
  }
  
  return (
    <div className="results-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Results Management</h2>
        <Button variant="primary" onClick={handleOpenCreateModal}>
          <FiPlus className="me-1" /> Add Result
        </Button>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Card className="mb-4">
        <Card.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label><FiFilter className="me-1" /> Filter by Team</Form.Label>
                  <Form.Select 
                    value={selectedTeam} 
                    onChange={handleFilterChange}
                  >
                    <option value="">All Teams</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.name}>
                        {team.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
      
      <Card className="results-table">
        <Card.Body>
          {results.length === 0 ? (
            <Alert variant="info">No results found with the current filter.</Alert>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Team</th>
                  <th>Result</th>
                  <th>Result Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={result.id}>
                    <td>{index + 1}</td>
                    <td>{result.team || result.team_name}</td>
                    <td>
                      {(result.visible_result === '-1' || result.result === '-1') ? (
                        <span className="text-muted">Pending</span>
                      ) : (
                        <span className="text-success fw-bold">
                          {result.visible_result || result.result}
                        </span>
                      )}
                    </td>
                    <td>{formatDateTimeDisplay(result.result_time)}</td>
                    <td>
                      {new Date(result.result_time) > new Date() ? (
                        <span className="badge bg-warning">Scheduled</span>
                      ) : (
                        <span className="badge bg-success">Published</span>
                      )}
                    </td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleOpenEditModal(result)}
                      >
                        <FiEdit />
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleOpenDeleteModal(result)}
                      >
                        <FiTrash2 />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
      
      {/* Create/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingResultId ? 'Edit Result' : 'Create New Result'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Team</Form.Label>
              <Form.Select
                name="team"
                value={formData.team}
                onChange={handleInputChange}
                disabled={formLoading}
                required
              >
                <option value="">Select a team</option>
                {teams.map(team => (
                  <option key={team.id} value={team.name}>
                    {team.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Result</Form.Label>
              <Form.Control
                type="text"
                name="result"
                placeholder="Enter result"
                value={formData.result}
                onChange={handleInputChange}
                disabled={formLoading}
                required
                pattern="[0-9]+"
              />
              <Form.Text className="text-muted">
                Enter numeric result (e.g., 45).
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Result Time</Form.Label>
              <DatePicker
                selected={formData.result_time}
                onChange={handleDateChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={1}  // Changed from 15 to 1 to allow any minute
                timeCaption="Time"
                dateFormat="yyyy-MM-dd HH:mm:ss" // Updated format to match required MySQL format
                className="form-control"
                disabled={formLoading}
                required
              />
              <Form.Text className="text-muted">
                Date and time when the result should be published (Format: YYYY-MM-DD HH:MM:SS, Indian Standard Time).
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)} disabled={formLoading}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={formLoading}>
              {formLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-1"
                  />
                  {editingResultId ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                editingResultId ? 'Update Result' : 'Create Result'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this result? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={formLoading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={formLoading}>
            {formLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-1"
                />
                Deleting...
              </>
            ) : 'Delete Result'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Results;
