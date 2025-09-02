# Sky Ship Link - Complete Setup Guide

This guide will help you set up the complete Sky Ship Link CRM system with frontend, backend, and database.

## Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud)
- npm or yarn
- Git

## Quick Start

### 1. Clone and Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Edit .env with your configuration
# Set MONGODB_URI, JWT_SECRET, etc.

# Start MongoDB (if local)
mongod

# In another terminal, start the backend
npm run dev

# Setup initial admin user
npm run setup
```

### 2. Setup Frontend

```bash
# In the root directory, install frontend dependencies
npm install

# Start the frontend development server
npm run dev
```

### 3. Access the System

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Admin Login**: 
  - Email: admin@skyshiplink.com
  - Password: admin123

## Detailed Setup

### Backend Configuration

1. **Environment Variables** (`.env`):
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

2. **MongoDB Setup**:
   - Install MongoDB locally or use MongoDB Atlas
   - Create database: `sky-ship-link`
   - Update connection string in `.env`

3. **Backend Features**:
   - JWT Authentication
   - Role-based access control
   - Customer management
   - Shipment tracking
   - User management
   - Admin dashboard

### Frontend Features

1. **Authentication System**:
   - Login/Logout
   - Protected routes
   - Role-based UI

2. **CRM Dashboard**:
   - Customer management
   - Shipment tracking
   - File management
   - Analytics

3. **Responsive Design**:
   - Mobile-friendly
   - Modern UI components
   - Tailwind CSS

## API Endpoints

### Public
- `GET /api/health` - Health check

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get profile
- `PUT /api/auth/profile` - Update profile

### Protected Routes
- `GET /api/customers` - List customers
- `POST /api/customers` - Create customer
- `GET /api/shipments` - List shipments
- `POST /api/shipments` - Create shipment

### Admin Only
- `GET /api/admin/dashboard` - Admin dashboard
- `GET /api/admin/users` - User management
- `GET /api/admin/system/stats` - System statistics

## Database Models

### User
- Authentication fields
- Role-based permissions
- Profile information

### Customer
- Contact information
- Company details
- Status tracking
- Assignment tracking

### Shipment
- Tracking numbers
- Origin/destination
- Status updates
- Cost tracking

## Security Features

- JWT token authentication
- Password hashing (bcrypt)
- Rate limiting
- Input validation
- CORS protection
- Helmet security headers

## Development

### Backend
```bash
cd backend
npm run dev          # Development with nodemon
npm start           # Production
npm run setup       # Create admin user
```

### Frontend
```bash
npm run dev         # Development server
npm run build       # Production build
npm run preview     # Preview production build
```

## Production Deployment

1. **Backend**:
   - Set `NODE_ENV=production`
   - Use strong JWT secret
   - Configure MongoDB connection
   - Set up PM2 or similar

2. **Frontend**:
   - Build with `npm run build`
   - Deploy to CDN/static hosting
   - Update API base URL

3. **Environment**:
   - Secure JWT secrets
   - Database connection strings
   - CORS origins
   - Rate limiting

## Troubleshooting

### Common Issues

1. **MongoDB Connection**:
   - Check if MongoDB is running
   - Verify connection string
   - Check network access

2. **JWT Issues**:
   - Verify JWT_SECRET is set
   - Check token expiration
   - Clear browser storage

3. **CORS Errors**:
   - Verify backend CORS configuration
   - Check frontend API base URL
   - Ensure ports match

### Logs

- Backend logs in terminal
- Frontend errors in browser console
- MongoDB logs in mongod output

## Support

For issues and questions:
1. Check the logs
2. Verify configuration
3. Test API endpoints
4. Check database connectivity

## License

MIT License - see LICENSE file for details
