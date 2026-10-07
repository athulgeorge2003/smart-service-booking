import { Link } from 'react-router-dom'

function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-light py-5">
        <div className="container py-5">
          <div className="row align-items-center">

            <div className="col-lg-7">
              <span className="badge bg-primary mb-3">
                Trusted Home Services
              </span>

              <h1 className="display-4 fw-bold">
                Reliable Home Services,
                <span className="text-primary"> Anytime You Need.</span>
              </h1>

              <p className="lead text-muted mt-3">
                Book professional cleaning and home maintenance
                services quickly, easily, and securely.
              </p>

              <div className="mt-4">
                <Link
                  to="/services"
                  className="btn btn-primary btn-lg me-2"
                >
                  Explore Services
                </Link>

                <Link
                  to="/contact"
                  className="btn btn-outline-dark btn-lg"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            <div className="col-lg-5 mt-5 mt-lg-0">
              <div className="bg-white rounded shadow-sm p-5 text-center">
                <h2 className="fw-bold">
                  Smart Service
                </h2>

                <p className="text-muted mb-0">
                  Quality service at your convenience.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-5">
        <div className="container">

          <div className="text-center mb-5">
            <h2 className="fw-bold">
              Why Choose Us?
            </h2>

            <p className="text-muted">
              We make booking home services simple and convenient.
            </p>
          </div>

          <div className="row g-4">

            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <h4 className="fw-bold">
                    Easy Booking
                  </h4>

                  <p className="text-muted">
                    Choose your service, select a convenient
                    date and time, and book in just a few steps.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <h4 className="fw-bold">
                    Professional Service
                  </h4>

                  <p className="text-muted">
                    Get reliable services from assigned and
                    managed service professionals.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <h4 className="fw-bold">
                    Track Your Booking
                  </h4>

                  <p className="text-muted">
                    View your booking status and manage your
                    upcoming service requests easily.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-dark text-white py-5">
        <div className="container text-center py-4">

          <h2 className="fw-bold">
            Ready to book a service?
          </h2>

          <p className="text-light">
            Find the right service for your home today.
          </p>

          <Link
            to="/services"
            className="btn btn-primary btn-lg mt-2"
          >
            Browse Services
          </Link>

        </div>
      </section>
    </>
  )
}

export default Home