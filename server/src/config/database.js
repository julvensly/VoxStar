import pg from 'pg'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const { Pool } = pg

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const envPath = path.join(__dirname, '../../.env')

dotenv.config({
  path: envPath
})

if (!process.env.DATABASE_URL) {
  throw new Error(
    `DATABASE_URL introuvable dans ${envPath}`
  )
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

pool.on('error', (error) => {
  console.error('PostgreSQL error:', error)
})

export default pool
