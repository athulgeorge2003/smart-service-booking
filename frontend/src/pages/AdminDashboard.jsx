import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function AdminDashboard() {
  const navigate = useNavigate()

  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    const isStaff = localStorage.getItem('is_staff')

    if (!token || isStaff !== 'true') {
      navigate('/')
      return
    }

    axios
      .get(
        'http://127.0.0.1:8000/api/accounts/admin-dashboard/',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setDashboard(response.data)
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

  return (
    <div className="container py-5">

      <div className="mb-4">
        <h1 className="fw-bold">Admin Dashboard</h1>
        <p className="text-muted">
          Overview of your Smart Service platform.
        </p>
      </div>

      <div className="row g-4">

        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <p className="text-muted mb-2">
                Total Customers
              </p>

              <h2 className="fw-bold">
                {dashboard.total_customers}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <p className="text-muted mb-2">
                Total Services
              </p>

              <h2 className="fw-bold">
                {dashboard.total_services}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <p className="text-muted mb-2">
                Total Bookings
              </p>

              <h2 className="fw-bold">
                {dashboard.total_bookings}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <p className="text-muted mb-2">
                Pending Bookings
              </p>

              <h2 className="fw-bold">
                {dashboard.pending_bookings}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <p className="text-muted mb-2">
                Completed Bookings
              </p>

              <h2 className="fw-bold">
                {dashboard.completed_bookings}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <p className="text-muted mb-2">
                Total Workers
              </p>

              <h2 className="fw-bold">
                {dashboard.total_workers}
              </h2>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}

export default AdminDashboard