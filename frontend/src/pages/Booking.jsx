
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

function Booking() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [service, setService] = useState(null)

  const [formData, setFormData] = useState({
    booking_date: '',
    booking_time: '',
    address: '',
    phone: '',
    notes: '',
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const [capacity, setCapacity] = useState(null)
  const [checkingCapacity, setCheckingCapacity] = useState(false)

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/services/${id}/`)
      .then((response) => {
        setService(response.data)
        setLoading(false)
      })
      .catch(() => {
        setError('Unable to load service.')
        setLoading(false)
      })
  }, [id])

  const checkCapacity = async (date, time) => {
    if (!date || !time) {
      setCapacity(null)
      return
    }

    setCheckingCapacity(true)

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/bookings/capacity/${id}/`,
        {
          params: {
            date: date,
            time: time,
          },
        }
      )

      setCapacity(response.data)
    } catch {
      setCapacity(null)
    } finally {
      setCheckingCapacity(false)
    }
  }

  const handleChange = (event) => {
    const updatedFormData = {
      ...formData,
      [event.target.name]: event.target.value,
    }

    setFormData(updatedFormData)

    if (
      updatedFormData.booking_date &&
      updatedFormData.booking_time
    ) {
      checkCapacity(
        updatedFormData.booking_date,
        updatedFormData.booking_time
      )
    } else {
      setCapacity(null)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setMessage('')

    const token = localStorage.getItem('access_token')

    if (!token) {
      navigate('/login')
      return
    }

    if (capacity && !capacity.available) {
      setError(
        'No workers are available for the selected date and time.'
      )
      return
    }

    try {
      await axios.post(
        'http://127.0.0.1:8000/api/bookings/',
        {
          service: Number(id),
          ...formData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setMessage('Booking created successfully!')

      setTimeout(() => {
        navigate('/bookings')
      }, 1500)
    } catch (error) {
      const data = error.response?.data

      if (data) {
        setError(JSON.stringify(data))
      } else {
        setError('Unable to create booking.')
      }
    }
  }

  if (loading) {
    return (
      <div className="container py-5">
        <h2>Loading...</h2>
      </div>
    )
  }

  if (error && !service) {
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
      <div className="row justify-content-center">
        <div className="col-lg-7">

          <div className="card shadow-sm">
            <div className="card-body p-4">

              <h2 className="fw-bold mb-2">
                Book Service
              </h2>

              <p className="text-muted mb-4">
                Service: <strong>{service.name}</strong>
              </p>

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
                      Booking Date
                    </label>

                    <input
                      type="date"
                      name="booking_date"
                      className="form-control"
                      value={formData.booking_date}
                      onChange={handleChange}
                      min={
                        new Date()
                          .toISOString()
                          .split('T')[0]
                      }
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Booking Time
                    </label>

                    <input
                      type="time"
                      name="booking_time"
                      className="form-control"
                      value={formData.booking_time}
                      onChange={handleChange}
                      required
                    />
                  </div>

                </div>

                {checkingCapacity && (
                  <div className="alert alert-info">
                    Checking worker availability...
                  </div>
                )}

                {capacity && !checkingCapacity && (
                  capacity.available ? (
                    <div className="alert alert-success">
                      {capacity.remaining_slots} worker slot
                      {capacity.remaining_slots === 1
                        ? ''
                        : 's'} available for this time.
                    </div>
                  ) : (
                    <div className="alert alert-danger">
                      No workers are available for this service
                      at the selected date and time. Please
                      choose another time.
                    </div>
                  )
                )}

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

                <div className="mb-4">
                  <label className="form-label">
                    Notes <span className="text-muted">(Optional)</span>
                  </label>

                  <textarea
                    name="notes"
                    className="form-control"
                    rows="3"
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={
                    checkingCapacity ||
                    (capacity && !capacity.available)
                  }
                >
                  Confirm Booking
                </button>

              </form>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Booking
