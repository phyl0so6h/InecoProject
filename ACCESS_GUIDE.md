# Ինչպես մուտք գործել Deployed Application-ին / How to Access Deployed Application

## 🚀 Backend URL (API)

Render Dashboard-ից գտեք backend service-ի URL-ը:

1. Գնացեք https://dashboard.render.com
2. Սեղմեք `ineco-backend` service
3. URL-ը կլինի ավտոմատ, օրինակ: `https://ineco-backend.onrender.com`

### Test Backend:

```bash
# Health check
curl https://your-backend-url.onrender.com/health

# Should return: {"ok":true}
```

## 🌐 Frontend URL (Website)

Render Dashboard-ից գտեք frontend static site-ի URL-ը:

1. Գնացեք https://dashboard.render.com
2. Սեղմեք `ineco-frontend` service
3. URL-ը կլինի ավտոմատ, օրինակ: `https://ineco-frontend.onrender.com`

### Browser-ում բացեք:

- Գնացեք frontend URL-ը ձեր browser-ում
- Example: `https://ineco-frontend.onrender.com`

## 🔐 Login Credentials (Test Accounts)

Application-ում կան demo accounts:

### Admin Account:

- **Email:** `admin@admin.com`
- **Password:** `admin`

### User Account:

- **Email:** `user@user.com`
- **Password:** `user`

### Provider Account:

- **Email:** `provider@provider.com`
- **Password:** `provider`

## ✅ Deployment Status Check

### 1. Ստուգեք Backend-ը:

- Render Dashboard → `ineco-backend` → Status-ը պետք է լինի **"Live"** կամ **"Running"**
- Logs-ում չպետք է լինեն errors
- Health check: `https://your-backend.onrender.com/health`

### 2. Ստուգեք Frontend-ը:

- Render Dashboard → `ineco-frontend` → Status-ը պետք է լինի **"Live"**
- Environment Variable-ը set-ված է:
  - `VITE_API_URL` = `https://your-backend.onrender.com`

### 3. Ստուգեք Database-ը:

- Render Dashboard → `ineco-db` → Status-ը պետք է լինի **"Available"**

## 🔧 Եթե Frontend չի աշխատում

### Problem: API calls չեն աշխատում

**Solution:**

1. Render Dashboard → `ineco-frontend` → Environment
2. Ստուգեք `VITE_API_URL`-ը:
   - Պետք է լինի: `https://ineco-backend.onrender.com` (without trailing slash)
3. Եթե չկա, ավելացրեք:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-url.onrender.com`
4. Save changes (frontend-ը կ rebuild լինի)

### Problem: CORS errors

**Solution:** Backend-ում CORS արդեն configured է, բայց ստուգեք:

- Browser console-ում errors
- Network tab-ում failed requests

## 📱 Հեռավար Միանալու համար

### Ցանկացած մեկը կարող է մուտք գործել:

1. **Frontend URL-ը share արեք** (օր. `https://ineco-frontend.onrender.com`)
2. **Browser-ում բացեք** URL-ը
3. **Login արեք** demo credentials-ով
4. **Օգտագործեք** application-ը

### Public Access:

- ✅ Frontend-ը **public** է - ցանկացած մեկը կարող է մուտք գործել
- ✅ Backend API-ն **public** է - բայց authentication required է որոշ endpoints-ների համար
- ✅ Database-ը **private** է (Render-ի internal network-ում)

## 🧪 Quick Test

### Browser Console Test:

1. Բացեք frontend URL-ը
2. Browser Console-ում (F12) run արեք:

```javascript
fetch("https://your-backend.onrender.com/health")
  .then((r) => r.json())
  .then(console.log);
// Should output: {ok: true}
```

### Login Test:

1. Frontend-ում գնացեք Login page
2. Login արեք `admin@admin.com` / `admin`
3. Պետք է redirect լինի և authenticated լինեք

## 📞 Support

Եթե issues ունեք:

1. Ստուգեք Render Dashboard-ում Logs
2. Browser Console-ում errors
3. Network tab-ում failed requests

## 🎉 Success Checklist

- [ ] Backend service is Live
- [ ] Frontend service is Live
- [ ] Health check returns `{"ok":true}`
- [ ] Frontend loads in browser
- [ ] Login works with demo credentials
- [ ] API calls from frontend work
- [ ] No CORS errors in browser console
