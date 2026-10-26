# 🐞 Pragnya ICSE 10th Study & Marks Tracker (Miraculous Ladybug Edition)

A high-performance, zero-build client-side web application designed for **Pragnya's ICSE Grade 10 Board preparation**. Tracks subject-wise and day-wise study time, logs sample paper & pre-board marks, and syncs directly to **Supabase** via stored credentials in `localStorage` (just like FitMetrics / Nutrition Tracker).

---

## ✨ Features

- 🐞 **Miraculous Ladybug Theme**: Parisian aesthetics, Crimson Red & Cat Noir Neon Green accents, motivational quotes from Marinette, Tikki & Plagg.
- ⏱️ **"Spots On!" Live Study Timer & Stopwatch**: Real-time timer with subject selector and auto-log to database upon completion.
- 📊 **Day-Wise & Subject-Wise Time Measurement**:
  - Interactive Daily Study Time Bar Chart with a 4.5-hour target reference line (switchable 7d, 14d, 30d views).
  - Subject Time Share Doughnut Chart (Maths, Physics, Chemistry, Biology, History, Geography, Hindi, English, Computer Applications).
  - Weekday study consistency chart (Monday to Sunday).
  - Subject hours ranking leaderboard.
- 🏆 **Sample Paper Marks Entries**:
  - Log sample papers (Educart, Oswaal, School Prelims, CISCE Specimen 2026).
  - Auto-calculated percentage, grades (Distinction / First Class), and time taken.
  - Track weak areas and error analysis to focus revisions.
  - Score trajectory line chart with 90% distinction target line.
  - Subject-by-subject average score comparison bar chart.
- ☁️ **Supabase Cloud Sync (Zero Node)**:
  - Connects directly to Supabase using client-side ES Modules (`@supabase/supabase-js`).
  - URL and Anon Key stored securely in browser `localStorage`.
  - Built-in offline local storage fallback if disconnected.
  - In-app SQL Schema viewer and copy button.

---

## 🚀 Step 1: Set Up Supabase Database

1. Open your Supabase Dashboard at [supabase.com](https://supabase.com/).
2. Select your project (or create a new one).
3. Navigate to **SQL Editor** on the left menu.
4. Copy and paste the contents of [`supabase_schema.sql`](./supabase_schema.sql) and click **Run**.
5. Copy your **Project URL** and **anon / public API Key** from `Project Settings -> API`.

---

## 🌐 Step 2: Deploy to GitHub Pages (Zero Node Required)

This project has no build steps and runs purely on HTML, CSS, and modern JavaScript ES modules:

1. Create a new GitHub repository named `pragnya-icse-dashboard` (or any name you prefer) under your GitHub account (`Nitin16May`).
2. Push this folder to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Pragnya ICSE 10th Study Tracker"
   git branch -M main
   git remote add origin https://github.com/Nitin16May/pragnya-icse-dashboard.git
   git push -u origin main
   ```
3. In GitHub, go to **Settings** -> **Pages**.
4. Under **Build and deployment -> Source**, select **Deploy from a branch**.
5. Under **Branch**, select `main` and root `/(root)`, then click **Save**.
6. Your web application will be live at:
   `https://Nitin16May.github.io/pragnya-icse-dashboard/`

---

## 🔑 Step 3: Connect Supabase in the Web App

1. Open the website on your phone, tablet, or laptop.
2. Click the **Database Settings** button in the top right.
3. Paste your **Supabase Project URL** and **Anon Key**.
4. Click **Save & Test Connection**.
5. Done! You will see the green "Supabase Connected" indicator. All logged sessions and sample paper scores will now sync live!

---

## 🤖 Optional: External Voice / ChatGPT Logging

You can log study sessions directly using this simple curl or Python request (great for Siri Shortcuts or custom ChatGPT GPTs):

```bash
curl -X POST 'https://YOUR_SUPABASE_URL.supabase.co/rest/v1/study_sessions' \
  -H "apikey: YOUR_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=minimal" \
  -d '{
    "student_name": "Pragnya",
    "subject": "Mathematics",
    "chapter_topic": "Circles - Tangents and Secants",
    "duration_minutes": 90,
    "study_date": "2026-10-25",
    "study_type": "Problem Solving",
    "efficiency_rating": 5,
    "notes": "Solved ML Aggarwal questions"
  }'
```
