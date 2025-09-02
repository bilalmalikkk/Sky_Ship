-- Test Connection Script for Sky Ship Link
-- Run this in SQL Server Management Studio

-- 1. Check if we can connect to the database
USE sky_ship_link;
GO

-- 2. Check if the user exists
SELECT 
    name as 'User Name',
    type_desc as 'User Type',
    is_disabled as 'Is Disabled'
FROM sys.database_principals 
WHERE name = 'skyshiplink_user';
GO

-- 3. Check if the login exists at server level
SELECT 
    name as 'Login Name',
    type_desc as 'Login Type',
    is_disabled as 'Is Disabled',
    default_database_name as 'Default Database'
FROM sys.server_principals 
WHERE name = 'skyshiplink_user';
GO

-- 4. Check user permissions
SELECT 
    dp.name as 'User Name',
    sp.name as 'Role Name',
    sp.type_desc as 'Role Type'
FROM sys.database_role_members drm
JOIN sys.database_principals dp ON drm.member_principal_id = dp.principal_id
JOIN sys.database_principals sp ON drm.role_principal_id = sp.principal_id
WHERE dp.name = 'skyshiplink_user';
GO

-- 5. Test a simple query
SELECT TOP 1 * FROM Users;
GO

PRINT 'Connection test completed!';
