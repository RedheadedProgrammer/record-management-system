const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all payroll records
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM payroll');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Add new payroll record
router.post('/', async (req, res) => {
  const { employee_id, base_salary, bonus, deductions, pay_date } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO payroll (employee_id, base_salary, bonus, deductions, pay_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [employee_id, base_salary, bonus, deductions, pay_date]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//update payroll record
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { employee_id, base_salary, bonus, deductions, pay_date } = req.body;
    try {
        const result = await pool.query(
            'UPDATE payroll SET employee_id=$1, base_salary=$2, bonus=$3, deductions=$4, pay_date=$5 WHERE payroll_id=$6 RETURNING *',
            [employee_id, base_salary, bonus, deductions, pay_date, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message
        )
    }
});

// Delete payroll record
router.delete('/:id', async (req, res) => {
    const { id } = req.params;  
    try {
        await pool.query('DELETE FROM payroll WHERE payroll_id=$1', [id]);
        res.send(`Payroll record ${id} deleted`);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
