import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const navigate = useNavigate()
  const { isLoggedIn, isStaff, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
      <div className="container">

        <Link className="navbar-brand fw-bold" to="/">
          Smart Service
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarContent"
        >
          <ul className="navbar-nav ms-auto">

            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/services">
                Services
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/contact">
                Contact
              </Link>
            </li>

            {isLoggedIn ? (
              <>
                {isStaff && (
                  <>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to="/admin-dashboard"
                      >
                        Admin Dashboard
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to="/admin-services"
                      >
                        Manage Services
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to="/admin-bookings"
                      >
                        Manage Bookings
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to="/admin-workers"
                      >
                        Manage Workers
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to="/admin-reviews"
                      >
                        Manage Reviews
                      </Link>
                    </li>

                     <li className="nav-item">
                        <Link className="nav-link" to="/admin-contacts">
                             Contact Messages
                        </Link>
                     </li>

                  </>
                )}

                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">
                    Dashboard
                 </Link>
                </li>
                
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/bookings"
                  >
                    My Bookings
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/profile"
                  >
                    Profile
                  </Link>
                </li>

                <li className="nav-item ms-lg-2">
                  <button
                    className="btn btn-outline-light"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item ms-lg-2">
                  <Link
                    className="btn btn-primary"
                    to="/login"
                  >
                    Login
                  </Link>
                </li>

                <li className="nav-item ms-lg-2">
                  <Link
                    className="btn btn-outline-light"
                    to="/register"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}

          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar