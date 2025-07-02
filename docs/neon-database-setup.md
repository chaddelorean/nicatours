# Neon Database Setup for Vercel Deployment

This project has been updated to use the `@neondatabase/serverless` driver, which is optimized for serverless environments like Vercel.

## Key Changes Made

1. **Replaced `pg` with `@neondatabase/serverless`**: The traditional node-postgres driver has been replaced with Neon's serverless driver for better performance in serverless environments.

2. **Updated query syntax**: Changed from parameterized queries (`$1`, `$2`) to template literals for better compatibility with the Neon driver.

3. **Removed connection pooling**: The serverless driver handles connections automatically, eliminating the need for manual pool management.

## Files Updated

- `src/app/api/auth/route.ts` - Updated authentication API route
- `scripts/create-user.js` - Updated user creation script
- `package.json` - Removed `pg` and `@types/pg` dependencies
- `.env.example` - Added Neon-specific documentation

## Environment Variables

Update your `.env` file with your Neon database connection string:

```env
DATABASE_URL=postgresql://username:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

## Benefits of Neon Serverless Driver

- **Optimized for serverless**: Designed specifically for edge and serverless environments
- **Better cold start performance**: Faster connection establishment
- **Automatic connection management**: No need to manage connection pools
- **Vercel integration**: Works seamlessly with Vercel's serverless functions
- **Edge-compatible**: Can be used in Edge Runtime environments

## Usage Examples

### Basic Query
```typescript
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

// Using template literals
const users = await sql`SELECT * FROM users WHERE username = ${username}`
```

### Insert with Returning
```typescript
const result = await sql`
  INSERT INTO users (username, password_hash, salt) 
  VALUES (${username}, ${passwordHash}, ${salt})
  RETURNING id, username, created_at
`
```

## Deployment Notes

- Ensure your Neon database allows connections from Vercel's IP ranges
- The `sslmode=require` parameter is recommended for production
- No additional configuration needed for Vercel deployment