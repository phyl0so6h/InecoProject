# Frontend Events Issue - Debug Guide

## ✅ Backend աշխատում է

Backend-ը events-ները բերում է: `{"items":[...],"total":44}`

## ❌ Frontend-ում չի ցուցադրվում

### Հավանական պատճառներ:

1. **VITE_API_URL չի set-ված Render-ում**
2. **Frontend rebuild չի եղել** environment variable-ը set-ելուց հետո
3. **Browser cache issue**
4. **CORS error** (բայց հավանաբար ոչ, քանի որ backend-ը CORS enabled է)

## 🔧 Լուծում:

### Step 1: Ստուգեք Render Dashboard-ում

1. Գնացեք **Render Dashboard** → `ineco-frontend` → **Environment**
2. Ստուգեք `VITE_API_URL` variable-ը:

   - **Key:** `VITE_API_URL`
   - **Value:** `https://your-backend-url.onrender.com` (առանց trailing slash)
   - Example: `https://ineco-backend.onrender.com`

3. **Եթե չկա**, ավելացրեք:

   - Add Environment Variable
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-url.onrender.com` (copy backend URL-ը)
   - **Save Changes**

4. **Frontend-ը կ rebuild լինի ավտոմատ** (սպասեք 2-3 րոպե)

### Step 2: Browser-ում Debug

1. **Browser Console (F12):**

   - Console tab-ում ստուգեք errors
   - Network tab-ում ստուգեք requests:
     - `GET /api/events` - պետք է 200 OK
     - Response-ը պետք է լինի events array

2. **Hard Refresh:**
   - **Windows/Linux:** `Ctrl + Shift + R`
   - **Mac:** `Cmd + Shift + R`
   - Կամ Clear Cache

### Step 3: Ստուգեք Frontend Build Logs

Render Dashboard → `ineco-frontend` → **Logs**

- Ստուգեք build logs-ում, որ `VITE_API_URL`-ը կարդացվում է
- Build successful է:

### Step 4: Test Directly

Browser Console-ում (F12) run արեք:

```javascript
// Ստուգեք VITE_API_URL-ը
console.log(import.meta.env.VITE_API_URL);

// Test API call
fetch(`${import.meta.env.VITE_API_URL || "/api"}/api/events`)
  .then((r) => r.json())
  .then((d) => console.log("Events:", d.items?.length || 0, "items"))
  .catch((e) => console.error("Error:", e));
```

## 📋 Checklist:

- [ ] `VITE_API_URL` set-ված է Render Dashboard-ում
- [ ] Frontend rebuild եղել է (Render logs-ում)
- [ ] Browser-ում hard refresh արել եք
- [ ] Browser Console-ում errors չկան
- [ ] Network tab-ում `/api/events` request-ը 200 OK է

## ⚠️ Հատուկ Նշումներ:

1. **Environment Variables-ը Vite-ում** build time-ում inject են լինում
2. Եթե variable-ը set-ելուց **հետո** rebuild չի եղել, հին build-ը օգտագործում է
3. **Manual Deploy** արեք Render-ում, եթե ավտոմատ rebuild չի աշխատում

## 🚀 Quick Fix:

1. Render Dashboard → `ineco-frontend`
2. Manual Deploy → Deploy latest commit
3. Սպասեք build-ին (2-3 րոպե)
4. Browser-ում hard refresh
