import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

import pool from './config/database.js'

import authRoutes from './routes/authRoutes.js'
import profileRoutes from './routes/profileRoutes.js'
import rankingRoutes from './routes/rankingRoutes.js'
import candidatesRoutes from './routes/candidatesRoutes.js'
import concoursRoutes from './routes/concoursRoutes.js'
import menuRoutes from './routes/menuRoutes.js'
import statusRoutes from './routes/statusRoutes.js'

dotenv.config()

const app = express()

const PORT = process.env.PORT || 5000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const uploadsPath = path.join(__dirname, '../uploads')

/*
|--------------------------------------------------------------------------
| Middlewares
|--------------------------------------------------------------------------
*/

app.use(cors())

app.use(express.json())

app.use(express.urlencoded({
  extended: true
}))

/*
|--------------------------------------------------------------------------
| Static files
|--------------------------------------------------------------------------
*/

app.use(
  '/uploads',
  express.static(uploadsPath)
)

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use(
  '/api/auth',
  authRoutes
)

app.use(
  '/api/profile',
  profileRoutes
)

app.use(
  '/api/ranking',
  rankingRoutes
)

app.use(
  '/api/candidates',
  candidatesRoutes
)

app.use(
  '/api/concours',
  concoursRoutes
)

app.use(
  '/api/menu',
  menuRoutes
)

app.use(
  '/api/status',
  statusRoutes
)

/*
|--------------------------------------------------------------------------
| API principal
|--------------------------------------------------------------------------
*/

app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'VoxStar API fonctionne 🚀'
  })
})

/*
|--------------------------------------------------------------------------
| Health check
|--------------------------------------------------------------------------
*/

app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT NOW()'
    )

    res.json({
      success: true,
      status: 'OK',
      database: 'PostgreSQL connected',
      time: result.rows[0].now
    })
  } catch (error) {
    console.error(
      'PostgreSQL error:',
      error
    )

    res.status(500).json({
      success: false,
      status: 'ERROR',
      database: 'PostgreSQL connection failed',
      message: error.message
    })
  }
})

/*
|--------------------------------------------------------------------------
| 404 API
|--------------------------------------------------------------------------
*/

app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route API introuvable'
  })
})

/*
|--------------------------------------------------------------------------
| Error handler
|--------------------------------------------------------------------------
*/

app.use((error, req, res, next) => {
  console.error(
    'Server error:',
    error
  )

  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur'
  })
})

/*
|--------------------------------------------------------------------------
| Start server
|--------------------------------------------------------------------------
*/

app.listen(PORT, () => {
  console.log('')
  console.log('=================================')
  console.log('🚀 VOXSTAR BACKEND')
  console.log('=================================')
  console.log(`📡 API: http://localhost:${PORT}/api`)
  console.log(`❤️ Health: http://localhost:${PORT}/api/health`)
  console.log(`👤 Auth: http://localhost:${PORT}/api/auth`)
  console.log(`📊 Ranking: http://localhost:${PORT}/api/ranking`)
  console.log(`👥 Candidates: http://localhost:${PORT}/api/candidates`)
  console.log(`🏆 Concours: http://localhost:${PORT}/api/concours`)
  console.log(`📋 Menu: http://localhost:${PORT}/api/menu`)
  console.log(`🔐 Status: http://localhost:${PORT}/api/status`)
  console.log('=================================')
  console.log('')
})
