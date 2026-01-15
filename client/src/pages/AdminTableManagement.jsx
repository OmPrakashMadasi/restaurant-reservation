// src/pages/AdminTableManagement.jsx
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../api/axios';

function AdminTableManagement() {
  const [tables, setTables] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    capacity: 2
  });

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const res = await api.get('/admin/tables');
      setTables(res.data);
    } catch (err) {
      toast.error('Failed to load tables');
    }
  };

  const handleOpenModal = (table = null) => {
    if (table) {
      setEditingTable(table);
      setFormData({
        name: table.name,
        capacity: table.capacity
      });
    } else {
      setEditingTable(null);
      setFormData({
        name: '',
        capacity: 2
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTable(null);
    setFormData({ name: '', capacity: 2 });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingTable) {
        // Update existing table
        await api.patch(`/admin/tables/${editingTable._id}`, formData);
        toast.success('Table updated successfully');
      } else {
        // Create new table
        await api.post('/admin/tables', formData);
        toast.success('Table created successfully');
      }
      
      handleCloseModal();
      fetchTables();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (table) => {
    try {
      await api.patch(`/admin/tables/${table._id}`, {
        isAvailable: !table.isAvailable
      });
      toast.success(`Table ${table.isAvailable ? 'disabled' : 'enabled'}`);
      fetchTables();
    } catch (err) {
      toast.error('Failed to update table');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? This cannot be undone.')) return;

    try {
      await api.delete(`/admin/tables/${id}`);
      toast.success('Table deleted successfully');
      fetchTables();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete table');
    }
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>Table Management</h2>
          <p className="text-muted">Manage restaurant tables and seating capacity</p>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={() => handleOpenModal()}>
            <i className="bi bi-plus-circle me-2"></i>
            Add New Table
          </Button>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Header className="bg-dark text-white">
          <h5 className="mb-0">All Tables ({tables.length})</h5>
        </Card.Header>
        <Card.Body>
          {tables.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-inbox empty-state-icon"></i>
              <p className="mt-3">No tables available. Add your first table!</p>
            </div>
          ) : (
            <Table responsive hover>
              <thead className="table-light">
                <tr>
                  <th>Table Name</th>
                  <th>Capacity</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tables.map((table) => (
                  <tr key={table._id}>
                    <td>
                      <strong>{table.name}</strong>
                    </td>
                    <td>
                      <i className="bi bi-people-fill me-1"></i>
                      {table.capacity} seats
                    </td>
                    <td>
                      <Badge bg={table.isAvailable ? 'success' : 'secondary'}>
                        {table.isAvailable ? 'Available' : 'Unavailable'}
                      </Badge>
                    </td>
                    <td>
                      <small className="text-muted">
                        {new Date(table.createdAt).toLocaleDateString('en-IN')}
                      </small>
                    </td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleOpenModal(table)}
                      >
                        <i className="bi bi-pencil"></i> Edit
                      </Button>
                      <Button 
                        variant={table.isAvailable ? 'outline-warning' : 'outline-success'}
                        size="sm" 
                        className="me-2"
                        onClick={() => handleToggleAvailability(table)}
                      >
                        <i className={`bi bi-${table.isAvailable ? 'pause' : 'play'}-circle`}></i>
                        {table.isAvailable ? ' Disable' : ' Enable'}
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDelete(table._id)}
                      >
                        <i className="bi bi-trash"></i> Delete
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
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingTable ? 'Edit Table' : 'Add New Table'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Table Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="e.g., Table 9, VIP Table 1"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <Form.Text className="text-muted">
                Must be unique and descriptive
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Seating Capacity *</Form.Label>
              <Form.Control
                type="number"
                name="capacity"
                min="1"
                max="8"
                value={formData.capacity}
                onChange={handleChange}
                required
              />
              <Form.Text className="text-muted">
                Maximum number of guests (1-8)
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Saving...' : (editingTable ? 'Update Table' : 'Create Table')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default AdminTableManagement;
