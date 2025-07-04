'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from './components/Header'

interface TodaysRide {
  id: number
  ride_date: string
  client_name: string
  client_phone: string
  client_email?: string
  notes?: string
  status: string
  trip_total?: number
}

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [todaysRides, setTodaysRides] = useState<TodaysRide[]>([])
  const [isLoadingRides, setIsLoadingRides] = useState(false)
  const router = useRouter()

  const fetchTodaysRides = async () => {
    setIsLoadingRides(true)
    try {
      const token = localStorage.getItem('jwt_token')
      if (!token) return

      const response = await fetch('/api/upcoming-rides', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        const today = new Date().toISOString().split('T')[0]
        
        // Filter rides for today
        const todaysRides = data.upcomingRides.filter((ride: TodaysRide) =>
          ride.ride_date === today && ride.status === 'scheduled'
        )
        
        setTodaysRides(todaysRides)
      }
    } catch (error) {
      console.error('Error fetching today\'s rides:', error)
    } finally {
      setIsLoadingRides(false)
    }
  }

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
      fetchTodaysRides()
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

      {/* Today's Rides Section */}
      {todaysRides.length > 0 && (
        <section className="py-8 px-4 bg-gradient-to-r from-green-600/20 to-blue-600/20 border-b border-white/10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="text-3xl mr-3">📅</span>
                Viajes de Hoy
              </h2>
              <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {todaysRides.length} {todaysRides.length === 1 ? 'viaje' : 'viajes'}
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {todaysRides.map((ride) => (
                <div key={ride.id} className="bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-nicaragua-blue text-lg">
                        {ride.client_name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        📞 {ride.client_phone}
                      </p>
                      {ride.client_email && (
                        <p className="text-gray-600 text-sm">
                          ✉️ {ride.client_email}
                        </p>
                      )}
                    </div>
                    {ride.trip_total && (
                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                        C$ {ride.trip_total}
                      </div>
                    )}
                  </div>
                  
                  {ride.notes && (
                    <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-700">
                      <strong>Notas:</strong> {ride.notes}
                    </div>
                  )}
                  
                  <div className="mt-3 flex items-center text-sm text-gray-500">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Programado para hoy
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {isLoadingRides && (
        <section className="py-4 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center text-white">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Cargando viajes de hoy...
            </div>
          </div>
        </section>
      )}

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Explora Nicaragua
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-8">
            Transporte seguro y cómodo para grupos de hasta 11 pasajeros
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
                <h3 className="font-semibold mb-2">11 Pasajeros</h3>
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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

            <Link href="/trips" className="group">
              <div className="card hover:shadow-xl transition-shadow duration-300">
                <div className="text-center">
                  <div className="text-4xl mb-4">🚐</div>
                  <h4 className="text-xl font-semibold text-nicaragua-blue mb-2">
                    Historial de Viajes
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Ver todos los viajes registrados con paginación
                    y detalles completos
                  </p>
                  <div className="btn-primary inline-block group-hover:bg-blue-700">
                    Ver Viajes
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