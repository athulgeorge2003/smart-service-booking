
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function Bookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('access_token')

    if (!token) {
      setError('Please login to view your bookings.')
      setLoading(false)
      return
    }

    axios
      .get('http://127.0.0.1:8000/api/bookings/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setBookings(response.data)
        setLoading(false)
      })
      .catch((error) => {
        setError(
          error.response?.data?.detail ||
          'Unable to load bookings.'
        )
        setLoading(false)
      })
  }, [])

  const handleCancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm(
      'Are you sure you want to cancel this booking?'
    )

    if (!confirmCancel) {
      return
    }

    const token = localStorage.getItem('access_token')

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/bookings/${bookingId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: 'Cancelled' }
            : booking
        )
      )
    } catch (error) {
      setError(
        error.response?.data?.error ||
        'Unable to cancel booking.'
      )
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-warning text-dark'

      case 'Confirmed':
        return 'bg-primary'

      case 'Assigned':
        return 'bg-info text-dark'

      case 'In Progress':
        return 'bg-secondary'

      case 'Completed':
        return 'bg-success'

      case 'Cancelled':
        return 'bg-danger'

      default:
        return 'bg-secondary'
    }
  }

  if (loading) {
    return (
      <div className="container py-5">
        <h2>Loading bookings...</h2>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          {error}
        </div>

        <Link to="/login" className="btn btn-primary">
          Login
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-5">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold">My Bookings</h1>

          <p className="text-muted mb-0">
            View and track your service bookings.
          </p>
        </div>

        <Link to="/services" className="btn btn-primary">
          Book Another Service
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-5">
          <h4>No bookings found</h4>

          <p className="text-muted">
            You haven't booked any services yet.
          </p>

          <Link to="/services" className="btn btn-primary">
            Browse Services
          </Link>
        </div>
      ) : (
        <div className="row g-4">

          {bookings.map((booking) => (
            <div
              className="col-md-6 col-lg-4"
              key={booking.id}
            >
              <div className="card h-100 shadow-sm">

                <div className="card-body">

                  <h5 className="card-title">
                    {booking.service_name}
                  </h5>

                  <p className="mb-2">
                    <strong>Date:</strong>{' '}
                    {booking.booking_date}
                  </p>

                  <p className="mb-2">
                    <strong>Time:</strong>{' '}
                    {booking.booking_time}
                  </p>

                  <p className="mb-2">
                    <strong>Address:</strong>{' '}
                    {booking.address}
                  </p>

                  <p className="mb-3">
                    <strong>Phone:</strong>{' '}
                    {booking.phone}
                  </p>

                  <div className="mb-3">
                    <span
                      className={`badge ${getStatusClass(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <p className="mb-2">
                    <strong>Payment:</strong>{' '}
                    {booking.payment_status}
                  </p>

                  {booking.status === 'Pending' && (
                    <button
                      className="btn btn-outline-danger btn-sm mt-2"
                      onClick={() =>
                        handleCancelBooking(booking.id)
                      }
                    >
                      Cancel Booking
                    </button>
                  )}

                  {booking.status === 'Completed' && (
                    <Link
                      to={`/review/${booking.service}`}
                      className="btn btn-outline-primary btn-sm mt-2"
                    >
                      Write Review
                    </Link>
                  )}

                </div>

              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  )
}

export default Bookings
