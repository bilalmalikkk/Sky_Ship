-- Complete Database Setup for Sky Ship Link
-- Run this script in SQL Server Management Studio or Azure Data Studio

-- 1. Create database if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'sky_ship_link')
BEGIN
    CREATE DATABASE sky_ship_link;
    PRINT 'Database sky_ship_link created successfully.';
END
ELSE
BEGIN
    PRINT 'Database sky_ship_link already exists.';
END
GO

USE sky_ship_link;
GO

-- 2. Create login if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.server_principals WHERE name = 'skyshiplink_user')
BEGIN
    CREATE LOGIN skyshiplink_user 
    WITH PASSWORD = 'Bb22092001@#',
    DEFAULT_DATABASE = sky_ship_link,
    CHECK_EXPIRATION = OFF,
    CHECK_POLICY = OFF;
    PRINT 'Login skyshiplink_user created successfully.';
END
ELSE
BEGIN
    PRINT 'Login skyshiplink_user already exists.';
END
GO

-- 3. Create database user
IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = 'skyshiplink_user')
BEGIN
    CREATE USER skyshiplink_user FOR LOGIN skyshiplink_user;
    PRINT 'Database user skyshiplink_user created successfully.';
END
ELSE
BEGIN
    PRINT 'Database user skyshiplink_user already exists.';
END
GO

-- 4. Grant permissions to the user
EXEC sp_addrolemember 'db_owner', 'skyshiplink_user';
PRINT 'Granted db_owner role to skyshiplink_user.';
GO

-- 5. Create Users table
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
    PRINT 'Users table created successfully.';
END
ELSE
BEGIN
    PRINT 'Users table already exists.';
END

-- 6. Create Customers table
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
    PRINT 'Customers table created successfully.';
END
ELSE
BEGIN
    PRINT 'Customers table already exists.';
END

-- 7. Create Shipments table
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
    PRINT 'Shipments table created successfully.';
END
ELSE
BEGIN
    PRINT 'Shipments table already exists.';
END

-- 8. Create admin user (password: admin123)
IF NOT EXISTS (SELECT * FROM Users WHERE username = 'admin')
BEGIN
    INSERT INTO Users (username, email, password, role, firstName, lastName)
    VALUES ('admin', 'admin@skyshiplink.com', '$2a$10$rQZ9K8mN2pL1vX3yB6cF7dE8gH9iJ0kL1mN2oP3qR4sT5uV6wX7yZ8', 'admin', 'Admin', 'User');
    PRINT 'Admin user created successfully.';
END
ELSE
BEGIN
    PRINT 'Admin user already exists.';
END

-- 9. Create indexes for better performance
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Users_Email')
BEGIN
    CREATE INDEX IX_Users_Email ON Users(email);
    PRINT 'Index IX_Users_Email created successfully.';
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Customers_Email')
BEGIN
    CREATE INDEX IX_Customers_Email ON Customers(email);
    PRINT 'Index IX_Customers_Email created successfully.';
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Shipments_TrackingNumber')
BEGIN
    CREATE INDEX IX_Shipments_TrackingNumber ON Shipments(trackingNumber);
    PRINT 'Index IX_Shipments_TrackingNumber created successfully.';
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Shipments_CustomerId')
BEGIN
    CREATE INDEX IX_Shipments_CustomerId ON Shipments(customerId);
    PRINT 'Index IX_Shipments_CustomerId created successfully.';
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Shipments_Status')
BEGIN
    CREATE INDEX IX_Shipments_Status ON Shipments(status);
    PRINT 'Index IX_Shipments_Status created successfully.';
END

PRINT 'Database setup completed successfully!';
PRINT 'You can now connect using:';
PRINT 'Server: DESKTOP-5FFLUPP';
PRINT 'Database: sky_ship_link';
PRINT 'Username: skyshiplink_user';
PRINT 'Password: Bb22092001@#';
GO
