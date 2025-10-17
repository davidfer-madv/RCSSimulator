# Database Setup Guide

## 🗄️ Setting Up Your Database

The RCS Simulator requires a PostgreSQL database. Here are your options:

---

## ⚡ **Quick Setup (Recommended): Neon Serverless PostgreSQL**

### Free tier includes:
- 512 MB storage
- Serverless PostgreSQL (same as Replit uses)
- Perfect for development and small production

### Steps:

1. **Create Account:**
   ```
   Visit: https://neon.tech
   Sign up (free, no credit card required)
   ```

2. **Create Database:**
   - Click "Create Project"
   - Name: "rcs-simulator"
   - Region: Choose closest to you
   - PostgreSQL version: 16 (recommended)
   - Click "Create"

3. **Get Connection String:**
   - Copy the connection string shown
   - It looks like: `postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb`

4. **Create .env File:**
   ```bash
   cd "/Users/david/Library/CloudStorage/GoogleDrive-david@messagingadvisory.com/My Drive/GitHub/RCSSimulator"
   
   cat > .env << 'EOF'
   DATABASE_URL=postgresql://your-connection-string-here
   SESSION_SECRET=your-random-secret-key-change-this
   NODE_ENV=development
   EOF
   ```

5. **Replace the connection string** in .env with your actual Neon connection string

6. **Initialize Database:**
   ```bash
   export PATH="/opt/homebrew/bin:$PATH"
   npm run db:push
   ```

7. **Start Server:**
   ```bash
   npm run dev
   ```

---

## 🐘 **Option 2: Local PostgreSQL**

### If you want to run PostgreSQL locally:

1. **Install PostgreSQL:**
   ```bash
   brew install postgresql@16
   brew services start postgresql@16
   ```

2. **Create Database:**
   ```bash
   createdb rcs_simulator
   ```

3. **Create .env File:**
   ```bash
   cat > .env << 'EOF'
   DATABASE_URL=postgresql://localhost:5432/rcs_simulator
   SESSION_SECRET=your-random-secret-key-here
   NODE_ENV=development
   EOF
   ```

4. **Initialize Database:**
   ```bash
   npm run db:push
   ```

5. **Start Server:**
   ```bash
   npm run dev
   ```

---

## 🌊 **Option 3: Supabase (Free PostgreSQL + More)**

### Includes: PostgreSQL + Auth + Storage + Real-time

1. **Create Account:**
   ```
   Visit: https://supabase.com
   Sign up (free tier available)
   ```

2. **Create Project:**
   - New Project → Name: "rcs-simulator"
   - Generate a secure password
   - Choose region closest to you

3. **Get Connection String:**
   - Go to Project Settings → Database
   - Copy "Connection String" (URI format)
   - Replace `[YOUR-PASSWORD]` with your password

4. **Create .env File:**
   ```bash
   cat > .env << 'EOF'
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
   SESSION_SECRET=your-random-secret-key
   NODE_ENV=development
   EOF
   ```

5. **Initialize and Run:**
   ```bash
   npm run db:push
   npm run dev
   ```

---

## 🔐 **Generating a Secure SESSION_SECRET**

Your session secret should be a random string. Generate one:

```bash
# Option 1: Using openssl
openssl rand -base64 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 3: Simple random string
echo "rcs-sim-$(date +%s)-$(openssl rand -hex 16)"
```

Copy the output and use it as your SESSION_SECRET in the .env file.

---

## 📝 **Complete .env File Example**

Create a file named `.env` in your project root:

```bash
# .env
DATABASE_URL=postgresql://user:password@host.region.provider.com:5432/database
SESSION_SECRET=jK8mN2pQ4rS6tU8vW0xY2zA4bC6dE8fG0hI2jK4lM6nO8pQ0rS2t
NODE_ENV=development
```

**Important:** 
- Never commit .env file to git (it's in .gitignore)
- Use different secrets for development and production
- Keep your database password secure

---

## 🚀 **After Database Setup**

Once your .env file is created:

1. **Initialize Database Schema:**
   ```bash
   export PATH="/opt/homebrew/bin:$PATH"
   npm run db:push
   ```
   
   This creates all tables:
   - users
   - customers (brands)
   - campaigns
   - rcs_formats
   - webhook_configs
   - webhook_logs

2. **Start Development Server:**
   ```bash
   npm run dev
   ```
   
   Server starts at: http://localhost:5000

3. **Access Application:**
   - Open: http://localhost:5000
   - Click "Register" to create your account
   - Start creating RCS formats!

---

## 🧪 **Testing Your Setup**

After the server starts:

1. Visit: http://localhost:5000
2. You should see the login page
3. Click "Register" → Create an account
4. After login, you should see the Dashboard
5. Click "New Format" dropdown → Should see all 4 format types
6. Try uploading an image → Should display in preview

If all these work, your setup is complete! ✅

---

## 🐛 **Troubleshooting**

### "DATABASE_URL must be set"
- Create .env file in project root
- Add DATABASE_URL with your connection string
- Restart the server

### "Connection refused" or "Connection timeout"
- Check database is running
- Verify connection string is correct
- Check firewall allows database port (5432)
- For Neon/Supabase: Check internet connection

### "Migration failed" or "Table already exists"
- Database tables might already exist
- Either:
  - Drop all tables and re-run `npm run db:push`
  - Or continue (tables will be reused)

### "Session secret" warnings
- Generate a proper SESSION_SECRET (see above)
- Add to .env file
- Restart server

---

## 📦 **What Database to Choose?**

| Option | Best For | Pros | Cons |
|--------|----------|------|------|
| **Neon** | Quick start | Free, fast, no setup | Cloud-dependent |
| **Local PostgreSQL** | Development | Full control, offline | Requires installation |
| **Supabase** | Production | Auth + DB + Storage | More complex |

**Recommendation for Testing:** Use **Neon** - it's the fastest way to get started (5 minutes setup, no local install needed).

---

## 🎯 **Quick Start (5 Minutes)**

```bash
# 1. Sign up at https://neon.tech (1 minute)
# 2. Create project, copy connection string (1 minute)
# 3. Create .env file:
cat > .env << 'EOF'
DATABASE_URL=your-neon-connection-string-here
SESSION_SECRET=$(openssl rand -base64 32)
NODE_ENV=development
EOF

# 4. Edit .env and paste your actual DATABASE_URL

# 5. Initialize database
export PATH="/opt/homebrew/bin:$PATH"
npm run db:push

# 6. Start server
npm run dev

# 7. Open browser: http://localhost:5000
```

Done! Your RCS Simulator is running! 🚀

---

Need help? Check the error messages or ask for specific guidance!

