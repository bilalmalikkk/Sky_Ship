# Sky Ship Link Backend

Complete Node.js backend for the Sky Ship Link CRM system with authentication, user management, customer management, and shipment tracking.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Admin, Manager, and Employee roles
- **Customer Management**: Full CRM functionality with search and filtering
- **Shipment Tracking**: Complete logistics management system
- **Admin Dashboard**: Analytics and system administration
- **Security**: Rate limiting, helmet, CORS, input validation

## Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud)
- npm or yarn

## Installation

1. **Clone and navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/sky-ship-link
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   NODE_ENV=development
   ```

4. **Start MongoDB:**
   ```bash
   # Local MongoDB
   mongod
   
   # Or use MongoDB Atlas cloud service
   ```

5. **Run the server:**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/change-password` - Change password
- `GET /api/users/team` - Get team members (managers+)

### Customers
- `GET /api/customers` - List customers with pagination
- `GET /api/customers/:id` - Get customer details
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer
- `GET /api/customers/stats/overview` - Customer statistics

### Shipments
- `GET /api/shipments` - List shipments with pagination
- `GET /api/shipments/:id` - Get shipment details
- `GET /api/shipments/tracking/:trackingNumber` - Track shipment
- `POST /api/shipments` - Create new shipment
- `PUT /api/shipments/:id` - Update shipment
- `DELETE /api/shipments/:id` - Delete shipment
- `GET /api/shipments/stats/overview` - Shipment statistics

### Admin (Admin role required)
- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/admin/users` - List all users
- `GET /api/admin/users/:id` - Get user details
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `POST /api/admin/users/:id/reset-password` - Reset user password
- `GET /api/admin/system/stats` - System statistics

## Database Models

### User
- name, email, password, role, isActive, lastLogin, profileImage

### Customer
- name, email, phone, company, address, status, source, notes, assignedTo, tags

### Shipment
- trackingNumber, customer, origin, destination, status, type, weight, dimensions, value, shippingCost, trackingHistory

## Security Features

- JWT authentication with configurable expiration
- Role-based access control (admin, manager, employee)
- Password hashing with bcrypt
- Input validation with express-validator
- Rate limiting (100 requests per 15 minutes)
- Helmet security headers
- CORS configuration

## Development

```bash
# Run with nodemon for development
npm run dev

# Run tests
npm test

# Check for linting issues
npm run lint
```

## Production Deployment

1. Set `NODE_ENV=production` in environment
2. Use strong JWT secret
3. Configure MongoDB connection string
4. Set up proper CORS origins
5. Use PM2 or similar process manager

## License

MIT
