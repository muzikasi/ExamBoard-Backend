import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  grade: {
    type: String,
    enum: ['grade 9', 'grade 10', 'grade 11', 'grade 12', 'university student'],
    required: true
  },
  photo: {
    type: String,
    default: ''
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String
  },
  verificationTokenExpires: {
    type: Date
  },
  verificationOTP: {
    type: String
  },
  verificationOTPExpires: {
    type: Date
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordTokenExpires: {
    type: Date
  },
  resetPasswordCode: {
    type: String
  },
  resetPasswordCodeExpires: {
    type: Date
  }
}, { timestamps: true })

export default mongoose.model('User', userSchema)