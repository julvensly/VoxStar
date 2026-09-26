import express from 'express'
import { getMenu } from '../controllers/menuController.js'
import { authenticateToken } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', (req, res, next) => {
  const authHeader = req.headers.authorization

  // Pa gen token → PublicMenu
  if (!authHeader) {
    return getMenu(req, res)
  }

  // Gen token → verifye li
  return authenticateToken(req, res, next)
}, getMenu)

export default router
