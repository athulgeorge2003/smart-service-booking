import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Profile() {
  const navigate = useNavigate()

  const [profile, setProfile] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    profile_image: null,
  })

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')

    if (!token) {
      navigate('/login')
      return
    }

    axios
      .get('http://127.0.0.1:8000/api/accounts/profile/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setProfile(response.data)
        setLoading(false)
      })
      .catch((error) => {
        setError(
          error.response?.data?.detail ||
          'Unable to load profile.'
        )
        setLoading(false)
      })
  }, [navigate])

  const handleChange = (event) => {
    setProfile({
      ...profile,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setMessage('')
    setError('')

    const token = localStorage.getItem('access_token')

    try {
      const response = await axios.patch(
        'http://127.0.0.1:8000/api/accounts/profile/',
        {
          phone: profile.phone,
          address: profile.address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setProfile(response.data)
      setMessage('Profile updated successfully.')
    } catch (error) {
      setError(
        error.response?.data
          ? JSON.stringify(error.response.data)
          : 'Unable to update profile.'
      )
    }
  }

  if (loading) {
    return (
      <div className="container py-5">
        <h2>Loading profile...</h2>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-7">

          <div className="card shadow-sm">
            <div className="card-body p-4">

              <h2 className="fw-bold mb-4">
                My Profile
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

              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={profile.username}
                  readOnly
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={profile.email}
                  readOnly
                />
              </div>

              <div className="row">

                <div className="col-md-6 mb-3">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profile.first_name}
                    readOnly
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profile.last_name}
                    readOnly
                  />
                </div>

              </div>

              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  value={profile.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Address</label>
                <textarea
                  name="address"
                  className="form-control"
                  rows="4"
                  value={profile.address}
                  onChange={handleChange}
                />
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                Update Profile
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Profile