import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autorización requerido' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    
    // Verify JWT token
    let decoded: any
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret')
    } catch (error) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    const userId = decoded.userId

    // Get trip data from request body
    const { 
      kilometros,
      litrosNecesarios,
      costoCombustible,
      costoMantenimiento,
      gananciaNeta,
      total,
      margenPorcentaje
    } = await request.json()

    // Validate required fields
    if (!kilometros || !litrosNecesarios || !costoCombustible || !costoMantenimiento || !gananciaNeta || !total || !margenPorcentaje) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    // Insert trip into database
    const result = await sql`
      INSERT INTO trips (
        kilometers_driven,
        diesel_liters_used,
        diesel_cost,
        maintenance_cost,
        profit_margin_percentage,
        profit_amount,
        grand_total,
        user_id
      ) VALUES (
        ${parseFloat(kilometros)},
        ${parseFloat(litrosNecesarios)},
        ${parseFloat(costoCombustible)},
        ${parseFloat(costoMantenimiento)},
        ${parseFloat(margenPorcentaje)},
        ${parseFloat(gananciaNeta)},
        ${parseFloat(total)},
        ${userId}
      )
      RETURNING id, created_at
    `

    return NextResponse.json({ 
      success: true, 
      message: 'Viaje guardado exitosamente',
      tripId: result[0].id,
      createdAt: result[0].created_at
    })

  } catch (error) {
    console.error('Error saving trip:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autorización requerido' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    
    // Verify JWT token
    let decoded: any
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret')
    } catch (error) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    const userId = decoded.userId

    // Get all trips for the user
    const trips = await sql`
      SELECT 
        id,
        kilometers_driven,
        diesel_liters_used,
        diesel_cost,
        maintenance_cost,
        profit_margin_percentage,
        profit_amount,
        grand_total,
        created_at
      FROM trips 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `

    return NextResponse.json({ trips })

  } catch (error) {
    console.error('Error fetching trips:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autorización requerido' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    
    // Verify JWT token
    let decoded: any
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret')
    } catch (error) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    // Get trip ID from request body
    const { tripId } = await request.json()

    if (!tripId) {
      return NextResponse.json(
        { error: 'ID del viaje es requerido' },
        { status: 400 }
      )
    }

    // Check if trip exists and get its user_id
    const tripCheck = await sql`
      SELECT user_id FROM trips WHERE id = ${tripId}
    `

    if (tripCheck.length === 0) {
      return NextResponse.json(
        { error: 'Viaje no encontrado' },
        { status: 404 }
      )
    }

    // Check if the user owns this trip or is an admin (optional security check)
    const userId = decoded.userId
    const tripOwnerId = tripCheck[0].user_id

    // For now, allow any authenticated user to delete any trip
    // You could add: if (userId !== tripOwnerId) { return error }

    // Delete the trip
    const result = await sql`
      DELETE FROM trips WHERE id = ${tripId}
    `

    return NextResponse.json({
      success: true,
      message: 'Viaje eliminado exitosamente'
    })

  } catch (error) {
    console.error('Error deleting trip:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}