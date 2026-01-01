import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Mail, Eye, MousePointer, TrendingUp, Users, Calendar } from "lucide-react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";

interface Campaign {
  id: string;
  name: string;
  subject: string;
  sent_count: number;
  open_count: number;
  unique_opens: number;
  status: string;
  sent_at: string | null;
}

interface EmailEvent {
  id: string;
  campaign_id: string;
  event_type: string;
  created_at: string;
  recipient_email: string;
}

interface DailyStats {
  date: string;
  opens: number;
  sends: number;
}

export default function EmailAnalyticsDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all");
  const [events, setEvents] = useState<EmailEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("7");
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    fetchEvents();
    calculateDailyStats();
  }, [selectedCampaign, dateRange]);

  const fetchCampaigns = async () => {
    const { data, error } = await supabase
      .from("email_campaigns")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setCampaigns(data as Campaign[]);
    }
    setLoading(false);
  };

  const fetchEvents = async () => {
    const startDate = subDays(new Date(), parseInt(dateRange));
    
    let query = supabase
      .from("email_events")
      .select("*")
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: false });

    if (selectedCampaign !== "all") {
      query = query.eq("campaign_id", selectedCampaign);
    }

    const { data, error } = await query;

    if (!error && data) {
      setEvents(data as EmailEvent[]);
    }
  };

  const calculateDailyStats = () => {
    const days = parseInt(dateRange);
    const stats: DailyStats[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, "MMM dd");
      
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);

      const opens = events.filter(e => {
        const eventDate = new Date(e.created_at);
        return e.event_type === "open" && eventDate >= dayStart && eventDate <= dayEnd;
      }).length;

      stats.push({ date: dateStr, opens, sends: 0 });
    }

    setDailyStats(stats);
  };

  // Calculate metrics
  const totalSent = campaigns.reduce((acc, c) => acc + (c.sent_count || 0), 0);
  const totalOpens = events.filter(e => e.event_type === "open").length;
  const uniqueOpeners = new Set(events.filter(e => e.event_type === "open").map(e => e.recipient_email)).size;
  const openRate = totalSent > 0 ? ((uniqueOpeners / totalSent) * 100).toFixed(1) : "0";

  const selectedCampaignData = selectedCampaign !== "all" 
    ? campaigns.find(c => c.id === selectedCampaign) 
    : null;

  const campaignOpenRate = selectedCampaignData && selectedCampaignData.sent_count > 0
    ? ((selectedCampaignData.unique_opens || 0) / selectedCampaignData.sent_count * 100).toFixed(1)
    : openRate;

  // Event type breakdown for pie chart
  const eventBreakdown = [
    { name: "Opens", value: events.filter(e => e.event_type === "open").length, color: "hsl(var(--primary))" },
    { name: "Clicks", value: events.filter(e => e.event_type === "click").length, color: "hsl(var(--secondary))" },
  ].filter(e => e.value > 0);

  // Top campaigns by open rate
  const topCampaigns = campaigns
    .filter(c => c.sent_count > 0)
    .map(c => ({
      name: c.name.substring(0, 20) + (c.name.length > 20 ? "..." : ""),
      openRate: ((c.unique_opens || 0) / c.sent_count * 100),
      sent: c.sent_count,
    }))
    .sort((a, b) => b.openRate - a.openRate)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="All Campaigns" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Campaigns</SelectItem>
            {campaigns.map((campaign) => (
              <SelectItem key={campaign.id} value={campaign.id}>
                {campaign.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="14">Last 14 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across {campaigns.filter(c => c.status === "sent").length} campaigns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Opens</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOpens.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {uniqueOpeners} unique openers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaignOpenRate}%</div>
            <p className="text-xs text-muted-foreground">
              Industry avg: 21.5%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.length}</div>
            <p className="text-xs text-muted-foreground">
              {campaigns.filter(c => c.status === "sent").length} sent
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Opens Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Opens Over Time</CardTitle>
            <CardDescription>Daily email opens for selected period</CardDescription>
          </CardHeader>
          <CardContent>
            {dailyStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="opens" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No data available for selected period
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Campaigns by Open Rate */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Campaigns</CardTitle>
            <CardDescription>By open rate performance</CardDescription>
          </CardHeader>
          <CardContent>
            {topCampaigns.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topCampaigns} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" domain={[0, 100]} unit="%" />
                  <YAxis dataKey="name" type="category" width={100} className="text-xs" />
                  <Tooltip 
                    formatter={(value: number) => [`${value.toFixed(1)}%`, "Open Rate"]}
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Bar dataKey="openRate" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No campaigns with sends yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Events Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
          <CardDescription>Latest email tracking events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Email</th>
                  <th className="text-left p-2 font-medium">Event</th>
                  <th className="text-left p-2 font-medium">Campaign</th>
                  <th className="text-left p-2 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {events.slice(0, 10).map((event) => {
                  const campaign = campaigns.find(c => c.id === event.campaign_id);
                  return (
                    <tr key={event.id} className="border-b hover:bg-muted/50">
                      <td className="p-2 font-mono text-xs">
                        {event.recipient_email.substring(0, 3)}***@***
                      </td>
                      <td className="p-2">
                        <Badge variant={event.event_type === "open" ? "default" : "secondary"}>
                          {event.event_type === "open" ? (
                            <Eye className="h-3 w-3 mr-1" />
                          ) : (
                            <MousePointer className="h-3 w-3 mr-1" />
                          )}
                          {event.event_type}
                        </Badge>
                      </td>
                      <td className="p-2 truncate max-w-[200px]">
                        {campaign?.name || "Unknown"}
                      </td>
                      <td className="p-2 text-muted-foreground">
                        {format(new Date(event.created_at), "MMM dd, HH:mm")}
                      </td>
                    </tr>
                  );
                })}
                {events.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-muted-foreground">
                      No tracking events yet. Events will appear when recipients open emails.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
