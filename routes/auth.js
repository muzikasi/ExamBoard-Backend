import express from 'express'
import { register, login, getProfile, verifyEmail, verifyOTP , resendOTP} from '../controllers/authController.js'
import protect from '../middleware/auth.js'


const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/verify-email/:token', verifyEmail)
router.post('/verify-otp', verifyOTP)
router.get('/profile', protect, getProfile)
router.post('/resend-otp', resendOTP)

export default router