# Railway.app Deployment Guide

## 🚀 Railway - Ավելի լավ, քան Render

Railway-ը **չի sleep լինում** և ունի արագ cold start:

### Քայլ 1: Sign Up

1. Գնացեք https://railway.app
2. Sign up with GitHub
3. Confirm email

### Քայլ 2: Create Project

1. Dashboard-ում → **New Project**
2. **Deploy from GitHub repo**
3. Select `phyl0so6h/InecoProject`

### Քայլ 3: Add PostgreSQL Database

1. Project-ում → **New**
2. **Database** → **PostgreSQL**
3. Railway-ը ավտոմատ կստեղծի database-ը
4. **Settings** → Copy **DATABASE_URL** (պետք է set անել backend-ում)

### Քայլ 4: Deploy Backend

1. Project-ում → **New**
2. **GitHub Repo** → Select your repo
3. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install --include=dev && npm run build`
   - **Start Command:** `npm start`
4. **Variables** tab:
   - `NODE_ENV` = `production`
   - `DATABASE_URL` = (from PostgreSQL service, copy-paste)
   - `JWT_SECRET` = (generate random string)
5. Railway-ը ավտոմատ կdeploy անի
6. **Settings** → Copy **Public Domain** (օր. `ineco-backend.railway.app`)

### Քայլ 5: Deploy Frontend

1. Project-ում → **New**
2. **Static Site**
3. **GitHub Repo** → Select your repo
4. Settings:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Output Directory:** `dist`
5. **Variables** tab:
   - `VITE_API_URL` = `https://ineco-backend.railway.app` (backend URL-ը)
6. Railway-ը ավտոմատ կdeploy անի

### Քայլ 6: Database Migrations

1. Backend service → **View Logs**
2. Click **Shell** (terminal access)
3. Run:
   ```bash
   npx prisma migrate deploy
   ```

## ✅ Advantages over Render:

- ✅ **No sleep** - Services-ը միշտ active են
- ✅ **Fast cold start** - Ավելի արագ, քան Render
- ✅ **$5/month free credit** - Ավելի քան բավական է
- ✅ **Easy setup** - Simple dashboard
- ✅ **Better logs** - Easier debugging

## 💰 Cost:

- **Free tier:** $5/month credit
- Small apps usually stay within free tier
- Database included in free tier

## 🔗 URLs:

- Backend: `https://ineco-backend.railway.app`
- Frontend: `https://ineco-frontend.railway.app`

## 📝 Notes:

- Railway-ը automatically generates public domains
- Custom domains available (paid)
- No need for keep-alive services
- Services stay active 24/7
