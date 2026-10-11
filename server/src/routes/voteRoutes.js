import express from 'express'

import { createVote } from '../controllers/voteController.js'
import { authenticateToken } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', authenticateToken, createVote)

export default router
