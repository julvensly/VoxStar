import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

import pool from './config/database.js'

import createConcoursRoutes from './routes/createConcoursRoutes.js'
import concoursRoutes from './routes/concoursRoutes.js'
import gererConcoursRoutes from './routes/gererConcoursRoutes.js'
import authRoutes from './routes/authRoutes.js'
import menuRoutes from './routes/menuRoutes.js'
import candidatesRoutes from './routes/candidatesRoutes.js'
import inscritsRoutes from './routes/inscritsRoutes.js'
import voteRoutes from './routes/voteRoutes.js'
import rankingRoutes from './routes/rankingRoutes.js'
import profileRoutes from './routes/profileRoutes.js'
import statusRoutes from './routes/statusRoutes.js'
dotenv.config()

const app = express()

const PORT = process.env.PORT || 5000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const uploadsPath = path.join(__dirname, '../uploads')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/uploads', express.static(uploadsPath))

app.use('/api/concours', createConcoursRoutes)
app.use('/api/concours', concoursRoutes)
app.use('/api/concours', gererConcoursRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/menu', menuRoutes)
app.use('/api/candidates', candidatesRoutes)
app.use('/api/inscrits', inscritsRoutes)
app.use('/api/votes', voteRoutes)
app.use('/api/ranking', rankingRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/status', statusRoutes)
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
    console.error('PostgreSQL error:', error)

    res.status(500).json({
      success: false,
      status: 'ERROR',
      database: 'PostgreSQL connection failed',
      message: error.message
    })
  }
})

app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route API introuvable'
  })
})

app.use((error, req, res, next) => {
  console.error('Server error:', error)

  res.status(500).json({
    success: false,
    message: error.message || 'Erreur interne du serveur'
  })
})

app.listen(PORT, () => {
  console.log('')
  console.log('=================================')
  console.log('🚀 VOXSTAR BACKEND')
  console.log('=================================')
  console.log(`📡 API: http://localhost:${PORT}/api`)
  console.log(`❤️ Health: http://localhost:${PORT}/api/health`)
  console.log(`🏆 Créer concours: POST http://localhost:${PORT}/api/concours`)
  console.log('=================================')
  console.log('')
})
