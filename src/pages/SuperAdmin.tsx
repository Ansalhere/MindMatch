import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Users, 
  Briefcase, 
  Settings,
  Search,
  Trash2,
  UserCheck,
  UserX,
  MessageSquare, 
  Bell, 
  Database,
  Plus,
  Mail
} from 'lucide-react';
import { toast } from "sonner";
import { useUser } from '@/hooks/useUser';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Loader } from "@/components/ui/loader";
import PostJobForm from '@/components/employer/PostJobForm';
import { createJob } from '@/lib/supabase';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EmailCampaignManager from '@/components/admin/EmailCampaignManager';
import SubscriberManagement from '@/components/admin/SubscriberManagement';

const SuperAdmin = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmittingJob, setIsSubmittingJob] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();


  useEffect(() => {
    // Check if user is admin
    if (user === undefined) return; // Still loading
    
    if (!user) {
      navigate('/admin-login');
      toast.error("Please log in to access admin panel.");
      return;
    }
    
    if (!['admin', 'super_admin'].includes(user.user_type)) {
      navigate('/');
      toast.error("Access denied. Admin privileges required.");
      return;
    }
    
    fetchAllData();
  }, [user, navigate]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch users
      const { data: usersData } = await supabase.from('users').select('*');
      setUsers(usersData || []);

      // Fetch jobs with employer info
      const { data: jobsData } = await supabase
        .from('jobs')
        .select('*, employer:employer_id(name, company)');
      setJobs(jobsData || []);

      // Fetch messages
      const { data: messagesData } = await supabase
        .from('messages')
        .select('*, sender:sender_id(name), receiver:receiver_id(name)')
        .order('created_at', { ascending: false });
      setMessages(messagesData || []);

      // Fetch notifications
      const { data: notificationsData } = await supabase
        .from('notifications')
        .select('*, user:user_id(name)')
        .order('created_at', { ascending: false });
      setNotifications(notificationsData || []);

    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, field: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ [field]: !currentValue })
        .eq('id', userId);
      
      if (error) throw error;
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, [field]: !currentValue } : user
      ));
      
      toast.success(`User ${field} updated successfully`);
    } catch (error) {
      console.error(`Error updating user ${field}:`, error);
      toast.error(`Failed to update user ${field}`);
    }
  };

  const toggleJobStatus = async (jobId: string, field: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ [field]: !currentValue })
        .eq('id', jobId);
      
      if (error) throw error;
      
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, [field]: !currentValue } : job
      ));
      
      toast.success(`Job ${field} updated successfully`);
    } catch (error) {
      console.error(`Error updating job ${field}:`, error);
      toast.error(`Failed to update job ${field}`);
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);
      
      if (error) throw error;
      
      setMessages(messages.filter(msg => msg.id !== messageId));
      toast.success("Message deleted successfully");
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);
      
      if (error) throw error;
      
      setNotifications(notifications.filter(notif => notif.id !== notificationId));
      toast.success("Notification deleted successfully");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  const handleAdminJobSubmit = async (formData: any) => {
    setIsSubmittingJob(true);
    try {
      // Convert form data to job data format
      const jobData = {
        title: formData.jobTitle,
        description: formData.description,
        location: formData.location,
        job_type: formData.jobType,
        company_name: formData.companyName,
        salary_min: formData.salary.min ? parseInt(formData.salary.min) : null,
        salary_max: formData.salary.max ? parseInt(formData.salary.max) : null,
        required_skills: formData.requiredSkills,
        min_experience: formData.minExperience ? parseFloat(formData.minExperience) : null,
        min_rank_requirement: formData.rankRestriction ? formData.minRank : null,
        external_apply_url: formData.externalApplyUrl || null,
        closing_date: formData.deadline || null,
        employer_id: user?.id // Admin posts the job
      };

      const { job, error } = await createJob(jobData);
      
      if (error) {
        throw error;
      }

      toast.success("Job posted successfully!");
      
      // Refresh jobs data
      await fetchAllData();
      
    } catch (error: any) {
      console.error("Error posting job:", error);
      toast.error(error.message || "Failed to post job");
    } finally {
      setIsSubmittingJob(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show loading if still checking user auth or loading data
  if (user === undefined || loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
          <Loader size={40} />
        </div>
      </Layout>
    );
  }

  // Redirect if not admin or super_admin (this shouldn't happen due to useEffect, but safety check)
  if (!user || !['admin', 'super_admin'].includes(user.user_type)) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">System management and oversight</p>
        </div>
        
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search across all data..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-9 max-w-6xl">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="post-job">Post Job</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{users.length}</div>
                  <div className="text-sm text-muted-foreground">Total Users</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{jobs.filter(j => j.is_active).length}</div>
                  <div className="text-sm text-muted-foreground">Active Jobs</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{users.filter(u => u.user_type === 'candidate').length}</div>
                  <div className="text-sm text-muted-foreground">Candidates</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{users.filter(u => u.user_type === 'employer').length}</div>
                  <div className="text-sm text-muted-foreground">Employers</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage all users and their premium status</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Rank</TableHead>
                      <TableHead>Premium</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map(user => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name || 'Unknown'}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.user_type}</Badge>
                        </TableCell>
                        <TableCell>{user.company || 'N/A'}</TableCell>
                        <TableCell>
                          {user.user_type === 'candidate' ? (
                            <Badge variant={user.rank_score > 70 ? 'default' : 'secondary'}>
                              {user.rank_score || 0}
                            </Badge>
                          ) : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.is_premium ? 'default' : 'outline'}>
                            {user.is_premium ? 'Premium' : 'Standard'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => toggleUserStatus(user.id, 'is_premium', user.is_premium)}
                            >
                              {user.is_premium ? 'Remove Premium' : 'Add Premium'}
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => navigate(`/profile/${user.id}/${user.user_type}`)}
                            >
                              View
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs">
            <Card>
              <CardHeader>
                <CardTitle>Job Management</CardTitle>
                <CardDescription>Manage all job postings across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Posted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobs.map(job => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">{job.title}</TableCell>
                        <TableCell>{job.employer?.company || job.employer?.name || 'Unknown'}</TableCell>
                        <TableCell>{job.location}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{job.job_type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={job.is_active ? 'default' : 'secondary'}>
                            {job.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(job.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => toggleJobStatus(job.id, 'is_active', job.is_active)}
                            >
                              {job.is_active ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => navigate(`/job/${job.id}`)}
                            >
                              View
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="post-job">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Admin Job Posting
                </CardTitle>
                <CardDescription>
                  Post jobs on behalf of any company with external application links
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PostJobForm 
                  onSubmit={handleAdminJobSubmit}
                  isSubmitting={isSubmittingJob}
                  isAdmin={true}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email">
            <EmailCampaignManager />
          </TabsContent>

          <TabsContent value="subscribers">
            <SubscriberManagement />
          </TabsContent>
          
          <TabsContent value="content">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Messages Management</CardTitle>
                  <CardDescription>Monitor and manage platform communications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {messages.slice(0, 10).map(message => (
                      <div key={message.id} className="flex justify-between items-start p-3 border rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {message.sender?.name} → {message.receiver?.name}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">{message.subject}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(message.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteMessage(message.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notifications Management</CardTitle>
                  <CardDescription>System notifications and alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {notifications.slice(0, 10).map(notification => (
                      <div key={notification.id} className="flex justify-between items-start p-3 border rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{notification.title}</p>
                          <p className="text-sm text-muted-foreground truncate">{notification.message}</p>
                          <p className="text-xs text-muted-foreground">
                            To: {notification.user?.name} | {new Date(notification.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Database Actions</CardTitle>
                  <CardDescription>Perform system maintenance operations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => {
                      supabase.rpc('calculate_candidate_rank', { user_id: 'all' });
                      toast.success("Rank recalculation started");
                    }}
                  >
                    <Database className="mr-2 h-4 w-4" />
                    Recalculate All User Rankings
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => {
                      // Clean up old notifications
                      supabase.from('notifications').delete().lt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
                      toast.success("Old notifications cleaned up");
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clean Old Notifications (30+ days)
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/supabase-admin')}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Advanced Database Management
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Analytics</CardTitle>
                  <CardDescription>System performance and usage statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-lg font-bold">{messages.length}</div>
                        <div className="text-sm text-muted-foreground">Total Messages</div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-lg font-bold">{notifications.length}</div>
                        <div className="text-sm text-muted-foreground">Total Notifications</div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-lg font-bold">{users.filter(u => u.is_premium).length}</div>
                        <div className="text-sm text-muted-foreground">Premium Users</div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-lg font-bold">{Math.round(users.filter(u => u.rank_score > 0).reduce((acc, u) => acc + (u.rank_score || 0), 0) / users.filter(u => u.rank_score > 0).length || 0)}</div>
                        <div className="text-sm text-muted-foreground">Avg Rank Score</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure global system parameters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Ranking Algorithm Weights</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Skills Weight (%)</label>
                        <Input type="number" defaultValue="40" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Experience Weight (%)</label>
                        <Input type="number" defaultValue="25" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Education Weight (%)</label>
                        <Input type="number" defaultValue="15" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">College Tier Weight (%)</label>
                        <Input type="number" defaultValue="12" />
                      </div>
                    </div>
                    <Button className="mt-4">Update Algorithm Weights</Button>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Platform Configuration</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Max Job Applications per User</label>
                        <Input type="number" defaultValue="50" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Job Post Duration (Days)</label>
                        <Input type="number" defaultValue="30" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Minimum Rank for Premium Jobs</label>
                        <Input type="number" defaultValue="60" />
                      </div>
                    </div>
                    <Button className="mt-4">Update Platform Settings</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SuperAdmin;