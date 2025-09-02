import { sql } from '../config/db.js';

class Shipment {
  static async create(shipmentData) {
    try {
      const { trackingNumber, customerId, origin, destination, weight, dimensions, status = 'pending', estimatedDelivery, notes } = shipmentData;
      
      const result = await sql.query`
        INSERT INTO Shipments (trackingNumber, customerId, origin, destination, weight, dimensions, status, estimatedDelivery, notes)
        OUTPUT INSERTED.id, INSERTED.trackingNumber, INSERTED.customerId, INSERTED.origin, INSERTED.destination, INSERTED.weight, INSERTED.dimensions, INSERTED.status, INSERTED.estimatedDelivery, INSERTED.actualDelivery, INSERTED.notes, INSERTED.createdAt, INSERTED.updatedAt
        VALUES (${trackingNumber}, ${customerId}, ${origin}, ${destination}, ${weight}, ${dimensions}, ${status}, ${estimatedDelivery}, ${notes})
      `;
      
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const result = await sql.query`
        SELECT s.*, c.companyName, c.contactPerson
        FROM Shipments s
        LEFT JOIN Customers c ON s.customerId = c.id
        WHERE s.id = ${id}
      `;
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByTrackingNumber(trackingNumber) {
    try {
      const result = await sql.query`
        SELECT s.*, c.companyName, c.contactPerson
        FROM Shipments s
        LEFT JOIN Customers c ON s.customerId = c.id
        WHERE s.trackingNumber = ${trackingNumber}
      `;
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  static async updateById(id, updateData) {
    try {
      const { origin, destination, weight, dimensions, status, estimatedDelivery, actualDelivery, notes } = updateData;
      const result = await sql.query`
        UPDATE Shipments 
        SET origin = ${origin}, destination = ${destination}, weight = ${weight}, dimensions = ${dimensions}, status = ${status}, estimatedDelivery = ${estimatedDelivery}, actualDelivery = ${actualDelivery}, notes = ${notes}, updatedAt = GETDATE()
        OUTPUT INSERTED.id, INSERTED.trackingNumber, INSERTED.customerId, INSERTED.origin, INSERTED.destination, INSERTED.weight, INSERTED.dimensions, INSERTED.status, INSERTED.estimatedDelivery, INSERTED.actualDelivery, INSERTED.notes, INSERTED.createdAt, INSERTED.updatedAt
        WHERE id = ${id}
      `;
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  static async updateStatus(id, status) {
    try {
      const result = await sql.query`
        UPDATE Shipments 
        SET status = ${status}, updatedAt = GETDATE()
        OUTPUT INSERTED.id, INSERTED.trackingNumber, INSERTED.status, INSERTED.updatedAt
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
        SELECT s.*, c.companyName, c.contactPerson
        FROM Shipments s
        LEFT JOIN Customers c ON s.customerId = c.id
        ORDER BY s.createdAt DESC
      `;
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async getByCustomerId(customerId) {
    try {
      const result = await sql.query`
        SELECT s.*, c.companyName, c.contactPerson
        FROM Shipments s
        LEFT JOIN Customers c ON s.customerId = c.id
        WHERE s.customerId = ${customerId}
        ORDER BY s.createdAt DESC
      `;
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async getByStatus(status) {
    try {
      const result = await sql.query`
        SELECT s.*, c.companyName, c.contactPerson
        FROM Shipments s
        LEFT JOIN Customers c ON s.customerId = c.id
        WHERE s.status = ${status}
        ORDER BY s.createdAt DESC
      `;
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async deleteById(id) {
    try {
      await sql.query`
        DELETE FROM Shipments WHERE id = ${id}
      `;
      return true;
    } catch (error) {
      throw error;
    }
  }
}

export default Shipment;
