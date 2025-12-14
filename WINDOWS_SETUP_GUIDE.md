# 🪟 Windows Setup Guide

Since Supabase CLI can't be installed via npm on Windows, here are alternative methods:

---

## Option 1: Install via Scoop (Recommended for Windows)

### Install Scoop (if not already installed):
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex
```

### Install Supabase CLI:
```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

---

## Option 2: Manual Installation (Alternative)

1. Go to: https://github.com/supabase/cli/releases/latest
2. Download the Windows executable (`.exe` file)
3. Extract and add to your PATH, or use it directly

---

## Option 3: Use Supabase Dashboard (No CLI Required!)

You can complete the setup **without installing the CLI** using the Supabase Dashboard:

### For Database Migrations:
1. Go to Supabase Dashboard → SQL Editor
2. Copy SQL from migration files in `supabase/migrations/`
3. Run them one by one in SQL Editor

### For Edge Functions:
1. Go to Supabase Dashboard → Edge Functions
2. Create each function manually:
   - Copy code from `supabase/functions/generate-scenes/index.ts`
   - Paste in Dashboard → Edge Functions → New Function
   - Name it `generate-scenes`
   - Repeat for: `generate-image`, `text-to-speech`, `compose-video`

### For Secrets:
1. Go to Supabase Dashboard → Edge Functions → Secrets
2. Add each secret:
   - `GEMINI_API_KEY` = your key
   - `OPENAI_API_KEY` = your key
   - `SHOTSTACK_API_KEY` = your key

---

## Recommended: Use Dashboard Method

Since you're on Windows, I recommend using the **Dashboard method (Option 3)** - it's easier and doesn't require CLI installation!

---

Would you like me to guide you through the Dashboard setup method instead?
