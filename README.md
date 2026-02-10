# Farmer Empowerment Management System (FEMS)

## Overview

The Farmer Empowerment Management System (FEMS) is a comprehensive web application designed to empower farmers by providing them with powerful tools and resources to manage their agricultural activities effectively. This project utilizes Django REST Framework for the backend API and Next.js with React for a modern, responsive frontend.

## Features

### 🔐 User Authentication & Profile
- **Secure Access**: Registration and login via phone/email with JWT authentication.
- **KYC Verification**: Upload and verify documents for identity proof.
- **Profile Management**: Manage personal details, farm information, and profile pictures.
- **Role-Based Access**: Specialized views for Farmers, Admins, and Wholesalers.

### 📊 Dashboard & Analytics
- **Live Overview**: Real-time summary of plots, active crops, pending tasks, and weather.
- **Weather Widget**: 4-day forecast and real-time conditions using Open-Meteo API.
- **Market Prices**: Live ticker of crop prices with trends.
- **Maharashtra Crop Data**: Specific analytics for district-wise crop production and area in Maharashtra.

### 🌾 Crop Management
- **Crop Database**: Add and maintain a detailed list of crops grown.
- **Crop Planning**: Schedule sowing and harvesting dates for seasons.
- **Crop Stocks**: Monitor current inventory levels of harvested produce.
- **Crop-Fertilizer Mapping**: Log fertilizer usage per crop.

### �️ Farm Resource Management
- **Plot Management**: Register land parcels, size, soil type, and location.
- **Machinery**: Track farm equipment, usage logs, and maintenance.
- **Manpower**: Manage labor resources, shifts, and wages.
- **Water Resources**: Monitor irrigation sources and water usage.
- **Fertilizers**: Manage fertilizer inventory and application records.

### ✅ Task & Operations
- **Task Scheduling**: Create tasks (Planting, Irrigation, etc.) with priority levels.
- **Status Tracking**: Monitor tasks from 'Pending' to 'Completed'.
- **Cost Tracking**: Log expenses associated with each task.

### 🛒 Marketplace & Business
- **Marketplace**: Connect with buyers and wholesalers.
- **Sales & Purchase**: Manage transactions, supply requests, and orders.
- **Wholesaler Directory**: Find and contact certified wholesalers.

### 📚 Knowledge Base
- **Resource Library**: Access educational articles, videos, and farming guides.
- **Reports**: Generate and view operational and financial reports.

## User Guide: How to Use the Application

This section guides you on where to find specific features and how to use them.

### 1. Getting Started
- **Registration**: Go to the **Auth** page (`/auth/register`) to create an account using your email/phone.
- **Profile Setup**: After logging in, navigate to **Profile** (`/editprofile`) to update your personal details, upload a photo, and complete KYC verification.

### 2. Setting Up Your Farm
- **Add Land**: Go to the **Plots** section (`/plots`) to register your farm plots. Enter the size, soil type, and location details.
- **Define Crops**: Visit the **Crops** section (`/crops`) to add the crops you intend to grow.
- **Inventory**: Use **Water Resources**, **Machinery**, and **Fertilizers** (under Crops/Inventory menus) to log your available resources.

### 3. Planning & Daily Operations
- **Plan Seasons**: Use **Crop Planning** (`/crop-planning`) to create schedules for your plots (e.g., Sowing Date, Harvest Date).
- **Assign Tasks**: Go to **Tasks** (`/tasks`) to create daily activities (e.g., "Watering Plot A"). Set deadlines, priority, and assign manpower to specific tasks.
- **Log Usage**: Record the usage of machinery and manpower in the **Machinery & Manpower** section (`/mach-man`).

### 4. Market & Business
- **Check Prices**: Visit the **Marketplace** (`/marketplace`) to see live crop prices and trends.
- **Connect**: Use the **Wholesaler** directory to find buyers.
- **Manage Trade**: Record your sales and purchases in the **Sales & Purchase** section (`/sales-purchase`).
- **Stocks**: Update your post-harvest inventory in **Crop Stocks** (`/crop-stocks`).

### 5. Insight & Analysis
- **Dashboard**: The **Home** page serves as your dashboard. Check weather forecasts, quick stats, and market tickers here.
- **Reports**: Go to **Reports** (`/reports`) to view detailed summaries of your farm's performance.
- **Data**: View **Maharashtra Data** on the dashboard or specific analytics page for regional insights.
- **Guides**: Need help? Visit the **Resource Library** (`/resources`) for farming guides and videos.

## Tech Stack

### Backend
- **Django 5.2.6** - High-level Python web framework
- **Django REST Framework** - Powerful API toolkit
- **SQLite** - Database
- **JWT Authentication** - Secure token-based auth
- **Python 3.10+** - Programming language

### Frontend
- **Next.js 14.1.4** - React framework with App Router
- **React 18** - UI library
- **TailwindCSS** - Utility-first CSS framework (v3.4.1)
- **JavaScript/JSX** - Programming language

### External APIs
- **Open-Meteo API** - Real-time weather data
- **BigDataCloud** - Reverse geocoding for location names
- **Gov Data (Mock)** - Maharashtra agriculture statistics

## Project Structure

```
FEMS/
├── backend/
│   ├── accounts/          # User authentication & management
│   ├── core/              # Project settings & main URLs
│   ├── crop/              # Crops, Tasks, Resources, Market Prices, Fertilizers
│   ├── plot/              # Plot management
│   ├── portal/            # Portal utilities and Base Views
│   ├── services/          # Email, OTP, KYC services
│   ├── wholeseller/       # Wholesaler management
│   └── manage.py
│
├── frontend/
│   ├── src/
│   │   ├── app/           # Next.js App Router pages
│   │   │   ├── auth/      # Login, Register
│   │   │   ├── crops/     # Crop management
│   │   │   ├── crop-planning/
│   │   │   ├── crop-stocks/
│   │   │   ├── plots/     # Plot management
│   │   │   ├── tasks/     # Task management
│   │   │   ├── resources/ # Library
│   │   │   ├── marketplace/
│   │   │   ├── sales-purchase/
│   │   │   ├── reports/
│   │   │   ├── mach-man/  # Machinery & Manpower
│   │   │   └── water-resources/
│   │   │   └── editprofile/
```

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

## API Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| **Auth** | `/accounts/register/`, `/login/` | User authentication |
| **Crops** | `/crop/`, `/crop/<id>/` | Manage crop details |
| **Planning** | `/crop/crop-plots/` | Manage crop planning per plot |
| **Tasks** | `/crop/tasks/` | Manage farming tasks |
| **Plots** | `/plot/` | Manage farm plots |
| **Stocks** | `/crop/stocks/` | Manage crop inventory |
| **Resources** | `/crop/resources/` | Access educational content |
| **Market** | `/crop/market-prices/` | Get market prices |
| **Machinery** | `/crop/machinery/` | Manage farm equipment |
| **Manpower** | `/crop/manpower/` | Manage labor |
| **Data** | `/crop/maharashtra-data/` | Get Maharashtra district crop stats |

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
This project is open source and available under the [MIT License](LICENSE).
