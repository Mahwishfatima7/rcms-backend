# RCMS Backend API Server

**Replacement Case Management System** - Production-ready Express.js backend API for managing camera replacement complaints and warranty claims.

## Features

✅ Complete REST API with 21+ endpoints  
✅ JWT Authentication & Authorization  
✅ Role-based Access Control (Agent, Admin, Management)  
✅ MySQL Database with automatic migrations  
✅ Input validation & error handling  
✅ CORS support  
✅ Comprehensive logging  
✅ Deployment-ready (Docker, PM2, Cloud)

---

## Prerequisites

- **Node.js** v16+ ([Download](https://nodejs.org/))
- **MySQL** 8.0+ ([Download](https://dev.mysql.com/downloads/mysql/))
- **npm** v8+ (comes with Node.js)

Verify installation:

```bash
node --version    # Should be v16+
npm --version     # Should be v8+
mysql --version   # Should be 8.0+
```

---

## Installation & Setup

### 1. Clone/Setup Project

```bash
cd c:\Users\Admin\dev\RCMS\Rcms_Backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
# Copy example to .env
cp .env.example .env

# Edit .env with your database credentials
# For Windows: copy .env.example .env
```

Edit `.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=rcms_db
JWT_SECRET=your_secret_key_here
```

### 4. Create Database

```bash
# Open MySQL command line
mysql -u root -p

# Create database
CREATE DATABASE rcms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 5. Run Migrations

```bash
npm run migrate
```

### 6. Seed Initial Data (Optional)

```bash
npm run seed
```

### 7. Start Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5000`

---

## API Endpoints

### Authentication

```
POST   /api/auth/login          - Login user
POST   /api/auth/logout         - Logout user
GET    /api/auth/me             - Get current user
POST   /api/auth/register       - Register new user (admin only)
```

### Complaints

```
GET    /api/complaints          - List all complaints (admin/management)
POST   /api/complaints          - Create new complaint (agent)
GET    /api/complaints/:id      - Get complaint details
PATCH  /api/complaints/:id      - Update complaint
PATCH  /api/complaints/:id/status - Update complaint status
GET    /api/complaints/agent/:agentId - Agent's complaints
DELETE /api/complaints/:id      - Delete complaint (admin)
```

### Manufacturer Bookings

```
GET    /api/bookings            - List all bookings
POST   /api/bookings            - Create booking
GET    /api/bookings/:id        - Get booking details
PATCH  /api/bookings/:id        - Update booking status
GET    /api/bookings/complaint/:complaintId - Booking for complaint
```

### Serial Validation

```
GET    /api/serials/validate/:serialNo - Validate serial number
GET    /api/serials             - List all serials
POST   /api/serials             - Add serial (admin)
GET    /api/serials/:serialNo   - Get serial details
```

### Analytics & Reports

```
GET    /api/analytics/dashboard - Dashboard KPIs
GET    /api/reports/export      - Export as CSV
GET    /api/reports/by-date     - Filtered report
```

### User Management

```
GET    /api/users               - List all users (admin)
POST   /api/users               - Create user (admin)
GET    /api/users/:id           - Get user
PATCH  /api/users/:id           - Update user
DELETE /api/users/:id           - Delete user (admin)
```

---

## Deployment

### Docker Deployment

```bash
docker build -t rcms-backend .
docker run -p 5000:5000 --env-file .env rcms-backend
```

### PM2 Deployment (Production)

```bash
npm install -g pm2
pm2 start src/index.js --name rcms-api
pm2 startup
pm2 save
pm2 logs rcms-api
```

### Cloud Deployment

- **Heroku**: Push to Heroku with Procfile
- **AWS**: ECR + ECS + RDS MySQL
- **DigitalOcean**: Deploy with App Platform
- **Azure**: App Service + Azure Database

---

## Project Structure

```
Rcms_Backend/
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/       # Business logic
│   ├── middleware/        # Express middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── utils/             # Utilities & validators
│   ├── scripts/           # Database scripts
│   └── index.js           # Server entry point
├── sql/
│   ├── schema.sql         # Database schema
│   └── seed.sql           # Sample data
├── tests/                 # Test files
├── package.json
├── .env.example
└── README.md
```

---

## Development

### Start Development Server

```bash
npm run dev
```

Watches for file changes and auto-restarts.

### Run Tests

```bash
npm test
```

### Lint Code

```bash
npm run lint
```

---

## Database Schema

**Tables:**

- `users` - System users
- `serial_registry` - Device registry
- `complaints` - Complaint tickets
- `manufacturer_updates` - Booking tracking
- `audit_logs` - Change history

See `sql/schema.sql` for complete DDL.

---

## Error Handling

All API errors return standard format:

```json
{
  "success": false,
  "error": "Error message here",
  "statusCode": 400
}
```

Success responses:

```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}
```

---

## Authentication

Uses JWT tokens. Include in requests:

```
Authorization: Bearer <your_jwt_token>
```

Token expires after 7 days (configurable in .env).

---

## Support & Issues

For issues, check:

1. .env file is configured correctly
2. MySQL is running
3. Database is created
4. Dependencies installed (`npm install`)
5. Port 5000 is not in use

---

## License

ISC © DXB Technologies 2026
