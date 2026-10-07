function About() {
  return (
    <div className="container py-5">

      <div className="text-center mb-5">
        <h1 className="fw-bold">About Smart Service</h1>

        <p className="text-muted mt-3">
          Smart Service is a home service booking platform designed
          to make finding and booking reliable services simple.
        </p>
      </div>

      <div className="row g-4">

        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h3 className="fw-bold mb-3">Our Mission</h3>

              <p className="text-muted mb-0">
                Our goal is to make home service booking convenient,
                transparent, and easy to manage for both customers
                and service providers.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h3 className="fw-bold mb-3">What We Provide</h3>

              <p className="text-muted mb-0">
                Customers can explore services, book appointments,
                track booking status, manage their profiles, and
                share reviews about their experience.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}

export default About