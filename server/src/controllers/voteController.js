import pool from '../config/database.js'
import { getConcoursPhase } from '../services/concoursPhaseService.js'

export async function createVote(req, res) {
  const client = await pool.connect()

  try {
    const userId = Number(req.user.id)
    const candidatId = Number(req.body.candidat_id)

    if (!Number.isSafeInteger(candidatId) || candidatId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Identifiant du candidat invalide'
      })
    }

    await client.query('BEGIN')

    const candidateResult = await client.query(
      `
      SELECT
        c.id,
        c.concours_id,
        c.user_id,
        u.full_name,
        co.name AS concours_name
      FROM public.candidats c
      INNER JOIN public.users u ON u.id = c.user_id
      INNER JOIN public.concours co ON co.id = c.concours_id
      WHERE c.id = $1
      FOR UPDATE OF c
      `,
      [candidatId]
    )

    if (candidateResult.rows.length === 0) {
      await client.query('ROLLBACK')

      return res.status(404).json({
        success: false,
        message: 'Candidat introuvable'
      })
    }

    const candidate = candidateResult.rows[0]
    const phaseInfo = await getConcoursPhase(
      candidate.concours_id,
      client
    )

    if (!phaseInfo || !phaseInfo.canVote) {
      await client.query('ROLLBACK')

      return res.status(403).json({
        success: false,
        message: 'Le vote n’est pas ouvert pour ce concours',
        phase: phaseInfo?.phase ?? null
      })
    }

    const roundNumber = phaseInfo.roundNumber

    if (roundNumber > 1) {
      const qualificationResult = await client.query(
        `
        SELECT id
        FROM public.concours_qualifications
        WHERE concours_id = $1
          AND candidat_id = $2
          AND round_number = $3
        LIMIT 1
        `,
        [
          candidate.concours_id,
          candidate.id,
          roundNumber
        ]
      )

      if (qualificationResult.rows.length === 0) {
        await client.query('ROLLBACK')

        return res.status(403).json({
          success: false,
          message: 'Ce candidat n’est pas qualifié pour ce tour'
        })
      }
    }

    const existingVote = await client.query(
      `
      SELECT id
      FROM public.votes
      WHERE user_id = $1
        AND candidat_id = $2
        AND concours_id = $3
        AND round_number = $4
      LIMIT 1
      `,
      [
        userId,
        candidate.id,
        candidate.concours_id,
        roundNumber
      ]
    )

    if (existingVote.rows.length > 0) {
      await client.query('ROLLBACK')

      return res.status(409).json({
        success: false,
        message: 'Vous avez déjà voté pour ce candidat pendant ce tour'
      })
    }

    await client.query(
      `
      INSERT INTO public.votes (
        user_id,
        candidat_id,
        concours_id,
        round_number
      )
      VALUES ($1, $2, $3, $4)
      `,
      [
        userId,
        candidate.id,
        candidate.concours_id,
        roundNumber
      ]
    )

    const countResult = await client.query(
      `
      SELECT COUNT(*)::integer AS total_votes
      FROM public.votes
      WHERE candidat_id = $1
        AND concours_id = $2
        AND round_number = $3
      `,
      [
        candidate.id,
        candidate.concours_id,
        roundNumber
      ]
    )

    await client.query('COMMIT')

    return res.status(201).json({
      success: true,
      message: 'Vote enregistré avec succès',
      vote: {
        candidat_id: candidate.id,
        concours_id: candidate.concours_id,
        round_number: roundNumber,
        total_votes: countResult.rows[0].total_votes
      }
    })
  } catch (error) {
    try {
      await client.query('ROLLBACK')
    } catch (rollbackError) {
      console.error('Vote rollback error:', rollbackError)
    }

    if (error.code === '23505' && error.constraint === 'votes_user_candidate_concours_round_unique') {
      return res.status(409).json({
        success: false,
        message: 'Vous avez déjà voté pour ce candidat pendant ce tour'
      })
    }

    console.error('Create vote error:', error)

    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l’enregistrement du vote'
    })
  } finally {
    client.release()
  }
}
