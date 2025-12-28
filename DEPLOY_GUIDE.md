# 🌐 Deploy to Vercel via Website (No CLI Needed!)

## This method works without installing anything!

### Step 1: Push to GitHub (Optional but Recommended)

If you don't have a GitHub repo yet:

1. Go to https://github.com/new
2. Create a new repository (e.g., `vidmerge-licensing`)
3. **Don't** initialize with README
4. Copy the commands shown

Then in PowerShell:
```powershell
cd e:\Python_Projects\merge_vids\backend

git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/vidmerge-licensing.git
git push -u origin main
```

### Step 2: Deploy from Vercel Dashboard

1. **Go to**: https://vercel.com/new
2. **Import Git Repository**:
   - Click "Import Git Repository"
   - Connect your GitHub account
   - Select your repository

**OR Skip GitHub - Import Manually:**

1. **Go to**: https://vercel.com/new
2. Click **"Browse"** to upload files manually
3. Select your `backend` folder
4. Click **Import**

### Step 3: Configure Project

- **Framework Preset**: Other
- **Root Directory**: `./` (leave as is)
- **Build Command**: (leave empty)
- **Output Directory**: (leave empty)

Click **Deploy**

### Step 4: Add Environment Variables

After deployment:

1. Go to your project dashboard
2. Click **Settings** → **Environment Variables**
3. Add these two:

**Variable 1: MONGODB_URI**
```
mongodb+srv://videomerge:ffPCuYdW2xOWIfjr@flow-ext.shyho6g.mongodb.net/vidmerge_licenses?retryWrites=true&w=majority&appName=Flow-Ext
```

**Variable 2: ADMIN_SECRET**
```
MySecurePassword123
```
(Change this to your own secure password!)

4. Click **Save for All**

### Step 5: Redeploy

1. Go to **Deployments** tab
2. Click the **⋯** (three dots) next to your latest deployment
3. Click **Redeploy**
4. Wait ~30 seconds

### Step 6: Get Your URL

Your Vercel URL will be shown:
```
https://vidmerge-licensing.vercel.app
```

**Copy this URL!**

---

## ✅ You're Done!

Share with me:
- ✅ Your Vercel URL
- ✅ Your ADMIN_SECRET password

Then I'll connect your Electron app to the licensing system!

---

## Alternative: Use Vercel Desktop App

1. Download: https://vercel.com/download
2. Install and login
3. Drag your `backend` folder to Vercel
4. Follow the same steps above

Much easier than CLI! 🚀
