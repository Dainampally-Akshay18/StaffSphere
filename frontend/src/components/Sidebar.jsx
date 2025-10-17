import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Sidebar({ isOpen, user }) {
  const location = useLocation()

  const menuItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
      )
    },
    { 
      name: 'My Profile', 
      path: '/faculty/create', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
      )
    },
    { 
      name: 'Faculty List', 
      path: '/faculty/list', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
      )
    },
  ]

  return (
    <>
      {/* Pure Shining Black Sidebar */}
      <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-black w-64 transition-transform duration-300 z-40 shadow-2xl border-r border-gray-800 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        
        {/* User Profile Section - Glossy Black */}
        <div className="p-4 sm:p-6 border-b border-gray-800 bg-gradient-to-br from-gray-900 via-black to-black">
          <div className="flex items-center gap-3">
            {/* Shining Avatar with Blue Glow */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-[0_0_20px_rgba(59,130,246,0.5)] flex-shrink-0 ring-2 ring-blue-500/30">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-bold text-white truncate">
                {user?.user_metadata?.first_name || 'Faculty Member'}
              </p>
              <p className="text-xs text-gray-400 truncate">{user?.email || ''}</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu - Pure Black with Shine Effect */}
        <nav className="p-3 sm:p-4 space-y-1 overflow-y-auto h-[calc(100vh-12rem)]">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 sm:px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]'
                    : 'text-gray-300 hover:bg-gradient-to-r hover:from-gray-900 hover:to-gray-800 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                }`}
              >
                <span className={`${isActive ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'text-gray-400'}`}>
                  {item.icon}
                </span>
                <span className="font-medium text-sm sm:text-base">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Bottom Shine Accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-30"></div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden" />
      )}
    </>
  )
}
