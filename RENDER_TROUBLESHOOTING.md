# Render Deployment Troubleshooting Guide

## Common Issues and Solutions

### 1. Build Failures

#### TypeScript Compilation Errors

**Symptoms:** Build fails with TypeScript errors
**Solution:**

```bash
# Test locally first
cd backend
npm run build
```

#### Missing Dependencies

**Symptoms:** `npm install` fails
**Solution:** Check `package.json` for all dependencies

### 2. Runtime Failures

#### Port Binding Issues

**Symptoms:** Service won't start
**Solution:**

- Render automatically sets `PORT` environment variable
- Backend code already uses `process.env.PORT || 4000`
- ✅ This should work

#### Health Check Fails

**Symptoms:** Health check returns non-200
**Solution:**

- Verify `/health` endpoint exists (✅ it does in index.ts)
- Check logs for startup errors

### 3. Environment Variables

#### Missing DATABASE_URL

**Symptoms:** Backend fails to start (if using database)
**Current Status:** Backend doesn't use database currently (uses mock data)
**Note:** DATABASE_URL is configured but not required for startup

#### Missing JWT_SECRET

**Symptoms:** Authentication fails
**Solution:** Render auto-generates this with `generateValue: true`
**Check:** Verify it's set in Render dashboard

### 4. Deployment Specific Checks

#### Check Build Logs in Render:

1. Go to Render Dashboard → ineco-backend → Logs
2. Look for:
   - Build errors (npm install, TypeScript compilation)
   - Runtime errors (startup failures)
   - Port binding errors

#### Common Build Errors:

**Error: "Command failed: npm install"**

- Check if all dependencies are in package.json
- Try updating npm/node versions

**Error: "Cannot find module"**

- Ensure all imports are correct
- Check TypeScript compilation output

**Error: "Port already in use"**

- Render handles this automatically
- Should not occur with current setup

### 5. Quick Debug Steps

1. **Test Build Locally:**

   ```bash
   cd backend
   npm install
   npm run build
   ```

2. **Test Start Locally:**

   ```bash
   npm start
   # Should see: "API running on :4000"
   ```

3. **Check Render Logs:**

   - Build Logs: Check for compilation errors
   - Runtime Logs: Check for startup errors

4. **Verify Environment Variables:**
   - NODE_ENV=production ✅
   - JWT_SECRET (auto-generated) ✅
   - DATABASE_URL (from database) ✅

### 6. If Backend Still Fails

#### Option A: Simplify build (remove DATABASE_URL temporarily)

Since backend doesn't use database:

- Remove DATABASE_URL from render.yaml temporarily
- Deploy
- Add it back later when needed

#### Option B: Check Render Logs

Share the exact error from Render logs tab

#### Option C: Manual Deployment

Instead of Blueprint, deploy manually:

1. Create Web Service manually
2. Set environment variables manually
3. Connect GitHub repo
4. Use same build/start commands

### Current Configuration Status

✅ **Build Command:** `npm install && npm run build`
✅ **Start Command:** `npm start`
✅ **Health Check:** `/health`
✅ **Port:** Auto-set by Render
✅ **Environment Variables:**

- NODE_ENV ✅
- JWT_SECRET (auto-generated) ✅
- DATABASE_URL (from database) ✅

### Next Steps

1. Check Render Dashboard → ineco-backend → Logs
2. Look for the specific error message
3. Share the error if deployment still fails
4. We can fix based on the specific error
