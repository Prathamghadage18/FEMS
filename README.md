# Farmer Empowerment Management System (FEMS)

## Overview

The Farmer Empowerment Management System (FEMS) is a comprehensive web application designed to empower farmers by providing them with powerful tools and resources to manage their agricultural activities effectively. This project utilizes Django REST Framework for the backend API and Next.js with React for a modern, responsive frontend.

## Features

### 🔐 User Authentication
- Secure registration and login with JWT authentication
- Phone number and email-based authentication
- KYC verification support
- OTP-based verification

### 👤 Profile Management
- Complete profile management with personal information
- Contact details and farm details
- Profile picture upload
- User type management (Farmer, Admin, Wholesaler)

### 📊 Dashboard
- Real-time weather updates with location detection (Open-Meteo API)
- Live market prices with auto-refresh
- Overview statistics (plots, crops, plans, tasks)
- Quick action shortcuts
- Upcoming tasks preview
- 4-day weather forecast

### 🌾 Crop Management
- Add, update, and monitor crop information
- Track planting dates and expected harvest
- Crop status monitoring
- Crop variety management

### 📋 Crop Planning
- Seasonal crop planning
- Plan adjustments
- Sowing schedules
- Plot-based planning

### 🗺️ Plot Management
- Register and manage farm plots
- Track plot size and location
- Soil type classification
- Plot-specific crop assignments

### ✅ Task Management
- Create and manage farming tasks
- Task types: Planting, Harvesting, Irrigation, Fertilization, Pest Control, Maintenance
- Priority levels: Low, Medium, High, Urgent
- Status tracking: Pending, In Progress, Completed, Cancelled
- Due date management
- Cost tracking

### 📚 Resource Library
- Articles, videos, and guides
- Categories: Crop Management, Pest Control, Irrigation, Soil Health, Market Trends, Equipment
- Search and filter functionality
- External resource links

### 🛒 Marketplace
- Live market prices for crops
- Wholesaler directory
- Supply request system
- Buy and sell agricultural products
- Connect farmers with buyers/sellers

### 💧 Water Resources
- Irrigation management
- Water source tracking

### 🚜 Machinery & Manpower
- Farm equipment management
- Machinery tracking

### 📦 Crop Stocks
- Current stock inventory
- Future stock projections

## Tech Stack

### Backend
- **Django 5.2.6** - High-level Python web framework
- **Django REST Framework** - Powerful API toolkit
- **SQLite** - Database (easily switchable to PostgreSQL)
- **JWT Authentication** - Secure token-based auth
- **Python 3.10+** - Programming language

### Frontend
- **Next.js 14.1.4** - React framework with App Router
- **React 18** - UI library
- **TailwindCSS** - Utility-first CSS framework
- **JavaScript/JSX** - Programming language

### APIs
- **Open-Meteo API** - Real-time weather data (free, no API key required)
- **BigDataCloud** - Reverse geocoding for location names

## Project Structure

```
FEMS/
├── backend/
│   ├── accounts/          # User authentication & management
│   ├── core/              # Project settings & main URLs
│   ├── crop/              # Crop, Task, Resource, MarketPrice models
│   ├── plot/              # Plot management
│   ├── portal/            # Portal utilities
│   ├── services/          # Email, OTP, KYC services
│   ├── wholeseller/       # Wholesaler management
│   ├── manage.py
│   └── req.txt            # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── app/           # Next.js App Router pages
│   │   │   ├── auth/      # Login, Register, Forgot Password
│   │   │   ├── crops/     # Crop management
│   │   │   ├── crop-planning/
│   │   │   ├── crop-stocks/
│   │   │   ├── plots/     # Plot management
│   │   │   ├── tasks/     # Task management
│   │   │   ├── resources/ # Resource library
│   │   │   ├── marketplace/
│   │   │   ├── water-resources/
│   │   │   ├── mach-man/  # Machinery & Manpower
│   │   │   └── editprofile/
│   │   ├── services/      # API client
│   │   ├── constants/     # App constants & nav links
│   │   └── styles/        # Global styles
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
│
└── README.md
```

## Prerequisites

- **Python**: Version 3.10 or higher
- **Node.js**: Version 18+ (for frontend development)
- **npm**: Latest stable version

## Setup Guide

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/FEMS.git
cd FEMS
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r req.txt

# Run migrations
python manage.py migrate

# Create admin user (optional)
python manage.py shell -c "from accounts.models import User; u = User.objects.create(email='admin@fems.com', full_name='Admin User', phone='1234567890', user_type='ADMIN'); u.set_password('admin123'); u.save()"

# Start backend server
python manage.py runserver
```

Backend will be running at `http://localhost:8000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (new terminal)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be running at `http://localhost:3000`

### 4. Access the Application

Open your browser and navigate to `http://localhost:3000`

**Default Admin Credentials:**
- Email: admin@fems.com
- Password: admin123

## API Endpoints

### Authentication
- `POST /accounts/register/` - User registration
- `POST /accounts/login/` - User login
- `POST /accounts/logout/` - User logout
- `GET /accounts/profile/` - Get user profile
- `PUT /accounts/profile/` - Update profile

### Crops
- `GET /crop/` - List all crops
- `POST /crop/` - Create crop
- `GET /crop/<id>/` - Get crop details
- `PUT /crop/<id>/` - Update crop
- `DELETE /crop/<id>/` - Delete crop

### Tasks
- `GET /crop/tasks/` - List all tasks
- `POST /crop/tasks/` - Create task
- `PUT /crop/tasks/<id>/` - Update task
- `DELETE /crop/tasks/<id>/` - Delete task

### Resources
- `GET /crop/resources/` - List all resources
- `POST /crop/resources/` - Create resource

### Market Prices
- `GET /crop/market-prices/` - List market prices
- `POST /crop/market-prices/` - Add market price

### Plots
- `GET /plot/` - List all plots
- `POST /plot/` - Create plot

### Crop Planning
- `GET /crop/planning/` - List crop plans
- `POST /crop/planning/` - Create plan

## Environment Variables

### Backend (.env)
```plaintext
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///db.sqlite3
```

### Frontend (.env.local)
```plaintext
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Screenshots

### Dashboard
The dashboard provides a comprehensive overview with:
- Real-time weather widget with 4-day forecast
- Live market prices with price change indicators
- Farm statistics (Plots, Crops, Plans, Tasks)
- Quick action buttons
- Upcoming tasks preview

### Task Management
- Create and track farming tasks
- Filter by status
- Priority-based organization
- Cost tracking

### Marketplace
- View current market prices
- Connect with wholesalers
- Create supply requests

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgements

- Django & Django REST Framework
- Next.js & React
- TailwindCSS
- Open-Meteo Weather API
- All open-source contributors
