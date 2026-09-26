import express from 'express'

import {
  changeStatus
} from '../controllers/statusController.js'

import {
  authenticateToken
} from '../middleware/authMiddleware.js'

const router = express.Router()

router.put(
  '/change',
  authenticateToken,
  changeStatus
)

export default router
