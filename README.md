# 💇‍♀️ Karapinha - Beauty Salon Appointment Booking System

## 📋 About the Project

**Karapinha** is a complete online appointment booking system for beauty salons, developed as an academic project for the third year of Web Application Development. The system allows clients to book services, professionals to manage their schedules, and administrators to control the entire salon operation.

## ✨ Main Features

### For Clients
- 📅 Online service booking
- 👤 Profile registration and management
- 📱 Responsive and intuitive interface
- 📊 Appointment history
- 💳 Service and pricing visualization

### For Professionals
- ⏰ Available schedule management
- 📋 Appointment visualization
- 👥 Client management
- 📈 Performance reports

### For Administrators
- 🏢 Complete salon management
- 👨‍💼 Professional registration
- 🛠️ Service and category management
- 📊 Reports and dashboards
- 📧 Email notification system

## 🛠️ Technologies Used

### Backend
- **ASP.NET Core 8.0** - Web framework
- **Entity Framework Core** - Database ORM
- **SQL Server** - Database management system
- **JWT (JSON Web Tokens)** - Authentication and authorization
- **BCrypt.Net** - Password hashing
- **MailKit** - Email sending
- **Swagger** - API documentation

### Frontend
- **React 18** - JavaScript library for UI
- **Vite** - Build tool and dev server
- **Material-UI (MUI)** - Interface components
- **TailwindCSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Router** - Routing
- **Chart.js** - Charts and visualizations
- **React Calendar** - Calendar component
- **jsPDF** - PDF generation
- **AOS (Animate On Scroll)** - Animations

## 🚀 How to Run the Project

### Prerequisites

- **.NET 8.0 SDK** or higher
- **Node.js** (version 16 or higher)
- **SQL Server** (LocalDB or full instance)
- **Git**

### 1. Cloning the Repository

```bash
git clone <repository-url>
cd karapinha
```

### 2. Backend Setup

```bash
# Navigate to the backend folder
cd backend

# Restore dependencies
dotnet restore

# Configure the connection string in appsettings.json
# Edit the appsettings.json file with your database settings

# Generate and apply database migrations
dotnet ef database update

# Run the backend in development mode
dotnet watch run
```

The backend will be available at: `https://localhost:7000` (HTTPS) or `http://localhost:5000` (HTTP)

### 3. Frontend Setup

```bash
# Navigate to the frontend folder (in a new terminal)
cd frontend

# Install dependencies
npm install

# Run the frontend in development mode
npm run dev
```

The frontend will be available at: `http://localhost:5173`

## 📁 Project Structure

```
karapinha/
├── backend/                 # ASP.NET Core API
│   ├── Controllers/         # API Controllers
│   ├── DAL/                # Data Access Layer
│   ├── DTO/                # Data Transfer Objects
│   ├── Model/              # Data models
│   ├── Services/           # Business logic
│   ├── Migrations/         # Database migrations
│   └── Program.cs          # Entry point
├── frontend/               # React application
│   ├── src/               # Source code
│   ├── public/            # Public files
│   └── package.json       # Node.js dependencies
└── README.md              # This file
```

## 🗄️ Database

The system uses **SQL Server** with **Entity Framework Core** for data management. The main entities include:

- **Users** - System users (clients, professionals, admin)
- **Appointments** - Bookings
- **Services** - Offered services
- **Categories** - Service categories
- **Professionals** - Salon professionals
- **ProfessionalSchedules** - Professional schedules

## 🔐 Authentication and Authorization

The system implements **JWT (JSON Web Tokens)** based authentication with different access levels:

- **Client** - Limited access to booking functionalities
- **Professional** - Schedule and client management
- **Administrator** - Full system access

## 📧 Email System

The project includes email sending functionality using **MailKit** for:
- Appointment confirmations
- Appointment reminders
- System notifications

## 🧪 Available Scripts

### Backend
```bash
dotnet run              # Run in production
dotnet watch run        # Run with hot reload
dotnet test            # Run tests
dotnet ef migrations add <name>  # Create new migration
dotnet ef database update        # Apply migrations
```

### Frontend
```bash
npm run dev            # Development server
npm run build          # Build for production
npm run preview        # Preview build
npm run lint           # Check code
```

## 📝 API Documentation

API documentation is available via **Swagger UI** when the backend is running:
- **Swagger UI**: `https://localhost:7000/swagger`

## 🤝 Contributing

This is an academic project. To contribute:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📄 License

This project is developed for academic purposes at ISPTEC.

## 👥 Development Team

Project developed by third-year Web Application Development students at ISPTEC.

---

**Note**: Make sure to properly configure database connection strings and email settings before running the project in production.
