# 🚀 Quick Start Guide - Fire Alarm IoT System

Complete authentication system with React frontend and Flask backend.

## 📁 Project Structure

```
IOT/
├── ignisguardian/              # React Frontend (Vite + Tailwind)
│   ├── src/
│   │   ├── App.jsx            # Main app with routing
│   │   ├── pages/
│   │   │   ├── LoginPages.jsx     # Login page
│   │   │   ├── RegisterPages.jsx  # Register page
│   │   │   └── MainMenu.jsx       # Dashboard
│   │   └── services/
│   │       └── api.js         # API service (TO BE CREATED)
│   └── package.json
│
├── backend/                    # Flask Backend (NEW!)
│   ├── app.py                 # Main Flask app
│   ├── config.py              # Configuration
│   ├── models.py              # Database models
│   ├── routes/
│   │   └── auth.py           # Auth endpoints
│   ├── requirements.txt       # Python dependencies
│   ├── setup.py              # Setup script
│   ├── test_api.py           # API test script
│   └── .env                  # Environment variables (CREATE THIS)
│
├── INTEGRATION_GUIDE.md       # Detailed integration guide
└── QUICK_START.md            # This file
```

## ⚡ Quick Setup (5 Minutes)

### Step 1: Setup Backend

```bash
# Navigate to backend folder
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Run setup script (creates .env with random secret key)
python setup.py

# Edit .env file and add your PostgreSQL URL
# For testing, you can use a free cloud database from:
# - Supabase: https://supabase.com (500MB free)
# - ElephantSQL: https://elephantsql.com (20MB free)
```

**Edit `backend/.env`:**
```env
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET_KEY=your-secret-key-here
```

**Start backend:**
```bash
python app.py
```

✅ Backend running on `http://127.0.0.1:5000`

### Step 2: Setup Frontend

```bash
# Navigate to frontend folder
cd ignisguardian

# Install dependencies
npm install react-router-dom axios

# Start development server
npm run dev
```

✅ Frontend running on `http://localhost:5173`

### Step 3: Test the System

1. Open browser: `http://localhost:5173`
2. Click "Đăng ký ngay" to register
3. Fill in registration form
4. Login with your credentials
5. View the dashboard
6. Click "Đăng xuất" to logout

## 🎯 What's Working Now

### ✅ Backend Features:
- **User Registration** with email validation
- **User Login** with JWT tokens (24h access, 30d refresh)
- **Logout** with token revocation
- **Password Hashing** with bcrypt
- **Token Refresh** mechanism
- **Protected Routes** with JWT middleware
- **PostgreSQL** cloud database integration

### ✅ Frontend Features:
- **Login Page** with validation
- **Register Page** with password confirmation
- **Protected Dashboard** only accessible when logged in
- **Logout Button** in dashboard
- **Routing** between pages
- **Error Messages** in Vietnamese

### ⚠️ What Needs to be Done:

To connect frontend with backend, you need to:

1. **Create API Service** (`ignisguardian/src/services/api.js`)
2. **Update App.jsx** to use real API
3. **Update LoginPages.jsx** to call backend
4. **Update RegisterPages.jsx** to call backend

📖 **See `INTEGRATION_GUIDE.md` for detailed instructions**

## 🧪 Test Backend API

```bash
cd backend
python test_api.py
```

This will test all endpoints automatically.

## 📊 Backend API Endpoints

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/api/auth/register` | POST | Register new user | ❌ |
| `/api/auth/login` | POST | Login user | ❌ |
| `/api/auth/logout` | POST | Logout user | ✅ |
| `/api/auth/refresh` | POST | Refresh token | ✅ |
| `/api/auth/me` | GET | Get current user | ✅ |
| `/api/auth/validate` | GET | Validate token | ✅ |

## 🔐 Current Authentication Flow

### Without Backend Integration (Current):
```
Login → localStorage → Dashboard
```

### With Backend Integration (After following INTEGRATION_GUIDE.md):
```
Login → API Call → JWT Token → localStorage → Dashboard
         ↓
    PostgreSQL Database
```

## 🗄️ Database Schema

**Users Table:**
- id (Primary Key)
- full_name
- email (Unique)
- password_hash
- created_at
- updated_at
- is_active
- last_login

**Token Blocklist Table:**
- id (Primary Key)
- jti (Token ID)
- token_type
- user_id (Foreign Key)
- revoked_at
- expires_at

## 📝 Example API Calls

### Register:
```bash
curl -X POST http://127.0.0.1:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Nguyen Van A",
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Login:
```bash
curl -X POST http://127.0.0.1:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Get Current User:
```bash
curl -X GET http://127.0.0.1:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Logout:
```bash
curl -X POST http://127.0.0.1:5000/api/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🆓 Free Cloud Database Options

1. **Supabase** (Recommended)
   - 500MB free database
   - https://supabase.com
   - Easy setup, great UI

2. **ElephantSQL**
   - 20MB free
   - https://elephantsql.com
   - Simple and reliable

3. **Railway**
   - Free tier available
   - https://railway.app
   - Easy deployment

4. **Neon**
   - Free tier
   - https://neon.tech
   - Serverless Postgres

## 🐛 Troubleshooting

### Backend won't start:
```bash
# Check if dependencies are installed
pip install -r requirements.txt

# Verify .env file exists and has DATABASE_URL
cat .env

# Check if PostgreSQL is accessible
# Test connection string with psql or pgAdmin
```

### Frontend errors:
```bash
# Install missing dependencies
npm install react-router-dom axios

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS errors:
- Backend already has CORS enabled
- Make sure backend is running on port 5000
- Check API_BASE_URL in api.js matches backend

### Database connection failed:
- Verify DATABASE_URL format
- Check if database server is online
- Ensure firewall allows connections
- Test credentials manually

## 📚 Documentation

- **Backend API**: `backend/README.md`
- **Frontend Setup**: `ignisguardian/SETUP_INSTRUCTIONS.md`
- **Integration Guide**: `INTEGRATION_GUIDE.md`

## 🎯 Next Steps

1. ✅ Backend is ready - **DONE**
2. ✅ Frontend has routing - **DONE**
3. ⏳ Connect frontend to backend - **Follow INTEGRATION_GUIDE.md**
4. ⏳ Add device management endpoints
5. ⏳ Implement real-time sensor monitoring
6. ⏳ Add notification system

## 💡 Pro Tips

- Use Postman or Thunder Client to test API endpoints
- Check browser console for frontend errors
- Check backend terminal for API logs
- Use `test_api.py` to verify backend works
- Keep access tokens in localStorage, never expose them
- Use refresh tokens for long-lived sessions

## 🎉 You're All Set!

Your Flask backend with PostgreSQL authentication is ready!

**Current Status:**
- ✅ Backend API: Fully functional
- ✅ Frontend UI: Complete with routing
- ⏳ Integration: Ready to connect (see INTEGRATION_GUIDE.md)

**Run Backend:**
```bash
cd backend && python app.py
```

**Run Frontend:**
```bash
cd ignisguardian && npm run dev
```

Happy coding! 🔥

