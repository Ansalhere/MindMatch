import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";
import { Search, Users, Briefcase, Settings, MessageSquare, Bell, Shield, Database } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SuperAdmin = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Super admin credentials check
  const adminCredentials = {
    email: 'admin@skillrank.com',
    password: 'SuperAdmin2024!'
  };

  useEffect(() => {
    fetchAllData();
  }, []);

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

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
          <Loader size={40} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              Super Admin Dashboard
            </h1>
            <p className="text-muted-foreground">Complete system management and oversight</p>
          </div>
          
          <Card className="p-4 bg-muted/50">
            <h3 className="font-semibold mb-2">Admin Login Credentials</h3>
            <div className="text-sm space-y-1">
              <div><strong>Email:</strong> {adminCredentials.email}</div>
              <div><strong>Password:</strong> {adminCredentials.password}</div>
            </div>
          </Card>
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
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">
              <Database className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="jobs">
              <Briefcase className="h-4 w-4 mr-2" />
              Jobs
            </TabsTrigger>
            <TabsTrigger value="messages">
              <MessageSquare className="h-4 w-4 mr-2" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{users.length}</div>
                  <div className="text-xs text-muted-foreground">
                    {users.filter(u => u.user_type === 'candidate').length} candidates, {users.filter(u => u.user_type === 'employer').length} employers
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{jobs.filter(j => j.is_active).length}</div>
                  <div className="text-xs text-muted-foreground">
                    {jobs.length - jobs.filter(j => j.is_active).length} inactive
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{messages.length}</div>
                  <div className="text-xs text-muted-foreground">
                    {messages.filter(m => !m.is_read).length} unread
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{notifications.length}</div>
                  <div className="text-xs text-muted-foreground">
                    {notifications.filter(n => !n.is_read).length} unread
                  </div>
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
          
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Message Management</CardTitle>
                <CardDescription>Monitor and manage user communications</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messages.slice(0, 10).map(message => (
                      <TableRow key={message.id}>
                        <TableCell>{message.sender?.name || 'Unknown'}</TableCell>
                        <TableCell>{message.receiver?.name || 'Unknown'}</TableCell>
                        <TableCell className="max-w-xs truncate">{message.subject}</TableCell>
                        <TableCell>{new Date(message.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={message.is_read ? 'outline' : 'default'}>
                            {message.is_read ? 'Read' : 'Unread'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => deleteMessage(message.id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Management</CardTitle>
                <CardDescription>Monitor system notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notifications.slice(0, 10).map(notification => (
                      <TableRow key={notification.id}>
                        <TableCell>{notification.user?.name || 'Unknown'}</TableCell>
                        <TableCell className="max-w-xs truncate">{notification.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{notification.type}</Badge>
                        </TableCell>
                        <TableCell>{new Date(notification.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={notification.is_read ? 'outline' : 'default'}>
                            {notification.is_read ? 'Read' : 'Unread'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
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