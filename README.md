# 🌍 Explore Kigezi

> A cultural tourism marketplace connecting curious travellers with authentic Bakiga cultural experience hosts in the beautiful Kigezi region of Uganda. 🇺🇬

![Kigezi Banner](https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1200&q=80)

---

## Features

### For Tourists
- Browse & search authentic cultural experiences
- Book with date selection, group size, and instant confirmation
- Pay via MTN Mobile Money, Airtel Money, or on arrival
- Leave reviews with ratings and host responses
- Manage all bookings in one dashboard

### For Cultural Hosts
- Create and manage experience listings
- Dashboard with earnings, booking stats, and reviews
- Confirm/complete bookings with one click
- SMS notifications via Africa's Talking

### For Admins
- Review and verify host applications
- Revenue charts and platform analytics
- Full booking oversight

---

## 🛠 Tech Stack

| Layer    | Technology |
|----------|-----------|
| Backend  | Django 4.2, Django REST Framework, PostgreSQL |
| Frontend | React 18, Vite, Tailwind CSS 3 |
| Payments | Flutterwave |
| SMS      | Africa's Talking |
| Auth     | JWT (djangorestframework-simplejwt) |
| Charts   | Recharts |
| Hosting  | Docker + Docker Compose |

---

## Quick Start

### Option 1: Docker (Recommended)

```bash
# 1. Clone the repo
git clone https://github.com/umarkhemis/explore-kigezi.git
cd explore-kigezi

# 2. Copy environment file
cp .env.example .env

# 3. Run everything
docker-compose up --build

# 4. In a new terminal, create a superuser
docker-compose exec backend python manage.py createsuperuser
```

Visit: **http://localhost:5173**

### Option 2: Manual Setup

**Backend:**
```bash
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp ../.env.example .env   # edit DB settings to use local postgres
python manage.py migrate
python manage.py loaddata fixtures/sample_data.json
python manage.py runserver
```

**Frontend:**
```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:8000" > .env
npm run dev
```

---

## Demo Credentials

| Role    | Email                          | Password       |
|---------|-------------------------------|----------------|
| Tourist | sarah@example.com              | tourist123456  |
| Tourist | james@example.com              | tourist123456  |
| Host    | amara@explorekigezi.com        | host123456     |
| Host    | grace@explorekigezi.com        | host123456     |
| Admin   | admin@explorekigezi.com        | admin123456    |

---

## 📡 Key API Endpoints

```
POST   /api/auth/login/              Login
POST   /api/auth/register/           Register tourist
POST   /api/hosts/register/          Register host
GET    /api/experiences/             List experiences
GET    /api/experiences/:id/         Experience detail
POST   /api/bookings/                Create booking
GET    /api/bookings/my/             My bookings
POST   /api/reviews/                 Submit review
GET    /api/admin/hosts/             Admin: list hosts
POST   /api/admin/hosts/:id/approve/ Admin: approve host
```

---

## Project Structure

```
explore-kigezi/
├── backend/
│   ├── explore_kigezi/      # Django settings
│   ├── apps/
│   │   ├── accounts/        # User auth + host profiles
│   │   ├── experiences/     # Experience listings + categories
│   │   ├── bookings/        # Booking management
│   │   ├── reviews/         # Reviews + ratings
│   │   └── payments/        # Flutterwave integration
│   ├── fixtures/            # Sample data
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├─�� pages/           # All page components
│   │   ├── components/      # Reusable UI components
│   │   ├── services/        # API service layer
│   │   ├── context/         # Auth context
│   │   └── App.jsx          # Routes
│   ├── tailwind.config.js
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Screenshots

> Add your screenshots here after running the app locally.

---

## License

MIT © 2026 Explore Kigezi — Celebrating Bakiga Culture 💚