// src/pages/AdminDashboard.jsx
import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Table, Alert, Form, Badge, Tabs, Tab } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { toast } from 'react-toastify';
import AdminTableManagement from './AdminTableManagement';


function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('reservations');
  const [reservations, setReservations] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    cancelled: 0
  });

  useEffect(() => {
    fetchReservations();
  }, [filterDate]);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const url = filterDate 
        ? `/admin/reservations?date=${filterDate}` 
        : '/admin/reservations';
      
      const res = await api.get(url);
      setReservations(res.data);
      
      // Calculate stats
      const confirmed = res.data.filter(r => r.status === 'confirmed').length;
      const cancelled = res.data.filter(r => r.status === 'cancelled').length;
      setStats({
        total: res.data.length,
        confirmed,
        cancelled
      });
    } catch (err) {
      toast.error('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this reservation?')) return;

    try {
      await api.delete(`/admin/reservations/${id}`);
      toast.success('Reservation cancelled successfully');
      fetchReservations();
    } catch (err) {
      toast.error('Failed to cancel reservation');
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/admin/reservations/${id}`, { status: newStatus });
      toast.success('Status updated successfully');
      fetchReservations();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const clearFilter = () => {
    setFilterDate('');
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>Admin Dashboard 🔐</h2>
          <p className="text-muted">Manage all restaurant reservations</p>
        </Col>
      </Row>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >

         <Tab eventKey="reservations" title="📅 Reservations">

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h3 className="text-primary">{stats.total}</h3>
              <p className="text-muted mb-0">Total Reservations</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h3 className="text-success">{stats.confirmed}</h3>
              <p className="text-muted mb-0">Confirmed</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h3 className="text-secondary">{stats.cancelled}</h3>
              <p className="text-muted mb-0">Cancelled</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      

      {/* Filter Section */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row className="align-items-end">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Filter by Date</Form.Label>
                <Form.Control
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Button variant="outline-secondary" onClick={clearFilter} className="w-100">
                Clear Filter
              </Button>
            </Col>
            <Col md={6} className="text-end">
              <Badge bg="info" className="p-2">
                Showing {reservations.length} reservation(s)
              </Badge>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Reservations Table */}
      <Card className="shadow-sm">
        <Card.Header className="bg-dark text-white">
          <h5 className="mb-0">All Reservations</h5>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary"></div>
            </div>
          ) : reservations.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-inbox" style={{fontSize: '3rem'}}></i>
              <p className="mt-3">No reservations found</p>
            </div>
          ) : (
            <Table responsive hover>
              <thead className="table-light">
                <tr>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Table</th>
                  <th>Guests</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((res) => (
                  <tr key={res._id}>
                    <td>{res.user?.name}</td>
                    <td><small>{res.user?.email}</small></td>
                    <td>{formatDate(res.date)}</td>
                    <td>{res.timeSlot}</td>
                    <td>
                      <Badge bg="secondary">{res.table?.name}</Badge>
                    </td>
                    <td>{res.guests}</td>
                    <td>
                      <Badge bg={res.status === 'confirmed' ? 'success' : 'secondary'}>
                        {res.status}
                      </Badge>
                    </td>
                    <td>
                      <small className="text-muted">
                        {res.notes || '-'}
                      </small>
                    </td>
                    <td>
                      {res.status === 'confirmed' ? (
                        <>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleCancel(res._id)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button 
                          variant="outline-success" 
                          size="sm"
                          onClick={() => handleUpdateStatus(res._id, 'confirmed')}
                        >
                          Restore
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
      </Tab>
      <Tab eventKey="tables" title="🍽️ Tables">
          <AdminTableManagement />
        </Tab>
      </Tabs>
    </Container>
  );
}

export default AdminDashboard;
