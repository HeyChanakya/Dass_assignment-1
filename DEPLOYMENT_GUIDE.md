# Felicity Event Management System - Complete Deployment Guide

## 🚀 Quick Deployment URLs

### Frontend (Vercel)
- **URL**: `https://your-app-name.vercel.app` (Update after deployment)
- **Platform**: Vercel
- **Status**: Ready to Deploy

### Backend (Render)
- **URL**: `https://your-backend-name.onrender.com` (Update after deployment)
- **Platform**: Render
- **Status**: Ready to Deploy

### Database
- **Platform**: MongoDB Atlas
- **Type**: Cloud Database
- **Status**: Configured

---

## 📋 Prerequisites

1. GitHub account
2. Vercel account (free tier)
3. Render account (free tier)
4. MongoDB Atlas account (free tier)
5. Gmail account (for email notifications)

---

## 🗄️ Step 1: Database Setup (MongoDB Atlas)

### Create Cluster
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up/Login
3. Click "Build a Database"
4. Choose FREE tier (M0)
5. Select region (closest to your users)
6. Name cluster: `felicity-cluster`

### Configure Security
1. **Database Access**:
   - Go to "Database Access"
   - Add new database user
   - Username: `felicity-admin`
   - Password: Generate strong password
   - Built-in Role: `Atlas admin`
   - Save credentials

2. **Network Access**:
   - Go to "Network Access"
   - Add IP Address
   - Click "Allow Access from Anywhere"
   - IP: `0.0.0.0/0` (for deployment)
   - Save

### Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Driver: Node.js
4. Copy connection string
5. Replace `<password>` with your database user password
6. Example: `mongodb+srv://felicity-admin:YOUR_PASSWORD@felicity-cluster.xxxxx.mongodb.net/felicity?retryWrites=true&w=majority`

---

## 🔧 Step 2: Backend Deployment (Render)

### Prepare Repository
1. Ensure code is pushed to GitHub
2. Repository structure:
   ```
   DASS_ASS/
   ├── backend/
   │   ├── package.json
   │   ├── server.js
   │   └── ...
   └── frontend/
   ```

### Deploy on Render
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect GitHub repository: `DASS_ASS`
4. Configure:
   - **Name**: `felicity-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### Environment Variables
Add these in Render dashboard (Environment tab):

```bash
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://felicity-admin:YOUR_PASSWORD@felicity-cluster.xxxxx.mongodb.net/felicity?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=https://your-app-name.vercel.app
ADMIN_EMAIL=admin@felicity.com
ADMIN_PASSWORD=Admin@123
```

### Gmail App Password Setup
1. Go to Google Account Settings
2. Security → 2-Step Verification (enable if not enabled)
3. App Passwords → Select app: Mail, device: Other (Custom name)
4. Generate password
5. Copy 16-character password to `EMAIL_PASSWORD`

### Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Note your backend URL: `https://felicity-backend.onrender.com`

---

## 🎨 Step 3: Frontend Deployment (Vercel)

### Update Backend URL in Frontend
1. Open `/frontend/.env` file
2. Update:
   ```bash
   REACT_APP_API_URL=https://felicity-backend.onrender.com
   ```
3. Commit and push to GitHub

### Deploy on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import Git Repository: `DASS_ASS`
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### Environment Variables
Add in Vercel settings:

```bash
REACT_APP_API_URL=https://felicity-backend.onrender.com
CI=false
```

**Important**: `CI=false` prevents warnings from being treated as errors in production.

### Deploy
1. Click "Deploy"
2. Wait for deployment (2-3 minutes)
3. Note your frontend URL: `https://your-app-name.vercel.app`

### Update Backend CORS
1. Go back to Render dashboard
2. Add/Update environment variable:
   ```bash
   FRONTEND_URL=https://your-app-name.vercel.app
   ```
3. Save (backend will redeploy automatically)

---

## ✅ Step 4: Testing Deployment

### 1. Check Backend Health
```bash
curl https://felicity-backend.onrender.com/api/auth/login
# Should return error about missing credentials (means API is working)
```

### 2. Test Frontend
1. Visit `https://your-app-name.vercel.app`
2. Should see login page with purple gradient
3. Try registering a new account
4. Should redirect to dashboard after successful login

### 3. Test Full Flow
1. **Register as Participant**:
   - Email: `test@iiit.ac.in` (IIIT student)
   - Password: `Test@123`
   - Fill other details

2. **Login with Admin** (auto-seeded):
   - Email: `admin@felicity.com`
   - Password: `Admin@123`
   - Should see admin dashboard

3. **Create Organizer** (as admin):
   - Add new club/organizer
   - Note the generated credentials

4. **Create Event** (as organizer):
   - Login with organizer credentials
   - Create a new event
   - Publish it

5. **Register for Event** (as participant):
   - Login as participant
   - Browse events
   - Register for the event
   - Check email for QR ticket

---

## 🔐 Default Credentials

### Admin (Auto-seeded)
- **Email**: `admin@felicity.com`
- **Password**: `Admin@123`

### Test Participant
- Create your own during testing
- Use `@iiit.ac.in` email for IIIT students

### Test Organizer
- Created by admin
- Credentials displayed after creation (save them!)

---

## 🐛 Common Issues & Fixes

### Backend Issues

**Issue**: "Database connection failed"
- **Fix**: Check MongoDB connection string
- Verify password doesn't contain special characters that need encoding
- Ensure IP whitelist includes `0.0.0.0/0`

**Issue**: "Port already in use"
- **Fix**: Render uses `PORT` env variable automatically
- Ensure `server.js` uses: `process.env.PORT || 5000`

**Issue**: "Email not sending"
- **Fix**: Verify Gmail app password is correct
- Check 2-Step Verification is enabled
- Try regenerating app password

### Frontend Issues

**Issue**: "Failed to fetch"
- **Fix**: Check `REACT_APP_API_URL` is correct
- Verify backend CORS allows frontend URL
- Check browser console for CORS errors

**Issue**: "Build failed: Treating warnings as errors"
- **Fix**: Add `CI=false` to Vercel environment variables
- Redeploy

**Issue**: "Cannot read property of undefined"
- **Fix**: Check API responses are being handled
- Verify backend is running
- Check network tab in browser DevTools

### Database Issues

**Issue**: "Authentication failed"
- **Fix**: Check database username/password
- Ensure password in connection string is URL-encoded
- Special characters: `@` → `%40`, `#` → `%23`, etc.

**Issue**: "Connection timeout"
- **Fix**: Verify network access whitelist
- Check cluster is running (not paused)

---

## 📊 Monitoring & Logs

### Backend Logs (Render)
1. Go to Render dashboard
2. Click on your service
3. "Logs" tab shows real-time logs
4. Look for:
   - `Connected to MongoDB` → Database OK
   - `Server running on port 5000` → Server OK
   - `Admin user seeded` → Admin created

### Frontend Logs (Vercel)
1. Go to Vercel dashboard
2. Click on your project
3. "Functions" tab for serverless logs
4. Browser DevTools → Console for client-side logs

### Database Monitoring (MongoDB Atlas)
1. Go to cluster
2. "Metrics" tab
3. Monitor:
   - Connections
   - Operations
   - Storage

---

## 🔄 Redeployment

### Backend
- **Auto**: Push to GitHub (if continuous deployment enabled)
- **Manual**: Render dashboard → Manual Deploy

### Frontend
- **Auto**: Push to GitHub (default)
- **Manual**: Vercel dashboard → Redeploy

### Database
- No redeployment needed
- Data persists across backend deployments

---

## 📝 Post-Deployment Checklist

- [ ] Backend URL is accessible
- [ ] Frontend URL is accessible
- [ ] Can register new participant
- [ ] Can login as admin
- [ ] Can create organizer
- [ ] Can create event
- [ ] Can register for event
- [ ] Email with QR code received
- [ ] All pages load without errors
- [ ] API calls work correctly
- [ ] CORS is properly configured
- [ ] Environment variables are set

---

## 🆘 Support

If you encounter issues:

1. **Check Logs**:
   - Render: Dashboard → Service → Logs
   - Vercel: Dashboard → Project → Functions/Deployments
   - Browser: DevTools → Console/Network

2. **Verify Environment**:
   - All environment variables set correctly
   - URLs match between frontend/backend
   - Database connection string is correct

3. **Test Locally First**:
   ```bash
   # Backend
   cd backend
   npm install
   npm start

   # Frontend
   cd frontend
   npm install
   npm start
   ```

4. **Common Commands**:
   ```bash
   # View logs
   npm start  # See console output

   # Test API
   curl -X POST https://your-backend.onrender.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@felicity.com","password":"Admin@123"}'
   ```

---

## 🎉 Success!

If all tests pass, your Felicity Event Management System is successfully deployed and ready to use!

**Update deployment.txt with your actual URLs and share with your team.**
