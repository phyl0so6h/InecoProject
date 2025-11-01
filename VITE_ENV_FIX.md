# VITE_API_URL Issue - 404 Error Fix

## ❌ Problem:

Frontend-ը ստանում է **404 error** events fetch-ի ժամանակ, քանի որ `VITE_API_URL`-ը set-ված չէ Render-ում:

## ✅ Solution:

### Step 1: Render Dashboard-ում set արեք Environment Variable

1. **Render Dashboard** → `ineco-frontend` service
2. **Environment** tab
3. **Add Environment Variable:**
   - **Key:** `VITE_API_URL`
   - **Value:** `https://ineco-backend.onrender.com` (կամ ձեր backend URL-ը)
   - ⚠️ **Չպետք է լինի trailing slash** (`/` վերջում)
   - ⚠️ **Չպետք է լինի** `/api` path-ը
4. **Save Changes**

### Step 2: Manual Deploy

Environment variable-ը set-ելուց **հետո**:

1. **Render Dashboard** → `ineco-frontend`
2. **Manual Deploy** → **Deploy latest commit**
3. Սպասեք rebuild-ին (2-3 րոպե)

### Step 3: Verify

Browser Console-ում (F12) run արեք:

```javascript
console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
```

Պետք է տեսնեք:

- ✅ `https://ineco-backend.onrender.com` (եթե set-ված է)
- ❌ `undefined` (եթե չի set-ված)

### Step 4: Test

Browser-ում:

- Hard Refresh: `Cmd+Shift+R` (Mac) կամ `Ctrl+Shift+R` (Windows)
- Console-ում պետք է տեսնեք: `Events response: {items: [...], total: 44}`

## 🔍 Why This Happens:

1. **Vite environment variables** inject են լինում **build time**-ում
2. Եթե variable-ը չի set-ված build-ի ժամանակ, default value-ն է օգտագործվում (`/api`)
3. Production-ում `/api` relative path-ը չի աշխատում, պետք է full URL
4. **Rebuild պետք է լինի** variable set-ելուց հետո

## ✅ Correct Configuration:

**Render Dashboard → ineco-frontend → Environment:**

```
Key: VITE_API_URL
Value: https://ineco-backend.onrender.com
```

**NOT:**

- ❌ `https://ineco-backend.onrender.com/` (trailing slash)
- ❌ `https://ineco-backend.onrender.com/api` (with /api)
- ❌ `/api` (relative path)
- ❌ Empty/undefined

## 🚨 Quick Check:

Browser Console-ում:

```javascript
// Check what URL is being used
console.log("API URL:", import.meta.env.VITE_API_URL || "/api");

// Test the actual fetch
fetch(`${import.meta.env.VITE_API_URL || "/api"}/api/events`)
  .then((r) => {
    console.log("Status:", r.status, r.ok);
    return r.json();
  })
  .then((d) => console.log("Events:", d.items?.length || 0))
  .catch((e) => console.error("Error:", e));
```

Если ստանում եք **404**, ուրեմն `apiUrl`-ը `/api` է (default), ոչ թե full backend URL:
