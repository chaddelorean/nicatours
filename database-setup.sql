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
