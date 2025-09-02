# Sky Ship Link - Shipping & Logistics CRM System

A comprehensive Customer Relationship Management system designed specifically for shipping and logistics companies. Built with modern web technologies to streamline operations, manage customers, track shipments, and provide real-time insights.

## 🚀 Features

### Core CRM Functionality
- **Customer Management**: Complete customer profiles, contact information, and history
- **Shipment Tracking**: Real-time shipment status, tracking numbers, and delivery updates
- **User Management**: Role-based access control (Admin, Manager, Employee)
- **File Management**: Document storage and organization system
- **Dashboard Analytics**: Key performance indicators and business insights

### User Roles & Permissions
- **Admin**: Full system access and user management
- **Manager**: Customer and shipment management
- **Employee**: Basic CRM operations and data entry

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for modern, responsive design
- **Shadcn/ui** components for consistent UI
- **React Router** for navigation
- **React Query** for data fetching

### Backend
- **Node.js** with Express.js
- **SQL Server** database
- **JWT** authentication
- **bcryptjs** for password hashing
- **Express middleware** for security

## 📋 Prerequisites

- Node.js 18+
- SQL Server (local or cloud)
- npm or yarn

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd sky-ship-link
```

### 2. Backend Setup
```bash
cd backend
npm install
cp env.example .env
# Edit .env with your SQL Server credentials
npm run dev
```

### 3. Frontend Setup
```bash
# In the root directory
npm install
npm run dev
```

### 4. Database Setup
Run the SQL scripts in `backend/scripts/` to set up your database:
- `setup-database-complete.sql` - Creates database and tables
- `fix-admin-password-final.sql` - Sets up admin user

### 5. Access the System
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:5000
- **Default Admin Login**:
  - Email: `admin@skyshiplink.com`
  - Password: `admin123`

## 📁 Project Structure

```
sky-ship-link/
├── src/                    # Frontend source code
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── contexts/          # React contexts
│   ├── services/          # API services
│   └── ui/                # UI component library
├── backend/               # Backend source code
│   ├── config/            # Database and app configuration
│   ├── models/            # Data models
│   ├── routes/            # API endpoints
│   ├── middleware/        # Express middleware
│   └── scripts/           # Database setup scripts
└── public/                # Static assets
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:

```env
PORT=5000
DB_SERVER=your-sql-server
DB_NAME=sky_ship_link
DB_USER=your-db-user
DB_PASSWORD=your-db-password
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
NODE_ENV=development
```

## 📊 Database Schema

### Users Table
- User authentication and profile information
- Role-based permissions
- Login history tracking

### Customers Table
- Customer contact information
- Shipping preferences
- Account history

### Shipments Table
- Tracking information
- Origin and destination
- Status and delivery updates

## 🚀 Deployment

### Frontend Build
```bash
npm run build
```

### Backend Production
```bash
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Sky Ship Link** - Streamlining shipping and logistics operations with modern CRM technology.
