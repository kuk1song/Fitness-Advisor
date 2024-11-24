import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from  '../models/User.js';

const authRoutes = express.Router();

// register endpoint
authRoutes.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  
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
    await newUser.save();

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
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // generate a JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token, user: { email, username: user.username } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

export default authRoutes;