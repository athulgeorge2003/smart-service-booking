import { useEffect, useState } from 'react'
import axios from 'axios'

function AdminWorkers() {
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    is_available: true,
  })

  const token = localStorage.getItem('access_token')

  const loadWorkers = () => {
    axios
      .get(
        'http://127.0.0.1:8000/api/accounts/admin/workers/',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setWorkers(response.data)
        setLoading(false)
      })
      .catch((error) => {
        setError(
          error.response?.data?.detail ||
          'Unable to load workers.'
        )
        setLoading(false)
      })
  }

  useEffect(() => {
    const isStaff = localStorage.getItem('is_staff')

    if (isStaff !== 'true') {
      window.location.href = '/'
      return
    }

    loadWorkers()
  }, [])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setMessage('')

    try {
      await axios.post(
        'http://127.0.0.1:8000/api/accounts/admin/workers/',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setMessage('Worker created successfully.')

      setFormData({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        phone: '',
        address: '',
        is_available: true,
      })

      loadWorkers()
    } catch (error) {
      setError(
        error.response?.data
          ? JSON.stringify(error.response.data)
          : 'Unable to create worker.'
      )
    }
  }

  const toggleAvailability = async (worker) => {
    setError('')
    setMessage('')

    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/accounts/admin/workers/${worker.id}/`,
        {
          is_available: !worker.is_available,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setMessage('Worker availability updated.')
      loadWorkers()
    } catch (error) {
      setError(
        error.response?.data
          ? JSON.stringify(error.response.data)
          : 'Unable to update worker.'
      )
    }
  }

  if (loading) {
    return (
      <div className="container py-5">
        <h2>Loading workers...</h2>
      </div>
    )
  }

  return (
    <div className="container py-5">

      <h1 className="fw-bold mb-4">
        Manage Workers
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

      <div className="card shadow-sm mb-5">
        <div className="card-body p-4">

          <h4 className="fw-bold mb-4">
            Add New Worker
          </h4>

          <form onSubmit={handleSubmit}>

            <div className="row">

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  First Name
                </label>

                <input
                  type="text"
                  name="first_name"
                  className="form-control"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Last Name
                </label>

                <input
                  type="text"
                  name="last_name"
                  className="form-control"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Username
                </label>

                <input
                  type="text"
                  name="username"
                  className="form-control"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Phone
                </label>

                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 mb-3">
                <label className="form-label">
                  Address
                </label>

                <textarea
                  name="address"
                  className="form-control"
                  rows="3"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            <div className="form-check mb-4">
              <input
                type="checkbox"
                name="is_available"
                className="form-check-input"
                id="workerAvailable"
                checked={formData.is_available}
                onChange={handleChange}
              />

              <label
                className="form-check-label"
                htmlFor="workerAvailable"
              >
                Available for assignments
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
            >
              Add Worker
            </button>

          </form>

        </div>
      </div>

      <h3 className="fw-bold mb-3">
        Workers
      </h3>

      <div className="row g-4">

        {workers.map((worker) => (
          <div
            className="col-md-6 col-lg-4"
            key={worker.id}
          >
            <div className="card shadow-sm h-100">

              <div className="card-body">

                <h5 className="fw-bold">
                  {worker.first_name} {worker.last_name}
                </h5>

                <p className="text-muted mb-2">
                  @{worker.username}
                </p>

                <p className="mb-1">
                  <strong>Email:</strong> {worker.email}
                </p>

                <p className="mb-1">
                  <strong>Phone:</strong> {worker.phone}
                </p>

                <p className="mb-3">
                  <strong>Address:</strong> {worker.address}
                </p>

                <p>
                  <strong>Status:</strong>{' '}
                  <span
                    className={`badge ${
                      worker.is_available
                        ? 'bg-success'
                        : 'bg-secondary'
                    }`}
                  >
                    {worker.is_available
                      ? 'Available'
                      : 'Unavailable'}
                  </span>
                </p>

                <button
                  className="btn btn-outline-primary"
                  onClick={() =>
                    toggleAvailability(worker)
                  }
                >
                  {worker.is_available
                    ? 'Mark Unavailable'
                    : 'Mark Available'}
                </button>

              </div>

            </div>
          </div>
        ))}

      </div>

    </div>
  )
}

export default AdminWorkers