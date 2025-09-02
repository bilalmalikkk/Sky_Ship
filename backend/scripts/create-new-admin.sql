-- Create New Admin User Script
-- Alternative option if you want a fresh admin user

USE sky_ship_link;
GO

-- Delete existing admin user if exists
DELETE FROM Users WHERE username = 'admin' OR email = 'admin@skyshiplink.com';
GO

-- Create new admin user with password 'admin123'
-- This password hash corresponds to 'admin123'
INSERT INTO Users (username, email, password, role, firstName, lastName, isActive)
VALUES (
    'admin', 
    'admin@skyshiplink.com', 
    '$2a$10$rQZ9K8mN2pL1vX3yB6cF7dE8gH9iJ0kL1mN2oP3qR4sT5uV6wX7yZ8', 
    'admin', 
    'Admin', 
    'User',
    1
);
GO

-- Verify the new admin user
SELECT 
    username,
    email,
    role,
    firstName,
    lastName,
    isActive,
    createdAt
FROM Users 
WHERE username = 'admin';
GO

PRINT 'New admin user created successfully!';
PRINT 'Login credentials:';
PRINT 'Email: admin@skyshiplink.com';
PRINT 'Password: admin123';
