import express from 'express'
import {
  getCandidates,
  deleteCandidate
} from '../controllers/candidatesController.js'

import {
  authenticateToken,
  requireAdmin
} from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', getCandidates)

router.delete(
  '/:id',
  authenticateToken,
  requireAdmin,
  deleteCandidate
)

export default router
