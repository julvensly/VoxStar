import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'

import { inscrireCandidat } from '../controllers/inscritsController.js'
import { authenticateToken } from '../middleware/authMiddleware.js'
import { requireRegistrationPhase } from '../middleware/concoursPhaseMiddleware.js'

const router = express.Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../uploads'),
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname)
    cb(null, `inscrit-${req.user.id}-${Date.now()}${extension}`)
  }
})

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Seules les images sont autorisées'))
    }
  }
})

router.post(
  '/:concoursId',
  authenticateToken,
  requireRegistrationPhase,
  upload.single('photo'),
  inscrireCandidat
)

export default router
