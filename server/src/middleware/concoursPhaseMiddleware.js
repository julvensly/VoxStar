import { getConcoursPhase } from '../services/concoursPhaseService.js'

export async function requireRegistrationPhase(req, res, next) {
  try {
    const concoursId = Number(req.params.concoursId)

    if (!Number.isSafeInteger(concoursId) || concoursId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Identifiant du concours invalide'
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

    next()
  } catch (error) {
    console.error('Registration phase middleware error:', error)

    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification de la période d’inscription'
    })
  }
}
