import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

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

    // Get pagination and filter parameters from URL
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Get total count and trips with date filtering
    let countResult: any
    let trips: any

    if (startDate && endDate) {
      // Both start and end date provided
      const endDateTime = endDate + ' 23:59:59'
      
      countResult = await sql`
        SELECT COUNT(*) as total
        FROM trips t
        WHERE t.created_at >= ${startDate} AND t.created_at <= ${endDateTime}
      `
      
      trips = await sql`
        SELECT
          t.id,
          t.kilometers_driven,
          t.diesel_liters_used,
          t.diesel_cost,
          t.maintenance_cost,
          t.profit_margin_percentage,
          t.profit_amount,
          t.grand_total,
          t.created_at,
          u.username
        FROM trips t
        JOIN users u ON t.user_id = u.id
        WHERE t.created_at >= ${startDate} AND t.created_at <= ${endDateTime}
        ORDER BY t.created_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `
    } else if (startDate) {
      // Only start date provided
      countResult = await sql`
        SELECT COUNT(*) as total
        FROM trips t
        WHERE t.created_at >= ${startDate}
      `
      
      trips = await sql`
        SELECT
          t.id,
          t.kilometers_driven,
          t.diesel_liters_used,
          t.diesel_cost,
          t.maintenance_cost,
          t.profit_margin_percentage,
          t.profit_amount,
          t.grand_total,
          t.created_at,
          u.username
        FROM trips t
        JOIN users u ON t.user_id = u.id
        WHERE t.created_at >= ${startDate}
        ORDER BY t.created_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `
    } else if (endDate) {
      // Only end date provided
      const endDateTime = endDate + ' 23:59:59'
      
      countResult = await sql`
        SELECT COUNT(*) as total
        FROM trips t
        WHERE t.created_at <= ${endDateTime}
      `
      
      trips = await sql`
        SELECT
          t.id,
          t.kilometers_driven,
          t.diesel_liters_used,
          t.diesel_cost,
          t.maintenance_cost,
          t.profit_margin_percentage,
          t.profit_amount,
          t.grand_total,
          t.created_at,
          u.username
        FROM trips t
        JOIN users u ON t.user_id = u.id
        WHERE t.created_at <= ${endDateTime}
        ORDER BY t.created_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `
    } else {
      // No date filtering
      countResult = await sql`
        SELECT COUNT(*) as total
        FROM trips
      `
      
      trips = await sql`
        SELECT
          t.id,
          t.kilometers_driven,
          t.diesel_liters_used,
          t.diesel_cost,
          t.maintenance_cost,
          t.profit_margin_percentage,
          t.profit_amount,
          t.grand_total,
          t.created_at,
          u.username
        FROM trips t
        JOIN users u ON t.user_id = u.id
        ORDER BY t.created_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `
    }

    const totalTrips = parseInt(countResult[0].total)
    const totalPages = Math.ceil(totalTrips / limit)

    return NextResponse.json({ 
      trips,
      pagination: {
        currentPage: page,
        totalPages,
        totalTrips,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    })

  } catch (error) {
    console.error('Error fetching all trips:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}