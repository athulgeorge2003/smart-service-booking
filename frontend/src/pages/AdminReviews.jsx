import { useEffect, useState } from 'react'
import axios from 'axios'

function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const token = localStorage.getItem('access_token')

  const loadReviews = () => {
    axios
      .get('http://127.0.0.1:8000/api/reviews/admin/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setReviews(response.data)
        setLoading(false)
      })
      .catch((error) => {
        setError(
          error.response?.data?.detail ||
          'Unable to load reviews.'
        )
        setLoading(false)
      })
  }

  useEffect(() => {
    if (localStorage.getItem('is_staff') !== 'true') {
      window.location.href = '/'
      return
    }

    loadReviews()
  }, [])

  const deleteReview = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this review?'
    )

    if (!confirmDelete) {
      return
    }

    try {
      await axios.delete(
        'http://127.0.0.1:8000/api/reviews/admin/',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            review_id: id,
          },
        }
      )

      setMessage('Review deleted successfully.')
      loadReviews()
    } catch (error) {
      setError(
        error.response?.data
          ? JSON.stringify(error.response.data)
          : 'Unable to delete review.'
      )
    }
  }

  if (loading) {
    return (
      <div className="container py-5">
        <h2>Loading reviews...</h2>
      </div>
    )
  }

  return (
    <div className="container py-5">

      <h1 className="fw-bold mb-4">
        Manage Reviews
      </h1>

      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="alert alert-info">
          No reviews found.
        </div>
      ) : (
        <div className="row g-4">

          {reviews.map((review) => (
            <div
              className="col-md-6 col-lg-4"
              key={review.id}
            >
              <div className="card h-100 shadow-sm">

                <div className="card-body">

                  <h5 className="fw-bold">
                    {review.customer}
                  </h5>

                  <p className="text-muted mb-2">
                    Service #{review.service}
                  </p>

                  <p className="mb-2">
                    <strong>Rating:</strong>{' '}
                    {review.rating}/5
                  </p>

                  <p className="mb-3">
                    {review.comment || 'No comment'}
                  </p>

                  <p className="small text-muted">
                    {new Date(
                      review.created_at
                    ).toLocaleString()}
                  </p>

                  <button
                    className="btn btn-outline-danger"
                    onClick={() =>
                      deleteReview(review.id)
                    }
                  >
                    Delete Review
                  </button>

                </div>

              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  )
}

export default AdminReviews