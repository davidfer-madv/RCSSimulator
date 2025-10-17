# 🚀 Complete Deployment Guide - Local & Production

## Overview

This guide covers running the RCS Simulator:
1. **Locally** on your Mac for development and testing
2. **Production** deployment for real-world use

---

## 🏠 LOCAL DEVELOPMENT SETUP

### **Option A: Quick Setup with Neon (Recommended - 5 Minutes)**

Perfect for development and testing without installing PostgreSQL locally.

#### Steps:

1. **Create Neon Account (Free):**
   ```
   Visit: https://neon.tech
   Sign up with GitHub or email
   No credit card required
   ```

2. **Create Database Project:**
   - Click "New Project"
   - Name: `rcs-simulator-dev`
   - Region: Choose closest (e.g., US East for North America)
   - PostgreSQL version: 16
   - Click "Create Project"

3. **Copy Connection String:**
   - You'll see a connection string like:
     ```
     postgresql://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
     ```
   - Copy this entire string

4. **Create .env File:**
   ```bash
   cd "/Users/david/Library/CloudStorage/GoogleDrive-david@messagingadvisory.com/My Drive/GitHub/RCSSimulator"
   
   # Create .env file
   cat > .env << 'EOF'
   DATABASE_URL=your-connection-string-here
   SESSION_SECRET=replace-with-generated-secret
   NODE_ENV=development
   EOF
   ```

5. **Generate Secure Session Secret:**
   ```bash
   # Generate random secret
   openssl rand -base64 32
   
   # Copy the output and replace SESSION_SECRET in .env
   ```

6. **Edit .env File:**
   ```bash
   # Open in your editor
   nano .env
   # or
   open -e .env
   
   # Replace:
   # - DATABASE_URL with your Neon connection string
   # - SESSION_SECRET with your generated secret
   # Save and close
   ```

7. **Initialize Database Schema:**
   ```bash
   export PATH="/opt/homebrew/bin:$PATH"
   npm run db:push
   ```
   
   You should see:
   ```
   ✓ Created tables: users, customers, campaigns, rcs_formats, etc.
   ```

8. **Start Development Server:**
   ```bash
   npm run dev
   ```
   
   Server starts at: **http://localhost:5000**

9. **Test It:**
   - Open: http://localhost:5000
   - Register a new account
   - Create your first RCS format!

---

### **Option B: Local PostgreSQL Installation**

For complete offline development capability.

#### Steps:

1. **Install PostgreSQL:**
   ```bash
   # Using Homebrew
   brew install postgresql@16
   
   # Start PostgreSQL service
   brew services start postgresql@16
   
   # Verify installation
   psql --version
   ```

2. **Create Database:**
   ```bash
   # Create database
   createdb rcs_simulator
   
   # Verify
   psql -l | grep rcs_simulator
   ```

3. **Create .env File:**
   ```bash
   cat > .env << 'EOF'
   DATABASE_URL=postgresql://localhost:5432/rcs_simulator
   SESSION_SECRET=your-generated-secret-here
   NODE_ENV=development
   EOF
   ```

4. **Generate Session Secret:**
   ```bash
   openssl rand -base64 32
   # Copy output and update SESSION_SECRET in .env
   ```

5. **Initialize Database:**
   ```bash
   npm run db:push
   ```

6. **Start Server:**
   ```bash
   npm run dev
   ```

7. **Manage PostgreSQL:**
   ```bash
   # Stop PostgreSQL
   brew services stop postgresql@16
   
   # Start PostgreSQL
   brew services start postgresql@16
   
   # Restart PostgreSQL
   brew services restart postgresql@16
   
   # Check status
   brew services list | grep postgresql
   ```

---

## 🌐 PRODUCTION DEPLOYMENT

### **Option A: Deploy to Replit (Original Platform)**

Your project is already configured for Replit.

#### Steps:

1. **Create Replit Account:**
   - Visit: https://replit.com
   - Sign in with GitHub

2. **Import Repository:**
   - Click "Create Repl"
   - Choose "Import from GitHub"
   - Select your repository: `davidfer-madv/RCSSimulator`
   - Replit will auto-detect the configuration

3. **Database Auto-Provisioned:**
   - Replit automatically provides PostgreSQL
   - DATABASE_URL is automatically set
   - No manual configuration needed!

4. **Configure Secrets:**
   - In Replit, go to "Secrets" tab (lock icon)
   - Add: `SESSION_SECRET` = `<your-random-secret>`

5. **Run:**
   - Click "Run" button
   - Replit handles everything automatically
   - Your app will be live at: `https://your-repl-name.username.repl.co`

6. **Deploy:**
   - Replit provides auto-deployment
   - Changes pushed to GitHub auto-deploy
   - Production-ready with zero configuration

---

### **Option B: Deploy to Vercel + Neon**

Great for modern serverless deployment.

#### Steps:

1. **Setup Neon Production Database:**
   - Go to: https://neon.tech
   - Create new project: `rcs-simulator-prod`
   - Choose production-grade region
   - Copy connection string (this is your production DATABASE_URL)

2. **Deploy to Vercel:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login
   vercel login
   
   # Deploy
   cd "/Users/david/Library/CloudStorage/GoogleDrive-david@messagingadvisory.com/My Drive/GitHub/RCSSimulator"
   vercel
   ```

3. **Set Environment Variables in Vercel:**
   - During deployment, Vercel will ask for env vars
   - Or set in Vercel dashboard: Project Settings → Environment Variables
   
   Add:
   ```
   DATABASE_URL = <your-neon-production-url>
   SESSION_SECRET = <new-random-secret-for-production>
   NODE_ENV = production
   ```

4. **Initialize Production Database:**
   ```bash
   # Temporarily set production DATABASE_URL locally
   export DATABASE_URL="your-production-neon-url"
   npm run db:push
   ```

5. **Redeploy:**
   ```bash
   vercel --prod
   ```

Your app is now live at: `https://your-project.vercel.app`

---

### **Option C: Deploy to Railway**

Another excellent platform with built-in PostgreSQL.

#### Steps:

1. **Create Railway Account:**
   - Visit: https://railway.app
   - Sign up with GitHub

2. **New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose: `davidfer-madv/RCSSimulator`

3. **Add PostgreSQL:**
   - Click "+ New"
   - Select "Database" → "PostgreSQL"
   - Railway auto-provisions database
   - DATABASE_URL automatically set

4. **Add Environment Variables:**
   - Go to your service → Variables tab
   - Add:
     ```
     SESSION_SECRET = <random-secret>
     NODE_ENV = production
     ```
   - DATABASE_URL is already set automatically

5. **Deploy:**
   - Railway auto-deploys on git push
   - Get your URL from deployment logs

---

## 🔄 BEST PRACTICE: Separate Dev & Production Databases

### Recommended Setup:

```
Development (Local):
├── Database: Neon "rcs-simulator-dev" OR Local PostgreSQL
├── .env file with dev DATABASE_URL
└── Test data, experiments safe

Production (Deployed):
├── Database: Neon "rcs-simulator-prod" OR Railway/Supabase
├── Environment variables in deployment platform
└── Real user data, stable
```

### Why Separate?

- ✅ Test new features without affecting production
- ✅ Experiment with schema changes safely
- ✅ Can reset dev database anytime
- ✅ Production data remains safe
- ✅ Different SESSION_SECRET for security

---

## 🛠️ MANAGING YOUR DATABASE

### View Database Contents:

**Using Neon Dashboard:**
```
1. Go to console.neon.tech
2. Select your project
3. Click "SQL Editor"
4. Run queries to view data
```

**Using Local PostgreSQL:**
```bash
# Connect to database
psql rcs_simulator

# View tables
\dt

# View users
SELECT * FROM users;

# View formats
SELECT * FROM rcs_formats;

# Exit
\q
```

### Reset Database (Development Only!):

**Neon:**
```
1. Neon Dashboard → Database → SQL Editor
2. Run: DROP SCHEMA public CASCADE; CREATE SCHEMA public;
3. Locally run: npm run db:push
```

**Local PostgreSQL:**
```bash
# Drop and recreate
dropdb rcs_simulator
createdb rcs_simulator

# Reinitialize schema
npm run db:push
```

### Backup Database:

**Neon:**
```
Dashboard → Backups → Create Backup
(Automatic backups on paid plans)
```

**Local PostgreSQL:**
```bash
# Backup
pg_dump rcs_simulator > backup_$(date +%Y%m%d).sql

# Restore
psql rcs_simulator < backup_20251017.sql
```

---

## 🔐 SECURITY BEST PRACTICES

### Environment Variables:

1. **Never commit .env file** (already in .gitignore ✓)

2. **Use different secrets for dev/prod:**
   ```bash
   # Development
   SESSION_SECRET=dev-secret-abc123
   
   # Production  
   SESSION_SECRET=prod-secure-xyz789-completely-different
   ```

3. **Rotate secrets periodically:**
   - Generate new SESSION_SECRET every 90 days
   - Update in .env or deployment platform
   - Restart server

### Database Security:

1. **Use SSL in production:**
   - Neon: `?sslmode=require` (already included)
   - Local: Not needed
   - Production: Always use SSL

2. **Restrict database access:**
   - Neon: IP allowlist in dashboard
   - Local: Firewall rules
   - Production: VPC or private networking

3. **Strong passwords:**
   - Use generated passwords (not "password123")
   - Minimum 16 characters
   - Store in password manager

---

## 📊 MONITORING & LOGS

### Local Development:

**View Server Logs:**
```bash
# Terminal shows real-time logs when running:
npm run dev

# Common logs:
# - SQL queries (in development mode)
# - API requests
# - Auth events
# - Errors and warnings
```

### Production Monitoring:

**Neon:**
- Dashboard → Metrics
- Shows: Connections, queries, data usage

**Vercel:**
- Dashboard → Project → Functions → Logs
- Real-time function logs

**Railway:**
- Service → Deployments → Logs
- Real-time deployment logs

---

## 🚀 RECOMMENDED SETUP FOR YOU

Based on your project, here's the **fastest path to get running**:

### **For Testing Your New Features (NOW):**

```bash
# 1. Quick setup with Neon (5 minutes)
# Go to https://neon.tech → Create free account
# Create project "rcs-simulator-dev"
# Copy connection string

# 2. Create .env file
cd "/Users/david/Library/CloudStorage/GoogleDrive-david@messagingadvisory.com/My Drive/GitHub/RCSSimulator"

cat > .env << 'EOF'
DATABASE_URL=paste-your-neon-url-here
SESSION_SECRET=$(openssl rand -base64 32)
NODE_ENV=development
EOF

# 3. Edit .env and paste your actual DATABASE_URL
open -e .env

# 4. Initialize database
export PATH="/opt/homebrew/bin:$PATH"
npm run db:push

# 5. Run server
npm run dev

# 6. Open browser
open http://localhost:5000
```

### **For Production Deployment:**

**Option 1: Replit (Easiest - Zero Config)**
1. Import your GitHub repo to Replit
2. Click "Run"
3. Database auto-provisioned
4. Live in 2 minutes

**Option 2: Vercel + Neon (Most Scalable)**
1. Separate Neon database for production
2. Deploy to Vercel
3. Set environment variables in Vercel dashboard
4. Auto-deploy on git push

---

## 📋 QUICK REFERENCE

### Local Development Commands:

```bash
# Start development server
npm run dev

# Initialize/update database schema
npm run db:push

# Build for production
npm run build

# Run production build locally
npm run start

# Type check
npm run check
```

### Database Connection Strings:

```bash
# Local PostgreSQL
DATABASE_URL=postgresql://localhost:5432/rcs_simulator

# Neon (serverless)
DATABASE_URL=postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require

# Supabase
DATABASE_URL=postgresql://postgres:pass@db.xxx.supabase.co:5432/postgres

# Railway (auto-provided)
DATABASE_URL=${{RAILWAY_POSTGRESQL_URL}}
```

### Environment Variable Files:

```bash
# Local development
.env                    # Not committed (in .gitignore)

# Production
Replit: Secrets tab     # Built-in secrets manager
Vercel: Dashboard       # Environment variables UI
Railway: Variables tab  # Built-in variables
```

---

## 🎯 IMMEDIATE NEXT STEP

To test all your new features **right now**, do this:

### **5-Minute Neon Setup:**

1. Open browser: https://console.neon.tech/signup
2. Sign up (use GitHub for quick auth)
3. Create project "rcs-simulator-dev"
4. Copy the connection string shown
5. Run these commands:

```bash
cd "/Users/david/Library/CloudStorage/GoogleDrive-david@messagingadvisory.com/My Drive/GitHub/RCSSimulator"

# Create .env with your connection string
echo 'DATABASE_URL=postgresql://paste-your-neon-connection-string-here
SESSION_SECRET='$(openssl rand -base64 32)'
NODE_ENV=development' > .env

# Edit to paste actual DATABASE_URL
nano .env
# Paste your Neon connection string, save (Ctrl+O, Enter, Ctrl+X)

# Initialize database
export PATH="/opt/homebrew/bin:$PATH"
npm run db:push

# Start server
npm run dev
```

Then open: **http://localhost:5000**

You'll see your RCS Simulator with all the new features running! 🎉

---

## 📸 What You'll See When Running:

1. **Login/Register Page** - Create your account
2. **Dashboard** - See stats and "New Format" dropdown
3. **RCS Formatter:**
   - Format type selector (Message/Rich Card/Carousel/Chip)
   - Image uploader with GIF warnings
   - Real-time validation (iOS 102 char limit)
   - Android/iOS preview tabs
   - Platform comparison guide
   - DP→PX media size reference
4. **Export Options:**
   - Export JSON (RBM API compatible)
   - Export Device Image (Android/iOS)
   - Save as Campaign

---

## 🔧 Troubleshooting

### "DATABASE_URL must be set"
**Fix:** Create .env file with DATABASE_URL (see above)

### "Cannot connect to database"
**Fix:** 
- Check internet connection (for Neon)
- Verify DATABASE_URL is correct
- Check for typos in connection string

### "npm: command not found"
**Fix:**
```bash
export PATH="/opt/homebrew/bin:$PATH"
# Or add to ~/.zshrc permanently:
echo 'export PATH="/opt/homebrew/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### "Port 5000 already in use"
**Fix:**
```bash
# Find what's using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change port in server/index.ts
```

### Database Migration Fails
**Fix:**
```bash
# Reset Neon database via SQL Editor:
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

# Re-run migration
npm run db:push
```

---

## 🎓 Database Management Tools

### Recommended GUI Tools:

1. **Neon Console** (Web-based)
   - Built into Neon dashboard
   - SQL Editor with syntax highlighting
   - Visual schema browser

2. **TablePlus** (Mac app - $79 but free trial)
   ```bash
   brew install --cask tableplus
   ```
   - Beautiful GUI
   - Supports all databases
   - Query builder

3. **pgAdmin** (Free, powerful)
   ```bash
   brew install --cask pgadmin4
   ```
   - Full-featured PostgreSQL tool
   - Schema designer
   - Query analyzer

4. **psql** (Command-line, free)
   - Already included with PostgreSQL
   - Fast and powerful
   - Perfect for quick queries

---

## 💰 Cost Comparison

| Solution | Development | Production | Database | Monthly Cost |
|----------|-------------|------------|----------|--------------|
| **Neon Free** | ✓ | Small scale | 512MB | $0 |
| **Neon Pro** | ✓ | ✓ | Unlimited | $19/mo |
| **Local PostgreSQL** | ✓ | ✗ | Unlimited | $0 |
| **Replit** | ✓ | ✓ | Auto-provision | $0-20/mo |
| **Railway** | ✓ | ✓ | 1GB free | $0-5/mo |
| **Supabase Free** | ✓ | Small scale | 500MB | $0 |
| **Supabase Pro** | ✓ | ✓ | 8GB | $25/mo |

**Recommendation:**
- **Development:** Neon Free (512MB is plenty)
- **Production:** Neon Pro or Railway (scales automatically)

---

## 🔄 Development Workflow

### Daily Development:

```bash
# Morning: Start database (if local PostgreSQL)
brew services start postgresql@16

# Start dev server
export PATH="/opt/homebrew/bin:$PATH"
npm run dev

# Make changes to code...
# Server auto-reloads on file changes (Vite HMR)

# Evening: Stop database (if local)
brew services stop postgresql@16
```

### After Schema Changes:

```bash
# Update database schema
npm run db:push

# Restart server
# (Ctrl+C to stop, then npm run dev)
```

### Before Deploying to Production:

```bash
# 1. Run type check
npm run check

# 2. Build production bundle
npm run build

# 3. Test production build locally
npm run start

# 4. Commit changes
git add -A
git commit -m "Your changes"

# 5. Push to GitHub
git push origin main

# 6. Deploy (if not auto-deploy)
vercel --prod
# or push triggers auto-deploy on Replit/Railway
```

---

## 📊 Monitoring Production

### Key Metrics to Watch:

1. **Database Usage:**
   - Neon: Dashboard → Metrics
   - Check: Storage used, connection count, query performance

2. **Application Performance:**
   - Server response times
   - API endpoint latency
   - Error rates

3. **User Activity:**
   - Formats created per day
   - Export requests
   - Campaign activations

### Alerts to Set Up:

- Database storage >80% capacity
- Connection pool exhausted
- Error rate >5%
- Response time >3 seconds

---

## 🎯 RECOMMENDED ARCHITECTURE

```
┌─────────────────────────────────────────────┐
│           DEVELOPMENT                        │
├─────────────────────────────────────────────┤
│  Your Mac (localhost:5000)                  │
│    ├── Node.js server                       │
│    ├── Vite dev server (HMR)                │
│    └── PostgreSQL connection                │
│           ↓                                  │
│  Neon Database "dev" (Cloud)                │
│    ├── Tables auto-created                  │
│    ├── Test data                            │
│    └── Can reset anytime                    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│           PRODUCTION                         │
├─────────────────────────────────────────────┤
│  Replit / Vercel / Railway                  │
│    ├── Auto-scaled servers                  │
│    ├── SSL/HTTPS automatic                  │
│    ├── CDN for static assets                │
│    └── Auto-deploy from GitHub              │
│           ↓                                  │
│  Neon Database "prod" (Cloud)               │
│    ├── Automated backups                    │
│    ├── Real user data                       │
│    ├── Production-grade                     │
│    └── Never reset!                         │
└─────────────────────────────────────────────┘
```

---

## ✅ YOUR ACTION ITEMS

### **RIGHT NOW (to test new features):**

1. [ ] Go to https://neon.tech
2. [ ] Create free account (1 min)
3. [ ] Create project "rcs-simulator-dev" (1 min)
4. [ ] Copy connection string
5. [ ] Create .env file with DATABASE_URL and SESSION_SECRET (1 min)
6. [ ] Run `npm run db:push` (30 sec)
7. [ ] Run `npm run dev` (30 sec)
8. [ ] Open http://localhost:5000 and test! (5+ min)

**Total time: ~10 minutes to be fully operational** ⚡

### **LATER (for production):**

1. [ ] Create production Neon database
2. [ ] Choose deployment platform (Replit/Vercel/Railway)
3. [ ] Set up auto-deployment
4. [ ] Configure monitoring
5. [ ] Set up backups

---

## 📞 Need Help?

If you encounter any issues:

1. **Check logs:** Terminal output shows detailed errors
2. **Verify .env:** Make sure DATABASE_URL and SESSION_SECRET are set
3. **Test connection:** Run `npm run db:push` to verify database connection
4. **Check documentation:** All guides are in the repository root

---

**The fastest path: Neon (dev) + Replit (prod) = Zero local installation, fully managed, free tier available!** 🚀

Ready to run: Just set up the .env file and you're good to go!

