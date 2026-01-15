import { useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/useUser';

// Generate a session ID for anonymous tracking
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

export type AnalyticsEventType = 
  | 'page_view'
  | 'template_select'
  | 'download_click'
  | 'download_success'
  | 'premium_gate_shown'
  | 'premium_upgrade_click'
  | 'premium_upgrade_success'
  | 'auth_gate_shown'
  | 'create_account_click'
  | 'login_click'
  | 'ats_check_click'
  | 'ats_check_success'
  | 'job_tailor_click'
  | 'job_tailor_success'
  | 'load_profile_click'
  | 'upload_resume_click'
  | 'tab_change'
  | 'template_modal_open'
  | 'tailor_modal_open';

interface AnalyticsEventData {
  template?: string;
  tab?: string;
  score?: number;
  plan?: string;
  amount?: number;
  [key: string]: any;
}

export function useResumeAnalytics() {
  const { user } = useUser();
  const hasTrackedPageView = useRef(false);

  const trackEvent = useCallback(async (
    eventType: AnalyticsEventType,
    eventData: AnalyticsEventData = {}
  ) => {
    try {
      const { error } = await supabase
        .from('resume_builder_analytics')
        .insert({
          event_type: eventType,
          event_data: eventData,
          user_id: user?.id || null,
          session_id: getSessionId(),
          page_url: window.location.href,
          user_agent: navigator.userAgent,
        });

      if (error) {
        console.error('Analytics tracking error:', error);
      }
    } catch (err) {
      console.error('Failed to track event:', err);
    }
  }, [user?.id]);

  // Track page view once per session
  const trackPageView = useCallback(() => {
    if (!hasTrackedPageView.current) {
      hasTrackedPageView.current = true;
      trackEvent('page_view');
    }
  }, [trackEvent]);

  return {
    trackEvent,
    trackPageView,
  };
}
