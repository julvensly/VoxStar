import jwt from 'jsonwebtoken'

export function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Token requis'
    })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = decoded

    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token invalide ou expiré'
    })
  }
}

export async function requireAdmin(req, res, next) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise'
      })
    }

    const { default: pool } = await import('../config/database.js')

    const result = await pool.query(
      'SELECT role FROM public.users WHERE id = $1',
      [req.user.id]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur introuvable'
      })
    }

    if (result.rows[0].role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Accès réservé aux administrateurs'
      })
    }

    req.user.role = result.rows[0].role
    next()
  } catch (error) {
    console.error('Admin authorization error:', error)

    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification des autorisations'
    })
  }
}
