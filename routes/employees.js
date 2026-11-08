const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all employees
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM employees');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Add new employee
router.post('/', async (req, res) => {
  const { first_name, last_name, department, email, phone } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO employees (first_name, last_name, department, email, phone) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [first_name, last_name, department, email, phone]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update employee
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, department, email, phone } = req.body;
  try {
    const result = await pool.query(
      'UPDATE employees SET first_name=$1, last_name=$2, department=$3, email=$4, phone=$5 WHERE employee_id=$6 RETURNING *',
      [first_name, last_name, department, email, phone, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete employee
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM employees WHERE employee_id=$1', [id]);
    res.send(`Employee ${id} deleted`);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


module.exports = router;
