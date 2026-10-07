import { useState } from 'react'
import axios from 'axios'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
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
      await axios.post(
        'http://127.0.0.1:8000/api/contact/',
        formData
      )

      setMessage('Your message has been submitted successfully.')

      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      })
    } catch (error) {
      setError(
        error.response?.data
          ? JSON.stringify(error.response.data)
          : 'Unable to submit your message.'
      )
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">

        <div className="col-lg-7">

          <div className="text-center mb-4">
            <h1 className="fw-bold">Contact Us</h1>

            <p className="text-muted">
              Have a question? Send us a message and we'll get back
              to you.
            </p>
          </div>

          <div className="card shadow-sm">
            <div className="card-body p-4">

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
                    Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
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
                    Phone <span className="text-muted">(Optional)</span>
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">
                    Message
                  </label>

                  <textarea
                    name="message"
                    className="form-control"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                >
                  Send Message
                </button>

              </form>

            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default Contact