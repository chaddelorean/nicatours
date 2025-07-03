'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../components/Header'

interface Trip {
  id: number
  kilometers_driven: number | string
  diesel_liters_used: number | string
  diesel_cost: number | string
  maintenance_cost: number | string
  profit_margin_percentage: number | string
  profit_amount: number | string
  grand_total: number | string
  created_at: string
  username: string
}

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalTrips: number
  limit: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export default function TripsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [trips, setTrips] = useState<Trip[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('jwt_token')
    if (!token) {
      router.push('/login')
      return
    }

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

  useEffect(() => {
    if (isAuthenticated) {
      fetchTrips(currentPage)
    }
  }, [isAuthenticated, currentPage, startDate, endDate])

  const fetchTrips = async (page: number) => {
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('jwt_token')
      if (!token) {
        router.push('/login')
        return
      }

      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      })

      if (startDate) {
        params.append('startDate', startDate)
      }
      if (endDate) {
        params.append('endDate', endDate)
      }

      const response = await fetch(`/api/trips/all?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (response.ok) {
        setTrips(data.trips)
        setPagination(data.pagination)
      } else {
        throw new Error(data.error || 'Error al cargar los viajes')
      }
    } catch (error) {
      console.error('Error fetching trips:', error)
      setError('Error al cargar los viajes')
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleDateFilterChange = (start: string, end: string) => {
    setStartDate(start)
    setEndDate(end)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const clearDateFilters = () => {
    setStartDate('')
    setEndDate('')
    setCurrentPage(1)
  }

  const handleDeleteTrip = async (tripId: number) => {
    setDeleteLoading(tripId)
    setError('')

    try {
      const token = localStorage.getItem('jwt_token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch('/api/trips', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tripId })
      })

      const data = await response.json()

      if (response.ok) {
        // Refresh the trips list
        await fetchTrips(currentPage)
        setShowDeleteConfirm(null)
      } else {
        throw new Error(data.error || 'Error al eliminar el viaje')
      }
    } catch (error) {
      console.error('Error deleting trip:', error)
      setError('Error al eliminar el viaje')
    } finally {
      setDeleteLoading(null)
    }
  }

  const confirmDelete = (tripId: number) => {
    setShowDeleteConfirm(tripId)
  }

  const cancelDelete = () => {
    setShowDeleteConfirm(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-NI', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    return `C$ ${(isNaN(numAmount) ? 0 : numAmount).toFixed(2)}`
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
      <Header />
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Todos los Viajes</h1>
            <p className="text-blue-100">Historial completo de todos los viajes registrados</p>
          </div>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
              {error}
            </div>
          )}
          {/* Date Range Filter */}
          <div className="card mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
              <div className="flex-1">
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de inicio
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => handleDateFilterChange(e.target.value, endDate)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-nicaragua-blue focus:border-nicaragua-blue"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de fin
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => handleDateFilterChange(startDate, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-nicaragua-blue focus:border-nicaragua-blue"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={clearDateFilters}
                  className="btn-secondary whitespace-nowrap"
                  disabled={!startDate && !endDate}
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
            {(startDate || endDate) && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-nicaragua-blue">
                  <span className="font-medium">Filtros activos:</span>
                  {startDate && ` Desde ${new Date(startDate).toLocaleDateString('es-NI')}`}
                  {startDate && endDate && ' - '}
                  {endDate && ` Hasta ${new Date(endDate).toLocaleDateString('es-NI')}`}
                </p>
              </div>
            )}
          </div>

          <div className="card">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nicaragua-blue mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando viajes...</p>
              </div>
            ) : trips.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">📋</div>
                <p className="text-lg">
                  {startDate || endDate ? 'No hay viajes en el rango de fechas seleccionado' : 'No hay viajes registrados'}
                </p>
              </div>
            ) : (
              <div>
                {/* Summary */}
                {pagination && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-nicaragua-blue">
                          Total de Viajes: {pagination.totalTrips}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Mostrando {((pagination.currentPage - 1) * pagination.limit) + 1} - {Math.min(pagination.currentPage * pagination.limit, pagination.totalTrips)} de {pagination.totalTrips}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          Página {pagination.currentPage} de {pagination.totalPages}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Table - Mobile View */}
                <div className="md:hidden space-y-4">
                  {trips.map((trip) => (
                    <div key={trip.id} className="bg-gray-50 p-4 rounded-lg border">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-nicaragua-blue">#{trip.id}</span>
                        <span className="text-sm text-gray-500">{formatDate(trip.created_at)}</span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Usuario:</span>
                          <span className="font-medium">{trip.username}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Kilómetros:</span>
                          <span>{parseFloat(trip.kilometers_driven.toString()).toFixed(1)} km</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Litros:</span>
                          <span>{parseFloat(trip.diesel_liters_used.toString()).toFixed(2)} L</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Margen:</span>
                          <span>{parseFloat(trip.profit_margin_percentage.toString()).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between font-semibold text-nicaragua-blue pt-2 border-t">
                          <span>Total:</span>
                          <span>{formatCurrency(trip.grand_total)}</span>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <button
                          onClick={() => confirmDelete(trip.id)}
                          disabled={deleteLoading === trip.id}
                          className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                        >
                          {deleteLoading === trip.id ? 'Eliminando...' : 'Eliminar Viaje'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Table - Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kilómetros</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Litros</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Margen</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {trips.map((trip) => (
                        <tr key={trip.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-nicaragua-blue">#{trip.id}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{trip.username}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{parseFloat(trip.kilometers_driven.toString()).toFixed(1)} km</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{parseFloat(trip.diesel_liters_used.toString()).toFixed(2)} L</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{parseFloat(trip.profit_margin_percentage.toString()).toFixed(1)}%</td>
                          <td className="px-4 py-3 text-sm font-semibold text-nicaragua-blue">{formatCurrency(trip.grand_total)}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{formatDate(trip.created_at)}</td>
                          <td className="px-4 py-3 text-sm">
                            <button
                              onClick={() => confirmDelete(trip.id)}
                              disabled={deleteLoading === trip.id}
                              className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                            >
                              {deleteLoading === trip.id ? 'Eliminando...' : 'Eliminar'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="mt-6">
                    {/* Mobile Pagination */}
                    <div className="flex flex-col space-y-3 md:hidden">
                      <div className="text-center text-sm text-gray-600">
                        Página {pagination.currentPage} de {pagination.totalPages}
                      </div>
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={!pagination.hasPrevPage}
                          className="flex-1 btn-secondary disabled:opacity-50 disabled:cursor-not-allowed text-sm py-2 max-w-[120px]"
                        >
                          ← Anterior
                        </button>
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={!pagination.hasNextPage}
                          className="flex-1 btn-secondary disabled:opacity-50 disabled:cursor-not-allowed text-sm py-2 max-w-[120px]"
                        >
                          Siguiente →
                        </button>
                      </div>
                    </div>

                    {/* Desktop Pagination */}
                    <div className="hidden md:flex items-center justify-between">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!pagination.hasPrevPage}
                        className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Anterior
                      </button>
                      <div className="flex space-x-2">
                        {(() => {
                          const totalPages = pagination.totalPages
                          const current = currentPage
                          const pages = []
                          
                          // Show first page
                          if (current > 3) {
                            pages.push(1)
                            if (current > 4) pages.push('...')
                          }
                          
                          // Show pages around current
                          for (let i = Math.max(1, current - 2); i <= Math.min(totalPages, current + 2); i++) {
                            pages.push(i)
                          }
                          
                          // Show last page
                          if (current < totalPages - 2) {
                            if (current < totalPages - 3) pages.push('...')
                            pages.push(totalPages)
                          }
                          
                          return pages.map((page, index) => (
                            page === '...' ? (
                              <span key={`ellipsis-${index}`} className="px-3 py-1 text-gray-500">...</span>
                            ) : (
                              <button
                                key={page}
                                onClick={() => handlePageChange(page as number)}
                                className={`px-3 py-1 rounded text-sm min-w-[40px] ${
                                  page === current
                                    ? 'bg-nicaragua-blue text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                              >
                                {page}
                              </button>
                            )
                          ))
                        })()}
                      </div>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!pagination.hasNextPage}
                        className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Siguiente
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
  
        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Confirmar Eliminación
              </h3>
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que deseas eliminar este viaje? Esta acción no se puede deshacer.
              </p>
              <div className="flex space-x-3 justify-end">
                <button
                  onClick={cancelDelete}
                  disabled={deleteLoading === showDeleteConfirm}
                  className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDeleteTrip(showDeleteConfirm)}
                  disabled={deleteLoading === showDeleteConfirm}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded font-medium transition-colors"
                >
                  {deleteLoading === showDeleteConfirm ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}