import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function Navbar({ user, onLogout, onToggleSidebar }) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout()
    }
    navigate('/login')
  }

  const isPublicRoute = ['/login', '/signup'].includes(location.pathname)

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-2xl fixed w-full z-50 top-0 border-b border-slate-700">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Menu Toggle & Logo */}
          <div className="flex items-center gap-3">
            {!isPublicRoute && user && (
              <button
                onClick={onToggleSidebar}
                className="lg:hidden p-2 rounded-lg text-gray-300 hover:bg-slate-700 transition-colors"
                aria-label="Toggle sidebar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </button>
            )}
            
            <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg shadow-lg">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                </svg>
              </div>
              <span className="text-lg sm:text-xl font-bold text-white">Faculty Portal</span>
            </Link>
          </div>

          {/* Right Section - User Info or Auth Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
                  to="/about-us"
                  className="bg-slate-700 hover:bg-slate-600 text-white px-3 sm:px-5 py-2 rounded-lg font-semibold border border-slate-600 transition-colors text-sm sm:text-base"
                >
                  About Developer
                </Link>
            {user ? (
              <>
                

                {/* Logout Button - VISIBLE */}
                <button
                  onClick={handleLogout}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg"
                >
                  <span className="text-sm sm:text-base">Logout</span>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="bg-slate-700 hover:bg-slate-600 text-white px-3 sm:px-5 py-2 rounded-lg font-semibold border border-slate-600 transition-colors text-sm sm:text-base"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-5 py-2 rounded-lg font-semibold transition-colors shadow-lg text-sm sm:text-base"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}