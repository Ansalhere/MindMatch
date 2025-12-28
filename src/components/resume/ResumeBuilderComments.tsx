import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, Send, MessageSquare, Loader2, Shield, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/useUser';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: string;
  user_name: string;
  user_avatar: string | null;
  comment: string;
  rating: number;
  is_featured: boolean;
  created_at: string;
  user_id: string | null;
}

interface ResumeBuilderCommentsProps {
  isAdmin?: boolean;
}

const ResumeBuilderComments = ({ isAdmin = false }: ResumeBuilderCommentsProps) => {
  const { user, profile } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);
  const [pendingComments, setPendingComments] = useState<Comment[]>([]);

  useEffect(() => {
    fetchComments();
    if (isAdmin) {
      fetchPendingComments();
    }
  }, [isAdmin]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('resume_builder_comments')
        .select('*')
        .eq('is_approved', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingComments = async () => {
    try {
      const { data, error } = await supabase
        .from('resume_builder_comments')
        .select('*')
        .eq('is_approved', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingComments(data || []);
    } catch (error) {
      console.error('Error fetching pending comments:', error);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please login to leave a review');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('resume_builder_comments')
        .insert({
          user_id: user.id,
          user_name: profile?.name || user.email?.split('@')[0] || 'Anonymous',
          user_avatar: profile?.avatar_url,
          comment: newComment.trim(),
          rating,
          is_approved: false, // Require admin approval
        });

      if (error) throw error;

      toast.success('Thank you! Your review will appear after moderation.');
      setNewComment('');
      setRating(5);
    } catch (error: any) {
      console.error('Error submitting comment:', error);
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('resume_builder_comments')
        .update({ is_approved: true })
        .eq('id', id);

      if (error) throw error;
      toast.success('Comment approved');
      fetchComments();
      fetchPendingComments();
    } catch (error) {
      console.error('Error approving comment:', error);
      toast.error('Failed to approve comment');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('resume_builder_comments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Comment deleted');
      fetchComments();
      if (isAdmin) fetchPendingComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  const handleFeature = async (id: string, featured: boolean) => {
    try {
      const { error } = await supabase
        .from('resume_builder_comments')
        .update({ is_featured: featured })
        .eq('id', id);

      if (error) throw error;
      toast.success(featured ? 'Comment featured' : 'Comment unfeatured');
      fetchComments();
    } catch (error) {
      console.error('Error featuring comment:', error);
      toast.error('Failed to update comment');
    }
  };

  const renderStars = (count: number, interactive = false, size = 'h-4 w-4') => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= count ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            onClick={() => interactive && setRating(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Admin Pending Comments Section */}
      {isAdmin && pendingComments.length > 0 && (
        <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-yellow-500" />
              Pending Reviews ({pendingComments.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingComments.map((comment) => (
              <div key={comment.id} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.user_avatar || undefined} />
                  <AvatarFallback className="text-xs">
                    {comment.user_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{comment.user_name}</span>
                    {renderStars(comment.rating)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{comment.comment}</p>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="default" onClick={() => handleApprove(comment.id)}>
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(comment.id)}>
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Comment Form */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Share Your Experience
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {user ? (
            <>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Your Rating:</span>
                {renderStars(rating, true, 'h-5 w-5')}
              </div>
              <Textarea
                placeholder="Tell us about your experience with the Resume Builder..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px] resize-none"
                maxLength={500}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {newComment.length}/500 characters
                </span>
                <Button 
                  onClick={handleSubmit} 
                  disabled={submitting || !newComment.trim()}
                  className="gap-2"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Submit Review
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-2">Login to share your experience</p>
              <Button variant="outline" onClick={() => window.location.href = '/auth'}>
                Login to Review
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          User Reviews
          {comments.length > 0 && (
            <Badge variant="secondary">{comments.length}</Badge>
          )}
        </h3>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : comments.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">No reviews yet. Be the first to share your experience!</p>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {comments.map((comment) => (
              <Card key={comment.id} className={comment.is_featured ? 'ring-2 ring-primary/50' : ''}>
                <CardContent className="pt-4">
                  <div className="flex gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={comment.user_avatar || undefined} />
                      <AvatarFallback>
                        {comment.user_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{comment.user_name}</span>
                        {comment.is_featured && (
                          <Badge className="bg-primary/10 text-primary text-xs">Featured</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {renderStars(comment.rating)}
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                    {comment.comment}
                  </p>
                  
                  {/* Admin Actions */}
                  {isAdmin && (
                    <div className="flex gap-2 mt-3 pt-3 border-t">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleFeature(comment.id, !comment.is_featured)}
                      >
                        {comment.is_featured ? 'Unfeature' : 'Feature'}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-destructive"
                        onClick={() => handleDelete(comment.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeBuilderComments;
