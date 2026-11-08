const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../authConfig');

// Register
router.post('/register', async (req, res) => {
  const username = typeof req.body.username === 'string' ? req.body.username.trim() : '';
  const password = typeof req.body.password === 'string' ? req.body.password : '';

  if (username.length < 3 || username.length > 64) {
    return res.status(400).send('Username must be between 3 and 64 characters.');
  }
  if (password.length < 8) {
    return res.status(400).send('Password must be at least 8 characters long.');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING user_id, username',
      [username, hashedPassword]
    );
    res.status(201).json({ message: 'User registered', user: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).send('That username is already in use.');
    }
    console.error('Registration failed:', err);
    res.status(500).send('Unable to create account right now.');
  }
});

// Login
router.post('/login', async (req, res) => {
  const username = typeof req.body.username === 'string' ? req.body.username.trim() : '';
  const password = typeof req.body.password === 'string' ? req.body.password : '';

  if (!username || !password) {
    return res.status(400).send('Enter your username and password.');
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE username=$1', [username]);
    if (result.rows.length === 0) return res.status(401).send('Invalid username or password.');

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).send('Invalid username or password.');

    const token = jwt.sign({ user_id: user.user_id, username: user.username }, SECRET, { expiresIn: '1h' });
    res.json({ token, user: { user_id: user.user_id, username: user.username } });
  } catch (err) {
    console.error('Login failed:', err);
    res.status(500).send('Unable to sign in right now.');
  }
});

module.exports = router;
