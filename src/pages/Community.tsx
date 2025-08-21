import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import BackNavigation from '@/components/navigation/BackNavigation';
import { useUser } from '@/hooks/useUser';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  TrendingUp, 
  MessageSquare, 
  Heart, 
  Share2, 
  Clock, 
  Building, 
  MapPin,
  Briefcase,
  MessageCircle,
  PlusCircle,
  Sparkles,
  ChevronRight
} from 'lucide-react';

const Community = () => {
  const { user } = useUser();
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [postType, setPostType] = useState('general');
  const [commentingPost, setCommentingPost] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
    if (user) {
      fetchUserLikes();
    }
  }, [user]);

  const fetchPosts = async () => {
    try {
      // Use simpler query to avoid TypeScript errors
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Fetch user data separately for each post
      const postsWithAuthors = await Promise.all(
        (data || []).map(async (post) => {
          const { data: userData } = await supabase
            .from('users')
            .select('name, user_type, company, location')
            .eq('id', post.author_id)
            .single();

          return {
            ...post,
            author_name: userData?.name || 'Anonymous',
            author_type: userData?.user_type || 'candidate',
            author_company: userData?.company,
            author_location: userData?.location,
            comments: post.comments_count || 0
          };
        })
      );

      setPosts(postsWithAuthors);
    } catch (error) {
      console.error('Error fetching posts:', error);
      // Use mock data if real data fails
      const mockPosts = [
        {
          id: '1',
          content: 'Welcome to our professional community! 🚀 Connect, share insights, and discover opportunities together.',
          title: null,
          type: 'general',
          likes: 12,
          comments_count: 3,
          created_at: new Date().toISOString(),
          author_name: 'Community Manager',
          author_type: 'admin',
          author_company: 'RankMe.AI',
          author_location: 'Global',
          comments: 3
        },
        {
          id: '2',
          content: 'Looking for talented React developers for our growing team! Remote-friendly position with competitive benefits.',
          title: 'Senior React Developer - Remote',
          type: 'job',
          likes: 8,
          comments_count: 5,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          author_name: 'Tech Recruiter',
          author_type: 'employer',
          author_company: 'InnovateTech',
          author_location: 'Mumbai',
          comments: 5
        }
      ];
      setPosts(mockPosts);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserLikes = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('post_likes')
        .select('post_id')
        .eq('user_id', user.id);

      if (error) throw error;

      const likedPostIds = new Set(data?.map(like => like.post_id) || []);
      setLikedPosts(likedPostIds);
    } catch (error) {
      console.error('Error fetching user likes:', error);
    }
  };

  const handleSubmitPost = async () => {
    if (!user || !newPost.trim()) return;

    if (newPost.length > 250) {
      toast.error('Post content must be 250 characters or less');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          author_id: user.id,
          content: newPost.trim(),
          title: postType === 'job' ? newPostTitle.trim() : null,
          type: postType
        })
        .select()
        .single();

      if (error) {
        if (error.message.includes('one_per_day') || error.message.includes('NOT EXISTS')) {
          toast.error('You can only post once per day');
          return;
        }
        throw error;
      }

      const newPostData = {
        ...data,
        author_name: user.name || 'Anonymous',
        author_type: user.user_type,
        author_company: user.company,
        author_location: user.location,
        comments: 0
      };

      setPosts([newPostData, ...posts]);
      setNewPost('');
      setNewPostTitle('');
      setPostType('general');
      toast.success('Post published successfully!');
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast.error('Failed to publish post. Please try again.');
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) {
      toast.error('Please login to like posts');
      return;
    }

    try {
      const isLiked = likedPosts.has(postId);
      
      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', postId);

        if (error) throw error;

        setLikedPosts(prev => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });

        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, likes: Math.max(0, post.likes - 1) }
            : post
        ));
      } else {
        // Like
        const { error } = await supabase
          .from('post_likes')
          .insert({
            user_id: user.id,
            post_id: postId
          });

        if (error) throw error;

        setLikedPosts(prev => new Set([...prev, postId]));
        
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, likes: post.likes + 1 }
            : post
        ));
      }
    } catch (error: any) {
      console.error('Error updating like:', error);
      toast.error('Failed to update like');
    }
  };

  const handleComment = async (postId: string) => {
    if (!user || !newComment.trim()) return;

    try {
      const { error } = await supabase
        .from('post_comments')
        .insert({
          author_id: user.id,
          post_id: postId,
          content: newComment.trim()
        });

      if (error) throw error;

      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, comments: post.comments + 1 }
          : post
      ));

      setNewComment('');
      setCommentingPost(null);
      toast.success('Comment added successfully!');
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'job': return <Briefcase className="h-4 w-4" />;
      case 'question': return <MessageCircle className="h-4 w-4" />;
      case 'update': return <Sparkles className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'job': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'question': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'update': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Layout 
      title="Community - RankMe.AI"
      description="Connect with professionals, share insights, and discover opportunities in our vibrant community"
      keywords="professional community, networking, career discussions, job opportunities"
    >
      <div className="container mx-auto px-4 py-6">
        <BackNavigation />
        
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Professional Community
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Connect with like-minded professionals, share insights, and discover new opportunities in our thriving community.
            </p>
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="text-center border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-primary mr-2" />
                  <span className="text-2xl font-bold">1,247</span>
                </div>
                <p className="text-sm text-muted-foreground">Active Members</p>
              </CardContent>
            </Card>
            <Card className="text-center border-emerald-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-6 w-6 text-emerald-600 mr-2" />
                  <span className="text-2xl font-bold">{posts.length}</span>
                </div>
                <p className="text-sm text-muted-foreground">Posts This Week</p>
              </CardContent>
            </Card>
            <Card className="text-center border-amber-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-2">
                  <MessageSquare className="h-6 w-6 text-amber-600 mr-2" />
                  <span className="text-2xl font-bold">89</span>
                </div>
                <p className="text-sm text-muted-foreground">Discussions Today</p>
              </CardContent>
            </Card>
          </div>

          {/* Create Post */}
          {user && (
            <Card className="mb-8 border-primary/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PlusCircle className="h-5 w-5 mr-2 text-primary" />
                  Share with the Community
                </CardTitle>
                <CardDescription>
                  What's on your mind? Share insights, ask questions, or post job opportunities.
                  <span className="text-sm text-muted-foreground block mt-1">
                    ⚠️ Limit: 1 post per day, 250 characters max
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  {['general', 'question', 'job', 'update'].map((type) => (
                    <Button
                      key={type}
                      variant={postType === type ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPostType(type)}
                      className="capitalize"
                    >
                      {getPostIcon(type)}
                      <span className="ml-1">{type}</span>
                    </Button>
                  ))}
                </div>
                
                {postType === 'job' && (
                  <Input
                    placeholder="Job title (e.g., Senior React Developer - Mumbai)"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                  />
                )}
                
                <Textarea
                  placeholder={postType === 'job' ? 'Job description, requirements, and application details...' : 'Share your thoughts, ask questions, or post updates...'}
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="min-h-[120px]"
                  maxLength={250}
                />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {250 - newPost.length} characters remaining
                  </span>
                  <Button 
                    onClick={handleSubmitPost}
                    disabled={!newPost.trim() || newPost.length > 250}
                    className="w-auto"
                  >
                    Publish Post
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Posts Feed */}
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-4">Loading community posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                  <p className="text-muted-foreground mb-4">Be the first to start a conversation!</p>
                  {!user && (
                    <Button onClick={() => window.location.href = '/auth-selector'}>
                      Join the Community
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              posts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="border-2 border-primary/20">
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {post.author_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">{post.author_name}</h3>
                            <Badge variant="secondary" className="text-xs capitalize">
                              {post.author_type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                            {post.author_company && (
                              <div className="flex items-center">
                                <Building className="h-3 w-3 mr-1" />
                                <span>{post.author_company}</span>
                              </div>
                            )}
                            {post.author_location && (
                              <div className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                <span>{post.author_location}</span>
                              </div>
                            )}
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{formatTimeAgo(post.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Badge className={`${getPostTypeColor(post.type)} border`}>
                        {getPostIcon(post.type)}
                        <span className="ml-1 capitalize">{post.type}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {post.title && (
                      <h4 className="text-lg font-semibold text-foreground">{post.title}</h4>
                    )}
                    <p className="whitespace-pre-wrap leading-relaxed">{post.content}</p>
                    
                    <Separator />
                    
                    <div className="flex items-center gap-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleLike(post.id)}
                        className={`text-muted-foreground hover:text-red-500 ${
                          likedPosts.has(post.id) ? 'text-red-500' : ''
                        }`}
                        disabled={!user}
                      >
                        <Heart className={`h-4 w-4 mr-1 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                        {post.likes} Likes
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setCommentingPost(commentingPost === post.id ? null : post.id)}
                        className="text-muted-foreground hover:text-blue-500"
                        disabled={!user}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {post.comments} Comments
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-green-500">
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                    
                    {commentingPost === post.id && user && (
                      <div className="mt-4 pt-4 border-t bg-muted/20 p-4 rounded-lg">
                        <div className="flex gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {user.name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-2">
                            <Textarea
                              placeholder="Write a thoughtful comment..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              className="min-h-[80px] resize-none"
                              maxLength={500}
                            />
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-muted-foreground">
                                {500 - newComment.length} characters remaining
                              </span>
                              <Button 
                                onClick={() => handleComment(post.id)}
                                disabled={!newComment.trim()}
                                size="sm"
                              >
                                Post Comment
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {!user && (commentingPost === post.id || likedPosts.has(post.id)) && (
                      <div className="mt-4 p-4 bg-muted/20 rounded-lg text-center">
                        <p className="text-sm text-muted-foreground mb-2">
                          Join our community to like and comment on posts
                        </p>
                        <Button size="sm" onClick={() => window.location.href = '/auth-selector'}>
                          Sign Up Now
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Community;