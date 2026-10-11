import pool from '../config/database.js'
import { getConcoursPhase } from '../services/concoursPhaseService.js'

export async function getCandidates(req, res) {
  try {
    const { concours_id } = req.query

    let concoursResult

    if (concours_id) {
      const id = Number(concours_id)

      if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Identifiant du concours invalide'
        })
      }

      concoursResult = await pool.query(
        `
        SELECT id, name, status
        FROM public.concours
        WHERE id = $1
        `,
        [id]
      )
    } else {
      concoursResult = await pool.query(
        `
        SELECT id, name, status
        FROM public.concours
        WHERE status = 'active'
        ORDER BY id DESC
        LIMIT 1
        `
      )
    }

    if (concoursResult.rows.length === 0) {
      return res.json({
        success: true,
        concours: null,
        phase: null,
        roundNumber: null,
        candidates: []
      })
    }

    const concours = concoursResult.rows[0]
    const phaseInfo = await getConcoursPhase(concours.id)

    if (!phaseInfo) {
      return res.json({
        success: true,
        concours: null,
        phase: null,
        roundNumber: null,
        candidates: []
      })
    }

    let roundNumber = phaseInfo.roundNumber

    if (phaseInfo.phase === 'finished') {
      roundNumber = 3
    } else if (roundNumber === null) {
      roundNumber = 1
    }

    const qualificationFilter =
      roundNumber === 2 || roundNumber === 3
        ? `
          AND EXISTS (
            SELECT 1
            FROM public.concours_qualifications q
            WHERE q.concours_id = c.concours_id
              AND q.candidat_id = c.id
              AND q.round_number = $3
          )
        `
        : ''

    const result = await pool.query(
      `
      SELECT
        c.id,
        c.concours_id,
        c.user_id,
        u.full_name,
        c.photo_url,
        c.profil_url,
        co.name AS concours_name,
        COUNT(v.id)::integer AS total_votes
      FROM public.candidats c
      INNER JOIN public.users u
        ON u.id = c.user_id
      INNER JOIN public.concours co
        ON co.id = c.concours_id
      LEFT JOIN public.votes v
        ON v.candidat_id = c.id
       AND v.concours_id = c.concours_id
       AND v.round_number = $2
      WHERE c.concours_id = $1
      ${qualificationFilter}
      GROUP BY
        c.id,
        c.concours_id,
        c.user_id,
        u.full_name,
        c.photo_url,
        c.profil_url,
        co.name
      ORDER BY total_votes DESC, c.id ASC
      `,
      (qualificationFilter ? [concours.id, roundNumber, roundNumber] : [concours.id, roundNumber])
    )

    return res.json({
      success: true,
      concours,
      phase: phaseInfo.phase,
      roundNumber: phaseInfo.roundNumber,
      canRegister: phaseInfo.canRegister,
      canVote: phaseInfo.canVote,
      candidates: result.rows
    })
  } catch (error) {
    console.error('Get candidates error:', error)

    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors du chargement des candidats'
    })
  }
}

export async function deleteCandidate(req, res) {
  const candidateId = Number(req.params.id)

  if (!Number.isSafeInteger(candidateId) || candidateId <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Identifiant du candidat invalide'
    })
  }

  try {
    const result = await pool.query(
      `
      DELETE FROM public.candidats
      WHERE id = $1
      RETURNING id, user_id, concours_id
      `,
      [candidateId]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Candidat introuvable'
      })
    }

    return res.json({
      success: true,
      message: 'Candidat supprimé avec succès',
      candidate: result.rows[0]
    })
  } catch (error) {
    console.error('Delete candidate error:', error)

    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression du candidat'
    })
  }
}
