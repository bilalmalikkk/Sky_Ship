import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import sql from 'mssql';

dotenv.config();

const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || 'DESKTOP-5FFLUPP',
  database: process.env.DB_NAME || 'sky_ship_link',
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true
  }
};

const setupAdmin = async () => {
  try {
    const pool = await sql.connect(sqlConfig);
    console.log('Connected to SQL Server');

    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const result = await pool.request()
      .input('username', sql.VarChar, 'admin')
      .input('email', sql.VarChar, 'admin@skyshiplink.com')
      .input('password', sql.VarChar, hashedPassword)
      .input('role', sql.VarChar, 'admin')
      .input('firstName', sql.VarChar, 'Admin')
      .input('lastName', sql.VarChar, 'User')
      .query(`
        IF NOT EXISTS (SELECT * FROM Users WHERE username = @username)
        BEGIN
          INSERT INTO Users (username, email, password, role, firstName, lastName)
          VALUES (@username, @email, @password, @role, @firstName, @lastName);
          SELECT 'Admin user created successfully' as message;
        END
        ELSE
        BEGIN
          SELECT 'Admin user already exists' as message;
        END
      `);

    console.log(result.recordset[0].message);
    await pool.close();
    process.exit(0);
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
};

setupAdmin();
