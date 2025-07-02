const bcrypt = require('bcryptjs');
const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL);

async function createUser(username, password) {
  try {
    // Generate salt and hash the password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);

    // Check if user already exists
    const checkResult = await sql`SELECT username FROM users WHERE username = ${username}`;
    
    if (checkResult.length > 0) {
      console.log(`User '${username}' already exists in the database.`);
      return;
    }

    // Insert new user
    const result = await sql`
      INSERT INTO users (username, password_hash, salt)
      VALUES (${username}, ${passwordHash}, ${salt})
      RETURNING id, username, created_at
    `;
    
    if (result.length > 0) {
      const newUser = result[0];
      console.log('User created successfully:');
      console.log(`- ID: ${newUser.id}`);
      console.log(`- Username: ${newUser.username}`);
      console.log(`- Created at: ${newUser.created_at}`);
    }
    
  } catch (error) {
    console.error('Error creating user:', error.message);
  }
}

// Create the user
const username = 'chad';
const password = 'Medrano123';

console.log(`Creating user: ${username}`);
createUser(username, password);