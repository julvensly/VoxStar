import pool from '../config/database.js'
import { getConcoursPhase } from '../services/concoursPhaseService.js'

export async function inscrireCandidat(req, res) {
  try {
    const concoursId = Number(req.params.concoursId)
    const userId = Number(req.user.id)

    if (!Number.isSafeInteger(concoursId) || concoursId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Identifiant du concours invalide'
      })
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'La photo du candidat est obligatoire'
      })
    }

    const phaseInfo = await getConcoursPhase(concoursId)

    if (!phaseInfo) {
      return res.status(404).json({
        success: false,
        message: 'Concours introuvable'
      })
    }

    if (!phaseInfo.canRegister) {
      return res.status(403).json({
        success: false,
        message: 'Les inscriptions à ce concours ne sont pas ouvertes',
        phase: phaseInfo.phase
      })
    }

    const concoursResult = await pool.query(
      `SELECT id, name, prix, places
       FROM public.concours
       WHERE id = $1`,
      [concoursId]
    )

    if (concoursResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Concours introuvable'
      })
    }

    const concours = concoursResult.rows[0]

    const inscriptionExistante = await pool.query(
      `SELECT id
       FROM public.candidats
       WHERE user_id = $1
       AND concours_id = $2`,
      [userId, concoursId]
    )

    if (inscriptionExistante.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Vous êtes déjà inscrit à ce concours'
      })
    }

    const utilisateur = await pool.query(
      `SELECT photo_url
       FROM public.users
       WHERE id = $1`,
      [userId]
    )

    if (utilisateur.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur introuvable'
      })
    }

    const nombreInscrits = await pool.query(
      `SELECT COUNT(*)::integer AS total
       FROM public.candidats
       WHERE concours_id = $1`,
      [concoursId]
    )

    if (nombreInscrits.rows[0].total >= concours.places) {
      return res.status(409).json({
        success: false,
        message: 'Toutes les places sont déjà occupées'
      })
    }

    const photoUrl = `/uploads/${req.file.filename}`
    const profilUrl = utilisateur.rows[0].photo_url

    const result = await pool.query(
      `INSERT INTO public.candidats (
        concours_id,
        user_id,
        photo_url,
        profil_url
      )
      VALUES ($1, $2, $3, $4)
      RETURNING
        id,
        concours_id,
        user_id,
        photo_url,
        profil_url`,
      [
        concoursId,
        userId,
        photoUrl,
        profilUrl
      ]
    )

    return res.status(201).json({
      success: true,
      message: 'Inscription réussie',
      candidat: result.rows[0]
    })
  } catch (error) {
    console.error('Inscription candidat error:', error)

    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l’inscription'
    })
  }
}
