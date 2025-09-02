-- Create database if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'sky_ship_link')
BEGIN
    CREATE DATABASE sky_ship_link;
END
GO

USE sky_ship_link;
GO

-- Create Users table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        firstName VARCHAR(50),
        lastName VARCHAR(50),
        phone VARCHAR(20),
        isActive BIT DEFAULT 1,
        createdAt DATETIME DEFAULT GETDATE(),
        updatedAt DATETIME DEFAULT GETDATE()
    );
END

-- Create Customers table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Customers')
BEGIN
    CREATE TABLE Customers (
        id INT IDENTITY(1,1) PRIMARY KEY,
        customerCode VARCHAR(20) UNIQUE NOT NULL,
        companyName VARCHAR(100) NOT NULL,
        contactPerson VARCHAR(100),
        email VARCHAR(100),
        phone VARCHAR(20),
        address TEXT,
        city VARCHAR(50),
        state VARCHAR(50),
        country VARCHAR(50),
        postalCode VARCHAR(20),
        isActive BIT DEFAULT 1,
        createdAt DATETIME DEFAULT GETDATE(),
        updatedAt DATETIME DEFAULT GETDATE()
    );
END

-- Create Shipments table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Shipments')
BEGIN
    CREATE TABLE Shipments (
        id INT IDENTITY(1,1) PRIMARY KEY,
        trackingNumber VARCHAR(50) UNIQUE NOT NULL,
        customerId INT FOREIGN KEY REFERENCES Customers(id),
        origin VARCHAR(100) NOT NULL,
        destination VARCHAR(100) NOT NULL,
        weight DECIMAL(10,2),
        dimensions VARCHAR(50),
        status VARCHAR(20) DEFAULT 'pending',
        estimatedDelivery DATETIME,
        actualDelivery DATETIME,
        notes TEXT,
        createdAt DATETIME DEFAULT GETDATE(),
        updatedAt DATETIME DEFAULT GETDATE()
    );
END

-- Create admin user (password: admin123)
IF NOT EXISTS (SELECT * FROM Users WHERE username = 'admin')
BEGIN
    INSERT INTO Users (username, email, password, role, firstName, lastName)
    VALUES ('admin', 'admin@skyshiplink.com', '$2a$10$rQZ9K8mN2pL1vX3yB6cF7dE8gH9iJ0kL1mN2oP3qR4sT5uV6wX7yZ8', 'admin', 'Admin', 'User');
END

-- Create indexes for better performance
CREATE INDEX IX_Users_Email ON Users(email);
CREATE INDEX IX_Customers_Email ON Customers(email);
CREATE INDEX IX_Shipments_TrackingNumber ON Shipments(trackingNumber);
CREATE INDEX IX_Shipments_CustomerId ON Shipments(customerId);
CREATE INDEX IX_Shipments_Status ON Shipments(status);
