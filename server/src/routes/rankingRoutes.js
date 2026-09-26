import express from 'express'

import {
  getRanking,
  getTopCandidates
} from '../controllers/rankingController.js'

const router = express.Router()

router.get('/', getRanking)

router.get('/top', getTopCandidates)

export default router
