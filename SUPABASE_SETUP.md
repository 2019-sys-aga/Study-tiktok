# 🚀 Supabase Setup Guide for StudyTok

## 📋 Prerequisites
1. Create a free Supabase account at [supabase.com](https://supabase.com)
2. Create a new project in your Supabase dashboard

## 🔧 Step 1: Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Click on "Settings" → "API"
3. Copy your:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **Anon Key** (public key, safe to use in frontend)

## 🔐 Step 2: Set Up Environment Variables

Create a `.env.local` file in your project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 🗄️ Step 3: Create Database Tables

Run these SQL commands in your Supabase SQL Editor:

### Users Table (handled by Supabase Auth)
```sql
-- Users are automatically created by Supabase Auth
-- No need to create a users table manually
```

### User Stats Table
```sql
CREATE TABLE user_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  decks_completed INTEGER DEFAULT 0,
  cards_studied INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own stats" ON user_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own stats" ON user_stats
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats" ON user_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Study Progress Table
```sql
CREATE TABLE study_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  deck_id UUID NOT NULL,
  deck_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  completed_cards INTEGER DEFAULT 0,
  total_cards INTEGER DEFAULT 0,
  score INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  last_studied TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE study_progress ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own progress" ON study_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON study_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON study_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Notifications Table
```sql
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('achievement', 'reminder', 'progress', 'social')) NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notifications" ON notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Study Decks Table
```sql
CREATE TABLE study_decks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Advanced')) NOT NULL,
  total_cards INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE study_decks ENABLE ROW LEVEL SECURITY;

-- Create policies (public read, authenticated write)
CREATE POLICY "Anyone can view decks" ON study_decks
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create decks" ON study_decks
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own decks" ON study_decks
  FOR UPDATE USING (auth.uid() = created_by);
```

### Study Cards Table
```sql
CREATE TABLE study_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deck_id UUID REFERENCES study_decks(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  type TEXT CHECK (type IN ('mcq', 'text', 'image')) NOT NULL,
  options JSONB,
  correct_answer TEXT,
  explanation TEXT,
  difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Advanced')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE study_cards ENABLE ROW LEVEL SECURITY;

-- Create policies (public read, authenticated write)
CREATE POLICY "Anyone can view cards" ON study_cards
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create cards" ON study_cards
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update cards" ON study_cards
  FOR UPDATE WITH CHECK (auth.role() = 'authenticated');
```

## 🔄 Step 4: Insert Sample Data

```sql
-- Insert sample study decks
INSERT INTO study_decks (title, subject, description, difficulty, total_cards, created_by) VALUES
('Calculus Mastery', 'Mathematics', 'Master calculus with interactive problems', 'Advanced', 25, (SELECT id FROM auth.users LIMIT 1)),
('Physics Fundamentals', 'Physics', 'Learn the basics of physics', 'Medium', 20, (SELECT id FROM auth.users LIMIT 1)),
('Chemistry Lab', 'Chemistry', 'Explore chemistry through experiments', 'Easy', 15, (SELECT id FROM auth.users LIMIT 1)),
('Biology Basics', 'Biology', 'Understand life sciences', 'Medium', 18, (SELECT id FROM auth.users LIMIT 1));

-- Insert sample study cards
INSERT INTO study_cards (deck_id, question, answer, type, options, correct_answer, difficulty) VALUES
((SELECT id FROM study_decks WHERE title = 'Calculus Mastery' LIMIT 1), 
 'What is the derivative of x²?', '2x', 'mcq', 
 '["x", "2x", "x²", "2x²"]', '2x', 'Easy'),
((SELECT id FROM study_decks WHERE title = 'Physics Fundamentals' LIMIT 1), 
 'What is Newton''s first law?', 'An object at rest stays at rest', 'text', 
 NULL, NULL, 'Easy');
```

## 🚀 Step 5: Test the Connection

Your StudyTok app is now ready to connect to Supabase! The app will:

1. ✅ **Authenticate users** with email/password
2. ✅ **Store study progress** and sync across devices
3. ✅ **Track user stats** and achievements
4. ✅ **Send notifications** for progress updates
5. ✅ **Load study decks** from the database
6. ✅ **Real-time updates** for collaborative features

## 🔧 Troubleshooting

- Make sure your `.env.local` file is in the project root
- Restart your development server after adding environment variables
- Check Supabase logs for any database errors
- Verify RLS policies are correctly set up

## 🎉 You're All Set!

Your StudyTok app now has a complete backend with Supabase! 🚀
