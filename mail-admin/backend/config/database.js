const mysql = require('mysql2/promise');
const config = require('./index');

const pool = mysql.createPool({
  ...config.db,
  charset: 'utf8mb4'
});

module.exports = pool;
