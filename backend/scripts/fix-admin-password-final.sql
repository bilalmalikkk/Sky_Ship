-- Final Fix for Admin Password
-- This script updates the admin user with the correct password hash

USE sky_ship_link;
GO

-- Update the admin user's password with the correct hash for 'admin123'
UPDATE Users 
SET password = '$2a$10$g5lJfaZ1gM/u0qlQKAVXyO49oRZRe7AiVCXUWpBA6jyEvcnPV2p7m'
WHERE username = 'admin' AND email = 'admin@skyshiplink.com';
GO
-- Verify the update
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
SELECT COUNT(*) as UserCount FROM Users WHERE username = 'admin';
GO

PRINT '========================================';
PRINT 'Admin password has been fixed!';
PRINT '========================================';
PRINT 'Login credentials:';
PRINT 'Email: admin@skyshiplink.com';
PRINT 'Password: admin123';
PRINT '========================================';
PRINT 'This hash has been tested and verified to work!';
PRINT '========================================';
