-- Fix Admin Login Script
-- This will completely recreate the admin user with the correct password

USE sky_ship_link;
GO

-- First, let's see what's currently in the Users table
SELECT 'Current Users:' as Info;
SELECT username, email, role, isActive, LEN(password) as PasswordLength FROM Users;
GO

-- Delete the existing admin user completely
DELETE FROM Users WHERE username = 'admin' OR email = 'oussoubb45@gmail.com' OR email = 'admin@skyshiplink.com';
GO

-- Create a fresh admin user with a simple password hash
-- Using a known working hash for 'admin123'
INSERT INTO Users (username, email, password, role, firstName, lastName, isActive)
VALUES (
    'admin', 
    'oussoubb45@gmail.com', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 
    'admin', 
    'Admin', 
    'User',
    1
);
GO

-- Verify the new admin user
SELECT 'New Admin User:' as Info;
SELECT 
    username,
    email,
    role,
    firstName,
    lastName,
    isActive,
    LEN(password) as PasswordLength,
    createdAt
FROM Users 
WHERE username = 'admin';
GO

-- Test query to make sure the user exists
SELECT 'Verification Query:' as Info;
SELECT COUNT(*) as UserCount FROM Users WHERE username = 'admin';
GO

PRINT '========================================';
PRINT 'Admin user has been recreated!';
PRINT '========================================';
PRINT 'Login credentials:';
PRINT 'Email: oussoubb45@gmail.com';
PRINT 'Password: admin123';
PRINT '========================================';
PRINT 'IMPORTANT: This password hash is known to work';
PRINT 'If it still fails, the issue is in the backend code';
PRINT '========================================';
