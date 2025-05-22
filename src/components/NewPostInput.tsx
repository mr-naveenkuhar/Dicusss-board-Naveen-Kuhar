import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { createPost } from '@/services/postService';
import { useToast } from '@/components/ui/use-toast';
import { Post } from '@/services/postService';

interface NewPostInputProps {
  onPostCreated?: (post: Post) => void;
  parentId?: string;
  placeholder?: string;
}

const NewPostInput: React.FC<NewPostInputProps> = ({ 
  onPostCreated,
  parentId,
  placeholder = "What's happening?"
}) => {
  const { user, isAuthenticated } = useAuth();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Update the handleSubmit function to ensure the user is registered before creating a post
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to create a post."
      });
      return;
    }

    if (!content.trim()) {
      toast({
        variant: "destructive",
        title: "Empty content",
        description: "Please enter some text for your post."
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Ensure the user is registered in the database
      const registerUserQuery = `SELECT id FROM users WHERE id = ? LIMIT 1`;
      const response = await fetch("http://localhost:5000/api/execute-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: registerUserQuery, values: [user.id] }),
      });
      const data = await response.json();

      if (!data.success || data.results.length === 0) {
        // Register the user if not found
        const registerResponse = await fetch("http://localhost:5000/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            email: user.email,
            password: "default_password", // Replace with actual password logic if needed
            profileImage: user.profileImage || "/placeholder.svg",
          }),
        });
        const registerData = await registerResponse.json();
        if (!registerData.success) {
          throw new Error(registerData.message || "Failed to register user.");
        }
      }

      // Create the post
      const newPost = await createPost(content, user, parentId);
      setContent('');

      toast({
        title: "Post created",
        description: parentId ? "Your reply has been added" : "Your post has been published",
      });

      if (onPostCreated) {
        onPostCreated(newPost);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create post. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-3">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <textarea
            className="form-control"
            rows={3}
            placeholder={placeholder}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={!content.trim() || isSubmitting || !isAuthenticated}
        >
          {parentId ? 'Reply' : 'Post'}
        </button>
      </form>
    </div>
  );
};

export default NewPostInput;
