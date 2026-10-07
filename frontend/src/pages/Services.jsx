import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/services/')
      .then((response) => {
        setServices(response.data)
        setLoading(false)
      })
      .catch(() => {
        setError('Unable to load services.')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="container py-5">
        <h2>Loading services...</h2>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <h1 className="fw-bold mb-4">Our Services</h1>

      <div className="row g-4">
        {services.map((service) => (
          <div className="col-md-6 col-lg-4" key={service.id}>
            <div className="card h-100 shadow-sm">
              {service.image && (
                <img
                  src={service.image}
                  className="card-img-top"
                  alt={service.name}
                />
              )}

              <div className="card-body">
                <h5 className="card-title">{service.name}</h5>

                <p className="card-text">
                  {service.description}
                </p>

                <p className="fw-bold mb-1">
                  ₹{service.price}
                </p>

                <p className="text-muted">
                  Duration: {service.duration}
                </p>

                <Link to={`/services/${service.id}`} className="btn btn-primary">
                   View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Services