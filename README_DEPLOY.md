# Deployment Guide - Deployment Օրենսգիրք

## Անվճար Hosting - Free Hosting Options

Այս ծրագիրը կարելի է deploy անել Render-ում անվճար tier-ով:

### Option 1: Render (Առաջարկվում է - Recommended)

Render-ը ապահովում է:

- ✅ Անվճար PostgreSQL database
- ✅ Անվճար backend hosting
- ✅ Անվճար static site hosting (frontend)
- ✅ Automatic deployments from GitHub

#### Քայլերը / Steps:

1. **GitHub-ում push արեք ձեր code-ը**

   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin master
   ```

2. **Render account ստեղծեք**

   - Գնացեք https://render.com
   - Sign up with GitHub

3. **Database ստեղծեք**

   - Dashboard-ում սեղմեք "New +" -> "PostgreSQL"
   - Name: `ineco-db`
   - Plan: Free
   - Database: `ineco`
   - User: `ineco_user`
   - Սեղմեք "Create Database"
   - Պահեք `Internal Database URL`-ը

4. **Backend deploy**

   **Վարչապետ: Render Blueprint (render.yaml)**

   Եթե օգտագործում եք render.yaml (recommended):

   - Dashboard-ում սեղմեք "New +" -> "Blueprint"
   - Connect your GitHub repository
   - Render-ը ավտոմատ կկարդա render.yaml file-ը
   - Ստուգեք որ Database connection string-ը ճիշտ է set-ված
   - Environment Variables (եթե չեն set-ված automatically):
     - `JWT_SECRET` = (generate random string, օր. `openssl rand -base64 32`)
     - `DATABASE_URL` = (copy from database service's Internal Database URL)
   - Սեղմեք "Apply"

   **Կամ Manual Setup:**

   - Dashboard-ում սեղմեք "New +" -> "Web Service"
   - Connect your GitHub repository
   - Settings:
     - Name: `ineco-backend`
     - Environment: `Node`
     - Root Directory: `backend`
     - Build Command: `npm install && npm run prisma:generate && npm run build`
     - Start Command: `npm start`
     - Plan: Free
   - Environment Variables:
     - `NODE_ENV` = `production`
     - `PORT` = `10000` (Render automatically sets this, but can override)
     - `JWT_SECRET` = (generate random string, օր. `openssl rand -base64 32`)
     - `DATABASE_URL` = (paste your PostgreSQL Internal Database URL from step 3)
   - Health Check Path: `/health`
   - Սեղմեք "Create Web Service"
   - Սպասեք deployment-ին ավարտվելուն
   - Պահեք backend URL-ը (օր. `https://ineco-backend.onrender.com`)

5. **Frontend deploy**

   **Render Blueprint մեթոդով:**

   - Blueprint-ը ավտոմատ կստեղծի frontend service-ը
   - **Պետք է manually set անել** Environment Variable:
     - Dashboard -> ineco-frontend -> Environment
     - Add: `VITE_API_URL` = `https://ineco-backend.onrender.com` (your backend URL)
     - Save changes (frontend-ը կ rebuild լինի)

   **Կամ Manual Setup:**

   - Dashboard-ում սեղմեք "New +" -> "Static Site"
   - Connect your GitHub repository
   - Settings:
     - Name: `ineco-frontend`
     - Root Directory: `frontend`
     - Build Command: `npm install && npm run build`
     - Publish Directory: `dist`
   - Environment Variables:
     - `VITE_API_URL` = (paste your backend URL from step 4, օր. `https://ineco-backend.onrender.com`)
   - Սեղմեք "Create Static Site"
   - Սպասեք deployment-ին ավարտվելուն

6. **Database migrations**

   **Render Shell-ից:**

   - Render Dashboard -> ineco-backend -> Shell
   - Run:

   ```bash
   npx prisma migrate deploy
   ```

   **Կամ Local Terminal-ից:**

   ```bash
   cd backend
   # Set DATABASE_URL environment variable to your Render database Internal URL
   export DATABASE_URL="postgresql://user:password@host:5432/database"
   npx prisma migrate deploy
   ```

   **Եթե ցանկանում եք seed անել (optional):**

   ```bash
   npm run prisma:seed
   ```

### Option 2: Railway (Alternative)

Railway-ն նույնպես ապահովում է անվճար tier:

1. Գնացեք https://railway.app
2. Sign up with GitHub
3. New Project -> Deploy from GitHub repo
4. Add PostgreSQL service
5. Add backend service (configure similar to Render)
6. Deploy frontend as static site

### Option 3: Fly.io (Alternative)

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Sign up: `fly auth signup`
3. Deploy backend: `fly launch` in backend directory
4. Deploy frontend: `fly launch` in frontend directory

---

## Environment Variables Setup

### Backend (.env)

```env
NODE_ENV=production
PORT=4000
JWT_SECRET=your-secret-key-here
DATABASE_URL=postgresql://user:password@host:5432/database
```

### Frontend (.env)

```env
VITE_API_URL=https://your-backend-url.onrender.com
```

---

## Post-Deployment Checklist

- [ ] Backend health check: `https://your-backend.onrender.com/health`
- [ ] Frontend loads correctly
- [ ] Login functionality works
- [ ] API calls from frontend work
- [ ] Database migrations completed
- [ ] CORS configured correctly (already done in backend)

---

## Troubleshooting

### Backend չի start լինում

- Ստուգեք `PORT` environment variable-ը
- Render-ում default port-ը `10000` է, բայց կարող է փոխվել
- Ստուգեք logs-ը Render dashboard-ում

### Frontend-ից API calls չեն աշխատում

- Ստուգեք `VITE_API_URL` environment variable-ը frontend-ում (Render dashboard-ում)
- **Պետք է լինի full URL** օր. `https://ineco-backend.onrender.com` (not `/api`)
- Ստուգեք CORS settings backend-ում (արդեն configured է)
- Browser console-ում ստուգեք errors
- Frontend-ը rebuild անելուց հետո ստուգեք որ environment variable-ը correct է

### Database connection issues

- Ստուգեք `DATABASE_URL`-ը
- Render-ում օգտագործեք "Internal Database URL" (not External)
- Ստուգեք որ migrations run են

---

## Notes

- Free tier-ում Render services-ը "sleep" լինում են 15 րոպե inactivity-ից հետո
- Առաջին request-ը կարող է լինել slow (cold start)
- Database-ը միշտ active է free tier-ում
