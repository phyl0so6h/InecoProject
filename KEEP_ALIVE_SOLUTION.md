# Render Keep-Alive Solution - Անվճար

## 🔧 Render-ում մնալու համար (Keep-Alive)

Render-ի free tier-ում services-ը sleep են լինում, բայց կարող ենք օգտագործել **free uptime monitoring services**, որ ամեն 5-10 րոպե request-ներ ուղարկեն:

---

## Solution 1: UptimeRobot (Առաջարկվում է ⭐)

### Setup:

1. **Sign up:** https://uptimerobot.com (free)
2. **Add Monitor:**
   - **Monitor Type:** HTTP(s)
   - **Friendly Name:** Ineco Backend
   - **URL:** `https://ineco-backend.onrender.com/health`
   - **Monitoring Interval:** 5 minutes (ամենաքիչը)
3. **Save**

### Result:

- ✅ Backend-ը չի sleep լինի
- ✅ Ամեն 5 րոպե request-ը `/health` endpoint-ին
- ✅ **Completely free**

---

## Solution 2: Cron-job.org

### Setup:

1. **Sign up:** https://cron-job.org (free)
2. **Create Cron Job:**
   - **URL:** `https://ineco-backend.onrender.com/health`
   - **Schedule:** Every 14 minutes (`*/14 * * * *`)
3. **Save**

### Result:

- ✅ Backend-ը չի sleep լինի
- ✅ Request-ները ամեն 14 րոպե

---

## Solution 3: EasyCron (Free Tier)

1. **Sign up:** https://www.easycron.com
2. **Add Cron Job:**
   - **URL:** `https://ineco-backend.onrender.com/health`
   - **Schedule:** Every 10 minutes
3. **Save**

---

## Solution 4: GitHub Actions (Free, Self-Hosted)

Ստեղծեք GitHub Actions workflow, որ keep-alive request-ներ ուղարկի:

1. Create: `.github/workflows/keepalive.yml`
2. Content:
   ```yaml
   name: Keep Alive
   on:
     schedule:
       - cron: "*/10 * * * *" # Every 10 minutes
   jobs:
     keepalive:
       runs-on: ubuntu-latest
       steps:
         - name: Ping Backend
           run: |
             curl https://ineco-backend.onrender.com/health
   ```

---

## 📊 Comparison:

| Service            | Free Tier      | Interval | Setup Difficulty |
| ------------------ | -------------- | -------- | ---------------- |
| **UptimeRobot**    | ✅ 50 monitors | 5 min    | Easy ⭐          |
| **Cron-job.org**   | ✅ Limited     | Custom   | Easy             |
| **EasyCron**       | ✅ Limited     | 10 min   | Easy             |
| **GitHub Actions** | ✅ Unlimited   | Custom   | Medium           |

## 🎯 Recommendation:

**UptimeRobot** - ամենահեշտը և ամենալավը:

- ✅ Free tier-ով 50 monitors
- ✅ 5 րոպե interval
- ✅ Email alerts
- ✅ Dashboard-ով monitoring

---

## ⚠️ Important Notes:

1. **Render's Terms:** Keep-alive services-ը allowed են
2. **Resource Usage:** Minimal (just `/health` endpoint)
3. **Cost:** Completely free
4. **Effectiveness:** Backend-ը չի sleep լինի

---

## 🚀 Alternative: Migrate to Railway

Եթե ցանկանում եք ավելի լավ solution, migrate անեք **Railway.app**-ում:

- ✅ No sleep (built-in)
- ✅ $5/month free credit
- ✅ Faster cold start

See `RAILWAY_DEPLOY.md` for migration guide.
