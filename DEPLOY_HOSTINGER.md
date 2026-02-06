# Deploying to Hostinger (Shared / Cloud Hosting)

This guide is for **Shared Hosting** or **Cloud Hosting** plans using **hPanel** (not VPS).

## 1. Prepare Your Project
1. **Build locally**: (Optional, but recommended for checking errors)
   ```bash
   npm run build
   ```
2. **Zip your project**:
   - Select all files in your project root **EXCEPT**:
     - `node_modules`
     - `.git`
     - `.next` (We will let the server build/run this, or upload it if using standalone, but for shared hosting, usually we upload source and build there if possible, OR upload the `.next` folder if the node version matches. **Safest bet for Shared:** Upload source + `.next` folder if you built it, but often `npm install` and `npm run build` on server is better if SSH is available.
   - **CRITICAL:** Include the `server.js` file I just created.
   - If you don't have SSH access, you MUST upload the `.next` folder from your local build.

   *(I have created an updated `deployment.zip` for you that includes `server.js`)*

## 2. Shared Hosting Setup (hPanel)
1. Log in to **hPanel** -> **Websites** -> **Manage**.
2. Search for **"Node.js"** in the sidebar.
3. Click **"Create Application"** (or use existing).

### Configuration
- **Node.js Version**: Select **v18** or **v20** (Match your local version).
- **Application Mode**: **Production**.
- **Application Root**: `public_html/event-app` (or just `public_html` if it's the only site).
- **Application Startup File**: `server.js` (VERY IMPORTANT - default is often app.js).
- Click **Create**.

## 3. Upload Files
1. Go to **File Manager**.
2. Navigate to your Application Root (e.g., `public_html` or `public_html/event-app`).
3. Upload and **Extract** your `deployment.zip`.
4. Ensure `server.js`, `package.json`, and `.next` folder (if strictly uploading build) or `src` code provided.

## 4. Install Dependencies
1. Go back to the **Node.js** page in hPanel.
2. Click **"NPM Install"**.
   - *Note: This might take a while. If it fails due to memory, you might need to upload your `node_modules` manually (zipped).*

## 5. Build (If not uploaded)
If you uploaded the source code but NOT the `.next` folder:
1. You need to run the build command.
2. In the **Node.js** page, look for "Run Script".
3. Enter `build` and click Run. (This refers to `npm run build` in package.json).
4. **Wait** for it to finish.

## 6. Database (Supabase PostgreSQL)
1. **Create a Supabase Project**: Go to [supabase.com](https://supabase.com) and create a new project.
2. **Get Connection Strings**:
   - Go to **Project Settings** -> **Database**.
   - Under **Connection String**, select **URI**.
   - **Mode: Transaction** (Copy this). This is your `DATABASE_URL`. (e.g., `postgres://[user]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/[db]`)
   - **Mode: Session** (Copy this). This is your `DIRECT_URL`. (e.g., `postgres://[user]:[password]@aws-0-us-east-1.supabase.co:5432/[db]`)
3. **Set Environment Variables in hPanel**:
   - Go to the **Node.js** page in hPanel.
   - Find the **"Environment Variables"** section (or create a `.env` file in the File Manager if the UI is missing).
   - Add:
     - `DATABASE_URL` = "your_transaction_pooler_url"
     - `DIRECT_URL` = "your_direct_session_url"
     - `NEXTAUTH_SECRET` = "generate_a_random_string"
     - `NEXTAUTH_URL` = "http://your-domain.com"
4. **Run Migrations (Optional but recommended)**:
   - It is best to run `npx prisma migrate deploy` locally connected to the prod DB, OR run it via SSH on Hostinger if available.
   - If no SSH, you can try adding `"migrate": "prisma migrate deploy"` to `package.json` scripts and running it via the "Run Script" feature in hPanel.

## 7. Start App
1. On the **Node.js** page, click **"Restart"** or **"Start"**.
2. Visit your domain!

## Troubleshooting
- **500 Error?** Check the "Error Logs" in hPanel.
- **"App Not Started"?** Ensure `server.js` is selected as the Startup File.
- **Database Read-Only?** SQLite needs write permissions on the *folder* containing the database file.
