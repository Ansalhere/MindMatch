import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  MessageSquare, 
  Heart, 
  Share2, 
  Briefcase, 
  Users, 
  TrendingUp,
  Plus,
  MapPin,
  Clock,
  Building
} from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { supabase } from '@/integrations/supabase/client';

interface Post {
  id: string;
  content: string;
  title?: string;
  type: 'discussion' | 'job' | 'achievement' | 'question';
  author_name: string;
  author_type: string;
  author_company?: string;
  author_location?: string;
  created_at: string;
  likes: number;
  comments: number;
}

const Community = () => {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [postType, setPostType] = useState<'discussion' | 'job' | 'achievement' | 'question'>('discussion');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [commentingPost, setCommentingPost] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  const mockPosts: Post[] = [
    {
      id: '1',
      title: 'Senior React Developer - Mumbai',
      content: 'We are hiring a Senior React Developer with 3+ years experience. Remote work available. Competitive salary package. Apply now!',
      type: 'job',
      author_name: 'TechCorp HR',
      author_type: 'employer',
      author_company: 'TechCorp Solutions',
      author_location: 'Mumbai',
      created_at: '2024-01-19T10:00:00Z',
      likes: 25,
      comments: 8
    },
    {
      id: '2',
      title: 'Tips for Acing Technical Interviews',
      content: 'Just cleared 5 technical interviews this month! Here are my top tips: 1. Practice coding daily 2. Understand system design basics 3. Ask clarifying questions 4. Think out loud during problem solving',
      type: 'discussion',
      author_name: 'Priya Sharma',
      author_type: 'candidate',
      author_location: 'Bangalore',
      created_at: '2024-01-19T08:30:00Z',
      likes: 42,
      comments: 15
    },
    {
      id: '3',
      title: 'Achieved AWS Certification!',
      content: 'Finally got my AWS Solutions Architect certification! It was a challenging journey but totally worth it. My RankMe.AI score jumped by 15 points! 🎉',
      type: 'achievement',
      author_name: 'Rohit Kumar',
      author_type: 'candidate',
      author_location: 'Delhi',
      created_at: '2024-01-19T06:15:00Z',
      likes: 67,
      comments: 23
    }
  ];

  useEffect(() => {
    setPosts(mockPosts);
  }, []);

  const handleSubmitPost = async () => {
    if (!newPost.trim() || !user) return;

    const post: Post = {
      id: Date.now().toString(),
      title: newPostTitle || undefined,
      content: newPost,
      type: postType,
      author_name: user.name || 'Anonymous',
      author_type: user.user_type || 'candidate',
      author_company: user.company,
      author_location: user.location,
      created_at: new Date().toISOString(),
      likes: 0,
      comments: 0
    };

    setPosts(prev => [post, ...prev]);
    setNewPost('');
    setNewPostTitle('');
  };

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'job': return <Briefcase className="h-4 w-4" />;
      case 'achievement': return <TrendingUp className="h-4 w-4" />;
      case 'question': return <MessageSquare className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'job': return 'bg-blue-100 text-blue-800';
      case 'achievement': return 'bg-green-100 text-green-800';
      case 'question': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const handleLike = (postId: string) => {
    const newLikedPosts = new Set(likedPosts);
    const isLiked = likedPosts.has(postId);
    
    if (isLiked) {
      newLikedPosts.delete(postId);
    } else {
      newLikedPosts.add(postId);
    }
    
    setLikedPosts(newLikedPosts);
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + (isLiked ? -1 : 1) }
        : post
    ));
  };

  const handleComment = (postId: string) => {
    if (!newComment.trim()) return;
    
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, comments: post.comments + 1 }
        : post
    ));
    
    setNewComment('');
    setCommentingPost(null);
  };

  return (
    <Layout>
      <div className="container-responsive section-padding">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Professional Community</h1>
            <p className="text-muted-foreground">Connect, share, and grow with professionals worldwide</p>
          </div>

          {/* Create Post */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create Post
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                {(['discussion', 'job', 'achievement', 'question'] as const).map((type) => (
                  <Button
                    key={type}
                    variant={postType === type ? "default" : "outline"}
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
              />
              
              <Button 
                onClick={handleSubmitPost}
                disabled={!newPost.trim()}
                className="w-full"
              >
                Publish Post
              </Button>
            </CardContent>
          </Card>

          {/* Posts Feed */}
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="card-hover">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{post.author_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{post.author_name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {post.author_type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {post.author_company && (
                            <>
                              <Building className="h-3 w-3" />
                              <span>{post.author_company}</span>
                            </>
                          )}
                          {post.author_location && (
                            <>
                              <MapPin className="h-3 w-3" />
                              <span>{post.author_location}</span>
                            </>
                          )}
                          <Clock className="h-3 w-3" />
                          <span>{formatTimeAgo(post.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className={getPostTypeColor(post.type)}>
                      {getPostIcon(post.type)}
                      <span className="ml-1 capitalize">{post.type}</span>
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {post.title && (
                    <h4 className="text-lg font-semibold">{post.title}</h4>
                  )}
                  <p className="whitespace-pre-wrap">{post.content}</p>
                  
                  <Separator />
                  
                  <div className="flex items-center gap-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleLike(post.id)}
                      className={`text-muted-foreground hover:text-red-500 ${
                        likedPosts.has(post.id) ? 'text-red-500' : ''
                      }`}
                    >
                      <Heart className={`h-4 w-4 mr-1 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                      {post.likes} Likes
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setCommentingPost(commentingPost === post.id ? null : post.id)}
                      className="text-muted-foreground hover:text-blue-500"
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {post.comments} Comments
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-green-500">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                  
                  {commentingPost === post.id && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex gap-2">
                        <Textarea
                          placeholder="Write a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="flex-1 min-h-[80px]"
                        />
                        <Button 
                          onClick={() => handleComment(post.id)}
                          disabled={!newComment.trim()}
                          size="sm"
                        >
                          Post
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Community;