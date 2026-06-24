import express from 'express'
import {
  getUsers,
  deleteUser,
  getAllMaterials,
  deleteMaterial
} from '../controllers/adminController.js'
import protect from '../middleware/auth.js'
import admin from '../middleware/admin.js'

const router = express.Router()

router.get('/users', protect, admin, getUsers)
router.delete('/users/:id', protect, admin, deleteUser)
router.get('/materials', protect, admin, getAllMaterials)
router.delete('/materials/:id', protect, admin, deleteMaterial)

export default router