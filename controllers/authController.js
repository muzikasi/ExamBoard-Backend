import User from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/email.js'

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
    const { firstName, lastName, email, password, grade } = req.body

    const allowedGrades = ['grade 9', 'grade 10', 'grade 11', 'grade 12', 'university student']
    if (!grade || !allowedGrades.includes(grade)) {
      return res.status(400).json({ message: 'Please provide a valid grade (grade 9, grade 10, grade 11, grade 12, university student)' })
    }

    if (!firstName || !lastName) {
      return res.status(400).json({ message: 'Please provide both firstName and lastName' })
    }

    const name = `${firstName.trim()} ${lastName.trim()}`

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
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email,
      password: hashedPassword,
      grade,
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

// @desc Update profile info
// @route PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const { firstName, lastName, name, grade } = req.body
    const allowedGrades = ['grade 9', 'grade 10', 'grade 11', 'grade 12', 'university student']

    if (firstName && firstName.trim()) {
      user.firstName = firstName.trim()
    }

    if (lastName && lastName.trim()) {
      user.lastName = lastName.trim()
    }

    if (name && name.trim()) {
      user.name = name.trim()
    } else if (user.firstName || user.lastName) {
      user.name = `${user.firstName || ''} ${user.lastName || ''}`.trim()
    }

    if (grade && allowedGrades.includes(grade)) {
      user.grade = grade
    }

    if (req.file) {
      user.photo = req.file.path || req.file.secure_url || ''
    }

    await user.save()

    const safeUser = await User.findById(user._id).select('-password')
    const photoUrl = safeUser.photo || ''
    const userResponse = {
      ...safeUser.toObject(),
      photo: photoUrl,
      avatar: photoUrl,
      photoUrl: photoUrl
    }

    res.json(userResponse)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc Change password
// @route POST /api/auth/change-password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide current and new passwords' })
    }

    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    user.password = hashedPassword
    await user.save()

    res.json({ message: 'Password updated successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc Request password reset
// @route POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: 'Please provide an email address' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      // For security, don't reveal if email exists
      return res.json({ message: 'If an account with that email exists, you will receive password reset instructions.' })
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString()
    const resetPasswordCodeExpires = Date.now() + 15 * 60 * 1000 // 15 minutes

    user.resetPasswordCode = resetCode
    user.resetPasswordCodeExpires = resetPasswordCodeExpires
    await user.save()

    await sendPasswordResetEmail(email, user.name, resetCode)

    res.json({ message: 'Password reset instructions have been sent to your email.' })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc Reset password with verification code
// @route POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { email, resetCode, newPassword, confirmPassword } = req.body

    if (!email || !resetCode || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'Please provide all required fields' })
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' })
    }

    const user = await User.findOne({
      email,
      resetPasswordCode: resetCode,
      resetPasswordCodeExpires: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({ message: 'Invalid reset code or code has expired' })
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    user.password = hashedPassword
    user.resetPasswordCode = undefined
    user.resetPasswordCodeExpires = undefined
    await user.save()

    res.json({ message: 'Password has been reset successfully. You can now login with your new password.' })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}