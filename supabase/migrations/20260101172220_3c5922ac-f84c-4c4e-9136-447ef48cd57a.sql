-- Create email events table for tracking opens and clicks
CREATE TABLE public.email_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES public.email_campaigns(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'open',
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster analytics queries
CREATE INDEX idx_email_events_campaign_id ON public.email_events(campaign_id);
CREATE INDEX idx_email_events_created_at ON public.email_events(created_at);
CREATE INDEX idx_email_events_type ON public.email_events(event_type);

-- Enable RLS
ALTER TABLE public.email_events ENABLE ROW LEVEL SECURITY;

-- Allow public inserts for tracking pixel (no auth required)
CREATE POLICY "Allow tracking pixel inserts"
ON public.email_events
FOR INSERT
WITH CHECK (true);

-- Only admins can view events
CREATE POLICY "Admins can view email events"
ON public.email_events
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM users WHERE users.id = auth.uid() AND users.user_type = 'admin'
));

-- Add open_count and click_count to campaigns for quick stats
ALTER TABLE public.email_campaigns
ADD COLUMN IF NOT EXISTS open_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS unique_opens INTEGER DEFAULT 0;