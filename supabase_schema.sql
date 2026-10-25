-- ==============================================================================
-- PRAGNYA ICSE 10TH BOARD STUDY TRACKER - SUPABASE DATABASE SCHEMA
-- ==============================================================================
-- Run this entire script in your Supabase Project -> SQL Editor -> Click 'Run'.
-- It will create:
-- 1. `study_sessions` table (tracks daily study time subject-wise)
-- 2. `mock_paper_entries` table (tracks sample papers and prelim marks)
-- 3. Row Level Security (RLS) policies allowing read/write with publishable/anon key.
-- ==============================================================================

-- 1. Create the Study Sessions Table
CREATE TABLE IF NOT EXISTS public.study_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name TEXT DEFAULT 'Pragnya' NOT NULL,
    subject TEXT NOT NULL,
    chapter_topic TEXT,
    duration_minutes NUMERIC NOT NULL,
    study_date DATE DEFAULT CURRENT_DATE NOT NULL,
    study_type TEXT DEFAULT 'Self Study', -- 'Self Study', 'Problem Solving', 'Revision', 'Sample Paper', 'Doubts Clearing'
    efficiency_rating INTEGER DEFAULT 5,  -- 1 to 5 scale
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create the Mock Paper & Marks Entries Table
CREATE TABLE IF NOT EXISTS public.mock_paper_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name TEXT DEFAULT 'Pragnya' NOT NULL,
    subject TEXT NOT NULL,
    paper_name TEXT NOT NULL,             -- e.g. 'Educart Mock 1', 'School Pre-board 1', 'Oswaal Specimen 2026'
    test_date DATE DEFAULT CURRENT_DATE NOT NULL,
    marks_obtained NUMERIC NOT NULL,
    max_marks NUMERIC DEFAULT 80 NOT NULL,
    percentage NUMERIC,
    time_taken_minutes NUMERIC,
    weak_areas TEXT,
    strong_areas TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexing for rapid queries by date and subject
CREATE INDEX IF NOT EXISTS idx_study_sessions_date ON public.study_sessions(study_date DESC);
CREATE INDEX IF NOT EXISTS idx_study_sessions_subject ON public.study_sessions(subject);
CREATE INDEX IF NOT EXISTS idx_mock_papers_date ON public.mock_paper_entries(test_date DESC);
CREATE INDEX IF NOT EXISTS idx_mock_papers_subject ON public.mock_paper_entries(subject);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_paper_entries ENABLE ROW LEVEL SECURITY;

-- 4. Create Open Access Policies for the Client Web App
-- (Allows reading and inserting/updating via publishable/anon key)
DROP POLICY IF EXISTS "Allow public read access for study_sessions" ON public.study_sessions;
CREATE POLICY "Allow public read access for study_sessions"
    ON public.study_sessions FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Allow public insert for study_sessions" ON public.study_sessions;
CREATE POLICY "Allow public insert for study_sessions"
    ON public.study_sessions FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update for study_sessions" ON public.study_sessions;
CREATE POLICY "Allow public update for study_sessions"
    ON public.study_sessions FOR UPDATE
    USING (true);

DROP POLICY IF EXISTS "Allow public delete for study_sessions" ON public.study_sessions;
CREATE POLICY "Allow public delete for study_sessions"
    ON public.study_sessions FOR DELETE
    USING (true);

DROP POLICY IF EXISTS "Allow public read access for mock_paper_entries" ON public.mock_paper_entries;
CREATE POLICY "Allow public read access for mock_paper_entries"
    ON public.mock_paper_entries FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Allow public insert for mock_paper_entries" ON public.mock_paper_entries;
CREATE POLICY "Allow public insert for mock_paper_entries"
    ON public.mock_paper_entries FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update for mock_paper_entries" ON public.mock_paper_entries;
CREATE POLICY "Allow public update for mock_paper_entries"
    ON public.mock_paper_entries FOR UPDATE
    USING (true);

DROP POLICY IF EXISTS "Allow public delete for mock_paper_entries" ON public.mock_paper_entries;
CREATE POLICY "Allow public delete for mock_paper_entries"
    ON public.mock_paper_entries FOR DELETE
    USING (true);
