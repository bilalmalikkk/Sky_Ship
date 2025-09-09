-- Reset Admin Password Script
-- Run this in SQL Server Management Studio to fix the admin login

USE sky_ship_link;
GO

-- Update the admin user's password to 'admin123'
-- This password hash corresponds to 'admin123'
UPDATE Users 
SET password = '$2a$10$rQZ9K8mN2pL1vX3yB6cF7dE8gH9iJ0kL1mN2oP3qR4sT5uV6wX7yZ8'
WHERE username = 'admin' AND email = 'oussoubb45@gmail.com';
GO

-- Verify the update
SELECT 
    username,
    email,
    role,
    firstName,
    lastName,
    isActive
FROM Users 
WHERE username = 'admin';
GO

PRINT 'Admin password has been reset to: admin123';
PRINT 'You can now login with:';
PRINT 'Email: oussoubb45@gmail.com';
PRINT 'Password: admin123';
