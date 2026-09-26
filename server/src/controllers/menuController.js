import pool from '../config/database.js'

export async function getMenu(req, res) {
  try {
    // Si moun nan pa konekte
    if (!req.user?.id) {
      return res.json({
        success: true,
        menu: 'public'
      })
    }

    const result = await pool.query(
      `SELECT
         id,
         full_name,
         email,
         role,
         photo_url
       FROM users
       WHERE id = $1
       LIMIT 1`,
      [req.user.id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur introuvable'
      })
    }

    const user = result.rows[0]

    // Par défaut, tout nouvel utilisateur est Voteur
    let menu = 'voteur'

    if (user.role === 'candidat') {
      menu = 'candidat'
    }

    if (user.role === 'admin') {
      menu = 'admin'
    }

    return res.json({
      success: true,
      menu,
      user
    })

  } catch (error) {
    console.error('Get menu error:', error)

    return res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    })
  }
}
