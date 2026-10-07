import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem('access_token'))
  )

  const [isStaff, setIsStaff] = useState(
    localStorage.getItem('is_staff') === 'true'
  )

  const login = (access, refresh, username, staff) => {
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
    localStorage.setItem('username', username)
    localStorage.setItem('is_staff', staff)

    setIsLoggedIn(true)
    setIsStaff(staff)
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('username')
    localStorage.removeItem('is_staff')

    setIsLoggedIn(false)
    setIsStaff(false)
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isStaff,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}