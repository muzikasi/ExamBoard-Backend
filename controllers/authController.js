import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { sendVerificationEmail } from '../utils/email.js'

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// @desc Register a new user
// @route POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationOTP = generateOTP()
    const verificationTokenExpires = Date.now() + 30 * 60 * 1000   // 30 minutes
    const verificationOTPExpires = Date.now() + 5 * 60 * 1000      // 5 minutes

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpires,
      verificationOTP,
      verificationOTPExpires
    })

    await sendVerificationEmail(email, name, verificationToken, verificationOTP)

    res.status(201).json({
      message: 'Registration successful! Please check your email to verify your account.'
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc Verify email with link
// @route GET /api/auth/verify-email/:token
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params

    // First check if token exists and not expired
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    })

    if (!user) {
      // Check if user is already verified with this token
      const alreadyVerified = await User.findOne({ isVerified: true })
      if (alreadyVerified) {
        return res.json({ message: 'Email already verified! You can now login.' })
      }
      return res.status(400).json({ message: 'Invalid or expired verification link' })
    }

    user.isVerified = true
    user.verificationToken = undefined
    user.verificationTokenExpires = undefined
    user.verificationOTP = undefined
    user.verificationOTPExpires = undefined
    await user.save()

    res.json({ message: 'Email verified successfully! You can now login.' })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


// @desc Resend OTP
// @route POST /api/auth/resend-otp
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email, isVerified: false })
    if (!user) {
      return res.status(400).json({ message: 'User not found or already verified' })
    }

    const verificationOTP = generateOTP()
    const verificationOTPExpires = Date.now() + 5 * 60 * 1000
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationTokenExpires = Date.now() + 30 * 60 * 1000

    user.verificationOTP = verificationOTP
    user.verificationOTPExpires = verificationOTPExpires
    user.verificationToken = verificationToken
    user.verificationTokenExpires = verificationTokenExpires
    await user.save()

    await sendVerificationEmail(email, user.name, verificationToken, verificationOTP)

    res.json({ message: 'New OTP sent! Please check your email.' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc Verify email with OTP
// @route POST /api/auth/verify-otp
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body

    const user = await User.findOne({
      email,
      verificationOTP: otp,
      verificationOTPExpires: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP code' })
    }

    user.isVerified = true
    user.verificationToken = undefined
    user.verificationTokenExpires = undefined
    user.verificationOTP = undefined
    user.verificationOTPExpires = undefined
    await user.save()

    res.json({ message: 'Email verified successfully! You can now login.' })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc Login user
// @route POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: 'Please verify your email before logging in' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc Get logged in user profile
// @route GET /api/auth/profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}