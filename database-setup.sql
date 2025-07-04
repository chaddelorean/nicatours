-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  salt VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert a default user (username: admin, password: admin123)
-- Password hash is for 'admin123' with bcrypt
INSERT INTO users (username, password_hash, salt) 
VALUES ('admin', '$2a$10$eImiTXuWVxfM37uY4JANjO.8GJkAPqNdW1uNV5YzjBcJmkGrPnKDO', 'default_salt')
ON CONFLICT (username) DO NOTHING;

-- Create trips table to store calculated trip data
CREATE TABLE IF NOT EXISTS trips (
  id SERIAL PRIMARY KEY,
  kilometers_driven DECIMAL(10,2) NOT NULL,
  diesel_liters_used DECIMAL(10,2) NOT NULL,
  diesel_cost DECIMAL(10,2) NOT NULL,
  maintenance_cost DECIMAL(10,2) NOT NULL,
  profit_margin_percentage DECIMAL(5,2) NOT NULL,
  profit_amount DECIMAL(10,2) NOT NULL,
  grand_total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER REFERENCES users(id)
);

-- Create upcoming_rides table for calendar functionality
CREATE TABLE IF NOT EXISTS upcoming_rides (
  id SERIAL PRIMARY KEY,
  ride_date DATE NOT NULL,
  client_name VARCHAR(100) NOT NULL,
  client_phone VARCHAR(20) NOT NULL,
  client_email VARCHAR(100),
  trip_id INTEGER REFERENCES trips(id),
  notes TEXT,
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on ride_date for efficient calendar queries
CREATE INDEX IF NOT EXISTS idx_upcoming_rides_date ON upcoming_rides(ride_date);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_upcoming_rides_status ON upcoming_rides(status);
