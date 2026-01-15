// src/pages/NotFound.jsx
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <Container className="text-center py-5">
      <div style={{ fontSize: '8rem' }}>🍽️</div>
      <h1 className="display-4 fw-bold">404 - Page Not Found</h1>
      <p className="text-muted mb-4">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Button as={Link} to="/" variant="primary" size="lg">
        Go Back Home
      </Button>
    </Container>
  );
}

export default NotFound;
