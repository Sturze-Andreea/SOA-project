const express = require('express');
const { generateToken } = require('../utils/jwt');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { SECRET_KEY } = process.env;

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = generateToken({ userId: user._id });
    res.status(200).json({ token, email: user.email, _id: user._id, username: user.username });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

router.post('/refresh-token', (req, res) => {
  const token = req.body.token;

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const newToken = jwt.sign({ id: decoded.id, email: decoded.email }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ token: newToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

module.exports = router;
