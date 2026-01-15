// src/pages/CustomerDashboard.jsx
import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Table, Alert, Modal, Form } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { toast } from 'react-toastify';
function CustomerDashboard() {
  const { user } = useContext(AuthContext);
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingTables, setLoadingTables] = useState(false);
  
  const [formData, setFormData] = useState({
    date: '',
    timeSlot: '18:00',
    guests: 2,
    tableId: '',
    notes: ''
  });

  const timeSlots = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];

  useEffect(() => {
    fetchReservations();
    fetchTables();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await api.get('/reservations/my');
      setReservations(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const fetchTables = async () => {
    setLoadingTables(true);
    try {
      const res = await api.get('/reservations/tables');
      setTables(res.data);
    } catch (err) {
      console.error('Fetch tables error:', err);
      toast.error('Failed to load tables');
    } finally {
    setLoadingTables(false);
  }
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
      await api.post('/reservations', formData);
      toast.success('Reservation created successfully!');
      setShowModal(false);
      fetchReservations();
      setFormData({
        date: '',
        timeSlot: '18:00',
        guests: 2,
        tableId: '',
        notes: ''
      });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this reservation?')) return;

    try {
      await api.delete(`/reservations/${id}`);
      toast.success('Reservation cancelled successfully');
      fetchReservations();
    } catch (err) {
      toast.error('Failed to cancel reservation');
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  const availableTables = tables.filter(table => table.capacity >= formData.guests);

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>Welcome, {user?.name}! 👋</h2>
          <p className="text-muted">Manage your table reservations</p>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <i className="bi bi-plus-circle me-2"></i>
            New Reservation
          </Button>
        </Col>
      </Row>

      
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">My Reservations</h5>
        </Card.Header>
        <Card.Body>
          {reservations.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-calendar-x empty-state-icon"></i>
              <p className="mt-3">No reservations yet. Book your first table!</p>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Table</th>
                  <th>Guests</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((res) => (
                  <tr key={res._id}>
                    <td>{formatDate(res.date)}</td>
                    <td>{res.timeSlot}</td>
                    <td>{res.table?.name}</td>
                    <td>{res.guests}</td>
                    <td>
                      <span className={`badge ${res.status === 'confirmed' ? 'bg-success' : 'bg-secondary'}`}>
                        {res.status}
                      </span>
                    </td>
                    <td>
                      {res.status === 'confirmed' && (
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleCancel(res._id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Create Reservation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Book a Table</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Time Slot</Form.Label>
              <Form.Select name="timeSlot" value={formData.timeSlot} onChange={handleChange}>
                {timeSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Number of Guests</Form.Label>
              <Form.Control
                type="number"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                min="1"
                max="8"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
  <Form.Label>Select Table</Form.Label>
  <Form.Select name="tableId" value={formData.tableId} onChange={handleChange} required>
    <option value="">Choose a table...</option>
    {availableTables.length === 0 ? (
      <option disabled>No tables available for {formData.guests} guests</option>
    ) : (
      availableTables.map(table => (
        <option key={table._id} value={table._id}>
          {table.name} (Seats {table.capacity})
        </option>
      ))
    )}
  </Form.Select>
  {availableTables.length === 0 && (
    <Form.Text className="text-danger">
      Try reducing guest count or contact us for larger groups
    </Form.Text>
  )}
</Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Special Requests (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any special requirements?"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Booking...' : 'Confirm Booking'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default CustomerDashboard;
