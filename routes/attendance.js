const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all attendance records
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM attendance');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Add new attendance record
router.post('/', async (req, res) => {
  const { employee_id, date, status } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO attendance (employee_id, date, status) VALUES ($1, $2, $3) RETURNING *',
      [employee_id, date, status]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update attendance record
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { employee_id, date, status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE attendance SET employee_id=$1, date=$2, status=$3 WHERE attendance_id=$4 RETURNING *',
      [employee_id, date, status, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete attendance record
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM attendance WHERE attendance_id=$1', [id]);
    res.send(`Attendance record ${id} deleted`);
  } catch (err) {
    res.status(500).send(err.message);
  }
});
module.exports = router;
