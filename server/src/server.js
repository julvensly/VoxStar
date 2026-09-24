import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import pool from './config/database.js'
import authRoutes from './routes/authRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)

app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'VoxStar API fonctionne 🚀'
  })
})

app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()')

    res.json({
      success: true,
      status: 'OK',
      database: 'PostgreSQL connected',
      time: result.rows[0].now
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      success: false,
      database: 'PostgreSQL connection failed'
    })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 VoxStar Backend: http://localhost:${PORT}`)
})
