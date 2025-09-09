import bcrypt from 'bcryptjs';
import connectDB, { sql } from '../config/db.js';

const setupAdmin = async () => {
  try {
    const pool = await connectDB();
    console.log('Connected to SQL Server (setup-admin)');

    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const result = await pool.request()
      .input('username', sql.VarChar, 'admin')
      .input('email', sql.VarChar, 'oussoubb45@gmail.com')
      .input('password', sql.VarChar, hashedPassword)
      .input('role', sql.VarChar, 'admin')
      .input('firstName', sql.VarChar, 'Ousmane')
      .input('lastName', sql.VarChar, 'Mboup')
      .query(`
        IF EXISTS (SELECT 1 FROM Users WHERE username = @username OR email IN ('admin@skyshiplink.com', @email))
        BEGIN
          UPDATE Users 
          SET email = @email,
              password = @password,
              role = @role,
              firstName = @firstName,
              lastName = @lastName,
              isActive = 1,
              updatedAt = GETDATE()
          WHERE username = @username OR email IN ('admin@skyshiplink.com', @email);
          SELECT 'Admin user updated successfully' as message;
        END
        ELSE
        BEGIN
          INSERT INTO Users (username, email, password, role, firstName, lastName, isActive)
          VALUES (@username, @email, @password, @role, @firstName, @lastName, 1);
          SELECT 'Admin user created successfully' as message;
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
