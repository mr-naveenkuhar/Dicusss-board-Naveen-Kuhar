import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPostById, fetchCommentsByPostId, createPost, Post } from '@/services/postService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formatDistanceToNow } from 'date-fns';
import MainNavigation from '@/components/MainNavigation';
import PostItem from '@/components/PostItem';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const PostDetailPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const { user, isAuthenticated } = useAuth();
  const [reply, setReply] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: post, isLoading: isLoadingPost } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => fetchPostById(postId || ''),
    enabled: !!postId,
  });

  const { data: comments, isLoading: isLoadingComments } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => fetchCommentsByPostId(postId || ''),
    enabled: !!postId,
  });

  const mutation = useMutation({
    mutationFn: (content: string) => createPost(content, user!, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      setReply('');
      toast({
        title: "Reply posted",
        description: "Your reply has been posted successfully.",
      });
    },
  });

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to reply.",
      });
      return;
    }
    mutation.mutate(reply);
  };

  if (isLoadingPost) {
    return (
      <div className="min-h-screen bg-xBackground text-white flex">
        <div className="w-64 border-r border-gray-700 h-screen sticky top-0">
          <MainNavigation />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p>Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-xBackground text-white flex">
        <div className="w-64 border-r border-gray-700 h-screen sticky top-0">
          <MainNavigation />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p>Post not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="mb-4">
        <Link to="/" className="btn btn-secondary">
          <ArrowLeft className="h-5 w-5" /> Back to Home
        </Link>
      </div>

      <div className="mb-4">
        <PostItem post={post} />
      </div>

      <div className="mt-4">
        <h5>Comments</h5>
        {/* Reply form */}
        {isAuthenticated && (
          <div className="p-4 border-b border-gray-700">
            <form onSubmit={handleSubmitReply}>
              <div className="flex space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.profileImage} alt={user?.displayName} />
                  <AvatarFallback>{user?.displayName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Post your reply"
                    className="bg-transparent border-gray-700 focus:border-xBlue resize-none"
                  />
                  <div className="flex justify-end mt-2">
                    <Button 
                      type="submit" 
                      className="bg-xBlue hover:bg-xBlue/80 rounded-full"
                      disabled={!reply.trim() || mutation.isPending}
                    >
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

        <div className="mt-3">
          {isLoadingComments ? (
            <div className="p-4 text-center">
              <p>Loading replies...</p>
            </div>
          ) : comments && comments.length > 0 ? (
            <div>
              {comments.map((comment: Post) => (
                <div className="card mb-3" key={comment.id}>
                  <div className="card-body">
                    <PostItem post={comment} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              <p>No replies yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
