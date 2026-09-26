import express from 'express'
import { register, login } from '../controllers/authController.js'
import { authenticateToken } from '../middleware/authMiddleware.js'
import pool from '../config/database.js'

const router = express.Router()

router.post('/register', register)

router.post('/login', login)

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         id,
         full_name,
         email,
         role,
         photo_url,
         created_at
       FROM users
       WHERE id = $1`,
      [req.user.id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur introuvable'
      })
    }

    res.json({
      success: true,
      user: result.rows[0]
    })
  } catch (error) {
    console.error('Me error:', error)

    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    })
  }
})

export default router
