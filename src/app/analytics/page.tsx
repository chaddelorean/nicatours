'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ResponsiveLine } from '@nivo/line'
import Header from '../components/Header'

interface DailyData {
  x: string
  date: string
  tripCount: number
  totalKilometers: number
  totalLiters: number
  totalDieselCost: number
  totalMaintenanceCost: number
  totalProfit: number
  totalRevenue: number
  avgProfitMargin: number
}

interface SummaryData {
  totalTrips: number
  totalKilometers: number
  totalLiters: number
  totalDieselCost: number
  totalMaintenanceCost: number
  totalProfit: number
  totalRevenue: number
  avgProfitMargin: number
  maxTripValue: number
  minTripValue: number
}

interface TopDay {
  date: string
  tripCount: number
  dailyRevenue: number
  dailyProfit: number
}

interface AnalyticsData {
  dailyData: DailyData[]
  summary: SummaryData | null
  topDays: TopDay[]
}

export default function AnalyticsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [timePeriod, setTimePeriod] = useState('30')
  const [customDateRange, setCustomDateRange] = useState({
    startDate: '',
    endDate: ''
  })
  const [useCustomRange, setUseCustomRange] = useState(false)
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
      fetchAnalytics()
    }
  }, [isAuthenticated, timePeriod, customDateRange, useCustomRange])

  const fetchAnalytics = async () => {
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('jwt_token')
      if (!token) {
        router.push('/login')
        return
      }

      let url = '/api/analytics'
      const params = new URLSearchParams()

      if (useCustomRange && customDateRange.startDate && customDateRange.endDate) {
        params.append('startDate', customDateRange.startDate)
        params.append('endDate', customDateRange.endDate)
      } else {
        params.append('period', timePeriod)
      }

      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (response.ok) {
        setAnalyticsData(data)
      } else {
        throw new Error(data.error || 'Error al cargar analytics')
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setError('Error al cargar los datos de analytics')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return `C$ ${amount.toFixed(2)}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-NI', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
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
            <h1 className="text-3xl font-bold text-white mb-4">Análisis de Viajes</h1>
            <p className="text-blue-100">Análisis detallado de métricas y rendimiento</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
              {error}
            </div>
          )}

          {/* Time Period Controls */}
          <div className="card mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Período de Tiempo</h3>
            
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="timeMode"
                  checked={!useCustomRange}
                  onChange={() => setUseCustomRange(false)}
                  className="mr-2"
                />
                <span>Período predefinido</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="timeMode"
                  checked={useCustomRange}
                  onChange={() => setUseCustomRange(true)}
                  className="mr-2"
                />
                <span>Rango personalizado</span>
              </label>
            </div>

            {!useCustomRange ? (
              <div className="flex flex-wrap gap-2">
                {[
                  { value: '7', label: 'Últimos 7 días' },
                  { value: '30', label: 'Últimos 30 días' },
                  { value: '90', label: 'Últimos 3 meses' },
                  { value: '365', label: 'Último año' }
                ].map(period => (
                  <button
                    key={period.value}
                    onClick={() => setTimePeriod(period.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      timePeriod === period.value
                        ? 'bg-nicaragua-blue text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha inicial
                  </label>
                  <input
                    type="date"
                    value={customDateRange.startDate}
                    onChange={(e) => setCustomDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha final
                  </label>
                  <input
                    type="date"
                    value={customDateRange.endDate}
                    onChange={(e) => setCustomDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                    className="form-input"
                  />
                </div>
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nicaragua-blue mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando analytics...</p>
            </div>
          ) : analyticsData ? (
            <div className="space-y-8">
              {/* Summary Cards */}
              {analyticsData.summary && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="card">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-nicaragua-blue">{analyticsData.summary.totalTrips}</div>
                      <div className="text-sm text-gray-600">Total Viajes</div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{formatCurrency(analyticsData.summary.totalRevenue)}</div>
                      <div className="text-sm text-gray-600">Ingresos Totales</div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{formatCurrency(analyticsData.summary.totalProfit)}</div>
                      <div className="text-sm text-gray-600">Ganancias Totales</div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{analyticsData.summary.avgProfitMargin.toFixed(1)}%</div>
                      <div className="text-sm text-gray-600">Margen Promedio</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Charts Section */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Revenue Chart */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingresos Diarios</h3>
                  <div style={{ height: '300px' }}>
                    <ResponsiveLine
                      data={[{
                        id: 'Ingresos',
                        color: '#10B981',
                        data: analyticsData.dailyData.map(d => ({
                          x: d.date,
                          y: d.totalRevenue
                        }))
                      }]}
                      margin={{ top: 20, right: 50, bottom: 50, left: 70 }}
                      xScale={{ type: 'point' }}
                      yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                      yFormat=" >-.2f"
                      axisTop={null}
                      axisRight={null}
                      axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: -45,
                        legend: 'Fecha',
                        legendOffset: 45,
                        legendPosition: 'middle'
                      }}
                      axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Ingresos (C$)',
                        legendOffset: -55,
                        legendPosition: 'middle'
                      }}
                      pointSize={6}
                      pointColor={{ theme: 'background' }}
                      pointBorderWidth={2}
                      pointBorderColor={{ from: 'serieColor' }}
                      pointLabelYOffset={-12}
                      useMesh={true}
                      enableGridX={false}
                      colors={['#10B981']}
                    />
                  </div>
                </div>

                {/* Profit Chart */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Ganancias Diarias</h3>
                  <div style={{ height: '300px' }}>
                    <ResponsiveLine
                      data={[{
                        id: 'Ganancias',
                        color: '#3B82F6',
                        data: analyticsData.dailyData.map(d => ({
                          x: d.date,
                          y: d.totalProfit
                        }))
                      }]}
                      margin={{ top: 20, right: 50, bottom: 50, left: 70 }}
                      xScale={{ type: 'point' }}
                      yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                      yFormat=" >-.2f"
                      axisTop={null}
                      axisRight={null}
                      axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: -45,
                        legend: 'Fecha',
                        legendOffset: 45,
                        legendPosition: 'middle'
                      }}
                      axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Ganancias (C$)',
                        legendOffset: -55,
                        legendPosition: 'middle'
                      }}
                      pointSize={6}
                      pointColor={{ theme: 'background' }}
                      pointBorderWidth={2}
                      pointBorderColor={{ from: 'serieColor' }}
                      pointLabelYOffset={-12}
                      useMesh={true}
                      enableGridX={false}
                      colors={['#3B82F6']}
                    />
                  </div>
                </div>

                {/* Trip Count Chart */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Número de Viajes Diarios</h3>
                  <div style={{ height: '300px' }}>
                    <ResponsiveLine
                      data={[{
                        id: 'Viajes',
                        color: '#8B5CF6',
                        data: analyticsData.dailyData.map(d => ({
                          x: d.date,
                          y: d.tripCount
                        }))
                      }]}
                      margin={{ top: 20, right: 50, bottom: 50, left: 70 }}
                      xScale={{ type: 'point' }}
                      yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                      yFormat=" >-.0f"
                      axisTop={null}
                      axisRight={null}
                      axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: -45,
                        legend: 'Fecha',
                        legendOffset: 45,
                        legendPosition: 'middle'
                      }}
                      axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Número de Viajes',
                        legendOffset: -55,
                        legendPosition: 'middle'
                      }}
                      pointSize={6}
                      pointColor={{ theme: 'background' }}
                      pointBorderWidth={2}
                      pointBorderColor={{ from: 'serieColor' }}
                      pointLabelYOffset={-12}
                      useMesh={true}
                      enableGridX={false}
                      colors={['#8B5CF6']}
                    />
                  </div>
                </div>

                {/* Kilometers Chart */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Kilómetros Diarios</h3>
                  <div style={{ height: '300px' }}>
                    <ResponsiveLine
                      data={[{
                        id: 'Kilómetros',
                        color: '#F59E0B',
                        data: analyticsData.dailyData.map(d => ({
                          x: d.date,
                          y: d.totalKilometers
                        }))
                      }]}
                      margin={{ top: 20, right: 50, bottom: 50, left: 70 }}
                      xScale={{ type: 'point' }}
                      yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                      yFormat=" >-.1f"
                      axisTop={null}
                      axisRight={null}
                      axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: -45,
                        legend: 'Fecha',
                        legendOffset: 45,
                        legendPosition: 'middle'
                      }}
                      axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Kilómetros',
                        legendOffset: -55,
                        legendPosition: 'middle'
                      }}
                      pointSize={6}
                      pointColor={{ theme: 'background' }}
                      pointBorderWidth={2}
                      pointBorderColor={{ from: 'serieColor' }}
                      pointLabelYOffset={-12}
                      useMesh={true}
                      enableGridX={false}
                      colors={['#F59E0B']}
                    />
                  </div>
                </div>
              </div>

              {/* Top Performance Days */}
              {analyticsData.topDays && analyticsData.topDays.length > 0 && (
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Mejores Días por Ingresos</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Viajes</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ingresos</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ganancias</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {analyticsData.topDays.map((day, index) => (
                          <tr key={day.date} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">{formatDate(day.date)}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{day.tripCount}</td>
                            <td className="px-4 py-3 text-sm font-semibold text-green-600">{formatCurrency(day.dailyRevenue)}</td>
                            <td className="px-4 py-3 text-sm font-semibold text-blue-600">{formatCurrency(day.dailyProfit)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-4">📊</div>
              <p className="text-lg">No hay datos disponibles para el período seleccionado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}