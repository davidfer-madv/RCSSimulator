# ⚡ Quick Start Guide - Get Running in 5 Minutes

## 🎯 You're Almost There!

npm is installed ✅  
Dependencies installed ✅  
Now you just need a database!

---

## 🚀 **Option 1: Fastest Setup (Neon - Recommended)**

### 5-Minute Setup:

**Step 1: Create Free Neon Database (2 minutes)**
```
1. Open: https://console.neon.tech/signup
2. Sign up with GitHub (instant auth)
3. Click "Create a project"
4. Name: rcs-simulator-dev
5. Region: US East (or closest to you)
6. Click "Create Project"
```

**Step 2: Copy Connection String (30 seconds)**
```
You'll see a connection string like:
postgresql://username:password@ep-cool-name.us-east-2.aws.neon.tech/neondb?sslmode=require

Click the "Copy" button next to it
```

**Step 3: Create .env File (1 minute)**
```bash
# In your terminal, run this:
cd "/Users/david/Library/CloudStorage/GoogleDrive-david@messagingadvisory.com/My Drive/GitHub/RCSSimulator"

# Create .env file
cat > .env << 'EOF'
DATABASE_URL=paste-your-connection-string-here
SESSION_SECRET=replace-this-with-generated-secret
NODE_ENV=development
EOF

# Generate a secure session secret
openssl rand -base64 32

# Now edit .env and:
# 1. Replace DATABASE_URL with your Neon connection string
# 2. Replace SESSION_SECRET with the generated secret
nano .env
# (Or use: open -e .env to open in TextEdit)
```

**Step 4: Initialize Database (30 seconds)**
```bash
npm run db:push
```

You should see:
```
✓ Created tables successfully
```

**Step 5: Start the Server (30 seconds)**
```bash
npm run dev
```

You should see:
```
Server running on http://localhost:5000
```

**Step 6: Open in Browser**
```bash
open http://localhost:5000
```

**You're done!** 🎉

---

## 🏃 **Option 2: Super Quick with Script**

I can create a setup script for you:

```bash
# Run this single command:
./setup.sh
```

Would you like me to create this automated setup script?

---

## 🧪 **What to Test After Setup**

Once the server is running at http://localhost:5000:

### 1. **Register Account** (30 seconds)
- Click "Register"
- Enter username, password, email
- Click "Create Account"

### 2. **Test New Format Menu** (1 minute)
- Click "New Format" button (top right)
- You should see dropdown with:
  - Message
  - Rich Card
  - Carousel  
  - Chip List ← NEW!
- Select "Chip List"
- Format type should auto-select

### 3. **Test Image Upload with GIF Warning** (1 minute)
- Upload a JPEG → Should show "Cross-platform ✓" badge
- Upload a GIF → Should show "iOS: Not supported" warning

### 4. **Test iOS Title Validation** (1 minute)
- Create Rich Card
- Type a long title (>102 characters)
- You should see:
  - iOS counter: "iOS: 105/102" in amber
  - Warning message below field
  - Amber border on input

### 5. **Test Dual Platform Preview** (2 minutes)
- Add some content
- Toggle between "Android" and "iOS" tabs
- See visual differences:
  - Android: Chips (inline buttons)
  - iOS: List (with chevrons ›)
- Scroll down to see Platform Comparison Guide

### 6. **Test DP→PX Converter** (1 minute)
- Scroll to "Media Size Reference"
- See conversion table
- Try custom DP calculator
- Enter "200" → Should show pixel conversions

---

## 📋 **Common First-Time Issues**

### Issue: "npm: command not found"
**Fix:**
```bash
export PATH="/opt/homebrew/bin:$PATH"

# Make permanent:
echo 'export PATH="/opt/homebrew/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Issue: "DATABASE_URL must be set"
**Fix:** Create .env file with your Neon connection string (see Step 3 above)

### Issue: "Port 5000 already in use"
**Fix:**
```bash
# Find what's using it
lsof -i :5000

# Kill it
kill -9 <PID>

# Or use different port (edit server/index.ts)
```

### Issue: ".env file not working"
**Fix:**
```bash
# Make sure .env is in project root
ls -la .env

# Check contents
cat .env

# Should show:
# DATABASE_URL=postgresql://...
# SESSION_SECRET=...
# NODE_ENV=development
```

---

## 🎯 **Your Complete Setup Checklist**

- [x] npm installed ✅
- [x] Dependencies installed ✅
- [x] Security vulnerabilities fixed ✅
- [ ] Database setup (Neon account)
- [ ] .env file created
- [ ] Database initialized (`npm run db:push`)
- [ ] Server running (`npm run dev`)
- [ ] Tested in browser

**You're 3 steps away from testing all your new features!** 🚀

---

## 📞 **Quick Support Commands**

```bash
# Check if .env exists
ls -la .env

# View database connection (without password)
grep DATABASE_URL .env | sed 's/:.*@/:***@/'

# Test database connection
npm run db:push

# Start server with full logs
npm run dev

# Check what's running on port 5000
lsof -i :5000

# View recent logs
tail -f /Users/david/.npm/_logs/*.log
```

---

## 🎉 **Next Step**

**Choose your path:**

**Path A - Quick Cloud Setup (5 min):**
1. Go to https://neon.tech now
2. Create account and database
3. Copy connection string
4. Create .env file
5. Run `npm run db:push && npm run dev`
6. Test!

**Path B - Local PostgreSQL (15 min):**
1. Install: `brew install postgresql@16`
2. Start: `brew services start postgresql@16`
3. Create DB: `createdb rcs_simulator`
4. Create .env with local connection
5. Run `npm run db:push && npm run dev`
6. Test!

---

**I recommend Path A (Neon) - it's faster and matches your production environment!**

Ready to set up the database? Let me know if you need help with any step!

