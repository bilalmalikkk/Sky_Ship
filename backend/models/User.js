import bcrypt from 'bcryptjs';
import { sql } from '../config/db.js';

class User {
  static async create(userData) {
    try {
      const { username, email, password, role = 'user', firstName, lastName, phone } = userData;
      
      // Hash password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      const result = await sql.query`
        INSERT INTO Users (username, email, password, role, firstName, lastName, phone)
        OUTPUT INSERTED.id, INSERTED.username, INSERTED.email, INSERTED.role, INSERTED.firstName, INSERTED.lastName, INSERTED.phone, INSERTED.isActive, INSERTED.createdAt, INSERTED.updatedAt
        VALUES (${username}, ${email}, ${hashedPassword}, ${role}, ${firstName}, ${lastName}, ${phone})
      `;
      
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const result = await sql.query`
        SELECT * FROM Users WHERE email = ${email}
      `;
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const result = await sql.query`
        SELECT id, username, email, role, firstName, lastName, phone, isActive, createdAt, updatedAt
        FROM Users WHERE id = ${id}
      `;
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  static async updateById(id, updateData) {
    try {
      const { firstName, lastName, phone, isActive } = updateData;
      const result = await sql.query`
        UPDATE Users 
        SET firstName = ${firstName}, lastName = ${lastName}, phone = ${phone}, isActive = ${isActive}, updatedAt = GETDATE()
        OUTPUT INSERTED.id, INSERTED.username, INSERTED.email, INSERTED.role, INSERTED.firstName, INSERTED.lastName, INSERTED.phone, INSERTED.isActive, INSERTED.createdAt, INSERTED.updatedAt
        WHERE id = ${id}
      `;
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  static async updateLastLogin(id) {
    try {
      await sql.query`
        UPDATE Users SET updatedAt = GETDATE() WHERE id = ${id}
      `;
    } catch (error) {
      throw error;
    }
  }

  static async matchPassword(enteredPassword, storedPassword) {
    return await bcrypt.compare(enteredPassword, storedPassword);
  }

  static async getAll() {
    try {
      const result = await sql.query`
        SELECT id, username, email, role, firstName, lastName, phone, isActive, createdAt, updatedAt
        FROM Users ORDER BY createdAt DESC
      `;
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  // Add these methods to make the model compatible with the auth logic
  async matchPassword(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  }

  async save() {
    try {
      // Update the user's lastLogin
      await sql.query`
        UPDATE Users SET updatedAt = GETDATE() WHERE id = ${this.id}
      `;
      return this;
    } catch (error) {
      throw error;
    }
  }
}

export default User;
