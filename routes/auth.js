import express from 'express'
import { register, login, getProfile, verifyEmail, verifyOTP, resendOTP, forgotPassword, resetPassword, updateProfile, changePassword } from '../controllers/authController.js'
import protect from '../middleware/auth.js'
import upload from '../middleware/upload.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/verify-email/:token', verifyEmail)
router.post('/verify-otp', verifyOTP)
router.get('/profile', protect, getProfile)
router.put('/profile', protect, upload.single('photo'), updateProfile)
router.post('/change-password', protect, changePassword)
router.post('/resend-otp', resendOTP)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

export default router