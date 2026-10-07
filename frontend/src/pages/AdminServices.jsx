
import { useEffect, useState } from 'react'
import axios from 'axios'

function AdminServices() {
  const [services, setServices] = useState([])
  const [workers, setWorkers] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    image: null,
    is_available: true,
    workers: [],
  })

  const token = localStorage.getItem('access_token')

  const loadServices = () => {
    axios
      .get('http://127.0.0.1:8000/api/services/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setServices(response.data)
        setLoading(false)
      })
      .catch(() => {
        setError('Unable to load services.')
        setLoading(false)
      })
  }

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
      })
      .catch(() => {
        setError('Unable to load workers.')
      })
  }

  useEffect(() => {
    const isStaff = localStorage.getItem('is_staff')

    if (isStaff !== 'true') {
      window.location.href = '/'
      return
    }

    loadServices()
    loadWorkers()
  }, [])

  const handleChange = (event) => {
    const { name, value, type, checked, files } = event.target

    setFormData({
      ...formData,
      [name]:
        type === 'checkbox'
          ? checked
          : type === 'file'
          ? files[0]
          : value,
    })
  }

  const handleWorkerChange = (workerId) => {
    setFormData((current) => {
      const alreadySelected =
        current.workers.includes(workerId)

      return {
        ...current,
        workers: alreadySelected
          ? current.workers.filter(
              (id) => id !== workerId
            )
          : [...current.workers, workerId],
      }
    })
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      image: null,
      is_available: true,
      workers: [],
    })

    setEditingId(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setMessage('')

    const data = new FormData()

    data.append('name', formData.name)
    data.append('description', formData.description)
    data.append('price', formData.price)
    data.append('duration', formData.duration)
    data.append(
      'is_available',
      formData.is_available
    )

    if (formData.image) {
      data.append('image', formData.image)
    }

    formData.workers.forEach((workerId) => {
      data.append('workers', workerId)
    })

    try {
      if (editingId) {
        await axios.put(
          `http://127.0.0.1:8000/api/services/${editingId}/`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        setMessage('Service updated successfully.')
      } else {
        await axios.post(
          'http://127.0.0.1:8000/api/services/',
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        setMessage('Service added successfully.')
      }

      resetForm()
      loadServices()
    } catch (error) {
      setError(
        error.response?.data
          ? JSON.stringify(error.response.data)
          : 'Unable to save service.'
      )
    }
  }

  const handleEdit = (service) => {
    setEditingId(service.id)

    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      image: null,
      is_available: service.is_available,
      workers: service.workers || [],
    })

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this service?'
    )

    if (!confirmDelete) {
      return
    }

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/services/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setMessage('Service deleted successfully.')
      loadServices()
    } catch (error) {
      setError(
        error.response?.data
          ? JSON.stringify(error.response.data)
          : 'Unable to delete service.'
      )
    }
  }

  if (loading) {
    return (
      <div className="container py-5">
        <h2>Loading services...</h2>
      </div>
    )
  }

  return (
    <div className="container py-5">

      <h1 className="fw-bold mb-4">
        Manage Services
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
            {editingId
              ? 'Edit Service'
              : 'Add New Service'}
          </h4>

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label className="form-label">
                Service Name
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
                Description
              </label>

              <textarea
                name="description"
                className="form-control"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="row">

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  className="form-control"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Duration
                </label>

                <input
                  type="text"
                  name="duration"
                  className="form-control"
                  placeholder="2-3 hours"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            <div className="mb-4">
              <label className="form-label">
                Service Image
              </label>

              <input
                type="file"
                name="image"
                className="form-control"
                accept="image/*"
                onChange={handleChange}
              />

              <small className="text-muted">
                Select an image for this service.
              </small>
            </div>

            <div className="mb-4">

              <label className="form-label fw-bold">
                Assign Workers
              </label>

              {workers.length === 0 ? (
                <p className="text-muted">
                  No workers available.
                </p>
              ) : (
                <div className="border rounded p-3">

                  {workers.map((worker) => (
                    <div
                      className="form-check mb-2"
                      key={worker.id}
                    >

                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`worker-${worker.id}`}
                        checked={formData.workers.includes(
                          worker.id
                        )}
                        onChange={() =>
                          handleWorkerChange(
                            worker.id
                          )
                        }
                      />

                      <label
                        className="form-check-label"
                        htmlFor={`worker-${worker.id}`}
                      >
                        {worker.first_name}{' '}
                        {worker.last_name}

                        {!worker.is_available && (
                          <span className="text-muted ms-2">
                            (Unavailable)
                          </span>
                        )}
                      </label>

                    </div>
                  ))}

                </div>
              )}

            </div>

            <div className="form-check mb-4">

              <input
                type="checkbox"
                name="is_available"
                className="form-check-input"
                checked={formData.is_available}
                onChange={handleChange}
                id="serviceAvailable"
              />

              <label
                className="form-check-label"
                htmlFor="serviceAvailable"
              >
                Service Available
              </label>

            </div>

            <button
              type="submit"
              className="btn btn-primary me-2"
            >
              {editingId
                ? 'Update Service'
                : 'Add Service'}
            </button>

            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}

          </form>

        </div>
      </div>

      <h3 className="fw-bold mb-3">
        Existing Services
      </h3>

      <div className="row g-4">

        {services.map((service) => (
          <div
            className="col-md-6 col-lg-4"
            key={service.id}
          >
            <div className="card h-100 shadow-sm">

              {service.image && (
                <img
                  src={service.image}
                  className="card-img-top"
                  alt={service.name}
                  style={{
                    height: '200px',
                    objectFit: 'cover',
                  }}
                />
              )}

              <div className="card-body">

                <h5 className="fw-bold">
                  {service.name}
                </h5>

                <p className="text-muted">
                  {service.description}
                </p>

                <p className="mb-1">
                  <strong>Price:</strong>{' '}
                  ₹{service.price}
                </p>

                <p className="mb-1">
                  <strong>Duration:</strong>{' '}
                  {service.duration}
                </p>

                <p className="mb-2">
                  <strong>Status:</strong>{' '}
                  {service.is_available
                    ? 'Available'
                    : 'Unavailable'}
                </p>

                <p className="mb-3">
                  <strong>Workers:</strong>{' '}
                  {service.workers?.length || 0}
                </p>

                <button
                  className="btn btn-outline-primary me-2"
                  onClick={() =>
                    handleEdit(service)
                  }
                >
                  Edit
                </button>

                <button
                  className="btn btn-outline-danger"
                  onClick={() =>
                    handleDelete(service.id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>
          </div>
        ))}

      </div>

    </div>
  )
}

export default AdminServices
