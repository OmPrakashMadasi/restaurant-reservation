// src/pages/Landing.jsx
import { useContext } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Landing() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/customer');
    } else {
      navigate('/register');
    }
  };

  const handleLogin = () => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/customer');
    } else {
      navigate('/login');
    }
  };

  return (
    <div>
      {/* Hero Section - NO MORE INLINE STYLES */}
      <section className="hero-section text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="text-center text-lg-start">
              <h1 className="display-3 fw-bold mb-4">
                Reserve Your Perfect Table
              </h1>
              <p className="lead mb-4">
                Experience fine dining at its best. Book your table in seconds, 
                manage reservations effortlessly, and enjoy memorable moments.
              </p>
              
              <div className="d-flex gap-3 justify-content-center justify-content-lg-start">
                {user ? (
                  <>
                    <Button 
                      onClick={handleGetStarted}
                      variant="light" 
                      size="lg"
                      className="px-4 py-2"
                    >
                      <i className="bi bi-calendar-check me-2"></i>
                      Go to {user.role === 'admin' ? 'Admin' : 'My'} Dashboard
                    </Button>
                    <Button 
                      as={Link}
                      to={user.role === 'admin' ? '/admin' : '/customer'}
                      variant="outline-light" 
                      size="lg"
                      className="px-4 py-2"
                    >
                      <i className="bi bi-list-check me-2"></i>
                      View Reservations
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      onClick={handleGetStarted}
                      variant="light" 
                      size="lg"
                      className="px-4 py-2"
                    >
                      <i className="bi bi-person-plus me-2"></i>
                      Get Started
                    </Button>
                    <Button 
                      onClick={handleLogin}
                      variant="outline-light" 
                      size="lg"
                      className="px-4 py-2"
                    >
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Login
                    </Button>
                  </>
                )}
              </div>
              
              {user && (
                <div className="welcome-message">
                  <small>
                    <i className="bi bi-info-circle me-2"></i>
                    Welcome back, <strong>{user.name}</strong>! 
                    {user.role === 'customer' ? ' Ready to book your next table?' : ' Manage all reservations from your dashboard.'}
                  </small>
                </div>
              )}
            </Col>
            <Col lg={6} className="text-center mt-5 mt-lg-0">
              <div className="p-4">
                <i className="bi bi-calendar-check hero-icon"></i>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">Why Choose Us?</h2>
            <p className="text-muted">Simple, fast, and reliable reservation system</p>
          </div>
          <Row className="g-4">
            <Col md={4}>
              <Card className="h-100 card-shadow-sm border-0 text-center">
                <Card.Body className="p-4">
                  <div className="mb-3">
                    <i className="bi bi-lightning-charge-fill text-primary feature-icon"></i>
                  </div>
                  <h4>Instant Booking</h4>
                  <p className="text-muted">
                    Book your table in just a few clicks. Real-time availability 
                    ensures no double bookings.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 card-shadow-sm border-0 text-center">
                <Card.Body className="p-4">
                  <div className="mb-3">
                    <i className="bi bi-shield-check text-success feature-icon"></i>
                  </div>
                  <h4>Secure & Safe</h4>
                  <p className="text-muted">
                    Your data is protected with industry-standard security. 
                    Book with confidence.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 card-shadow-sm border-0 text-center">
                <Card.Body className="p-4">
                  <div className="mb-3">
                    <i className="bi bi-clock-history text-info feature-icon"></i>
                  </div>
                  <h4>Easy Management</h4>
                  <p className="text-muted">
                    View, modify, or cancel your reservations anytime. 
                    Complete control at your fingertips.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">How It Works</h2>
            <p className="text-muted">Three simple steps to your perfect dining experience</p>
          </div>
          <Row className="text-center g-4">
            <Col md={4}>
              <div className="position-relative">
                <div className="step-circle step-circle-primary mb-3">
                  1
                </div>
                <h4>Create Account</h4>
                <p className="text-muted">
                  Sign up in seconds with just your email and name
                </p>
              </div>
            </Col>
            <Col md={4}>
              <div className="position-relative">
                <div className="step-circle step-circle-success mb-3">
                  2
                </div>
                <h4>Choose Date & Table</h4>
                <p className="text-muted">
                  Select your preferred date, time, and table size
                </p>
              </div>
            </Col>
            <Col md={4}>
              <div className="position-relative">
                <div className="step-circle step-circle-info mb-3">
                  3
                </div>
                <h4>Enjoy Your Meal</h4>
                <p className="text-muted">
                  Show up and enjoy a wonderful dining experience
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-5 bg-dark text-white">
        <Container className="text-center">
          <h2 className="display-5 fw-bold mb-4">Ready to Reserve?</h2>
          <p className="lead mb-4">
            {user 
              ? `Welcome back, ${user.name}! Continue managing your reservations.`
              : 'Join hundreds of satisfied diners. Book your table today!'
            }
          </p>
          <Button 
            onClick={handleGetStarted}
            variant="primary" 
            size="lg"
            className="px-5 py-3"
          >
            {user ? 'Go to Dashboard' : 'Start Booking Now'}
          </Button>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="text-center">
            <Col md={3}>
              <h2 className="stats-number text-primary">500+</h2>
              <p className="text-muted">Happy Customers</p>
            </Col>
            <Col md={3}>
              <h2 className="stats-number text-success">1000+</h2>
              <p className="text-muted">Reservations Made</p>
            </Col>
            <Col md={3}>
              <h2 className="stats-number text-info">8</h2>
              <p className="text-muted">Available Tables</p>
            </Col>
            <Col md={3}>
              <h2 className="stats-number text-warning">24/7</h2>
              <p className="text-muted">Support Available</p>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}

export default Landing;
