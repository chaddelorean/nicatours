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

    // Get upcoming ride data from request body
    const { 
      rideDate,
      clientName,
      clientPhone,
      clientEmail,
      tripId,
      notes
    } = await request.json()

    // Validate required fields
    if (!rideDate || !clientName || !clientPhone) {
      return NextResponse.json(
        { error: 'Fecha, nombre del cliente y teléfono son requeridos' },
        { status: 400 }
      )
    }

    // Insert upcoming ride into database
    const result = await sql`
      INSERT INTO upcoming_rides (
        ride_date,
        client_name,
        client_phone,
        client_email,
        trip_id,
        notes
      ) VALUES (
        ${rideDate},
        ${clientName},
        ${clientPhone},
        ${clientEmail || null},
        ${tripId || null},
        ${notes || null}
      )
      RETURNING id, created_at
    `

    return NextResponse.json({ 
      success: true, 
      message: 'Viaje programado exitosamente',
      rideId: result[0].id,
      createdAt: result[0].created_at
    })

  } catch (error) {
    console.error('Error saving upcoming ride:', error)
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
    try {
      jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret')
    } catch (error) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    // Get all upcoming rides
    const upcomingRides = await sql`
      SELECT 
        ur.id,
        ur.ride_date,
        ur.client_name,
        ur.client_phone,
        ur.client_email,
        ur.notes,
        ur.status,
        ur.created_at,
        t.grand_total as trip_total
      FROM upcoming_rides ur
      LEFT JOIN trips t ON ur.trip_id = t.id
      ORDER BY ur.ride_date ASC
    `

    return NextResponse.json({ upcomingRides })

  } catch (error) {
    console.error('Error fetching upcoming rides:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}