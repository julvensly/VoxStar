import express from 'express'

import {
  getConcours,
  getConcoursById
} from '../controllers/concoursController.js'

const router = express.Router()

router.get('/', getConcours)

router.get('/:id', getConcoursById)

export default router
