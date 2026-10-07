import { useEffect, useState } from 'react'
import axios from 'axios'

function AdminContacts() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const token = localStorage.getItem('access_token')

  const loadMessages = () => {
    axios
      .get('http://127.0.0.1:8000/api/contact/admin/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setMessages(response.data)
        setLoading(false)
      })
      .catch((error) => {
        setError(
          error.response?.data?.detail ||
          'Unable to load contact messages.'
        )
        setLoading(false)
      })
  }

  useEffect(() => {
    if (localStorage.getItem('is_staff') !== 'true') {
      window.location.href = '/'
      return
    }

    loadMessages()
  }, [])

  const deleteMessage = async (id) => {
    const confirmDelete = window.confirm(
      'Delete this contact message?'
    )

    if (!confirmDelete) {
      return
    }

    try {
      await axios.delete(
        'http://127.0.0.1:8000/api/contact/admin/',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            message_id: id,
          },
        }
      )

      setMessage('Message deleted successfully.')
      loadMessages()
    } catch (error) {
      setError(
        error.response?.data
          ? JSON.stringify(error.response.data)
          : 'Unable to delete message.'
      )
    }
  }

  if (loading) {
    return (
      <div className="container py-5">
        <h2>Loading messages...</h2>
      </div>
    )
  }

  return (
    <div className="container py-5">

      <h1 className="fw-bold mb-4">
        Contact Messages
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

      {messages.length === 0 ? (
        <div className="alert alert-info">
          No contact messages found.
        </div>
      ) : (
        <div className="row g-4">

          {messages.map((item) => (
            <div
              className="col-md-6 col-lg-4"
              key={item.id}
            >
              <div className="card h-100 shadow-sm">

                <div className="card-body">

                  <h5 className="fw-bold">
                    {item.name}
                  </h5>

                  <p className="mb-1">
                    <strong>Email:</strong>{' '}
                    {item.email}
                  </p>

                  {item.phone && (
                    <p className="mb-1">
                      <strong>Phone:</strong>{' '}
                      {item.phone}
                    </p>
                  )}

                  <p className="mt-3">
                    {item.message}
                  </p>

                  <p className="small text-muted">
                    {new Date(
                      item.created_at
                    ).toLocaleString()}
                  </p>

                  <button
                    className="btn btn-outline-danger"
                    onClick={() =>
                      deleteMessage(item.id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  )
}

export default AdminContacts