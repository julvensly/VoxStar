import pool from '../config/database.js'

export async function getConcours(req, res) {
  try {
    const result = await pool.query(
      `SELECT
         id,
         title,
         registration_start,
         registration_end,
         voting_start,
         voting_end,
         results_date,
         status,
         created_at
       FROM editions
       ORDER BY created_at DESC, id DESC`
    )

    res.json({
      success: true,
      concours: result.rows
    })
  } catch (error) {
    console.error('Get concours error:', error)

    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    })
  }
}

export async function getConcoursById(req, res) {
  try {
    const { id } = req.params

    const result = await pool.query(
      `SELECT
         id,
         title,
         registration_start,
         registration_end,
         voting_start,
         voting_end,
         results_date,
         status,
         created_at
       FROM editions
       WHERE id = $1`,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Concours introuvable'
      })
    }

    res.json({
      success: true,
      concours: result.rows[0]
    })
  } catch (error) {
    console.error(
      'Get concours by id error:',
      error
    )

    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    })
  }
}
