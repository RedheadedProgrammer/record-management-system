const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const employeesRoutes = require('./routes/employees.js');
const attendanceRoutes = require('./routes/attendance.js');
const payrollRoutes = require('./routes/payroll.js');
const authRoutes = require('./routes/auth.js');
const { SECRET } = require('./authConfig');

const app = express();
const allowedOrigins = [
  process.env.CLIENT_URL,
  ...(process.env.CORS_ORIGINS || '').split(',')
].filter(Boolean).map(origin => origin.trim());

// Apply middleware before routers so JSON bodies and authorization headers are available.
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || (process.env.NODE_ENV !== 'production' && origin === 'http://localhost:3000')) {
      return callback(null, true);
    }
    return callback(new Error('Origin is not allowed by CORS.'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ message: 'Sign in is required.' });
  }

  jwt.verify(token, SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ message: 'Your session is invalid or has expired.' });
    }
    req.user = user;
    next();
  });
}

// Authentication endpoints are public; record-management endpoints require a valid token.
app.use('/auth', authRoutes);
app.use('/employees', authenticateToken, employeesRoutes);
app.use('/attendance', authenticateToken, attendanceRoutes);
app.use('/payroll', authenticateToken, payrollRoutes);

const PORT = Number(process.env.PORT || 5000);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
