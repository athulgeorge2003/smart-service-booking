import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

function Review() {
  const { serviceId } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    rating: '5',
    comment: '',
  })

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setMessage('')
    setError('')

    const token = localStorage.getItem('access_token')

    if (!token) {
      navigate('/login')
      return
    }

    try {
      await axios.post(
        'http://127.0.0.1:8000/api/reviews/',
        {
          service: Number(serviceId),
          rating: Number(formData.rating),
          comment: formData.comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setMessage('Thank you! Your review has been submitted.')

      setTimeout(() => {
        navigate('/bookings')
      }, 1500)

    } catch (error) {
      setError(
        error.response?.data
          ? JSON.stringify(error.response.data)
          : 'Unable to submit your review.'
      )
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6">

          <div className="card shadow-sm">
            <div className="card-body p-4">

              <h2 className="fw-bold mb-4">
                Write a Review
              </h2>

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

              <form onSubmit={handleSubmit}>

                <div className="mb-4">
                  <label className="form-label">
                    Rating
                  </label>

                  <select
                    name="rating"
                    className="form-select"
                    value={formData.rating}
                    onChange={handleChange}
                    required
                  >
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label">
                    Comment
                  </label>

                  <textarea
                    name="comment"
                    className="form-control"
                    rows="5"
                    placeholder="Share your experience..."
                    value={formData.comment}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                >
                  Submit Review
                </button>

              </form>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Review