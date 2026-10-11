import express from 'express'
import { authenticateToken } from '../middleware/authMiddleware.js'
import { uploadConcoursAffiche } from '../middleware/concoursUploadMiddleware.js'
import { createConcours } from '../controllers/createConcoursController.js'

const router = express.Router()

router.post(
  '/',
  authenticateToken,
  uploadConcoursAffiche.single('affiche'),
  createConcours
)

export default router
