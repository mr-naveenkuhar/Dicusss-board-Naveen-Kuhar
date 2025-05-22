import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Repeat, Share } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Post, likePost } from '@/services/postService';
import { useToast } from '@/components/ui/use-toast';

interface PostItemProps {
  post: Post;
  onLike?: (post: Post) => void;
}

const PostItem: React.FC<PostItemProps> = ({ post, onLike }) => {
  const [isLiked, setIsLiked] = useState<boolean>(post.isLiked);
  const [likeCount, setLikeCount] = useState<number>(post.likes);
  const [userAction, setUserAction] = useState<'like' | 'dislike' | null>(null);
  const { toast } = useToast();

  const handleLikeClick = async () => {
    if (userAction === 'like') return; // Prevent multiple likes
    try {
      const newIsLiked = !isLiked;
      await likePost(post.id, newIsLiked);
      setIsLiked(newIsLiked);
      setLikeCount(prev => (newIsLiked ? prev + 1 : prev - 1));
      setUserAction('like');

      if (onLike) {
        onLike({
          ...post,
          isLiked: newIsLiked,
          likes: newIsLiked ? post.likes + 1 : post.likes - 1,
        });
      }
    } catch (error) {
      console.error('Error liking post:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to like post. Please try again.',
      });
    }
  };

  const handleDislikeClick = async () => {
    if (userAction === 'dislike') return; // Prevent multiple dislikes
    try {
      const newIsLiked = !isLiked;
      await likePost(post.id, newIsLiked);
      setIsLiked(newIsLiked);
      setLikeCount(prev => (newIsLiked ? prev - 1 : prev + 1));
      setUserAction('dislike');

      if (onLike) {
        onLike({
          ...post,
          isLiked: newIsLiked,
          likes: newIsLiked ? post.likes - 1 : post.likes + 1,
        });
      }
    } catch (error) {
      console.error('Error disliking post:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to dislike post. Please try again.',
      });
    }
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex align-items-start">
          <Link to={`/profile/${post.author.username}`} className="me-3">
            <img
              src={post.author.profileImage}
              alt={post.author.displayName}
              className="rounded-circle"
              style={{ width: '40px', height: '40px' }}
            />
          </Link>

          <div className="flex-grow-1">
            <div className="d-flex align-items-center mb-2">
              <Link to={`/profile/${post.author.username}`} className="fw-bold text-decoration-none">
                {post.author.displayName}
              </Link>
              <span className="text-muted ms-2">@{post.author.username}</span>
              <span className="text-muted mx-2">·</span>
              <span className="text-muted small">
                {formatDistanceToNow(post.createdAt, { addSuffix: true })}
              </span>
            </div>

            <Link to={`/post/${post.id}`} className="text-decoration-none">
              <p className="mb-2">{post.content}</p>
            </Link>

            <div className="d-flex justify-content-between">
              <button
                className="btn btn-outline-secondary btn-sm d-flex align-items-center"
                onClick={handleLikeClick}
                disabled={userAction !== null}
              >
                <Heart className={`me-1 ${isLiked ? 'text-danger' : ''}`} />
                {likeCount}
              </button>

              <button className="btn btn-outline-secondary btn-sm d-flex align-items-center">
                <MessageCircle className="me-1" />
                {post.comments}
              </button>

              <button className="btn btn-outline-secondary btn-sm d-flex align-items-center">
                <Repeat className="me-1" />
                0
              </button>

              <button className="btn btn-outline-secondary btn-sm d-flex align-items-center">
                <Share className="me-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
