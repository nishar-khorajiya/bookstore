const express = require('express');
const router = express.Router();

// In-memory storage for users (same as before)
const users = [];

// Route to register a new user
router.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  const newUser = { username, password };
  users.push(newUser);

  res.status(201).json({ message: 'User registered successfully' });
});

// Route to login a user
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const user = users.find(user => user.username === username && user.password === password);
  if (user) {
    // Here you would typically generate a token or session
    res.status(200).json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
});

module.exports = router;
