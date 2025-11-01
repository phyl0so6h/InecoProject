# API Endpoints Verification

## ✅ Correct Endpoints Mapping:

### Authentication:

- Frontend: `${apiUrl}/auth/login` → Backend: `/auth/login` ✅

### Profile & Account:

- Frontend: `${apiUrl}/api/profile` → Backend: `/api/profile` ✅
- Frontend: `${apiUrl}/api/routes` → Backend: `/api/routes` ✅
- Frontend: `${apiUrl}/api/routes/:id` → Backend: `/api/routes/:id` ✅

### Events:

- Frontend: `${apiUrl}/api/events` → Backend: `/api/events` ✅
- Frontend: `${apiUrl}/api/events/:id` → Backend: `/api/events/:id` ✅
- Frontend: `${apiUrl}/api/events` (POST) → Backend: `/api/events` (POST) ✅
- Frontend: `${apiUrl}/api/events/:id` (DELETE) → Backend: `/api/events/:id` (DELETE) ✅

### Travel Plans:

- Frontend: `${apiUrl}/api/travel-plans` → Backend: `/api/travel-plans` ✅
- Frontend: `${apiUrl}/api/travel-plans/:id/join` → Backend: `/api/travel-plans/:id/join` ✅
- Frontend: `${apiUrl}/api/travel-plans` (POST) → Backend: `/api/travel-plans` (POST) ✅

### Attractions:

- Frontend: `${apiUrl}/api/attractions` → Backend: `/api/attractions` ✅
- Frontend: `${apiUrl}/api/attractions/:id` → Backend: `/api/attractions/:id` ✅

### Itinerary:

- Frontend: `${apiUrl}/api/itinerary` (POST) → Backend: `/api/itinerary` (POST) ✅

### Other:

- Frontend: `${apiUrl}/info` → Backend: `/info` ✅
- Frontend: `${apiUrl}/companions/search` → Backend: `/companions/search` ✅
- Frontend: `${apiUrl}/users` → Backend: `/users` ✅ (Admin only)

## 🔍 Debugging Steps:

1. **Check Browser Console (F12)**

   - Network tab: See which requests are failing
   - Console tab: Check for CORS or other errors

2. **Check API URL**

   - In Render Dashboard → `ineco-frontend` → Environment
   - Verify `VITE_API_URL` is set to: `https://your-backend.onrender.com`
   - Make sure there's NO trailing slash

3. **Test Backend Directly**

   ```
   curl https://your-backend.onrender.com/health
   curl https://your-backend.onrender.com/api/events
   ```

4. **Common Issues:**
   - CORS errors → Backend already has `app.use(cors())`
   - 404 errors → Check if endpoint has `/api` prefix
   - 401 errors → Check authentication token
   - 500 errors → Check backend logs in Render
