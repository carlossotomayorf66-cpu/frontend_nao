const mysql = require('C:\\Users\\casf2\\Desktop\\backend_nao\\backend_nao\\node_modules\\mysql2/promise');
const bcrypt = require('C:\\Users\\casf2\\Desktop\\backend_nao\\backend_nao\\node_modules\\bcryptjs');

async function createAdmin() {
  try {
    const pool = mysql.createPool({
      host: 'localhost',
      port: 3307,
      user: 'gaby_user',
      password: 'gaby_secure_pass_2026',
      database: 'empresa_gaby'
    });

    const email = 'admin@gaby.com';
    const plainPassword = 'admin';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      await pool.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);
      console.log('Password reset successfully for existing user!');
      console.log('Email:', email);
      console.log('Password:', plainPassword);
    } else {
      await pool.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', ['Admin Gaby', email, hashedPassword]);
      console.log('User created successfully!');
      console.log('Email:', email);
      console.log('Password:', plainPassword);
    }
    process.exit(0);
  } catch (error) {
    console.error('Error creating user:', error);
    process.exit(1);
  }
}

createAdmin();
