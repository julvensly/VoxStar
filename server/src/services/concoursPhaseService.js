import pool from '../config/database.js'
import { qualifyCandidates } from './roundQualificationService.js'

export async function getConcoursPhase(concoursId, db = pool) {
  const id = Number(concoursId)

  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error('Identifiant du concours invalide')
  }

  const result = await db.query(
    `
    SELECT
      id,
      name,
      status,
      inscription_debut,
      inscription_fin,
      premier_debut,
      premier_fin,
      deuxieme_debut,
      deuxieme_fin,
      troisieme_debut,
      troisieme_fin,

      CURRENT_TIMESTAMP AT TIME ZONE 'America/Port-au-Prince'
        AS local_now

    FROM public.concours
    WHERE id = $1
    `,
    [id]
  )

  if (result.rows.length === 0) {
    return null
  }

  const concours = result.rows[0]

  let phase = 'between_phases'
  let roundNumber = null

  const now = new Date(concours.local_now).getTime()

  const timestamp = value => {
    if (!value) return null

    const parsed = new Date(value).getTime()
    return Number.isFinite(parsed) ? parsed : null
  }

  const inscriptionDebut = timestamp(concours.inscription_debut)
  const inscriptionFin = timestamp(concours.inscription_fin)
  const premierDebut = timestamp(concours.premier_debut)
  const premierFin = timestamp(concours.premier_fin)
  const deuxiemeDebut = timestamp(concours.deuxieme_debut)
  const deuxiemeFin = timestamp(concours.deuxieme_fin)
  const troisiemeDebut = timestamp(concours.troisieme_debut)
  const troisiemeFin = timestamp(concours.troisieme_fin)

  if (concours.status === 'cancelled') {
    phase = 'cancelled'
  } else if (concours.status === 'finished') {
    phase = 'finished'
  } else if (concours.status !== 'active') {
    phase = 'draft'
  } else if (
    troisiemeFin !== null &&
    now > troisiemeFin
  ) {
    phase = 'finished'
  } else if (
    inscriptionDebut !== null &&
    inscriptionFin !== null &&
    now >= inscriptionDebut &&
    now <= inscriptionFin
  ) {
    phase = 'registration'
  } else if (
    premierDebut !== null &&
    premierFin !== null &&
    now >= premierDebut &&
    now <= premierFin
  ) {
    phase = 'round_1'
    roundNumber = 1
  } else if (
    deuxiemeDebut !== null &&
    deuxiemeFin !== null &&
    now >= deuxiemeDebut &&
    now <= deuxiemeFin
  ) {
    phase = 'round_2'
    roundNumber = 2
  } else if (
    troisiemeDebut !== null &&
    troisiemeFin !== null &&
    now >= troisiemeDebut &&
    now <= troisiemeFin
  ) {
    phase = 'final'
    roundNumber = 3
  } else if (
    inscriptionDebut !== null &&
    now < inscriptionDebut
  ) {
    phase = 'upcoming'
  }

  if (concours.status === 'active') {
    if (premierFin !== null && now > premierFin) {
      await qualifyCandidates(concours.id, 1)
    }

    if (deuxiemeFin !== null && now > deuxiemeFin) {
      await qualifyCandidates(concours.id, 2)
    }
  }

  return {
    concoursId: concours.id,
    concoursName: concours.name,
    status: concours.status,
    phase,
    roundNumber,
    canRegister: phase === 'registration',
    canVote: ['round_1', 'round_2', 'final'].includes(phase)
  }
}
