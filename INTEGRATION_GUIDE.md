# Frontend-Backend Integration Guide

Complete guide to connect your React frontend with the Flask backend.

## Project Structure

```
IOT/
├── ignisguardian/          # React Frontend
│   ├── src/
│   │   ├── App.jsx
│   │   └── pages/
│   └── ...
└── backend/                # Flask Backend
    ├── app.py
    ├── models.py
    └── ...
```

## Step 1: Setup Backend

### 1.1 Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 1.2 Run Setup Script

```bash
python setup.py
```

### 1.3 Configure Database

Edit `backend/.env` and add your PostgreSQL connection:

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

**Quick Start with Supabase (Recommended):**
1. Go to https://supabase.com and sign up
2. Create a new project
3. Go to Settings → Database
4. Copy the "Connection string" (URI format)
5. Paste it in your `.env` file

### 1.4 Start Backend Server

```bash
cd backend
python app.py
```

Backend will run on: `http://127.0.0.1:5000`

## Step 2: Install Frontend Dependencies

```bash
cd ignisguardian
npm install react-router-dom axios
```

## Step 3: Update Frontend to Use Backend API

### 3.1 Create API Service File

Create `ignisguardian/src/services/api.js`:

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired, try to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            {},
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          );

          const { access_token } = response.data;
          localStorage.setItem('access_token', access_token);

          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout user
          localStorage.clear();
          window.location.href = '/';
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  validateToken: () => api.get('/auth/validate'),
};

export default api;
```

### 3.2 Update App.jsx

Replace the content of `ignisguardian/src/App.jsx`:

```javascript
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import FireAlarmLogin from './pages/LoginPages'
import FireAlarmRegister from './pages/RegisterPages'
import FireAlarmDashboard from './pages/MainMenu'
import { authAPI } from './services/api'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)

  // Check authentication on mount
  useEffect(() => {
    const validateAuth = async () => {
      const token = localStorage.getItem('access_token')
      
      if (token) {
        try {
          const response = await authAPI.validateToken()
          if (response.data.valid) {
            setIsAuthenticated(true)
            setUser(response.data.user)
          } else {
            localStorage.clear()
          }
        } catch (error) {
          console.error('Token validation failed:', error)
          localStorage.clear()
        }
      }
      
      setIsLoading(false)
    }

    validateAuth()
  }, [])

  const handleLogin = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password })
      
      const { access_token, refresh_token, user } = response.data
      
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)
      localStorage.setItem('user', JSON.stringify(user))
      
      setIsAuthenticated(true)
      setUser(user)
      
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Đăng nhập thất bại'
      return { success: false, error: errorMessage }
    }
  }

  const handleLogout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.clear()
      setIsAuthenticated(false)
      setUser(null)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white text-2xl">Đang tải...</div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <FireAlarmLogin onLogin={handleLogin} />
            )
          } 
        />
        
        <Route 
          path="/register" 
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <FireAlarmRegister />
            )
          } 
        />
        
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? (
              <FireAlarmDashboard onLogout={handleLogout} user={user} />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
```

### 3.3 Update LoginPages.jsx

Update the `handleSubmit` function in `ignisguardian/src/pages/LoginPages.jsx`:

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  if (!email || !password) {
    setError('Vui lòng nhập đầy đủ thông tin');
    return;
  }

  const result = await onLogin(email, password);
  
  if (!result.success) {
    setError(result.error);
  }
  // Navigation handled by App.jsx
};
```

### 3.4 Update RegisterPages.jsx

Update the `handleSubmit` function in `ignisguardian/src/pages/RegisterPages.jsx`:

```javascript
import { authAPI } from '../services/api';

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');

  // Validate inputs
  if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
    setError('Vui lòng điền đầy đủ thông tin');
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    setError('Mật khẩu xác nhận không khớp');
    return;
  }

  if (formData.password.length < 6) {
    setError('Mật khẩu phải có ít nhất 6 ký tự');
    return;
  }

  try {
    await authAPI.register({
      full_name: formData.fullName,
      email: formData.email,
      password: formData.password
    });

    setSuccess('Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...');
    
    setTimeout(() => {
      navigate('/');
    }, 2000);
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Đăng ký thất bại';
    setError(errorMessage);
  }
};
```

## Step 4: Test the Integration

### 4.1 Start Backend
```bash
cd backend
python app.py
```

### 4.2 Start Frontend
```bash
cd ignisguardian
npm run dev
```

### 4.3 Test Flow

1. **Register**: Create a new account at `/register`
2. **Login**: Login with your credentials
3. **Dashboard**: View the dashboard
4. **Logout**: Click logout button
5. **Try accessing dashboard**: Should redirect to login

## Step 5: Test Backend API (Optional)

```bash
cd backend
python test_api.py
```

This will test all endpoints automatically.

## Common Issues & Solutions

### Issue 1: CORS Error
**Error:** "Access to XMLHttpRequest has been blocked by CORS policy"

**Solution:** Backend already has CORS enabled. If still seeing errors:
- Check backend is running on port 5000
- Verify API_BASE_URL in api.js matches backend URL

### Issue 2: Database Connection Error
**Error:** "could not connect to server"

**Solution:**
- Verify DATABASE_URL in `.env` is correct
- Ensure PostgreSQL database is accessible
- Check firewall/network settings for cloud databases

### Issue 3: "react-router-dom not found"
**Error:** "Cannot find module 'react-router-dom'"

**Solution:**
```bash
cd ignisguardian
npm install react-router-dom
```

### Issue 4: Token Expired
**Solution:** The API service automatically refreshes tokens. If refresh fails, user is logged out.

## Production Deployment

### Backend (Example: Railway)
1. Push code to GitHub
2. Connect Railway to your repo
3. Add PostgreSQL service
4. Set environment variables
5. Deploy

### Frontend (Example: Vercel)
1. Update `API_BASE_URL` to your production backend URL
2. Push to GitHub
3. Connect Vercel to your repo
4. Deploy

## Security Checklist

- [ ] Change JWT_SECRET_KEY in production
- [ ] Use HTTPS for production
- [ ] Enable rate limiting
- [ ] Add input sanitization
- [ ] Set up proper CORS origins
- [ ] Use secure cookies for tokens (optional)
- [ ] Add logging and monitoring

## API Endpoints Reference

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | Login user | No |
| POST | /api/auth/logout | Logout user | Yes |
| POST | /api/auth/refresh | Refresh access token | Yes (refresh token) |
| GET | /api/auth/me | Get current user | Yes |
| GET | /api/auth/validate | Validate token | Yes |

## Next Steps

Now that authentication is working, you can:

1. **Add Device Management**: Create endpoints for managing fire alarm devices
2. **Real-time Monitoring**: Implement WebSocket for live sensor data
3. **Alerts System**: Create notification endpoints
4. **Historical Data**: Store and query sensor readings
5. **User Preferences**: Add user settings and preferences

## Support

Check the full documentation:
- Backend: `backend/README.md`
- Frontend: `ignisguardian/SETUP_INSTRUCTIONS.md`

Happy coding! 🔥

