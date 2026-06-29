import express from 'express'
import {
  getMaterials,
  getMaterial,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  upvoteMaterial
} from '../controllers/materialController.js'
import protect from '../middleware/auth.js'
import upload from '../middleware/upload.js'

const router = express.Router()

router.get('/', getMaterials)
router.get('/:id', getMaterial)
router.post('/', protect, upload.single('file'), createMaterial)
router.put('/:id', protect, upload.single('file'), updateMaterial)
router.delete('/:id', protect, deleteMaterial)
router.put('/:id/upvote', protect, upvoteMaterial)

export default router