# SQL Server Integration Setup

## Prerequisites
- SQL Server installed and running on DESKTOP-5FFLUPP
- SQL Server Management Studio (SSMS) or Azure Data Studio
- Node.js and npm installed

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File
Copy `env.example` to `.env` and update with your SQL Server credentials:
```env
PORT=5000
DB_SERVER=DESKTOP-5FFLUPP
DB_USER=sa
DB_PASSWORD=your-actual-password
DB_NAME=sky_ship_link
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
NODE_ENV=development
```

### 3. Create Database and Tables
Run the SQL script in SSMS or Azure Data Studio:
```bash
# Open backend/scripts/setup-database.sql in SSMS
# Execute the script to create database and tables
```

### 4. Setup Admin User
```bash
npm run setup
```

### 5. Start the Server
```bash
npm run dev
```

## Database Schema

### Users Table
- id (Primary Key)
- username, email, password
- role (admin/user)
- firstName, lastName, phone
- isActive, createdAt, updatedAt

### Customers Table
- id (Primary Key)
- customerCode, companyName, contactPerson
- email, phone, address
- city, state, country, postalCode
- isActive, createdAt, updatedAt

### Shipments Table
- id (Primary Key)
- trackingNumber, customerId (Foreign Key)
- origin, destination, weight, dimensions
- status, estimatedDelivery, actualDelivery
- notes, createdAt, updatedAt

## Connection Details
- Server: DESKTOP-5FFLUPP
- Database: sky_ship_link
- Authentication: SQL Server Authentication
- User: sa (or your preferred user)
- Encryption: Enabled with trust server certificate

## Troubleshooting
- Ensure SQL Server service is running
- Check firewall settings
- Verify SQL Server Authentication is enabled
- Confirm user has appropriate permissions
