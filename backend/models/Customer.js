import { sql } from '../config/db.js';

class Customer {
  static async create(customerData) {
    try {
      const { customerCode, companyName, contactPerson, email, phone, address, city, state, country, postalCode } = customerData;
      
      const result = await sql.query`
        INSERT INTO Customers (customerCode, companyName, contactPerson, email, phone, address, city, state, country, postalCode)
        OUTPUT INSERTED.id, INSERTED.customerCode, INSERTED.companyName, INSERTED.contactPerson, INSERTED.email, INSERTED.phone, INSERTED.address, INSERTED.city, INSERTED.state, INSERTED.country, INSERTED.postalCode, INSERTED.isActive, INSERTED.createdAt, INSERTED.updatedAt
        VALUES (${customerCode}, ${companyName}, ${contactPerson}, ${email}, ${phone}, ${address}, ${city}, ${state}, ${country}, ${postalCode})
      `;
      
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const result = await sql.query`
        SELECT * FROM Customers WHERE id = ${id}
      `;
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const result = await sql.query`
        SELECT * FROM Customers WHERE email = ${email}
      `;
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  static async updateById(id, updateData) {
    try {
      const { companyName, contactPerson, email, phone, address, city, state, country, postalCode, isActive } = updateData;
      const result = await sql.query`
        UPDATE Customers 
        SET companyName = ${companyName}, contactPerson = ${contactPerson}, email = ${email}, phone = ${phone}, address = ${address}, city = ${city}, state = ${state}, country = ${country}, postalCode = ${postalCode}, isActive = ${isActive}, updatedAt = GETDATE()
        OUTPUT INSERTED.id, INSERTED.customerCode, INSERTED.companyName, INSERTED.contactPerson, INSERTED.email, INSERTED.phone, INSERTED.address, INSERTED.city, INSERTED.state, INSERTED.country, INSERTED.postalCode, INSERTED.isActive, INSERTED.createdAt, INSERTED.updatedAt
        WHERE id = ${id}
      `;
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  static async getAll() {
    try {
      const result = await sql.query`
        SELECT * FROM Customers ORDER BY createdAt DESC
      `;
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async getActive() {
    try {
      const result = await sql.query`
        SELECT * FROM Customers WHERE isActive = 1 ORDER BY createdAt DESC
      `;
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async deleteById(id) {
    try {
      await sql.query`
        UPDATE Customers SET isActive = 0 WHERE id = ${id}
      `;
      return true;
    } catch (error) {
      throw error;
    }
  }
}

export default Customer;
