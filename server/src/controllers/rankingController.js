import pool from '../config/database.js'
import { getConcoursPhase } from '../services/concoursPhaseService.js'

async function loadRanking(req, limit = null) {
  const concoursResult = await pool.query(`
    SELECT
      id,
      name AS title,
      description,
      photo_url,
      status,
      prix,
      places
    FROM public.concours
    ORDER BY
      CASE WHEN status = 'active' THEN 0 ELSE 1 END,
      id DESC
    LIMIT 1
  `)

  if (concoursResult.rows.length === 0) {
    return {
      edition: null,
      candidates: [],
      phase: null,
      roundNumber: null
    }
  }

  const edition = concoursResult.rows[0]
  const phase = await getConcoursPhase(edition.id)

  const requestedRound = req.query.round
  let roundNumber

  if (requestedRound !== undefined) {
    roundNumber = Number(requestedRound)

    if (![1, 2, 3].includes(roundNumber)) {
      const error = new Error('Le tour doit être 1, 2 ou 3')
      error.statusCode = 400
      throw error
    }
  } else {
    roundNumber = phase?.roundNumber ?? null
  }

  if (roundNumber === null) {
    return {
      edition,
      candidates: [],
      phase,
      roundNumber: null
    }
  }

  let query = `
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
  `

  const params = [edition.id, roundNumber]

  if (roundNumber === 2 || roundNumber === 3) {
    query += `
      AND EXISTS (
        SELECT 1
        FROM public.concours_qualifications q
        WHERE q.concours_id = c.concours_id
          AND q.candidat_id = c.id
          AND q.round_number = $2
      )
    `
  }

  query += `
    GROUP BY
      c.id,
      c.concours_id,
      c.user_id,
      u.full_name,
      c.photo_url,
      c.profil_url,
      co.name
    ORDER BY
      total_votes DESC,
      LOWER(TRIM(u.full_name)) ASC,
      c.id ASC
  `

  if (limit !== null) {
    query += ' LIMIT $3'
    params.push(limit)
  }

  const candidatesResult = await pool.query(query, params)

  return {
    edition,
    candidates: candidatesResult.rows,
    phase,
    roundNumber
  }
}

export async function getRanking(req, res) {
  try {
    const result = await loadRanking(req)

    return res.json({
      success: true,
      edition: result.edition,
      phase: result.phase,
      roundNumber: result.roundNumber,
      candidates: result.candidates,
      message: result.edition
        ? undefined
        : 'Aucun concours disponible pour le moment'
    })
  } catch (error) {
    if (error.statusCode === 400) {
      return res.status(400).json({
        success: false,
        message: error.message
      })
    }

    console.error('Get ranking error:', error)

    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors du chargement du classement'
    })
  }
}

export async function getTopCandidates(req, res) {
  try {
    const result = await loadRanking(req, 3)

    return res.json({
      success: true,
      edition: result.edition,
      phase: result.phase,
      roundNumber: result.roundNumber,
      candidates: result.candidates,
      message: result.edition
        ? undefined
        : 'Aucun concours disponible pour le moment'
    })
  } catch (error) {
    if (error.statusCode === 400) {
      return res.status(400).json({
        success: false,
        message: error.message
      })
    }

    console.error('Get top candidates error:', error)

    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors du chargement du Top 3'
    })
  }
}
