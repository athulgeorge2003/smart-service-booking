
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Services from './pages/Services'
import ServiceDetails from './pages/ServiceDetails'
import Login from './pages/Login'
import Register from './pages/Register'
import Booking from './pages/Booking'
import Bookings from './pages/Bookings'
import Contact from './pages/Contact'
import Profile from './pages/Profile'
import About from './pages/About'
import Footer from './components/Footer'
import AdminDashboard from './pages/AdminDashboard'
import AdminServices from './pages/AdminServices'
import AdminBookings from './pages/AdminBookings'
import AdminWorkers from './pages/AdminWorkers'
import AdminReviews from './pages/AdminReviews'
import Review from './pages/Review'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import AdminContacts from './pages/AdminContacts'

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/book/:id" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/review/:serviceId" element={<ProtectedRoute><Review /></ProtectedRoute>} />

        <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin-services" element={<AdminRoute><AdminServices /></AdminRoute>} />
        <Route path="/admin-bookings" element={<AdminRoute><AdminBookings /></AdminRoute>} />
        <Route path="/admin-workers" element={<AdminRoute><AdminWorkers /></AdminRoute>} />
        <Route path="/admin-reviews" element={<AdminRoute><AdminReviews /></AdminRoute>} />
        <Route path="/admin-contacts" element={<AdminRoute><AdminContacts /></AdminRoute>} />
      </Routes>

      <Footer />
    </BrowserRouter>
  )
}

export default App
