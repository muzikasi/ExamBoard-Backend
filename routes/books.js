import express from 'express'
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} from '../controllers/bookController.js'
import protect from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'

const router = express.Router()

router.get('/', getBooks)
router.get('/:id', getBookById)
router.post('/', protect, admin, upload.single('file'), createBook)
router.put('/:id', protect, admin, upload.single('file'), updateBook)
router.delete('/:id', protect, admin, deleteBook)

export default router
