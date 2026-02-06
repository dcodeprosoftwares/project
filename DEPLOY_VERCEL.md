# Deploying to Vercel + Supabase

This is the **Recommended** path for free, high-performance hosting of Next.js applications.

## 1. Database Setup (Supabase)
Since Vercel is serverless, we need a cloud database. **Supabase** provides a free PostgreSQL database.

1. Go to [database.new](https://database.new) (Supabase) and sign in/sign up.
2. Create a **New Project**:
   - **Name**: `EventApp`
   - **Database Password**: *Create a strong password and SAVE IT.*
   - **Region**: Choose one close to you (e.g., Mumbai, Singapore).
3. Wait for the project to be created.
4. **EASIEST WAY**: Look at the top-right of the dashboard and click the green **"Connect"** button.
5. In the popup that appears:
   - Click on **"Transaction Pooler"** (or ensure checkmark is ON).
   - Copy the string that looks like `postgres://...:6543/...`. This is your **Transaction** string.
   - Uncheck "Use connection pooler" (or switch to Session mode) to see the string ending in `:5432`. This is your **Session** string.
6. **ALTERNATIVE**:
   - Go to **Project Settings** (Gear icon) -> **Database**.
   - Under **Connection String**, make sure **"URI"** is selected.
   - You will see a "Mode" toggle for **Transaction** (6543) vs **Session** (5432).

## 2. Prepare Code
1. I have already updated your `prisma/schema.prisma` to use `postgresql`.
2. Push your code to **GitHub** (if you haven't already).
   - Create a repository on GitHub.
   - Run these commands in your terminal:
     ```bash
     git remote add origin https://github.com/your-username/your-repo.git
     git branch -M main
     git push -u origin main
     ```

## 3. Vercel Deployment
1. Go to [vercel.com](https://vercel.com) and sign in.
2. Click **"Add New..."** -> **"Project"**.
3. Import your GitHub repository.
4. In the **Configure Project** screen:
   - **Framework Preset**: Next.js (Default)
   - **Environment Variables**:
     - `DATABASE_URL`: Your Supabase **Transaction** Connection String (port 6543).
     - `DIRECT_URL`: Your Supabase **Session** Connection String (port 5432).
     - `NEXTAUTH_SECRET`: Generate one (or use `openssl rand -base64 32`).
     - `NEXTAUTH_URL`: You can leave this EMPTY for Vercel (it automatically sets it) OR set it to your custom domain later. 
     - **Important**: If utilizing Supabase storage for photos (recommended for Vercel), you would add those keys here too. *For now, your local file upload logic (`/api/upload`) will NOT work well on Vercel because Vercel has a read-only filesystem.*

## 4. Critical: File Uploads on Vercel
**Vercel does not support storing uploaded files locally** (in `public/uploads`).
You must switch to a cloud storage provider or use **Supabase Storage**.

### Quick Fix (Supabase Storage)
1. In Supabase, go to **Storage** -> **New Bucket**.
2. Name it `events`. Make it **Public**.
3. I would need to update your `/src/app/api/upload/route.ts` to upload to Supabase instead of the local folder.

**Do you want me to update the upload logic to use Supabase Storage now?** (Highly Recommended)
