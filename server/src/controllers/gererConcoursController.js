import pool from '../config/database.js'

export async function activateConcours(req, res) {
  try {
    const id = Number(req.params.id)

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Identifiant du concours invalide'
      })
    }

    const result = await pool.query(
      `UPDATE public.concours
       SET status = 'active',
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
         AND status = 'draft'
       RETURNING id, name, status`,
      [id]
    )

    if (result.rows.length === 0) {
      const existing = await pool.query(
        `SELECT id, name, status
         FROM public.concours
         WHERE id = $1`,
        [id]
      )

      if (existing.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Concours introuvable'
        })
      }

      return res.status(409).json({
        success: false,
        message: 'Ce concours existe déjà et ne peut pas être activé depuis son statut actuel',
        concours: existing.rows[0]
      })
    }

    return res.json({
      success: true,
      message: 'Concours activé. Les inscriptions et les votes suivront les dates définies dans le règlement.',
      concours: result.rows[0]
    })
  } catch (error) {
    console.error('Activate concours error:', error)

    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l’activation du concours'
    })
  }
}

export async function deleteConcours(req, res) {
  try {
    const id = Number(req.params.id)

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Identifiant du concours invalide'
      })
    }

    const result = await pool.query(
      `DELETE FROM public.concours
       WHERE id = $1
       RETURNING id, name`,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Concours introuvable'
      })
    }

    return res.json({
      success: true,
      message: 'Concours supprimé avec succès',
      concours: result.rows[0]
    })
  } catch (error) {
    console.error('Delete concours error:', error)

    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression du concours'
    })
  }
}
