import pool from '../config/database.js'

export async function getRanking(req, res) {
  try {
    const editionResult = await pool.query(
      `SELECT
         id,
         title,
         registration_start,
         registration_end,
         voting_start,
         voting_end,
         results_date,
         status
       FROM editions
       WHERE status = 'active'
       ORDER BY id DESC
       LIMIT 1`
    )

    if (editionResult.rows.length === 0) {
      return res.json({
        success: true,
        edition: null,
        candidates: [],
        message: 'Aucune édition active pour le moment'
      })
    }

    const edition = editionResult.rows[0]

    const candidatesResult = await pool.query(
      `SELECT
         id,
         full_name,
         class_name,
         photo_url,
         description,
         total_votes
       FROM candidates
       WHERE edition_id = $1
         AND is_active = true
       ORDER BY total_votes DESC, id ASC`,
      [edition.id]
    )

    res.json({
      success: true,
      edition,
      candidates: candidatesResult.rows
    })
  } catch (error) {
    console.error('Get ranking error:', error)

    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    })
  }
}

export async function getTopCandidates(req, res) {
  try {
    const editionResult = await pool.query(
      `SELECT
         id,
         title,
         registration_start,
         registration_end,
         voting_start,
         voting_end,
         results_date,
         status
       FROM editions
       WHERE status = 'active'
       ORDER BY id DESC
       LIMIT 1`
    )

    if (editionResult.rows.length === 0) {
      return res.json({
        success: true,
        edition: null,
        candidates: [],
        message: 'Aucune édition active pour le moment'
      })
    }

    const edition = editionResult.rows[0]

    const candidatesResult = await pool.query(
      `SELECT
         id,
         full_name,
         class_name,
         photo_url,
         description,
         total_votes
       FROM candidates
       WHERE edition_id = $1
         AND is_active = true
       ORDER BY total_votes DESC, id ASC
       LIMIT 3`,
      [edition.id]
    )

    res.json({
      success: true,
      edition,
      candidates: candidatesResult.rows
    })
  } catch (error) {
    console.error('Get top candidates error:', error)

    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    })
  }
}
