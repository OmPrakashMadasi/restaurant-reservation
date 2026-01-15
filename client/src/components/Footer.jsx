// src/components/Footer.jsx
import { Container } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <div className="row">
          <div className="col-md-6">
            <h5>Restaurant Reservations</h5>
            <p className=" text-white mb-0">
              Reserve your table hassle-free. Enjoy fine dining at its best.
            </p>
          </div>
          <div className="col-md-3">
            <h6>Quick Links</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white text-decoration-none">About Us</a></li>
              <li><a href="#" className=" text-white text-decoration-none">Contact</a></li>
              <li><a href="#" className=" text-white text-decoration-none">Privacy Policy</a></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h6>Contact</h6>
            <p className=" text-white mb-0">
              <i className="bi bi-telephone me-2"></i>+91 9100177915<br/>
              <i className="bi bi-envelope me-2"></i>info@restaurantreservations.com
            </p>
          </div>
        </div>
        <hr className="bg-secondary"/>
        <p className="text-center  text-white mb-0">
          © 2026 Restaurant Reservations. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}

export default Footer;
