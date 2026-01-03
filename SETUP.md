# PlayMatch App - Complete Setup Guide

This guide will get your PlayMatch app running from scratch in **under 10 minutes**.

---

## 🚀 Quick Start (TL;DR)

```bash
# 1. Get a free PostgreSQL database from Neon
https://neon.tech (copy the connection string)

# 2. Set up the database
cd apps/web
export DATABASE_URL='postgresql://...'  # paste your Neon URL
./setup-database.sh

# 3. Configure environment
cp .env.example .env
# Edit .env and add your DATABASE_URL

# 4. Start dev servers
cd apps/web && npm run dev        # Terminal 1 - Backend
cd apps/mobile && npx expo start  # Terminal 2 - Mobile app

# 5. Deploy to Vercel
vercel env add DATABASE_URL production  # paste your Neon URL
vercel --prod
```

Done! 🎉

---

## 📋 Detailed Setup Instructions

### Step 1: Create a PostgreSQL Database

**Option A: Neon (Recommended - Free)**

1. Go to https://neon.tech
2. Sign up for free account
3. Create a new project called "PlayMatch"
4. Copy the connection string (looks like `postgresql://user:pass@ep-xxx.neon.tech/...`)

**Option B: Other providers**
- [Supabase](https://supabase.com) - Free tier
- [Railway](https://railway.app) - Free tier
- [ElephantSQL](https://www.elephantsql.com) - Free tier

### Step 2: Set Up Database Schema

```bash
cd apps/web

# Set your database URL
export DATABASE_URL='postgresql://YOUR_CONNECTION_STRING'

# Run the setup script
./setup-database.sh
```

The script will:
- ✅ Create 4 tables (users, venues, games, game_participants)
- ✅ Add indexes for performance
- ✅ Set up automatic timestamps
- ✅ Optionally add sample data for testing

### Step 3: Configure Environment Variables

**For Web Backend:**

```bash
cd apps/web
cp .env.example .env
```

Edit `apps/web/.env`:
```bash
DATABASE_URL=postgresql://YOUR_CONNECTION_STRING
CORS_ORIGINS=*  # Allow all origins for development
AUTH_SECRET=your-super-secret-key-min-32-characters
```

**For Mobile App:**

```bash
cd apps/mobile
cp .env.example .env
```

Edit `apps/mobile/.env`:
```bash
# For local development
EXPO_PUBLIC_API_BASE_URL=http://localhost:4000

# Or point to production
EXPO_PUBLIC_API_BASE_URL=https://your-app.vercel.app
```

### Step 4: Install Dependencies

```bash
# Web backend
cd apps/web
bun install  # or npm install

# Mobile app
cd apps/mobile
npm install
```

### Step 5: Start Development Servers

**Terminal 1 - Backend API:**
```bash
cd apps/web
npm run dev  # Runs on port 4000
```

**Terminal 2 - Mobile App:**
```bash
cd apps/mobile
npx expo start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

### Step 6: Test the API

```bash
# Test games endpoint
curl http://localhost:4000/api/games

# Should return JSON with games data
```

---

## 🚀 Deploy to Production (Vercel)

### 1. Install Vercel CLI

```bash
npm i -g vercel
vercel login
```

### 2. Configure Environment Variables

```bash
# From project root
vercel env add DATABASE_URL production
# Paste your Neon connection string

vercel env add CORS_ORIGINS production
# Enter: *

vercel env add AUTH_SECRET production
# Enter a secure random string (32+ chars)
```

### 3. Deploy

```bash
vercel --prod
```

Your API will be live at `https://your-app.vercel.app`!

### 4. Update Mobile App to Use Production API

Edit `apps/mobile/.env`:
```bash
EXPO_PUBLIC_API_BASE_URL=https://your-app.vercel.app
```

Restart Expo:
```bash
cd apps/mobile
npx expo start -c  # -c clears cache
```

---

## 🧪 Test Everything Works

### Test Backend API:

```bash
# List games
curl https://your-app.vercel.app/api/games

# Get specific game
curl https://your-app.vercel.app/api/games/1
```

### Test Mobile App:

1. Open the app in Expo
2. You should see games on the home screen
3. Tap a game to view details
4. Try joining a game

---

## 🐛 Troubleshooting

### "403 Forbidden" Error

**Cause:** DATABASE_URL not set on Vercel

**Fix:**
```bash
vercel env add DATABASE_URL production
vercel --prod  # Redeploy
```

### "TLS Error" on Mobile

**Cause:** Mobile app can't reach API

**Fix:**
1. Check `EXPO_PUBLIC_API_BASE_URL` in `apps/mobile/.env`
2. Restart Expo: `npx expo start -c`
3. Make sure URL is https:// not http://

### "Connection Refused" localhost

**Cause:** Using localhost on real device

**Fix:** Use your computer's IP address instead:
```bash
# In apps/mobile/.env
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.X:4000
```

Find your IP:
- Mac: `ifconfig | grep inet`
- Windows: `ipconfig`
- Linux: `ip addr`

### Database Connection Error

**Check your connection string:**
```bash
# Test connection
psql "$DATABASE_URL" -c "SELECT 1;"
```

If it fails, your DATABASE_URL might be wrong.

---

## 📂 Project Structure

```
PlayMatch-App/
├── apps/
│   ├── web/              # Backend API (React Router + Hono)
│   │   ├── db/
│   │   │   ├── schema.sql       # Database schema
│   │   │   └── seed.sql         # Sample data
│   │   ├── src/app/api/         # API routes
│   │   ├── .env                 # Environment vars
│   │   └── setup-database.sh    # Setup script
│   │
│   └── mobile/           # Mobile app (React Native + Expo)
│       ├── src/
│       │   ├── app/             # Screens
│       │   ├── components/      # UI components
│       │   └── utils/           # Utilities
│       └── .env                 # Environment vars
│
└── SETUP.md              # This file
```

---

## 🎨 What's Included

### Backend Features:
- ✅ PostgreSQL database with full schema
- ✅ RESTful API for games, users, venues
- ✅ Join/leave games
- ✅ Team management
- ✅ Payment status tracking
- ✅ Search and filters

### Mobile App Features:
- ✅ "Street Court Voltage" design (electric volt green + neon!)
- ✅ Browse nearby games
- ✅ View game details with team rosters
- ✅ Join games and select teams
- ✅ Animated UI with glowing effects
- ✅ Pull-to-refresh

### Sample Data (if seeded):
- 5 sample users
- 5 venues in Metro Manila
- 7 active games
- 11 game participants

---

## 🔐 Security Notes

**Before Production:**

1. **Change AUTH_SECRET** to a secure random string
2. **Set CORS_ORIGINS** to your actual domains (not *)
3. **Add authentication** to API routes (currently open)
4. **Add input validation** (Yup schemas)
5. **Enable CSRF protection** (disabled in __create/index.ts)
6. **Add rate limiting**

See the production readiness assessment for full security checklist.

---

## 📚 Additional Resources

- [React Router v7 Docs](https://reactrouter.com)
- [Expo Docs](https://docs.expo.dev)
- [Neon Docs](https://neon.tech/docs)
- [Vercel Docs](https://vercel.com/docs)

---

## 🆘 Need Help?

If you're still stuck:
1. Check the error message carefully
2. Verify all environment variables are set
3. Make sure database schema is created
4. Test API endpoints with curl
5. Check Vercel deployment logs

**Common Issues:** See Troubleshooting section above

---

## ✅ Success Checklist

- [ ] Database created and schema loaded
- [ ] Environment variables configured
- [ ] Web backend running locally
- [ ] Mobile app running in Expo
- [ ] Games showing on home screen
- [ ] Can view game details
- [ ] Deployed to Vercel
- [ ] Production API working
- [ ] Mobile app connected to production

If all checked, you're ready to go! 🎉🏀
