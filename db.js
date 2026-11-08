const { Pool } = require('pg');

const databaseOptions = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === 'true'
        ? { rejectUnauthorized: false }
        : undefined,
    }
  : {
      user: process.env.PGUSER || 'postgres',
      host: process.env.PGHOST || 'localhost',
      database: process.env.PGDATABASE || 'record_management',
      password: process.env.PGPASSWORD,
      port: Number(process.env.PGPORT || 5432),
    };

const pool = new Pool(databaseOptions);

module.exports = pool;
