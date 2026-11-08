const fs = require('node:fs');
const path = require('node:path');
const pool = require('../db');

async function initializeDatabase() {
  const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');

  try {
    await pool.query(schema);
    console.log('Database schema is ready.');
  } finally {
    await pool.end();
  }
}

initializeDatabase().catch(error => {
  console.error('Database schema initialization failed:', error.message);
  process.exitCode = 1;
});