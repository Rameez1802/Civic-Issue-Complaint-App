import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Adjust path as needed
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const router = express.Router();

// Utility function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
router.post('/register', async (req, res) => {
  const { fullName, mobile, email, password } = req.body;

  if (!fullName || !mobile || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      fullName,
      mobile,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Auth user & get token (Login)
// @route   POST /api/users/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// --- Nodemailer Transporter Setup ---
// This uses the credentials from your .env file to send emails via Gmail.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "mohdrameez88@gmail.com",
    pass: "pcss jlwo yxmw iitn",
  },
});


// @desc    Handle forgot password request (send OTP)
// @route   POST /api/users/forgot-password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      // IMPORTANT: For security, don't reveal if the user exists or not.
      // But for your requirement, we send a specific message.
      return res.status(404).json({ message: 'User is not registered' });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP and expiry time (e.g., 10 minutes from now)
    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // --- Send the email ---
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Your Password Reset OTP',
      text: `You are receiving this because you have requested to reset the password for your Seva Setu account.\n\n` +
            `Your OTP is: ${otp}\n\n` +
            `This OTP will expire in 10 minutes.\n\n` +
            `If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'An OTP has been sent to your email.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


// @desc    Reset password with OTP
// @route   POST /api/users/reset-password
router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({
      email,
      resetPasswordOtp: otp,
      resetPasswordExpires: { $gt: Date.now() }, // Check if OTP is not expired
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid OTP or OTP has expired.' });
    }

    // Set new password
    user.password = newPassword;
    // Clear the OTP fields
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpires = undefined;

    await user.save(); // The pre-save hook will automatically hash the new password

    res.status(200).json({ message: 'Password has been reset successfully.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


export default router;