import express from 'express';
import bcrypt from 'bcrypt';
import User from  '../models/User.js';

const router = express.Router();

// register endpoint
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ email, passwordHash, name });
  await user.save();
  res.status(201).json({ message: 'User registered successfully' });
});

// login endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'User not found' });

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

  res.json({ message: 'Login successful', userId: user._id });
});

module.exports = router;