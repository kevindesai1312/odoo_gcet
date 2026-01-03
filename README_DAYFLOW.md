# 🚀 Dayflow HRMS - Human Resource Management System

**A modern, open-source HRMS built with Next.js, React, and Supabase**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-In%20Development-yellow.svg)](#project-status)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.17-green.svg)](https://nodejs.org/)

---

## ✨ About Dayflow

Dayflow is a comprehensive HRMS solution designed to streamline HR operations in modern organizations. It provides:

- 🔐 **Secure Authentication** - Email verification and JWT-based security
- 👥 **Employee Management** - Centralized employee database and profiles
- 📍 **Attendance Tracking** - Digital check-in/check-out with analytics
- 🏖️ **Leave Management** - Leave requests with approval workflow
- 💰 **Payroll System** - Salary management and payroll processing
- 📊 **Admin Dashboard** - Comprehensive management interface
- 📈 **Analytics & Reports** - Data-driven insights

---

## 🎯 Key Features (Current & Planned)

| Feature | Status | Details |
|---------|--------|---------|
| Authentication | ✅ | Sign up, sign in, email verification |
| Employee Management | 🟨 | API ready, UI in progress |
| Attendance Tracking | 🟨 | Check-in/out system ready |
| Leave Management | 🟨 | Request & approval system |
| Payroll | 🟨 | Salary processing ready |
| Admin Dashboard | 🔜 | Coming soon |
| Mobile App | 🔜 | Phase 2 |
| Notifications | 🔜 | Coming soon |
| Reports | 🔜 | Coming soon |

---

## 🏗️ Architecture

### Tech Stack
- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, JWT, Supabase
- **Database:** PostgreSQL (via Supabase)
- **Authentication:** Email + JWT tokens
- **Deployment:** Vercel (Frontend), Supabase (Backend)

### System Architecture
```
User Interface (Next.js/React)
    ↓
REST API (Next.js Routes)
    ↓
Database (PostgreSQL)
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.17+
- npm or yarn
- Supabase account (free)

### Installation

1. **Clone & Install**
```bash
git clone https://github.com/yourusername/dayflow.git
cd dayflow
npm install
```

2. **Setup Environment**
```bash
cp .env.example .env.local
# Edit .env.local with Supabase credentials
```

3. **Setup Database**
- Go to Supabase SQL Editor
- Run SQL script from HRMS_SYSTEM_DESIGN.md
- Or use: `npm run setup:db`

4. **Run Development Server**
```bash
npm run dev
```

Visit `http://localhost:3000` to see your app!

---

## 📚 Documentation

- [**HRMS System Design**](HRMS_SYSTEM_DESIGN.md) - Complete architecture & workflows
- [**Setup Guide**](SETUP_GUIDE.md) - Installation & configuration
- [**API Testing Guide**](API_TESTING_GUIDE.md) - Test all endpoints
- [**Project Status**](PROJECT_STATUS.md) - Development progress & roadmap
- [**Environment Variables**](.env.example) - Configuration template

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login
- `POST /api/auth/verify-email` - Verify email

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create employee (admin)

### Attendance
- `GET /api/attendance` - Get records
- `POST /api/attendance` - Check-in/Check-out

### Leave
- `GET /api/leave` - Get applications
- `POST /api/leave/apply` - Apply for leave

### Payroll
- `GET /api/payroll` - Get payroll records
- `POST /api/payroll/process` - Process payroll (admin)

Full API docs: [API_TESTING_GUIDE.md](API_TESTING_GUIDE.md)

---

## 🧪 Testing

### Test with cURL
```bash
# Sign up
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123","firstName":"John","lastName":"Doe","hireDate":"2024-01-01"}'

# Sign in
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123"}'
```

### Test with Postman
Import collection from API_TESTING_GUIDE.md

### Default Test Credentials
- Email: `admin@dayflow.com` | Password: `AdminPass123`
- Email: `john.doe@dayflow.com` | Password: `JohnPass123`

⚠️ Change these in production!

---

## 📊 Project Status

**Current Phase:** 🚧 Backend Complete - Frontend in Progress

### Completed ✅
- [x] System design & architecture
- [x] Database schema (12 tables)
- [x] Authentication system
- [x] All API endpoints
- [x] Type definitions
- [x] Documentation

### In Progress 🚧
- [ ] Frontend pages
- [ ] Admin dashboard
- [ ] Employee dashboard

### Coming Soon 🔜
- [ ] Mobile app
- [ ] Notifications
- [ ] Reports generation
- [ ] Advanced analytics

More details: [PROJECT_STATUS.md](PROJECT_STATUS.md)

---

## 📈 Development Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| Architecture | ✅ | 2 days |
| Backend APIs | ✅ | 3 days |
| Frontend | 🚧 | 3 days |
| Testing | ⏳ | 3 days |
| Deployment | ⏳ | 2 days |

---

## 🔐 Security

- ✅ Email validation
- ✅ Password strength validation (min 8 chars, uppercase, lowercase, number)
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ Email verification required
- 🔜 Two-factor authentication
- 🔜 Rate limiting
- 🔜 Input sanitization

---

## 📁 Project Structure

```
dayflow/
├── src/
│   ├── app/
│   │   ├── api/                # API routes
│   │   ├── auth/               # Auth pages
│   │   └── dashboard/          # Dashboard pages
│   ├── components/             # React components
│   ├── lib/
│   │   ├── database.ts         # DB config
│   │   ├── auth.ts             # Auth utilities
│   │   └── types-new.ts        # TypeScript types
│   └── hooks/                  # Custom hooks
├── public/                     # Static files
└── docs/                       # Documentation
```

---

## 🎯 Roadmap

### Phase 1 (Current) ✅
- [x] Core HRMS functionality
- [x] Authentication
- [x] Basic employee, attendance, leave, payroll

### Phase 2 (Next)
- [ ] Admin dashboard
- [ ] Employee portal
- [ ] Email notifications
- [ ] PDF reports

### Phase 3 (Future)
- [ ] Mobile app (iOS/Android)
- [ ] Biometric integration
- [ ] Advanced analytics
- [ ] Performance management

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 💬 Support

- 📖 Read the [documentation](HRMS_SYSTEM_DESIGN.md)
- 🧪 Check [API testing guide](API_TESTING_GUIDE.md)
- 📊 View [project status](PROJECT_STATUS.md)
- 📧 Email: support@dayflow.com

---

## 👥 Team

- **Architecture & Backend:** AI Assistant
- **Project Management:** Team Lead
- **Frontend Development:** In Progress

---

## 🙏 Acknowledgments

- Next.js & React teams
- Supabase for excellent backend services
- Shadcn/ui for component library
- Contributors and supporters

---

## 📞 Contact

- **Website:** (Coming soon)
- **Email:** support@dayflow.com
- **GitHub:** github.com/yourusername/dayflow
- **Issues:** [GitHub Issues](https://github.com/yourusername/dayflow/issues)

---

**Made with ❤️ | Dayflow HRMS v0.1.0 | 2024-2025**
