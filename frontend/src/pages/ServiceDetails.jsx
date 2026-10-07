
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

function ServiceDetails() {
  const { id } = useParams()

  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [reviews, setReviews] = useState([])
  const [averageRating, setAverageRating] = useState(0)
  const [reviewCount, setReviewCount] = useState(0)

  useEffect(() => {
    const loadService = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/services/${id}/`
        )

        setService(response.data)
      } catch {
        setError('Unable to load service details.')
      } finally {
        setLoading(false)
      }
    }

    const loadReviews = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/reviews/service/${id}/`
        )

        setReviews(response.data.reviews)
        setAverageRating(response.data.average_rating)
        setReviewCount(response.data.review_count)
      } catch {
        setReviews([])
        setAverageRating(0)
        setReviewCount(0)
      }
    }

    loadService()
    loadReviews()
  }, [id])

  if (loading) {
    return (
      <div className="container py-5">
        <h2>Loading...</h2>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          {error}
        </div>

        <Link
          to="/services"
          className="btn btn-primary"
        >
          Back to Services
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-5">

      {/* Service Details */}
      <div className="row g-4">

        <div className="col-md-6">
          {service.image ? (
            <img
              src={service.image}
              alt={service.name}
              className="img-fluid rounded shadow-sm"
            />
          ) : (
            <div className="bg-light rounded p-5 text-center">
              <h5>No image available</h5>
            </div>
          )}
        </div>

        <div className="col-md-6">

          <h1 className="fw-bold">
            {service.name}
          </h1>

          <p className="mt-3">
            {service.description}
          </p>

          <h4 className="text-primary mt-4">
            ₹{service.price}
          </h4>

          <p className="text-muted">
            Duration: {service.duration}
          </p>

          <p>
            <strong>Availability:</strong>{' '}
            {service.is_available
              ? 'Available'
              : 'Currently unavailable'}
          </p>

          {/* Rating */}
          <div className="mt-4">
            <h5 className="fw-bold">
              Customer Rating
            </h5>

            <p className="mb-0">
              <span className="fs-5">
                {averageRating > 0
                  ? `⭐ ${averageRating} / 5`
                  : 'No rating yet'}
              </span>

              <span className="text-muted ms-2">
                ({reviewCount}{' '}
                {reviewCount === 1
                  ? 'review'
                  : 'reviews'})
              </span>
            </p>
          </div>

          <div className="mt-4">

            {service.is_available && (
              <Link
                to={`/book/${service.id}`}
                className="btn btn-primary"
              >
                Book Now
              </Link>
            )}

            <Link
              to="/services"
              className="btn btn-outline-secondary ms-2"
            >
              Back to Services
            </Link>

          </div>

        </div>

      </div>

      {/* Reviews */}
      <div className="mt-5">

        <h2 className="fw-bold mb-4">
          Customer Reviews
        </h2>

        {reviews.length === 0 ? (
          <div className="alert alert-light border">
            No reviews yet. Be the first to review this service.
          </div>
        ) : (
          <div className="row g-4">

            {reviews.map((review) => (
              <div
                className="col-md-6 col-lg-4"
                key={review.id}
              >
                <div className="card border-0 shadow-sm h-100">

                  <div className="card-body">

                    <h5 className="fw-bold">
                      {review.customer}
                    </h5>

                    <p className="mb-2">
                      {'⭐'.repeat(review.rating)}
                    </p>

                    <p className="text-muted">
                      {review.comment ||
                        'No comment provided.'}
                    </p>

                    <small className="text-muted">
                      {new Date(
                        review.created_at
                      ).toLocaleDateString()}
                    </small>

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  )
}

export default ServiceDetails
