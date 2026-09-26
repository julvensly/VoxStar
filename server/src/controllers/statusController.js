import pool from '../config/database.js'

function wordToCode(word) {
  return word
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .split('')
    .map((letter) => {
      return letter.charCodeAt(0) - 64
    })
    .join('')
}

function getStatusCodes() {
  return {
    voteur: wordToCode(
      process.env.STATUS_WORD_VOTEUR
    ),

    candidat: wordToCode(
      process.env.STATUS_WORD_CANDIDAT
    ),

    admin: wordToCode(
      process.env.STATUS_WORD_ADMIN
    )
  }
}

export async function changeStatus(req, res) {
  try {
    const { code } = req.body

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Code de changement de statut obligatoire'
      })
    }

    const enteredCode = String(code).trim()

    const statusCodes = getStatusCodes()

    let newRole = null

    for (const [role, statusCode] of Object.entries(statusCodes)) {
      if (enteredCode === statusCode) {
        newRole = role
        break
      }
    }

    if (!newRole) {
      return res.status(403).json({
        success: false,
        message: 'Code de changement de statut invalide'
      })
    }

    const result = await pool.query(
      `UPDATE users
       SET role = $1
       WHERE id = $2
       RETURNING
         id,
         full_name,
         email,
         role,
         photo_url,
         created_at`,
      [newRole, req.user.id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur introuvable'
      })
    }

    return res.json({
      success: true,
      message: 'Statut modifié avec succès',
      user: result.rows[0]
    })

  } catch (error) {
    console.error(
      'Change status error:',
      error
    )

    return res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    })
  }
}
