
import { useEffect, useState } from 'react'
import axios from 'axios'

function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const token = localStorage.getItem('access_token')

  const statusOptions = [
    'Pending',
    'Confirmed',
    'Assigned',
    'In Progress',
    'Completed',
    'Cancelled',
  ]

  const loadBookings = () => {
    axios
      .get('http://127.0.0.1:8000/api/bookings/admin/', {
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
  }

  useEffect(() => {
    const isStaff = localStorage.getItem('is_staff')

    if (isStaff !== 'true') {
      window.location.href = '/'
      return
    }

    loadBookings()
  }, [])

  const updateBooking = async (
    bookingId,
    newStatus,
    workerId
  ) => {
    setError('')
    setMessage('')

    try {
      await axios.patch(
        'http://127.0.0.1:8000/api/bookings/admin/',
        {
          booking_id: bookingId,
          status: newStatus,
          worker_id: workerId
            ? Number(workerId)
            : null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setMessage('Booking updated successfully.')
      loadBookings()
    } catch (error) {
      setError(
        error.response?.data
          ? JSON.stringify(error.response.data)
          : 'Unable to update booking.'
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

  return (
    <div className="container py-5">

      <div className="mb-4">
        <h1 className="fw-bold">
          Manage Bookings
        </h1>

        <p className="text-muted">
          View bookings, update status, and assign workers.
        </p>
      </div>

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

      {bookings.length === 0 ? (
        <div className="alert alert-info">
          No bookings found.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">

            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Date</th>
                <th>Time</th>
                <th>Phone</th>
                <th>Worker</th>
                <th>Status</th>
                <th>Payment</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>

                  <td>{booking.id}</td>

                  <td>{booking.customer}</td>

                  <td>
                    {booking.service_name}
                  </td>

                  <td>{booking.booking_date}</td>

                  <td>{booking.booking_time}</td>

                  <td>{booking.phone}</td>

                  <td style={{ minWidth: '200px' }}>

                    <select
                      className="form-select form-select-sm mb-2"
                      value={booking.assigned_worker || ''}
                      onChange={(event) =>
                        updateBooking(
                          booking.id,
                          booking.status,
                          event.target.value
                        )
                      }
                    >
                      <option value="">
                        Select Worker
                      </option>

                      {booking.available_workers?.map(
                        (worker) => (
                          <option
                            key={worker.id}
                            value={worker.id}
                          >
                            {worker.name}
                          </option>
                        )
                      )}
                    </select>

                    <small className="text-muted">
                      {booking.assigned_worker_name
                        ? `Assigned: ${booking.assigned_worker_name}`
                        : 'No worker assigned'}
                    </small>

                  </td>

                  <td style={{ minWidth: '170px' }}>

                    <span
                      className={`badge mb-2 ${getStatusClass(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>

                    <select
                      className="form-select form-select-sm"
                      value={booking.status}
                      onChange={(event) =>
                        updateBooking(
                          booking.id,
                          event.target.value,
                          booking.assigned_worker
                        )
                      }
                    >
                      {statusOptions.map((status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status}
                        </option>
                      ))}
                    </select>

                  </td>

                  <td>
                    {booking.payment_status}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

    </div>
  )
}

export default AdminBookings
