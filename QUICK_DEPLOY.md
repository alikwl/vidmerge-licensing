# ⚡ Fastest Way to Deploy (No npm issues!)

## Option 1: Vercel Website (Easiest!)

1. **Go to**: https://vercel.com/login
   - Sign up with GitHub (recommended) or email

2. **After login, go to**: https://vercel.com/new

3. **Click "Browse"** and select your `backend` folder:
   ```
   e:\Python_Projects\merge_vids\backend
   ```

4. Click **Deploy** and wait ~30 seconds

5. **Add Environment Variables**:
   - Click your project → Settings → Environment Variables
   - Add `MONGODB_URI`: 
     ```
     mongodb+srv://videomerge:ffPCuYdW2xOWIfjr@flow-ext.shyho6g.mongodb.net/vidmerge_licenses?retryWrites=true&w=majority&appName=Flow-Ext
     ```
   - Add `ADMIN_SECRET`: `YourPasswordHere123`
   - Click Save
   
6. **Redeploy**: Deployments → ⋯ → Redeploy

7. **Copy your URL**: `https://your-project.vercel.app`

---

## Option 2: Vercel Desktop App

1. Download: https://vercel.com/download
2. Install and login
3. Drag `backend` folder into Vercel
4. Follow step 5-7 above

---

## Then Tell Me:
- ✅ Your Vercel URL
- ✅ Your ADMIN_SECRET password

Done! 🎉
