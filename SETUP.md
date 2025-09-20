# Quick Setup Guide

## 🚀 **The app is now working!**

The dog food tracker is currently running in **local mode** using localStorage. You can use all features immediately:

- ✅ Add family members
- ✅ Track purchases
- ✅ Rotate turns
- ✅ View purchase history
- ✅ Mobile responsive design

## 🔄 **To Enable Real-time Collaboration (Optional)**

If you want real-time updates across multiple devices, set up Supabase:

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for it to be ready

### 2. Set up Database
1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the entire contents of `supabase-schema.sql`
3. Paste and run it

### 3. Get API Keys
1. Go to **Settings** → **API**
2. Copy your **Project URL** and **anon public** key

### 4. Create Environment File
Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Restart the App
```bash
npm run dev
```

The yellow "Local Mode" notice will disappear and you'll have real-time collaboration!

## 🎯 **Current Status**

- **Local Mode**: ✅ Working (data saved to browser)
- **Real-time Mode**: ⏳ Ready to enable (just add Supabase credentials)

## 📱 **Features Available Now**

- Family member management
- Turn rotation system
- Purchase tracking
- Due date monitoring
- Purchase history
- Mobile responsive design
- Beautiful purple/blue theme

Enjoy your dog food tracker! 🐕
