import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Modal, Spinner, Alert } from 'react-bootstrap';
import teamsService from '../services/teams';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form state
  const [showModal, setShowModal] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  
  // Delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingTeamId, setDeletingTeamId] = useState(null);
  const [deletingTeamName, setDeletingTeamName] = useState('');
  
  const fetchTeams = async () => {
    try {
      setLoading(true);
      const data = await teamsService.getAll();
      setTeams(data);
      setError('');
    } catch (err) {
      console.error('Error fetching teams:', err);
      setError('Failed to load teams. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTeams();
  }, []);
  
  const handleOpenCreateModal = () => {
    setEditingTeamId(null);
    setTeamName('');
    setShowModal(true);
  };
  
  const handleOpenEditModal = (team) => {
    setEditingTeamId(team.id);
    setTeamName(team.name);
    setShowModal(true);
  };
  
  const handleOpenDeleteModal = (team) => {
    setDeletingTeamId(team.id);
    setDeletingTeamName(team.name);
    setShowDeleteModal(true);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!teamName.trim()) {
      toast.error('Team name is required');
      return;
    }
    
    try {
      setFormLoading(true);
      
      if (editingTeamId) {
        // Update existing team
        await teamsService.update(editingTeamId, { name: teamName });
        toast.success('Team updated successfully');
      } else {
        // Create new team
        await teamsService.create({ name: teamName });
        toast.success('Team created successfully');
      }
      
      // Reset form and refresh teams
      setShowModal(false);
      setTeamName('');
      setEditingTeamId(null);
      await fetchTeams();
      
    } catch (err) {
      console.error('Error saving team:', err);
      toast.error(err.response?.data?.error || 'Failed to save team');
    } finally {
      setFormLoading(false);
    }
  };
  
  const handleDelete = async () => {
    try {
      setFormLoading(true);
      await teamsService.delete(deletingTeamId);
      
      toast.success('Team deleted successfully');
      setShowDeleteModal(false);
      await fetchTeams();
      
    } catch (err) {
      console.error('Error deleting team:', err);
      toast.error(err.response?.data?.error || 'Failed to delete team');
    } finally {
      setFormLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading teams...</p>
      </div>
    );
  }
  
  return (
    <div className="teams-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Teams Management</h2>
        <Button variant="primary" onClick={handleOpenCreateModal}>
          <FiPlus className="me-1" /> Add Team
        </Button>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Card className="teams-table">
        <Card.Body>
          {teams.length === 0 ? (
            <Alert variant="info">No teams found. Create a new team to get started.</Alert>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Team Name</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team, index) => (
                  <tr key={team.id}>
                    <td>{index + 1}</td>
                    <td>{team.name}</td>
                    <td>{new Date(team.created_at).toLocaleString('en-IN', {timeZone: 'Asia/Kolkata'})}</td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleOpenEditModal(team)}
                      >
                        <FiEdit />
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleOpenDeleteModal(team)}
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
          <Modal.Title>{editingTeamId ? 'Edit Team' : 'Create New Team'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Team Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter team name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                disabled={formLoading}
                required
              />
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
                  {editingTeamId ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                editingTeamId ? 'Update Team' : 'Create Team'
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
          Are you sure you want to delete the team <strong>{deletingTeamName}</strong>? 
          This action cannot be undone.
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
            ) : 'Delete Team'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Teams;
