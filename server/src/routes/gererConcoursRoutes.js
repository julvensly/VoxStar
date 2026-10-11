import express from 'express'

import {
  activateConcours,
  deleteConcours
} from '../controllers/gererConcoursController.js'

import {
  authenticateToken,
  requireAdmin
} from '../middleware/authMiddleware.js'

const router = express.Router()

router.patch(
  '/:id/activate',
  authenticateToken,
  requireAdmin,
  activateConcours
)

router.delete(
  '/:id',
  authenticateToken,
  requireAdmin,
  deleteConcours
)

export default router
