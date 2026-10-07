import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-dark text-white mt-5">
      <div className="container py-5">

        <div className="row g-4">

          <div className="col-md-5">
            <h4 className="fw-bold">Smart Service</h4>

            <p className="text-light">
              Reliable home services with simple and convenient
              online booking.
            </p>
          </div>

          <div className="col-md-3">
            <h5 className="fw-bold">Quick Links</h5>

            <div className="d-flex flex-column gap-2">
              <Link to="/" className="text-white text-decoration-none">
                Home
              </Link>

              <Link
                to="/services"
                className="text-white text-decoration-none"
              >
                Services
              </Link>

              <Link
                to="/about"
                className="text-white text-decoration-none"
              >
                About
              </Link>

              <Link
                to="/contact"
                className="text-white text-decoration-none"
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="col-md-4">
            <h5 className="fw-bold">Contact</h5>

            <p className="mb-1">Email: support@smartservice.com</p>
            <p className="mb-0">Phone: +91 98765 43210</p>
          </div>

        </div>

        <hr className="my-4" />

        <p className="text-center text-light mb-0">
          © 2026 Smart Service. All rights reserved.
        </p>

      </div>
    </footer>
  )
}

export default Footer