-- Create resume_builder_comments table for user feedback
CREATE TABLE public.resume_builder_comments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_avatar TEXT,
    comment TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    is_approved BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.resume_builder_comments ENABLE ROW LEVEL SECURITY;

-- Anyone can read approved comments
CREATE POLICY "Anyone can view approved comments" 
ON public.resume_builder_comments 
FOR SELECT 
USING (is_approved = true);

-- Users can view their own comments (approved or not)
CREATE POLICY "Users can view own comments" 
ON public.resume_builder_comments 
FOR SELECT 
USING (auth.uid() = user_id);

-- Authenticated users can insert their own comments
CREATE POLICY "Authenticated users can create comments" 
ON public.resume_builder_comments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own comments
CREATE POLICY "Users can update own comments" 
ON public.resume_builder_comments 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete own comments" 
ON public.resume_builder_comments 
FOR DELETE 
USING (auth.uid() = user_id);

-- Admin can manage all comments (using user_type check)
CREATE POLICY "Admin can manage all comments" 
ON public.resume_builder_comments 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND user_type = 'admin'
    )
);

-- Create trigger for updated_at
CREATE TRIGGER update_resume_builder_comments_updated_at
    BEFORE UPDATE ON public.resume_builder_comments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for performance
CREATE INDEX idx_resume_comments_approved ON public.resume_builder_comments(is_approved, created_at DESC);
CREATE INDEX idx_resume_comments_user ON public.resume_builder_comments(user_id);