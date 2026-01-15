import { Component } from 'react';
import { Alert, Container } from 'react-bootstrap';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container className="py-5">
          <Alert variant="danger">
            Something went wrong. Please refresh the page.
          </Alert>
        </Container>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
