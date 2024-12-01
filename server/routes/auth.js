import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import authMiddleware from '../middleware/auth.js';

const authRoutes = express.Router();

// register endpoint
authRoutes.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  
  // regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // if it fails validation then return alert and prevent nextStep
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Email is not valid!' })
  }
  
  try {
    // check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      setError('Email already registered');
      return res.status(400).json({ message: 'Email already registered' });
    }

    // create a new user
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ email, name, passwordHash });
    await newUser.save(); // save the user to the database

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// login endpoint
authRoutes.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('email username passwordHash');

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // create a new Access Token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(200).json({ 
      message: 'Login successful', 
      token, 
      user: { email: user.email, username: user.username } 
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});


authRoutes.get('/user', authMiddleware, async (req, res) => {
  try {
  
    console.log("Decoded token:", req.user);
    
    const user = await User.findById(req.user.userId).select('name email'); 
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ name: user.name, email: user.email });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

export default authRoutes;