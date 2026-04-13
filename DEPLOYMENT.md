# RCMS Backend - Quick Start & Deployment Guide

## ✅ Backend Setup Complete!

Your production-ready RCMS backend has been created with:

- ✓ Complete REST API (21+ endpoints)
- ✓ MySQL database with auto-migrations
- ✓ JWT authentication & role-based authorization
- ✓ Input validation & error handling
- ✓ Docker containerization
- ✓ Deployment-ready configuration

---

## 🚀 Quick Start (5 minutes)

### 1. Install Dependencies

```bash
cd c:\Users\Admin\dev\RCMS\Rcms_Backend
npm install
```

### 2. Configure Environment

```bash
# Copy example to .env
copy .env.example .env

# Edit .env with your MySQL credentials
# You'll need to update:
# - DB_PASSWORD (your MySQL password)
# - JWT_SECRET (change to something secure)
```

### 3. Create MySQL Database

```bash
# Open MySQL command line
mysql -u root -p

# Create database
CREATE DATABASE rcms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 4. Run Migrations (Creates Tables)

```bash
npm run migrate
```

### 5. Seed Sample Data (Optional)

```bash
npm run seed
```

### 6. Start Server

```bash
# Development mode (auto-reload)
npm run dev

# OR Production mode
npm start
```

**Server runs on:** `http://localhost:5000`

---

## 📊 Database

**Tables created:**

- `users` — System users
- `serial_registry` — Camera devices
- `complaints` — Support tickets
- `manufacturer_updates` — Booking tracking
- `audit_logs` — Activity logging

**Sample data included:**

- 3 test users (Agent, Admin, Management)
- 8 camera serials
- 5 sample complaints

---

## 🔐 Authentication

### Login

```bash
POST http://localhost:5000/api/auth/login

Body:
{
  "email": "ahmed@isp.com",
  "password": "your_password"
}

Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": { "id": 1, "name": "Ahmed Khan", "role": "agent" }
  }
}
```

### Use Token in Requests

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## 📚 API Endpoints

### Authentication

```
POST   /api/auth/login              - Login
POST   /api/auth/register           - Register
GET    /api/auth/me                 - Get profile
POST   /api/auth/logout             - Logout
```

### Complaints (Main Feature)

```
GET    /api/complaints              - List complaints
POST   /api/complaints              - Create complaint (agents)
GET    /api/complaints/:id          - Get details
PATCH  /api/complaints/:id          - Update complaint
PATCH  /api/complaints/:id/status   - Change status
DELETE /api/complaints/:id          - Delete (admin)
```

### Manufacturer Bookings

```
GET    /api/bookings                - List bookings
POST   /api/bookings                - Create booking
GET    /api/bookings/:id            - Get details
PATCH  /api/bookings/:id            - Update status
DELETE /api/bookings/:id            - Delete booking
```

### Serial Validation

```
GET    /api/serials/validate/:serialNo  - Validate serial
GET    /api/serials                     - List all serials
POST   /api/serials                     - Add serial (admin)
GET    /api/serials/:serialNo           - Get details
```

### Analytics & Reports

```
GET    /api/analytics/dashboard     - Dashboard KPIs
GET    /api/reports/export          - CSV export
GET    /api/reports/by-date         - Filtered report
```

### User Management (Admin)

```
GET    /api/users                   - List users
POST   /api/users                   - Create user
GET    /api/users/:id               - Get user
PATCH  /api/users/:id               - Update user
DELETE /api/users/:id               - Delete user
```

---

## 🐳 Docker Deployment

### Option 1: Run with Docker Compose (Easiest)

```bash
# Start both MySQL and Backend
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop
docker-compose down
```

### Option 2: Deploy to Production

**Heroku:**

```bash
heroku create rcms-api
heroku addons:create cleardb:ignite
git push heroku main
```

**AWS:**

- Push Docker image to ECR
- Deploy to ECS with RDS MySQL

**DigitalOcean:**

- Deploy with App Platform
- Connect to Managed MySQL database

**Docker Hub:**

```bash
docker build -t yourusername/rcms-backend:1.0 .
docker push yourusername/rcms-backend:1.0
```

---

## ✅ Testing

### Test Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ahmed@isp.com",
    "password": "your_password"
  }'
```

### Test Protected Route

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Health Check

```bash
curl http://localhost:5000/health
```

---

## 🛠️ Project Structure

```
Rcms_Backend/
├── src/
│   ├── config/           # Database & config
│   ├── controllers/       # Business logic (6 files)
│   ├── middleware/        # Auth & error handling
│   ├── models/            # Database models (4 files)
│   ├── routes/            # API routes (6 files)
│   ├── utils/             # JWT, password, validators
│   ├── scripts/           # Migrate & seed
│   └── index.js           # Server entry point
├── sql/
│   ├── schema.sql         # Table definitions
│   └── seed.sql           # Sample data
├── Dockerfile             # Container config
├── docker-compose.yml     # MySQL + Backend
├── package.json           # Dependencies
├── .env.example           # Environment template
└── README.md              # This file
```

---

## 🚨 Troubleshooting

### "Database connection failed"

1. Check MySQL is running
2. Verify DB_HOST, DB_USER, DB_PASSWORD in `.env`
3. Make sure database `rcms_db` exists

### "Port 5000 already in use"

```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill it
taskkill /PID <PID> /F

# Or change PORT in .env
PORT=3001 npm run dev
```

### "Table already exists"

```bash
# Drop all tables and recreate
mysql -u root -p -e "DROP DATABASE rcms_db; CREATE DATABASE rcms_db CHARACTER SET utf8mb4;"
npm run migrate
```

---

## 📝 Environment Variables

Create `.env` file from `.env.example`:

```env
PORT=5000                           # Server port
NODE_ENV=production                 # development/production
DB_HOST=localhost                   # MySQL host
DB_PORT=3306                        # MySQL port
DB_USER=root                        # MySQL user
DB_PASSWORD=your_password           # MySQL password
DB_NAME=rcms_db                     # Database name
JWT_SECRET=your_super_secret_key    # JWT signing key
JWT_EXPIRE=7d                       # Token expiration
CORS_ORIGIN=http://localhost:5173   # Frontend URL
```

---

## 📦 Dependencies Installed

- **express** — Web framework
- **mysql2** — Database driver
- **jsonwebtoken** — JWT handling
- **bcryptjs** — Password hashing
- **joi** — Input validation
- **cors** — Cross-origin support
- **morgan** — HTTP logging
- **dotenv** — Environment variables

---

## 🔄 Development Workflow

### 1. During Development

```bash
npm run dev
# Server auto-restarts on file changes
```

### 2. Add Seed Data

```bash
npm run seed
```

### 3. Test API

Use Postman, Insomnia, or VS Code REST Client

### 4. Deploy

```bash
# Build Docker image
docker build -t rcms-backend:v1.0 .

# Push to registry
docker push your-registry/rcms-backend:v1.0

# Deploy on target server
docker pull your-registry/rcms-backend:v1.0
docker run -p 5000:5000 --env-file .env your-registry/rcms-backend:v1.0
```

---

## 🎁 What's Included

✅ **Complete API** — All 21+ endpoints working  
✅ **Authentication** — JWT with roles (agent/admin/management)  
✅ **Database** — MySQL with normalized schema  
✅ **Validation** — Request validation with Joi  
✅ **Error Handling** — Structured error responses  
✅ **Logging** — Morgan request logging  
✅ **Docker** — Containerized for easy deployment  
✅ **Migrations** — Auto-create schema on startup  
✅ **CORS** — Pre-configured for frontend  
✅ **Sample Data** — 3 users + 5 complaints for testing

---

## 🚀 Next Steps

1. ✅ **Start Server**: `npm run dev`
2. ✅ **Test Login**: POST `/api/auth/login`
3. ✅ **Connect Frontend**: Update API BASE_URL in frontend
4. ✅ **Deploy**: Use Docker or Heroku
5. ✅ **Monitor**: Check logs with PM2 or container logs

---

## 📞 Support

For issues:

1. Check `.env` file is configured
2. Verify MySQL is running
3. Check server logs: `npm run dev`
4. Try database migrations: `npm run migrate`

---

**Backend ready for production! 🎉**
