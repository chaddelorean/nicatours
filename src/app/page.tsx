'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from './components/Header'

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('jwt_token')
    if (!token) {
      router.push('/login')
      return
    }

    // Validate JWT token
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const isExpired = payload.exp * 1000 < Date.now()
      
      if (isExpired) {
        localStorage.removeItem('jwt_token')
        router.push('/login')
        return
      }
      
      setIsAuthenticated(true)
    } catch (error) {
      localStorage.removeItem('jwt_token')
      router.push('/login')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('jwt_token')
    router.push('/login')
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header onLogout={handleLogout} />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Explora Nicaragua
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-8">
            Transporte seguro y cómodo para grupos de hasta 13 pasajeros
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">🚐</div>
                <h3 className="font-semibold mb-2">Van Moderna</h3>
                <p className="text-sm text-blue-100">
                  Hyundai H1 2013 con motor diésel
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">👥</div>
                <h3 className="font-semibold mb-2">13 Pasajeros</h3>
                <p className="text-sm text-blue-100">
                  Capacidad para grupos grandes
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🗺️</div>
                <h3 className="font-semibold mb-2">Todo Nicaragua</h3>
                <p className="text-sm text-blue-100">
                  Recogida y destino en cualquier parte del país
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Cards */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            Herramientas de Gestión
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <Link href="/calculadora" className="group">
              <div className="card hover:shadow-xl transition-shadow duration-300">
                <div className="text-center">
                  <div className="text-4xl mb-4">💰</div>
                  <h4 className="text-xl font-semibold text-nicaragua-blue mb-2">
                    Calculadora de Precios
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Calcula el precio del viaje basado en kilómetros, 
                    combustible y margen de ganancia
                  </p>
                  <div className="btn-primary inline-block group-hover:bg-blue-700">
                    Abrir Calculadora
                  </div>
                </div>
              </div>
            </Link>
            
            <div className="card opacity-75">
              <div className="text-center">
                <div className="text-4xl mb-4">📋</div>
                <h4 className="text-xl font-semibold text-gray-500 mb-2">
                  Gestión de Reservas
                </h4>
                <p className="text-gray-400 mb-4">
                  Próximamente: Sistema de reservas y calendario
                </p>
                <div className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg inline-block">
                  Próximamente
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/20">
        <div className="max-w-4xl mx-auto text-center text-blue-100">
          <p>&copy; {new Date().getFullYear()} Nicatours. Transporte turístico en Nicaragua.</p>
        </div>
      </footer>
    </div>
  )
}