import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader } from '@/components/ui/loader';
import { supabase } from '@/integrations/supabase/client';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { 
  Eye, Download, Crown, UserPlus, MousePointerClick, 
  RefreshCw, Calendar, TrendingUp, FileText, Zap, Target, 
  Briefcase, Upload, User, LogIn
} from 'lucide-react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

interface AnalyticsData {
  id: string;
  event_type: string;
  event_data: any;
  user_id: string | null;
  session_id: string;
  created_at: string;
}

interface EventCount {
  type: string;
  count: number;
  label: string;
}

const EVENT_LABELS: Record<string, string> = {
  page_view: 'Page Views',
  template_select: 'Template Selected',
  download_click: 'Download Clicked',
  download_success: 'Download Success',
  premium_gate_shown: 'Premium Gate Shown',
  premium_upgrade_click: 'Upgrade Clicked',
  premium_upgrade_success: 'Upgrade Success',
  auth_gate_shown: 'Auth Gate Shown',
  create_account_click: 'Create Account Click',
  login_click: 'Login Click',
  ats_check_click: 'ATS Check Click',
  ats_check_success: 'ATS Check Success',
  job_tailor_click: 'Job Tailor Click',
  job_tailor_success: 'Job Tailor Success',
  load_profile_click: 'Load Profile Click',
  upload_resume_click: 'Upload Resume Click',
  tab_change: 'Tab Changes',
  template_modal_open: 'Template Modal Opened',
  tailor_modal_open: 'Tailor Modal Opened',
};

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#EA4335', '#4285F4'];

export default function ResumeBuilderAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(7); // days

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const startDate = startOfDay(subDays(new Date(), dateRange));
      const endDate = endOfDay(new Date());

      const { data, error } = await supabase
        .from('resume_builder_analytics')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnalytics(data || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  // Calculate metrics
  const uniqueSessions = new Set(analytics.map(a => a.session_id)).size;
  const uniqueUsers = new Set(analytics.filter(a => a.user_id).map(a => a.user_id)).size;

  const eventCounts: EventCount[] = Object.entries(
    analytics.reduce((acc, item) => {
      acc[item.event_type] = (acc[item.event_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([type, count]) => ({
    type,
    count,
    label: EVENT_LABELS[type] || type,
  })).sort((a, b) => b.count - a.count);

  // Daily trend data
  const dailyData = analytics.reduce((acc, item) => {
    const date = format(new Date(item.created_at), 'MM/dd');
    if (!acc[date]) {
      acc[date] = { date, pageViews: 0, downloads: 0, upgrades: 0, atsChecks: 0 };
    }
    if (item.event_type === 'page_view') acc[date].pageViews++;
    if (item.event_type === 'download_success') acc[date].downloads++;
    if (item.event_type === 'premium_upgrade_success') acc[date].upgrades++;
    if (item.event_type === 'ats_check_success') acc[date].atsChecks++;
    return acc;
  }, {} as Record<string, any>);

  const dailyTrend = Object.values(dailyData).reverse();

  // Conversion funnel
  const pageViews = analytics.filter(a => a.event_type === 'page_view').length;
  const downloadClicks = analytics.filter(a => a.event_type === 'download_click').length;
  const downloadSuccess = analytics.filter(a => a.event_type === 'download_success').length;
  const premiumGateShown = analytics.filter(a => a.event_type === 'premium_gate_shown').length;
  const upgradeClicks = analytics.filter(a => a.event_type === 'premium_upgrade_click').length;
  const upgradeSuccess = analytics.filter(a => a.event_type === 'premium_upgrade_success').length;

  // ATS Check Analytics
  const atsCheckClicks = analytics.filter(a => a.event_type === 'ats_check_click').length;
  const atsCheckSuccess = analytics.filter(a => a.event_type === 'ats_check_success').length;
  const atsScores = analytics
    .filter(a => a.event_type === 'ats_check_success' && a.event_data?.score)
    .map(a => a.event_data.score);
  const avgAtsScore = atsScores.length > 0 
    ? Math.round(atsScores.reduce((a, b) => a + b, 0) / atsScores.length) 
    : 0;

  // Job Tailor Analytics
  const jobTailorClicks = analytics.filter(a => a.event_type === 'job_tailor_click').length;
  const jobTailorSuccess = analytics.filter(a => a.event_type === 'job_tailor_success').length;

  // Upload and Profile Load Analytics
  const uploadResumeClicks = analytics.filter(a => a.event_type === 'upload_resume_click').length;
  const loadProfileClicks = analytics.filter(a => a.event_type === 'load_profile_click').length;

  // Auth Gate Analytics
  const authGateShown = analytics.filter(a => a.event_type === 'auth_gate_shown').length;
  const createAccountClicks = analytics.filter(a => a.event_type === 'create_account_click').length;
  const loginClicks = analytics.filter(a => a.event_type === 'login_click').length;

  // User Type Breakdown
  const loggedInEvents = analytics.filter(a => a.user_id).length;
  const anonymousEvents = analytics.filter(a => !a.user_id).length;
  const userTypeData = [
    { name: 'Logged In', value: loggedInEvents, fill: '#00C49F' },
    { name: 'Anonymous', value: anonymousEvents, fill: '#8884d8' },
  ];

  // Tab Change Analytics
  const tabChanges = analytics
    .filter(a => a.event_type === 'tab_change' && a.event_data?.tab)
    .reduce((acc, item) => {
      const tab = item.event_data.tab;
      acc[tab] = (acc[tab] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
  const tabChartData = Object.entries(tabChanges)
    .map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }))
    .sort((a, b) => b.value - a.value);

  const funnelData = [
    { name: 'Page Views', value: pageViews, fill: '#8884d8' },
    { name: 'Download Clicks', value: downloadClicks, fill: '#82ca9d' },
    { name: 'Downloads', value: downloadSuccess, fill: '#ffc658' },
  ];

  const premiumFunnelData = [
    { name: 'Premium Gate Shown', value: premiumGateShown, fill: '#ff7300' },
    { name: 'Upgrade Clicks', value: upgradeClicks, fill: '#0088FE' },
    { name: 'Upgrade Success', value: upgradeSuccess, fill: '#00C49F' },
  ];

  // Template popularity
  const templateData = analytics
    .filter(a => a.event_type === 'template_select' && a.event_data?.template)
    .reduce((acc, item) => {
      const template = item.event_data.template;
      acc[template] = (acc[template] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const templateChartData = Object.entries(templateData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with date range selector */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Resume Builder Analytics</h2>
          <p className="text-muted-foreground">Track user interactions and conversions</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div className="flex gap-1">
            {[7, 14, 30, 90].map((days) => (
              <Button
                key={days}
                size="sm"
                variant={dateRange === days ? 'default' : 'outline'}
                onClick={() => setDateRange(days)}
              >
                {days}d
              </Button>
            ))}
          </div>
          <Button size="sm" variant="outline" onClick={fetchAnalytics}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Key Metrics - Row 1 */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{pageViews}</p>
                <p className="text-xs text-muted-foreground">Page Views</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{uniqueSessions}</p>
                <p className="text-xs text-muted-foreground">Unique Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-indigo-500" />
              <div>
                <p className="text-2xl font-bold">{uniqueUsers}</p>
                <p className="text-xs text-muted-foreground">Logged In Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{downloadSuccess}</p>
                <p className="text-xs text-muted-foreground">Downloads</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{upgradeSuccess}</p>
                <p className="text-xs text-muted-foreground">Premium Upgrades</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="text-2xl font-bold">
                  {pageViews > 0 ? ((downloadSuccess / pageViews) * 100).toFixed(1) : 0}%
                </p>
                <p className="text-xs text-muted-foreground">Download Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics - Row 2: ATS & Features */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{atsCheckSuccess}</p>
                <p className="text-xs text-muted-foreground">ATS Checks Done</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{avgAtsScore}%</p>
                <p className="text-xs text-muted-foreground">Avg ATS Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{jobTailorSuccess}</p>
                <p className="text-xs text-muted-foreground">Job Tailors Done</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-teal-500" />
              <div>
                <p className="text-2xl font-bold">{uploadResumeClicks}</p>
                <p className="text-xs text-muted-foreground">Resume Uploads</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <LogIn className="h-5 w-5 text-cyan-500" />
              <div>
                <p className="text-2xl font-bold">{loadProfileClicks}</p>
                <p className="text-xs text-muted-foreground">Profile Loads</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <MousePointerClick className="h-5 w-5 text-pink-500" />
              <div>
                <p className="text-2xl font-bold">{authGateShown}</p>
                <p className="text-xs text-muted-foreground">Auth Gates Shown</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Daily Trend</CardTitle>
            <CardDescription>Key metrics over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pageViews" stroke="#8884d8" name="Page Views" />
                <Line type="monotone" dataKey="downloads" stroke="#82ca9d" name="Downloads" />
                <Line type="monotone" dataKey="atsChecks" stroke="#ffc658" name="ATS Checks" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Event Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Event Distribution</CardTitle>
            <CardDescription>All tracked events</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={eventCounts.slice(0, 10)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" fontSize={12} />
                <YAxis dataKey="label" type="category" width={120} fontSize={11} />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Funnel Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Download Funnel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Download Funnel</CardTitle>
            <CardDescription>From page view to download</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {funnelData.map((item, index) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                  <div className="h-8 bg-muted rounded overflow-hidden">
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${(item.value / Math.max(pageViews, 1)) * 100}%`,
                        backgroundColor: item.fill,
                      }}
                    />
                  </div>
                  {index < funnelData.length - 1 && funnelData[index + 1] && (
                    <p className="text-xs text-muted-foreground">
                      → {item.value > 0 ? ((funnelData[index + 1].value / item.value) * 100).toFixed(1) : 0}% conversion
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Premium Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Premium Conversion</CardTitle>
            <CardDescription>From premium gate to upgrade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {premiumFunnelData.map((item, index) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                  <div className="h-8 bg-muted rounded overflow-hidden">
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${(item.value / Math.max(premiumGateShown, 1)) * 100}%`,
                        backgroundColor: item.fill,
                      }}
                    />
                  </div>
                  {index < premiumFunnelData.length - 1 && premiumFunnelData[index + 1] && (
                    <p className="text-xs text-muted-foreground">
                      → {item.value > 0 ? ((premiumFunnelData[index + 1].value / item.value) * 100).toFixed(1) : 0}% conversion
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Template & User Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Popularity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Template Popularity</CardTitle>
            <CardDescription>Most selected templates</CardDescription>
          </CardHeader>
          <CardContent>
            {templateChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={templateChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {templateChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-8">No template data yet</p>
            )}
          </CardContent>
        </Card>

        {/* User Type Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">User Breakdown</CardTitle>
            <CardDescription>Logged in vs anonymous events</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={userTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tab Navigation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Form Section Usage</CardTitle>
            <CardDescription>Which sections users interact with</CardDescription>
          </CardHeader>
          <CardContent>
            {tabChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={tabChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" fontSize={12} />
                  <YAxis dataKey="name" type="category" width={100} fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" name="Interactions" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-8">No tab navigation data yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ATS Score Distribution */}
      {atsScores.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">ATS Score Distribution</CardTitle>
            <CardDescription>Range of ATS scores achieved by users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
              {['0-20', '21-40', '41-60', '61-80', '81-100'].map((range, idx) => {
                const [min, max] = range.split('-').map(Number);
                const count = atsScores.filter(s => s >= min && s <= max).length;
                const percentage = atsScores.length > 0 ? (count / atsScores.length) * 100 : 0;
                const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];
                return (
                  <div key={range} className="text-center">
                    <div className="h-24 flex items-end justify-center mb-2">
                      <div 
                        className={`w-full ${colors[idx]} rounded-t`}
                        style={{ height: `${Math.max(percentage, 5)}%` }}
                      />
                    </div>
                    <p className="text-xs font-medium">{range}%</p>
                    <p className="text-xs text-muted-foreground">{count} users</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Events Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Events</CardTitle>
          <CardDescription>Last 50 events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-background">
                <tr className="border-b">
                  <th className="text-left py-2 px-2">Event</th>
                  <th className="text-left py-2 px-2">Details</th>
                  <th className="text-left py-2 px-2">User</th>
                  <th className="text-left py-2 px-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {analytics.slice(0, 50).map((event) => (
                  <tr key={event.id} className="border-b">
                    <td className="py-2 px-2">
                      <Badge variant="outline">{EVENT_LABELS[event.event_type] || event.event_type}</Badge>
                    </td>
                    <td className="py-2 px-2 text-muted-foreground text-xs max-w-[200px] truncate">
                      {JSON.stringify(event.event_data)}
                    </td>
                    <td className="py-2 px-2">
                      {event.user_id ? (
                        <Badge variant="secondary" className="text-xs">Logged In</Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">Anonymous</span>
                      )}
                    </td>
                    <td className="py-2 px-2 text-muted-foreground text-xs">
                      {format(new Date(event.created_at), 'MM/dd HH:mm')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
