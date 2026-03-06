# 🏔️ Explore Kigezi

> **Authentic Bakiga Cultural Experiences** — a tourism platform connecting travellers with verified local hosts in Kigezi, Uganda.

---

## 🌿 About

**Explore Kigezi** is a cultural tourism MVP platform that enables travellers to discover, book, and review authentic Bakiga experiences — from traditional dance workshops and cooking classes to highland hikes and craft sessions. Local hosts can register, create experiences, and manage bookings through a dedicated dashboard.

---

## ✨ Features

| Role     | Capabilities |
|----------|-------------|
| **Tourist** | Browse experiences, book, view booking history, leave reviews |
| **Host** | Multi-step registration, create/edit experiences, manage bookings, view earnings |
| **Admin** | Verify/reject hosts, view all bookings, revenue analytics |

---

## 🛠 Tech Stack

| Layer       | Technology |
|-------------|-----------|
| Backend     | Django 4.2, Django REST Framework, PostgreSQL |
| Frontend    | React 18, Vite, Tailwind CSS 3 |
| Auth        | JWT (SimpleJWT) |
| Payments    | Flutterwave |
| SMS         | Africa's Talking |
| Container   | Docker + Docker Compose |

---

## 🚀 Quick Start

### With Docker (Recommended)

```bash
cp .env.example .env
# Edit .env with your values
docker-compose up --build
```

- Frontend: http://localhost:5173  
- Backend API: http://localhost:8000

### Manual Setup

**Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # edit values
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

**Frontend**
```bash
cd frontend
npm install
cp .env.example .env  # set VITE_API_URL
npm run dev
```

---

## 🔐 Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```env
# Django
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=explore_kigezi
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=db
DB_PORT=5432

# Frontend
VITE_API_URL=http://localhost:8000

# Flutterwave
FLUTTERWAVE_PUBLIC_KEY=your-flw-public-key
FLUTTERWAVE_SECRET_KEY=your-flw-secret-key

# Africa's Talking
AT_USERNAME=sandbox
AT_API_KEY=your-at-api-key
AT_SENDER_ID=ExploreKigezi
```

---

## 👤 Demo Credentials

| Role    | Email              | Password  |
|---------|--------------------|-----------|
| Tourist | tourist@demo.com   | demo1234  |
| Host    | host@demo.com      | demo1234  |
| Admin   | admin@demo.com     | demo1234  |

> **Note:** When the Django backend is not running, the frontend automatically falls back to mock data so you can explore the UI.

---

## 📡 API Endpoints (Overview)

| Endpoint                          | Description |
|-----------------------------------|-------------|
| `POST /api/auth/token/`           | Obtain JWT tokens |
| `POST /api/auth/register/`        | Tourist registration |
| `GET /api/experiences/`           | List experiences |
| `GET /api/experiences/:id/`       | Experience detail |
| `POST /api/bookings/`             | Create booking |
| `GET /api/bookings/my/`           | My bookings (tourist) |
| `POST /api/hosts/register/`       | Host registration |
| `GET /api/hosts/dashboard/stats/` | Host stats |
| `GET /api/hosts/bookings/`        | Host's bookings |
| `GET /api/hosts/experiences/`     | Host's experiences |
| `GET /api/admin/hosts/`           | Admin: list hosts |
| `POST /api/admin/hosts/:id/approve/` | Admin: approve host |
| `GET /api/admin/bookings/`        | Admin: all bookings |
| `GET /api/admin/stats/`           | Admin: platform stats |

---

## 📁 Project Structure

```
explore-kigezi/
├── backend/               # Django REST API
│   ├── config/            # Django settings & URL routing
│   ├── accounts_app/      # User, Host models & auth
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/              # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── layout/    # Navbar, Footer
│   │   │   ├── reviews/   # ReviewForm
│   │   │   └── ui/        # Badge, Modal, LoadingSpinner, etc.
│   │   ├── context/       # AuthContext
│   │   ├── pages/         # Route-level pages
│   │   │   ├── host/      # Host dashboard pages
│   │   │   └── admin/     # Admin panel pages
│   │   ├── routes/        # ProtectedRoute
│   │   └── services/      # API service modules
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 📸 Screenshots

_Screenshots will be added here once the platform is deployed._

---

## 📄 License

MIT © Explore Kigezi