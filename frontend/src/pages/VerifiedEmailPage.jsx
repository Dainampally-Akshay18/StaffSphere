import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/supabase'

export default function VerifiedEmailPage() {
  const navigate = useNavigate()
  const [userName, setUserName] = useState('User')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserDetails()
  }, [])

  const fetchUserDetails = async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      if (currentUser) {
        const firstName = currentUser.user_metadata?.first_name || currentUser.email?.split('@')[0] || 'User'
        setUserName(firstName)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      setUserName('User')
    } finally {
      setLoading(false)
    }
  }

  const handleLoginRedirect = () => {
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 px-4">
      <div className="max-w-md w-full">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <svg 
                className="w-12 h-12 text-green-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="3" 
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Email Verified! 🎉
          </h1>

          {/* Message */}
          <div className="mb-8">
            <p className="text-lg text-gray-700 mb-2">
              Dear <span className="font-bold text-blue-600">{userName}</span>,
            </p>
            <p className="text-gray-600">
              Your email has been <span className="font-semibold text-green-600">successfully verified</span>. 
              You can now access all features of your account.
            </p>
          </div>

          {/* Success Badge */}
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-green-700">
              <svg 
                className="w-5 h-5" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-semibold">Verification Complete</span>
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLoginRedirect}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
          >
            <span>Proceed to Login</span>
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>

          {/* Additional Info */}
          <p className="text-sm text-gray-500 mt-6">
            Welcome to Faculty Management System! 🚀
          </p>
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-600 mt-6 text-sm">
          Need help? Contact support at{' '}
          <a 
            href="mailto:support@faculty.com" 
            className="text-blue-600 hover:underline font-medium"
          >
            support@faculty.com
          </a>
        </p>
      </div>
    </div>
  )
}
