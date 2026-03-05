# Vercel Deployment Guide for EduBridge

## Prerequisites

1. GitHub account with your code pushed
2. Vercel account (sign up at https://vercel.com)
3. PostgreSQL database (SQLite won't work on Vercel)

## Database Setup Options

Choose one of these hosted PostgreSQL providers:

### Option 1: Vercel Postgres (Recommended)
- Go to your Vercel dashboard
- Create a new Postgres database
- Copy the DATABASE_URL connection string

### Option 2: Neon (Free tier available)
- Sign up at https://neon.tech
- Create a new project
- Copy the connection string

### Option 3: Supabase (Free tier available)
- Sign up at https://supabase.com
- Create a new project
- Go to Settings > Database
- Copy the connection string (use "Connection pooling" for better performance)

## Deployment Steps

### 1. Push Your Code to GitHub

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Deploy to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure your project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `prisma generate && next build`
   - Install Command: `npm install`

### 3. Set Environment Variables

In Vercel dashboard, go to Settings > Environment Variables and add:

**Required Variables:**
```
DATABASE_URL=your_postgresql_connection_string
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=generate_a_random_secret_key
```

**Email Configuration:**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-gmail-app-password
EMAIL_FROM=your-email@gmail.com
```

**Application Configuration:**
```
APP_NAME=EduBridge
APP_URL=https://your-app.vercel.app
APP_ENV=production
BCRYPT_ROUNDS=12
JWT_EXPIRY=7d
LOG_LEVEL=info
```

### 4. Generate NEXTAUTH_SECRET

Run this command locally to generate a secure secret:
```bash
openssl rand -base64 32
```

Or use this online: https://generate-secret.vercel.app/32

### 5. Run Database Migrations

After deployment, you need to run migrations:

**Option A: Using Vercel CLI**
```bash
npm i -g vercel
vercel login
vercel env pull .env.production
npm run db:migrate
```

**Option B: Using Prisma Data Platform**
1. Go to https://cloud.prisma.io
2. Connect your database
3. Run migrations from the dashboard

**Option C: Manual SQL**
- Copy the SQL from `prisma/migrations/20251202111550_add_all_models/migration.sql`
- Run it directly in your database console

### 6. Seed the Database (Optional)

If you want to add demo data:
```bash
vercel env pull .env.production
npm run db:seed
```

## Post-Deployment

### Test Your Deployment

1. Visit your Vercel URL
2. Try registering a new user
3. Test the admin login with seeded credentials
4. Check all major features

### Monitor Your App

- Check Vercel dashboard for logs
- Monitor database connections
- Set up error tracking (optional: Sentry)

## Troubleshooting

### Build Fails
- Check Vercel build logs
- Ensure all dependencies are in package.json
- Verify DATABASE_URL is set correctly

### Database Connection Issues
- Verify your DATABASE_URL format
- Check if your database allows connections from Vercel IPs
- For Supabase, use connection pooling URL

### Environment Variables Not Working
- Make sure variables are set for "Production" environment
- Redeploy after adding new variables
- Check variable names match exactly (case-sensitive)

### Prisma Issues
- Ensure `postinstall` script runs: `"postinstall": "prisma generate"`
- Check that migrations are applied to production database

## Important Notes

⚠️ **SQLite to PostgreSQL Migration**
- Your current setup uses SQLite (dev.db)
- Vercel requires PostgreSQL
- You'll need to migrate your data or start fresh

⚠️ **Security**
- Never commit .env file
- Use strong NEXTAUTH_SECRET
- Enable HTTPS only in production
- Review and update CORS settings if needed

⚠️ **Email Configuration**
- Gmail requires "App Passwords" (not your regular password)
- Enable 2FA on Gmail, then generate an App Password
- Consider using SendGrid or Resend for production

## Continuous Deployment

Once set up, Vercel automatically deploys when you push to GitHub:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Vercel will automatically build and deploy your changes!

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Prisma Docs: https://www.prisma.io/docs
- Next.js Docs: https://nextjs.org/docs
