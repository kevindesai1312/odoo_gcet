# Dayflow HRMS - Human Resource Management System

## 🎯 Overview

Dayflow is a modern, web-based Human Resource Management System (HRMS) designed to digitize and streamline HR operations. It provides secure authentication, employee management, attendance tracking, leave management, payroll visibility, and comprehensive reporting capabilities.

**Project Status:** 🚧 In Development (Foundations Complete)

---

## ✨ Key Features

### Core Modules
- ✅ **Authentication** - Secure sign up/sign in with email verification
- ✅ **Employee Management** - Create, update, and manage employee profiles
- ✅ **Attendance Tracking** - Daily check-in/check-out with analytics
- ✅ **Leave Management** - Apply for leaves with approval workflow
- ✅ **Payroll** - Salary management and payroll processing
- 🚧 **Admin Dashboard** - Comprehensive admin interface (In Progress)
- 🔜 **Reports & Analytics** - Generate attendance and payroll reports

### User Roles
- **Admin/HR Officer** - Full access to all modules and approvals
- **Employee** - Access to own profile, attendance, leave, and salary

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────┐
│        Frontend (Next.js React)                 │
│  • Employee Dashboard                           │
│  • Admin Dashboard                              │
│  • Authentication Pages                         │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│        Backend API (Next.js API Routes)         │
│  • Authentication Service                       │
│  • Employee Management Service                  │
│  • Attendance Service                           │
│  • Leave Management Service                     │
│  • Payroll Service                              │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│      Database (Supabase PostgreSQL)             │
│  • Users & Authentication                       │
│  • Employees & Departments                      │
│  • Attendance Records                           │
│  • Leave Applications                           │
│  • Payroll Data                                 │
└─────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17 or later
- npm or yarn
- Supabase account (free tier available)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/dayflow.git
cd dayflow
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
```bash
# Copy example to create local environment file
cp .env.example .env.local
```

**Edit `.env.local` with your actual values:**
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT
JWT_SECRET=your-secret-key-change-in-production

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set Up Supabase Database

#### Option A: Manual Setup (Using SQL)
1. Log in to [Supabase](https://supabase.com)
2. Create a new project
3. Go to SQL Editor
4. Run the SQL script from [HRMS_SYSTEM_DESIGN.md](HRMS_SYSTEM_DESIGN.md#sql-setup-scripts)

#### Option B: Use Database Setup Utility
```bash
npm run setup:db
```

### 5. Run Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/           # Authentication endpoints
│   │   │   ├── signup/
│   │   │   ├── signin/
│   │   │   └── verify-email/
│   │   ├── employees/       # Employee management endpoints
│   │   ├── attendance/      # Attendance tracking endpoints
│   │   ├── leave/          # Leave management endpoints
│   │   └── payroll/        # Payroll management endpoints
│   ├── auth/               # Auth pages (signin, signup)
│   ├── dashboard/          # Dashboard pages
│   │   ├── attendance/
│   │   ├── employees/
│   │   ├── leave/
│   │   └── payroll/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # Reusable UI components
│   └── dashboard-nav.tsx   # Navigation component
├── hooks/                  # Custom React hooks
├── lib/
│   ├── database.ts         # Database configuration
│   ├── auth.ts             # Authentication utilities
│   ├── types-new.ts        # TypeScript type definitions
│   └── utils.ts            # Utility functions
└── middleware.ts           # Next.js middleware

public/                     # Static assets
```

---

## 🔑 API Endpoints

### Authentication
```
POST   /api/auth/signup           - Register new user
POST   /api/auth/signin           - Login user
POST   /api/auth/verify-email     - Verify email address
POST   /api/auth/forgot-password  - Request password reset
POST   /api/auth/reset-password   - Reset password
```

### Employee Management
```
GET    /api/employees             - Get all employees (admin)
GET    /api/employees/:id         - Get employee details
POST   /api/employees             - Create new employee (admin)
PUT    /api/employees/:id         - Update employee (admin)
DELETE /api/employees/:id         - Delete employee (admin)
GET    /api/employees/profile/me  - Get own profile
PUT    /api/employees/profile/me  - Update own profile
```

### Attendance
```
GET    /api/attendance            - Get attendance records
POST   /api/attendance            - Create attendance record
POST   /api/attendance/check-in   - Check in
POST   /api/attendance/check-out  - Check out
GET    /api/attendance/stats      - Get attendance statistics
```

### Leave Management
```
GET    /api/leave                 - Get leave applications
POST   /api/leave/apply           - Apply for leave
POST   /api/leave/approve         - Approve leave (admin)
POST   /api/leave/reject          - Reject leave (admin)
GET    /api/leave/balance         - Get leave balance
GET    /api/leave/types           - Get leave types
```

### Payroll
```
GET    /api/payroll               - Get payroll records
POST   /api/payroll/process       - Process payroll (admin)
GET    /api/payroll/salary-slip   - Get salary slip
PUT    /api/payroll/:id           - Update payroll record (admin)
POST   /api/payroll/generate-slip - Generate salary slip (admin)
```

---

## 🧪 Testing API Endpoints

### Using cURL
```bash
# Sign up
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "hireDate": "2024-01-01"
  }'

# Sign in
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'

# Check in
curl -X POST http://localhost:3000/api/attendance/check-in \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman
1. Import the collection from `postman-collection.json`
2. Set up environment variables with your token
3. Test each endpoint

---

## 🔒 Security Features

✅ **Password Security**
- Minimum 8 characters with uppercase, lowercase, and numbers
- Bcrypt hashing (planned for production)
- Password strength validation

✅ **Authentication**
- JWT token-based authentication
- Email verification required
- Token expiry (7 days)
- Secure password reset flow

✅ **Authorization**
- Role-based access control (RBAC)
- Admin-only endpoints protected
- Employees can only access their own data

✅ **Data Protection**
- HTTPS enforcement in production
- Input validation on all endpoints
- SQL injection prevention
- CSRF protection

---

## 🛠️ Development

### Build for Production
```bash
npm run build
npm start
```

### Run Tests
```bash
npm test
```

### Lint Code
```bash
npm run lint
```

### Format Code
```bash
npm run format
```

---

## 📊 Database Schema

### Core Tables
- `users` - User authentication records
- `employees` - Employee information
- `departments` - Organization departments
- `attendance` - Daily attendance records
- `leave_types` - Available leave types
- `leave_balance` - Employee leave balance
- `leave_applications` - Leave requests
- `payroll` - Salary records
- `salary_components` - Deductions and allowances
- `salary_slips` - Generated salary documents

See [HRMS_SYSTEM_DESIGN.md](HRMS_SYSTEM_DESIGN.md#database-schema-overview) for detailed schema.

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Deploy to Heroku
```bash
# Create Heroku app
heroku create dayflow-hrms

# Set environment variables
heroku config:set JWT_SECRET=your-secret

# Deploy
git push heroku main
```

### Deploy to AWS
1. Create EC2 instance
2. Configure RDS for PostgreSQL
3. Use Docker for containerization
4. Deploy with CodePipeline

---

## 📚 Documentation

- [System Design Document](HRMS_SYSTEM_DESIGN.md) - Complete system architecture and workflows
- [API Documentation](docs/API.md) - Detailed API endpoints
- [Database Schema](docs/DATABASE.md) - Database structure
- [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment steps
- [Security Guidelines](docs/SECURITY.md) - Security best practices

---

## 🎯 Roadmap

### Phase 1 (Current) ✅
- [x] Authentication system
- [x] Employee management API
- [x] Attendance tracking
- [x] Leave management
- [x] Payroll module
- [ ] Dashboard UI

### Phase 2 (Next)
- [ ] Admin dashboard interface
- [ ] Employee self-service portal
- [ ] Email notifications
- [ ] Report generation (PDF/Excel)
- [ ] Mobile app (React Native)

### Phase 3 (Future)
- [ ] Biometric attendance integration
- [ ] Bulk operations & imports
- [ ] Performance management
- [ ] Advanced analytics & insights
- [ ] API rate limiting & caching
- [ ] Multi-language support

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Use TypeScript for type safety
- Follow ESLint configuration
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes before submitting

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Project Lead:** [Your Name]
- **Backend Developer:** [Name]
- **Frontend Developer:** [Name]
- **DevOps:** [Name]

---

## 💬 Support

For support, email support@dayflow.com or open an issue in the GitHub repository.

### FAQ

**Q: How do I reset a user's password?**
A: Use the `/api/auth/forgot-password` endpoint to initiate password reset.

**Q: Can I customize leave types?**
A: Yes, admins can add custom leave types via the admin dashboard (coming soon).

**Q: Is there a mobile app?**
A: Mobile apps are planned for Phase 2. Currently, the web app is responsive.

**Q: How is data backed up?**
A: Supabase automatically backs up data. Manual backups are recommended for production.

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Supabase for database hosting
- Shadcn/ui for UI components
- All contributors and testers

---

**Last Updated:** January 3, 2026  
**Version:** 0.1.0  
**Status:** 🚧 In Development
