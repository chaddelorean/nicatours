'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface HeaderProps {
  onLogout?: () => void
}

export default function Header({ onLogout }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    } else {
      localStorage.removeItem('jwt_token')
      window.location.href = '/login'
    }
  }

  const navItems = [
    { href: '/', label: 'Inicio', icon: '🏠' },
    { href: '/calculadora', label: 'Calculadora', icon: '💰' },
    { href: '/trips', label: 'Viajes', icon: '🚐' },
    { href: '/analytics', label: 'Análisis', icon: '📊' },
    { href: '#', label: 'Reservas', icon: '📋', disabled: true },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-nicaragua-blue hover:text-blue-700 transition-colors">
              🚐 Nicatours
            </h1>
            <span className="hidden sm:block text-sm text-gray-600">
              Transporte Turístico Nicaragua
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.disabled ? '#' : item.href}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === item.href
                    ? 'text-nicaragua-blue bg-blue-50 shadow-sm border-l-2 border-nicaragua-blue'
                    : item.disabled
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:text-nicaragua-blue hover:bg-gray-50 hover:shadow-sm'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {item.disabled && (
                  <span className="text-xs bg-gray-200 px-1 rounded">Próximo</span>
                )}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-600 transition-all duration-200 flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-red-50 hover:shadow-sm"
            >
              <span>🚪</span>
              <span>Cerrar Sesión</span>
            </button>
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-nicaragua-blue hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-nicaragua-blue focus:ring-opacity-50"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <div className="w-6 h-6 relative">
              <span
                className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${
                  isMenuOpen ? 'rotate-45 top-2.5' : 'top-1'
                }`}
              />
              <span
                className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${
                  isMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100 top-2.5'
                }`}
              />
              <span
                className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${
                  isMenuOpen ? '-rotate-45 top-2.5' : 'top-4'
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0 pb-0'
          }`}
        >
          <nav className="pt-4 border-t border-gray-200 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.disabled ? '#' : item.href}
                className={`flex items-center justify-between mx-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === item.href
                    ? 'text-nicaragua-blue bg-blue-50 border-l-4 border-nicaragua-blue shadow-sm'
                    : item.disabled
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:text-nicaragua-blue hover:bg-gray-50 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.disabled && (
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded">Próximo</span>
                )}
                {pathname === item.href && (
                  <div className="w-2 h-2 bg-nicaragua-blue rounded-full" />
                )}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between mx-2 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 hover:shadow-sm transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">🚪</span>
                <span>Cerrar Sesión</span>
              </div>
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}