import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
  })

  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setMessage('')

    try {
      await axios.post(
        'http://127.0.0.1:8000/api/accounts/register/',
        formData
      )

      setMessage('Registration successful! Redirecting to login...')

      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (error) {
      const data = error.response?.data

      if (data) {
        setError(JSON.stringify(data))
      } else {
        setError('Registration failed. Please try again.')
      }
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">

          <div className="card shadow-sm">
            <div className="card-body p-4">

              <h2 className="fw-bold text-center mb-4">
                Create Account
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

                </div>

                <div className="mb-3">
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

                <div className="mb-3">
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

                <div className="mb-3">
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

                <div className="mb-3">
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

                <div className="mb-4">
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

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                >
                  Create Account
                </button>

              </form>

              <p className="text-center mt-3 mb-0">
                Already have an account?{' '}
                <Link to="/login">
                  Login
                </Link>
              </p>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Register