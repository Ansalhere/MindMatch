-- Create a function to handle newsletter subscription inserts
CREATE OR REPLACE FUNCTION public.insert_newsletter_subscription(email_address TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.newsletter_subscriptions (email)
  VALUES (email_address);
EXCEPTION 
  WHEN unique_violation THEN
    RAISE EXCEPTION 'Email already subscribed';
END;
$$;