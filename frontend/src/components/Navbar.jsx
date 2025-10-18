import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function Navbar({ user, onLogout, onToggleSidebar }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Add scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      setScrolled(isScrolled)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout()
    }
    navigate('/login')
    setMobileMenuOpen(false)
  }

  const isPublicRoute = ['/login', '/signup', '/forgot-password', '/reset-password'].includes(location.pathname)

  return (
    <nav className={`bg-gray-900/95 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'shadow-2xl shadow-blue-900/20' : 'shadow-lg shadow-blue-900/10'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Reduced height from h-20 to h-16 and adjusted padding */}
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Menu Toggle & Logo */}
          <div className="flex items-center gap-3">
            {/* Hamburger Menu - Only show when user is logged in and not on public routes */}
            {!isPublicRoute && user && (
              <button
                onClick={onToggleSidebar}
                className="p-2 rounded-xl hover:bg-gradient-to-r from-blue-500/10 to-indigo-500/10 transition-all duration-200 lg:hidden border border-gray-700 hover:border-blue-500/30 group"
                aria-label="Toggle sidebar"
              >
                <svg className="w-5 h-5 text-gray-300 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </button>
            )}

            {/* Enhanced Logo - Adjusted padding */}
            <Link 
              to={user ? '/dashboard' : '/'} 
              className="flex items-center gap-2 group"
            >
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl shadow-lg group-hover:shadow-xl group-hover:shadow-blue-500/25 transition-all duration-300 group-hover:scale-105">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                  </svg>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                  Faculty Portal
                </span>
                <span className="text-xs text-gray-400 font-medium">Academic Excellence</span>
              </div>
            </Link>
          </div>

          {/* Right Section - Desktop - Adjusted padding */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/about-us"
              className="px-4 py-2 rounded-xl text-gray-300 hover:text-white font-medium hover:bg-gray-800/50 transition-all duration-200 border border-transparent hover:border-gray-700 group relative"
            >
              About Developer
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 group-hover:w-full transition-all duration-300"></span>
            </Link>

            {user ? (
              <button
                onClick={handleLogout}
                className="px-5 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-red-500/20 transform hover:scale-105 flex items-center gap-2 group"
              >
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                Logout
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl border-2 border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400 transition-all duration-200 font-semibold hover:shadow-md hover:shadow-blue-500/10"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Enhanced Mobile Menu Button - Adjusted padding */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-gray-800/50 transition-all duration-200 border border-gray-700 hover:border-gray-600 group"
            aria-label="Toggle mobile menu"
          >
            <div className="relative w-5 h-5">
              {mobileMenuOpen ? (
                <svg className="w-5 h-5 text-gray-300 group-hover:text-blue-400 transition-all duration-300 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-300 group-hover:text-blue-400 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Enhanced Mobile Menu Dropdown - Adjusted padding */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-xl border-t border-gray-800 shadow-2xl shadow-blue-900/20 animate-in slide-in-from-top duration-300">
          <div className="px-4 py-3 space-y-2">
            <Link
              to="/about-us"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-xl text-gray-300 hover:text-white font-medium hover:bg-gray-800/50 transition-all duration-200 border border-gray-800 hover:border-gray-700 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></div>
                About Developer
              </div>
            </Link>

            {user ? (
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-red-500/20 flex items-center gap-3 group"
              >
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                Logout
              </button>
            ) : (
              <div className="space-y-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-3 rounded-xl border-2 border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400 transition-all duration-200 font-semibold hover:shadow-md hover:shadow-blue-500/10"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}