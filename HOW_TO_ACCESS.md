# Ինչպես Մուտք Գործել Deployed Application-ին

## 📍 Քայլ 1: Գտեք URL-ները Render Dashboard-ում

1. **Գնացեք Render Dashboard:**

   - https://dashboard.render.com
   - Login արեք ձեր account-ով

2. **Գտեք Frontend URL-ը:**

   - Dashboard-ում գտեք `ineco-frontend` service
   - Սեղմեք դրա վրա
   - **URL-ը կլինի** site-ի վերևում, օրինակ: `https://ineco-frontend.onrender.com`
   - ⭐ **Այս URL-ը share արեք** - ցանկացած մեկը կարող է այս URL-ով մուտք գործել

3. **Գտեք Backend URL-ը (optional, testing-ի համար):**
   - Dashboard-ում գտեք `ineco-backend` service
   - URL-ը կլինի, օրինակ: `https://ineco-backend.onrender.com`

## 🌐 Քայլ 2: Բացեք Frontend-ը Browser-ում

1. **Copy արեք Frontend URL-ը** Render Dashboard-ից
2. **Browser-ում բացեք** այդ URL-ը (Chrome, Firefox, Safari, etc.)
3. **Պետք է տեսնեք** ձեր application-ի homepage-ը

## 🔐 Քայլ 3: Login արեք

Application-ում կան **demo accounts** testing-ի համար:

### Admin Account:

- **Email:** `admin@admin.com`
- **Password:** `admin`

### User Account:

- **Email:** `user@user.com`
- **Password:** `user`

### Provider Account:

- **Email:** `provider@provider.com`
- **Password:** `provider`

## ✅ Քայլ 4: Ստուգեք, որ ամեն ինչ աշխատում է

### Backend Health Check:

Browser-ում բացեք:

```
https://your-backend-url.onrender.com/health
```

Պետք է տեսնեք: `{"ok":true}`

### Frontend-ում ստուգեք:

1. ✅ Frontend-ը loads է
2. ✅ Login-ը աշխատում է
3. ✅ Events-ները load են լինում
4. ✅ Routes-ները աշխատում են

## 📱 Հեռավար Միանալու համար

### Ցանկացած մեկը կարող է մուտք գործել:

1. **Share արեք Frontend URL-ը:**

   - Render Dashboard → `ineco-frontend` → URL-ը
   - Օրինակ: `https://ineco-frontend.onrender.com`

2. **Նրանք browser-ում բացում են** URL-ը

3. **Login արեք** demo credentials-ով

4. **Օգտագործեք** application-ը

### ⚠️ Կարևոր: Frontend Environment Variable

Մինչ frontend-ը աշխատի, պետք է set արված լինի:

1. **Render Dashboard** → `ineco-frontend` → **Environment**
2. **Ստուգեք** `VITE_API_URL` variable-ը:
   - Key: `VITE_API_URL`
   - Value: `https://ineco-backend.onrender.com` (ձեր backend URL-ը)
3. **Եթե չկա**, ավելացրեք և save արեք (frontend-ը կ rebuild լինի)

## 🧪 Quick Test

### Terminal-ից test:

```bash
# Test backend health
curl https://your-backend-url.onrender.com/health

# Should return: {"ok":true}
```

### Browser Console-ում test:

1. Frontend-ը բացեք
2. F12 → Console
3. Run արեք:

```javascript
fetch("https://your-backend-url.onrender.com/health")
  .then((r) => r.json())
  .then(console.log);
```

## 📊 Deployment Status

Render Dashboard-ում ստուգեք:

- ✅ **ineco-backend**: Status = **"Live"** կամ **"Running"**
- ✅ **ineco-frontend**: Status = **"Live"**
- ✅ **ineco-db**: Status = **"Available"**

## 🔗 URL Format

Render-ում URL-ները սովորաբար այսպիսին են:

- Frontend: `https://ineco-frontend.onrender.com`
- Backend: `https://ineco-backend.onrender.com`

(Ամեն service-ի համար Render-ը unique URL է տալիս)

## ⚡ Free Tier Notes

- **Cold Start:** Առաջին request-ը կարող է լինել slow (10-30 վայրկյան)
- **Auto Sleep:** 15 րոպե inactivity-ից հետո services-ը sleep են լինում
- **Wake Up:** Հաջորդ request-ը ավտոմատ wake up է անում (բայց slow է լինում)

## 🎉 Success!

Եթե բոլոր services-ները "Live" են և frontend-ը բացվում է browser-ում, ուրեմն ամեն ինչ աշխատում է!

**Հիմա ցանկացած մեկը կարող է մուտք գործել frontend URL-ով!** 🚀
