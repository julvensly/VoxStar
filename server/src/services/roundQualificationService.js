import pool from '../config/database.js'

export async function qualifyCandidates(concoursId, roundNumber, db = pool) {
  const id = Number(concoursId)
  const round = Number(roundNumber)

  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error('Identifiant du concours invalide')
  }

  if (![1, 2].includes(round)) {
    throw new Error('Seuls les tours 1 et 2 peuvent qualifier des candidats')
  }

  const client = db === pool ? await pool.connect() : db
  const ownsClient = db === pool

  try {
    await client.query('BEGIN')

    const concoursResult = await client.query(
      `
      SELECT
        id,
        status,
        premier_nombre,
        deuxieme_nombre,
        premier_fin,
        deuxieme_fin,
        CASE
          WHEN $2 = 1 THEN
            CURRENT_TIMESTAMP AT TIME ZONE 'America/Port-au-Prince'
              >= premier_fin
          WHEN $2 = 2 THEN
            CURRENT_TIMESTAMP AT TIME ZONE 'America/Port-au-Prince'
              >= deuxieme_fin
          ELSE FALSE
        END AS round_is_over
      FROM public.concours
      WHERE id = $1
      FOR UPDATE
      `,
      [id, round]
    )

    if (concoursResult.rows.length === 0) {
      throw new Error('Concours introuvable')
    }

    const concours = concoursResult.rows[0]

    if (concours.status !== 'active') {
      throw new Error('Le concours doit être actif pour qualifier des candidats')
    }

    if (!concours.round_is_over) {
      throw new Error('Le tour concerné n’est pas encore terminé')
    }

    const limit = Number(
      round === 1
        ? concours.premier_nombre
        : concours.deuxieme_nombre
    )

    if (!Number.isSafeInteger(limit) || limit <= 0) {
      throw new Error('Le nombre de candidats qualifiés est invalide')
    }

    const targetRound = round + 1

    const existing = await client.query(
      `
      SELECT COUNT(*)::integer AS total
      FROM public.concours_qualifications
      WHERE concours_id = $1
        AND round_number = $2
      `,
      [id, targetRound]
    )

    if (existing.rows[0].total > 0) {
      await client.query('COMMIT')

      return {
        success: true,
        alreadyProcessed: true,
        qualifiedCount: existing.rows[0].total
      }
    }

    const rankingResult = await client.query(
      `
      SELECT
        c.id AS candidat_id,
        COUNT(v.id)::integer AS total_votes
      FROM public.candidats c
      LEFT JOIN public.votes v
        ON v.candidat_id = c.id
       AND v.concours_id = c.concours_id
       AND v.round_number = $2
      WHERE c.concours_id = $1
        AND (
          $2 = 1
          OR EXISTS (
            SELECT 1
            FROM public.concours_qualifications q
            WHERE q.concours_id = c.concours_id
              AND q.candidat_id = c.id
              AND q.round_number = $2
          )
        )
      GROUP BY c.id
      ORDER BY total_votes DESC, c.id ASC
      LIMIT $3
      `,
      [id, round, limit]
    )

    let rank = 1

    for (const candidate of rankingResult.rows) {
      await client.query(
        `
        INSERT INTO public.concours_qualifications
          (concours_id, candidat_id, round_number, rank)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (concours_id, candidat_id, round_number)
        DO NOTHING
        `,
        [id, candidate.candidat_id, targetRound, rank]
      )

      rank += 1
    }

    await client.query('COMMIT')

    return {
      success: true,
      alreadyProcessed: false,
      qualifiedCount: rankingResult.rows.length
    }
  } catch (error) {
    try {
      await client.query('ROLLBACK')
    } catch (rollbackError) {
      console.error('Qualification rollback error:', rollbackError)
    }

    throw error
  } finally {
    if (ownsClient) {
      client.release()
    }
  }
}
