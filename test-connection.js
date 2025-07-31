const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'sernan',
      port: 3306,
    });

    const [version] = await connection.query('SELECT VERSION() as version');
    console.log('MySQL Server Version:', version[0].version);

    const [rows] = await connection.execute('SELECT DATABASE() as db');
    console.log('Connected to database:', rows[0].db);

    await connection.end();
  } catch (error) {
    console.error('Connection failed:', error.message);
  }
}

testConnection();
