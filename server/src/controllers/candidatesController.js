import pool from '../config/database.js'

export async function getCandidates(req, res) {
  try {
    const result = await pool.query(
      `SELECT
         id,
         full_name,
         class_name,
         photo_url,
         description,
         total_votes,
         edition_id,
         is_active
       FROM candidates
       WHERE is_active = true
       ORDER BY id ASC`
    )

    res.json({
      success: true,
      candidates: result.rows
    })
  } catch (error) {
    console.error('Get candidates error:', error)

    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    })
  }
}
