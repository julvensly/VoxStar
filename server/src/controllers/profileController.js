import pool from '../config/database.js'

export async function updateProfileName(req, res) {
  try {
    const { old_full_name, new_full_name } = req.body

    if (!old_full_name || !new_full_name) {
      return res.status(400).json({
        success: false,
        message: 'Ancien nom et nouveau nom sont obligatoires'
      })
    }

    const oldName = old_full_name.trim()
    const newName = new_full_name.trim()

    if (oldName.length < 2 || newName.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Le nom doit contenir au moins 2 caractères'
      })
    }

    const userResult = await pool.query(
      `SELECT id, full_name
       FROM users
       WHERE id = $1`,
      [req.user.id]
    )

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur introuvable'
      })
    }

    const user = userResult.rows[0]

    if (
      user.full_name.trim().toLowerCase() !==
      oldName.toLowerCase()
    ) {
      return res.status(400).json({
        success: false,
        message: 'L’ancien nom ne correspond pas à votre nom actuel'
      })
    }

    if (
      user.full_name.trim().toLowerCase() ===
      newName.toLowerCase()
    ) {
      return res.status(400).json({
        success: false,
        message: 'Le nouveau nom doit être différent de l’ancien'
      })
    }

    const result = await pool.query(
      `UPDATE users
       SET full_name = $1
       WHERE id = $2
       RETURNING id, full_name, email, role, photo_url, created_at`,
      [newName, req.user.id]
    )

    res.json({
      success: true,
      message: 'Nom modifié avec succès',
      user: result.rows[0]
    })

  } catch (error) {
    console.error('Update profile name error:', error)

    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    })
  }
}

export async function updateProfilePhoto(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucune photo sélectionnée'
      })
    }

    const photoUrl = `/uploads/${req.file.filename}`

    const result = await pool.query(
      `UPDATE users
       SET photo_url = $1
       WHERE id = $2
       RETURNING id, full_name, email, role, photo_url, created_at`,
      [photoUrl, req.user.id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur introuvable'
      })
    }

    res.json({
      success: true,
      message: 'Photo modifiée avec succès',
      user: result.rows[0]
    })

  } catch (error) {
    console.error('Update profile photo error:', error)

    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    })
  }
}
