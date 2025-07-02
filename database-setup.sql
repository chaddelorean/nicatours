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
