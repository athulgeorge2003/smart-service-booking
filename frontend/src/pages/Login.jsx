import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

function Login() {
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    username: '',
    password: '',
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

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/accounts/login/',
        formData
      )

      login(
        response.data.access,
        response.data.refresh,
        response.data.username,
        response.data.is_staff
      )

      setMessage('Login successful!')
    } catch (error) {
      setError(
        error.response?.data?.error ||
        'Invalid username or password.'
      )
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">

          <div className="card shadow-sm">
            <div className="card-body p-4">

              <h2 className="fw-bold mb-4 text-center">
                Login
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
                  Login
                </button>

              </form>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Login