-- Create analytics events table to track user interactions on resume builder
CREATE TABLE public.resume_builder_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  session_id TEXT,
  page_url TEXT,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_resume_builder_analytics_event_type ON public.resume_builder_analytics(event_type);
CREATE INDEX idx_resume_builder_analytics_created_at ON public.resume_builder_analytics(created_at DESC);
CREATE INDEX idx_resume_builder_analytics_user_id ON public.resume_builder_analytics(user_id);

-- Enable RLS
ALTER TABLE public.resume_builder_analytics ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert analytics events (anonymous tracking)
CREATE POLICY "Anyone can insert analytics events"
ON public.resume_builder_analytics
FOR INSERT
WITH CHECK (true);

-- Only admins can view analytics
CREATE POLICY "Admins can view all analytics"
ON public.resume_builder_analytics
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() 
    AND users.user_type = 'admin'
  )
);