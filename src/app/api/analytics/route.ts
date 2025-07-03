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

    // Get time period parameters from URL
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // default to 30 days
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Get daily aggregated data
    let dailyData
    let summaryData
    let topDays

    if (startDate && endDate) {
      // Custom date range
      dailyData = await sql`
        SELECT
          DATE(created_at) as date,
          COUNT(*) as trip_count,
          SUM(kilometers_driven) as total_kilometers,
          SUM(diesel_liters_used) as total_liters,
          SUM(diesel_cost) as total_diesel_cost,
          SUM(maintenance_cost) as total_maintenance_cost,
          SUM(profit_amount) as total_profit,
          SUM(grand_total) as total_revenue,
          AVG(profit_margin_percentage) as avg_profit_margin
        FROM trips
        WHERE created_at >= ${startDate} AND created_at <= ${endDate}
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `

      summaryData = await sql`
        SELECT
          COUNT(*) as total_trips,
          SUM(kilometers_driven) as total_kilometers,
          SUM(diesel_liters_used) as total_liters,
          SUM(diesel_cost) as total_diesel_cost,
          SUM(maintenance_cost) as total_maintenance_cost,
          SUM(profit_amount) as total_profit,
          SUM(grand_total) as total_revenue,
          AVG(profit_margin_percentage) as avg_profit_margin,
          MAX(grand_total) as max_trip_value,
          MIN(grand_total) as min_trip_value
        FROM trips
        WHERE created_at >= ${startDate} AND created_at <= ${endDate}
      `

      topDays = await sql`
        SELECT
          DATE(created_at) as date,
          COUNT(*) as trip_count,
          SUM(grand_total) as daily_revenue,
          SUM(profit_amount) as daily_profit
        FROM trips
        WHERE created_at >= ${startDate} AND created_at <= ${endDate}
        GROUP BY DATE(created_at)
        ORDER BY daily_revenue DESC
        LIMIT 5
      `
    } else {
      // Predefined period (days)
      const days = parseInt(period)
      
      dailyData = await sql`
        SELECT
          DATE(created_at) as date,
          COUNT(*) as trip_count,
          SUM(kilometers_driven) as total_kilometers,
          SUM(diesel_liters_used) as total_liters,
          SUM(diesel_cost) as total_diesel_cost,
          SUM(maintenance_cost) as total_maintenance_cost,
          SUM(profit_amount) as total_profit,
          SUM(grand_total) as total_revenue,
          AVG(profit_margin_percentage) as avg_profit_margin
        FROM trips
        WHERE created_at >= NOW() - INTERVAL '${days} days'
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `

      summaryData = await sql`
        SELECT
          COUNT(*) as total_trips,
          SUM(kilometers_driven) as total_kilometers,
          SUM(diesel_liters_used) as total_liters,
          SUM(diesel_cost) as total_diesel_cost,
          SUM(maintenance_cost) as total_maintenance_cost,
          SUM(profit_amount) as total_profit,
          SUM(grand_total) as total_revenue,
          AVG(profit_margin_percentage) as avg_profit_margin,
          MAX(grand_total) as max_trip_value,
          MIN(grand_total) as min_trip_value
        FROM trips
        WHERE created_at >= NOW() - INTERVAL '${days} days'
      `

      topDays = await sql`
        SELECT
          DATE(created_at) as date,
          COUNT(*) as trip_count,
          SUM(grand_total) as daily_revenue,
          SUM(profit_amount) as daily_profit
        FROM trips
        WHERE created_at >= NOW() - INTERVAL '${days} days'
        GROUP BY DATE(created_at)
        ORDER BY daily_revenue DESC
        LIMIT 5
      `
    }

    // Format data for charts
    const formattedDailyData = dailyData.map(row => ({
      x: row.date,
      date: row.date,
      tripCount: parseInt(row.trip_count),
      totalKilometers: parseFloat(row.total_kilometers || 0),
      totalLiters: parseFloat(row.total_liters || 0),
      totalDieselCost: parseFloat(row.total_diesel_cost || 0),
      totalMaintenanceCost: parseFloat(row.total_maintenance_cost || 0),
      totalProfit: parseFloat(row.total_profit || 0),
      totalRevenue: parseFloat(row.total_revenue || 0),
      avgProfitMargin: parseFloat(row.avg_profit_margin || 0)
    }))

    const summary = summaryData[0] ? {
      totalTrips: parseInt(summaryData[0].total_trips),
      totalKilometers: parseFloat(summaryData[0].total_kilometers || 0),
      totalLiters: parseFloat(summaryData[0].total_liters || 0),
      totalDieselCost: parseFloat(summaryData[0].total_diesel_cost || 0),
      totalMaintenanceCost: parseFloat(summaryData[0].total_maintenance_cost || 0),
      totalProfit: parseFloat(summaryData[0].total_profit || 0),
      totalRevenue: parseFloat(summaryData[0].total_revenue || 0),
      avgProfitMargin: parseFloat(summaryData[0].avg_profit_margin || 0),
      maxTripValue: parseFloat(summaryData[0].max_trip_value || 0),
      minTripValue: parseFloat(summaryData[0].min_trip_value || 0)
    } : null

    const formattedTopDays = topDays.map(row => ({
      date: row.date,
      tripCount: parseInt(row.trip_count),
      dailyRevenue: parseFloat(row.daily_revenue || 0),
      dailyProfit: parseFloat(row.daily_profit || 0)
    }))

    return NextResponse.json({
      dailyData: formattedDailyData,
      summary,
      topDays: formattedTopDays
    })

  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}