import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Dashboard() {
  const navigate = useNavigate()

  const [bookings, setBookings] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('access_token')

    if (!token) {
      navigate('/login')
      return
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    }

    Promise.all([
      axios.get(
        'http://127.0.0.1:8000/api/bookings/',
        { headers }
      ),
      axios.get(
        'http://127.0.0.1:8000/api/accounts/profile/',
        { headers }
      ),
    ])
      .then(([bookingResponse, profileResponse]) => {
        setBookings(bookingResponse.data)
        setProfile(profileResponse.data)
        setLoading(false)
      })
      .catch((error) => {
        setError(
          error.response?.data?.detail ||
          'Unable to load dashboard.'
        )
        setLoading(false)
      })
  }, [navigate])

  if (loading) {
    return (
      <div className="container py-5">
        <h2>Loading dashboard...</h2>
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

  const totalBookings = bookings.length

  const pendingBookings = bookings.filter(
    (booking) =>
      booking.status === 'Pending' ||
      booking.status === 'Confirmed' ||
      booking.status === 'Assigned' ||
      booking.status === 'In Progress'
  ).length

  const completedBookings = bookings.filter(
    (booking) => booking.status === 'Completed'
  ).length

  const recentBookings = bookings.slice(0, 3)

  return (
    <div className="container py-5">

      <div className="mb-5">
        <h1 className="fw-bold">
          Welcome, {profile?.first_name || profile?.username}
        </h1>

        <p className="text-muted">
          Manage your services and bookings from one place.
        </p>
      </div>

      {/* Statistics */}
      <div className="row g-4 mb-5">

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-2">
                Total Bookings
              </p>

              <h2 className="fw-bold">
                {totalBookings}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-2">
                Active Bookings
              </p>

              <h2 className="fw-bold">
                {pendingBookings}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-2">
                Completed Bookings
              </p>

              <h2 className="fw-bold">
                {completedBookings}
              </h2>
            </div>
          </div>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="mb-5">

        <h3 className="fw-bold mb-3">
          Quick Actions
        </h3>

        <Link
          to="/services"
          className="btn btn-primary me-2"
        >
          Browse Services
        </Link>

        <Link
          to="/bookings"
          className="btn btn-outline-primary me-2"
        >
          My Bookings
        </Link>

        <Link
          to="/profile"
          className="btn btn-outline-secondary"
        >
          My Profile
        </Link>

      </div>

      {/* Recent Bookings */}
      <div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="fw-bold mb-0">
            Recent Bookings
          </h3>

          <Link to="/bookings">
            View All
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="alert alert-light border">
            You don't have any bookings yet.
          </div>
        ) : (
          <div className="row g-4">

            {recentBookings.map((booking) => (
              <div
                className="col-md-6 col-lg-4"
                key={booking.id}
              >
                <div className="card border-0 shadow-sm h-100">

                  <div className="card-body">

                    <h5 className="fw-bold">
                      {booking.service_name}
                    </h5>

                    <p className="mb-2">
                      <strong>Date:</strong>{' '}
                      {booking.booking_date}
                    </p>

                    <p className="mb-3">
                      <strong>Time:</strong>{' '}
                      {booking.booking_time}
                    </p>

                    <span className="badge bg-primary">
                      {booking.status}
                    </span>

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

export default Dashboard