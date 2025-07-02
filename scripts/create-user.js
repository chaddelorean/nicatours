const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function createUser(username, password) {
  try {
    // Generate salt and hash the password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);

    const client = await pool.connect();
    
    try {
      // Check if user already exists
      const checkQuery = 'SELECT username FROM users WHERE username = $1';
      const checkResult = await client.query(checkQuery, [username]);
      
      if (checkResult.rows.length > 0) {
        console.log(`User '${username}' already exists in the database.`);
        return;
      }

      // Insert new user
      const insertQuery = `
        INSERT INTO users (username, password_hash, salt) 
        VALUES ($1, $2, $3)
        RETURNING id, username, created_at
      `;
      
      const result = await client.query(insertQuery, [username, passwordHash, salt]);
      
      if (result.rows.length > 0) {
        const newUser = result.rows[0];
        console.log('User created successfully:');
        console.log(`- ID: ${newUser.id}`);
        console.log(`- Username: ${newUser.username}`);
        console.log(`- Created at: ${newUser.created_at}`);
      }
      
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('Error creating user:', error.message);
  } finally {
    await pool.end();
  }
}

// Create the user
const username = 'chad';
const password = 'Medrano123';

console.log(`Creating user: ${username}`);
createUser(username, password);