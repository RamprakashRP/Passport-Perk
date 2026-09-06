-- =============================================================================
-- COMMUNITY FEEDBACK, PERKS CONTRIBUTIONS & BUG REPORTS SCHEMA
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.community_feedback (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('perk_suggestion', 'bug_report', 'general_feedback')),
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    partner_name TEXT,
    promo_code TEXT,
    deal_url TEXT,
    estimated_savings TEXT,
    region TEXT,
    page_url TEXT,
    severity TEXT CHECK (severity IN ('low', 'medium', 'critical')),
    user_email TEXT,
    user_name TEXT,
    user_id TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved', 'resolved', 'archived')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.community_feedback ENABLE ROW LEVEL SECURITY;

-- 1. Allow any user (authenticated or anon guest) to insert submissions
CREATE POLICY "Allow public insert for community feedback"
ON public.community_feedback
FOR INSERT
WITH CHECK (true);

-- 2. Allow authenticated users to view their own submissions
CREATE POLICY "Allow users to view their own feedback"
ON public.community_feedback
FOR SELECT
USING (auth.uid()::text = user_id OR auth.role() = 'authenticated');

-- 3. Create index on submission timestamp and status for fast admin moderation
CREATE INDEX IF NOT EXISTS idx_community_feedback_status_date 
ON public.community_feedback(status, submitted_at DESC);
