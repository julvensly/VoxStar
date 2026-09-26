import express from 'express'
import { getCandidates } from '../controllers/candidatesController.js'

const router = express.Router()

router.get('/', getCandidates)

export default router
