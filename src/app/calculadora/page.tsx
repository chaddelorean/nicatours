'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '../components/Header'

export default function CalculadoraPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [kilometros, setKilometros] = useState('')
  const [precioDiesel, setPrecioDiesel] = useState('')
  const [margenGanancia, setMargenGanancia] = useState('600')
  const [resultado, setResultado] = useState<any>(null)
  const router = useRouter()
  const resultsRef = useRef<HTMLDivElement>(null)

  // Fuel economy constant: 10.2 liters per kilometer
  const CONSUMO_KM_POR_LITROS = 10.2

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

  const calcularPrecio = () => {
    const km = parseFloat(kilometros)
    const precioLitro = parseFloat(precioDiesel)
    const margen = parseFloat(margenGanancia)

    if (!km || !precioLitro || !margen) {
      alert('Todos los campos son requeridos')
      return
    }

    if (margen < 100 || margen > 1000) {
      alert('El margen de ganancia debe estar entre 100% y 1000%')
      return
    }

    // Calculate fuel cost
    const litrosNecesarios = km / CONSUMO_KM_POR_LITROS
    const costoCombustible = litrosNecesarios * precioLitro

    // Calculate maintenance cost (20% of fuel cost)
    const costoMantenimiento = costoCombustible * 0.20

    // Calculate profit margin
    const gananciaNeta = costoCombustible * (margen / 100)

    // Calculate total
    const total = costoCombustible + costoMantenimiento + gananciaNeta

    setResultado({
      kilometros: km,
      litrosNecesarios: litrosNecesarios.toFixed(2),
      costoCombustible: costoCombustible.toFixed(2),
      costoMantenimiento: costoMantenimiento.toFixed(2),
      gananciaNeta: gananciaNeta.toFixed(2),
      total: total.toFixed(2),
      margenPorcentaje: margen
    })

    // Scroll to results section after calculation
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }, 100)
  }

  const limpiarFormulario = () => {
    setKilometros('')
    setPrecioDiesel('')
    setMargenGanancia('')
    setResultado(null)
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">
              Calculadora de Precios de Viaje
            </h1>
            <p className="text-blue-100">
              Calcula el costo total del viaje basado en kilómetros, precio del diésel y margen de ganancia
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Formulario */}
            <div className="card">
              <h2 className="text-xl font-semibold text-nicaragua-blue mb-6">
                Datos del Viaje
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Kilómetros Totales
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Ingrese los kilómetros totales"
                    value={kilometros}
                    onChange={(e) => setKilometros(e.target.value)}
                    min="0"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Precio del Diésel (Córdobas por litro)
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Precio actual del diésel"
                    value={precioDiesel}
                    onChange={(e) => setPrecioDiesel(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Margen de Ganancia (100% - 1000%)
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Porcentaje de ganancia"
                    value={margenGanancia}
                    onChange={(e) => setMargenGanancia(e.target.value)}
                    min="10"
                    max="100"
                    step="1"
                  />
                </div>

                <div className="pt-4 space-y-3">
                  <button
                    onClick={calcularPrecio}
                    className="btn-primary w-full"
                  >
                    Calcular Precio
                  </button>
                  <button
                    onClick={limpiarFormulario}
                    className="btn-secondary w-full"
                  >
                    Limpiar Formulario
                  </button>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-nicaragua-blue mb-2">
                  Información del Vehículo
                </h3>
                <p className="text-sm text-gray-600">
                  <strong>Vehículo:</strong> Hyundai H1 2013 Diésel<br/>
                  <strong>Consumo:</strong> {CONSUMO_KM_POR_LITROS} kilómetro  por litros<br/>
                  <strong>Capacidad:</strong> 11 pasajeros
                </p>
              </div>
            </div>

            {/* Resultados */}
            <div ref={resultsRef} className="card">
              <h2 className="text-xl font-semibold text-nicaragua-blue mb-6">
                Desglose de Costos
              </h2>
              
              {resultado ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 mb-3">Cálculos Base</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Kilómetros:</span>
                        <span className="font-medium">{resultado.kilometros} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Litros necesarios:</span>
                        <span className="font-medium">{resultado.litrosNecesarios} L</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">Costo de Combustible:</span>
                      <span className="font-semibold">C$ {resultado.costoCombustible}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">Mantenimiento (20%):</span>
                      <span className="font-semibold">C$ {resultado.costoMantenimiento}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">Ganancia ({resultado.margenPorcentaje}%):</span>
                      <span className="font-semibold">C$ {resultado.gananciaNeta}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 bg-nicaragua-blue text-white px-4 rounded-lg">
                      <span className="font-bold text-lg">TOTAL:</span>
                      <span className="font-bold text-2xl">C$ {resultado.total}</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">
                      <strong>Precio recomendado:</strong> C$ {resultado.total}<br/>
                      Este precio incluye combustible, mantenimiento y su margen de ganancia.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-4">💰</div>
                  <p>Complete el formulario para ver el desglose de costos</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
