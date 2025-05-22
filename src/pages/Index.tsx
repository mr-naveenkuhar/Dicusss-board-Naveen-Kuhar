import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MainNavigation from '@/components/MainNavigation';
import PostItem from '@/components/PostItem';
import NewPostInput from '@/components/NewPostInput';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import { useAuth } from '@/contexts/AuthContext';
import { fetchPosts, Post } from '@/services/postService';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import Chatbot from '@/components/Chatbot';

const Index = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [showChatbot, setShowChatbot] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const fetchedPosts = await fetchPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handlePostCreated = (newPost: Post) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const handlePostLiked = (updatedPost: Post) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  };

  const openAuthDialog = (tab: 'login' | 'register') => {
    setAuthTab(tab);
    setShowAuthDialog(true);
  };

  const closeAuthDialog = () => {
    setShowAuthDialog(false);
  };
  
  const toggleChatbot = () => {
    setShowChatbot(prev => !prev);
  };

  return (
    <div>
      <MainNavigation />
      <div className="container mt-4">
        <header className="sticky top-0 z-10 bg-xBackground/80 backdrop-blur-md border-b border-gray-700 p-4">
          <h1 className="text-xl font-bold">Home</h1>
        </header>

        {isAuthenticated ? (
          <NewPostInput onPostCreated={handlePostCreated} />
        ) : (
          <div className="border-b border-gray-700 p-6 bg-secondary/20">
            <h2 className="text-xl font-bold mb-2">Welcome to DiscussX</h2>
            <p className="mb-4">Sign in to join the conversation and start posting.</p>
            <div className="flex gap-3">
              <Button
                onClick={() => openAuthDialog('login')}
                className="bg-xBlue hover:bg-xBlue/80"
              >
                Sign in
              </Button>
              <Button
                onClick={() => openAuthDialog('register')}
                variant="outline"
                className="border-gray-600"
              >
                Sign up
              </Button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="p-4 text-center">
            <p>Loading posts...</p>
          </div>
        ) : (
          <div className="mt-4">
            {posts.map(post => (
              <PostItem key={post.id} post={post} onLike={handlePostLiked} />
            ))}
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="w-80 p-4 hidden lg:block">
        <div className="bg-secondary rounded-lg p-4 mb-4">
          <h2 className="font-bold mb-2">What's happening</h2>
          <div className="space-y-3">
            <div className="hover:bg-secondary/50 p-2 rounded-md cursor-pointer">
              <p className="text-sm text-gray-400">Trending in Technology</p>
              <p className="font-bold">#ReactJS</p>
              <p className="text-sm text-gray-400">10.5K posts</p>
            </div>
            <div className="hover:bg-secondary/50 p-2 rounded-md cursor-pointer">
              <p className="text-sm text-gray-400">Trending in AI</p>
              <p className="font-bold">#MachineLearning</p>
              <p className="text-sm text-gray-400">8.2K posts</p>
            </div>
          </div>
        </div>

        <div className="bg-secondary rounded-lg p-4">
          <h2 className="font-bold mb-2">Who to follow</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-gray-700"></div>
                <div>
                  <p className="font-bold">Tech Insider</p>
                  <p className="text-sm text-gray-400">@techinsider</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="rounded-full">
                Follow
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-gray-700"></div>
                <div>
                  <p className="font-bold">Code Daily</p>
                  <p className="text-sm text-gray-400">@codedaily</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="rounded-full">
                Follow
              </Button>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={toggleChatbot}
          className="fixed bottom-4 right-4 bg-xBlue hover:bg-xBlue/80 rounded-full h-14 w-14 flex items-center justify-center shadow-lg"
        >
          <span className="sr-only">Open Help Chatbot</span>
          {showChatbot ? "✕" : "?"}
        </Button>
      </div>

      {/* Auth Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md bg-xBackground border border-gray-700">
          <Tabs defaultValue={authTab} className="w-full" onValueChange={(v) => setAuthTab(v as 'login' | 'register')}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm 
                onSuccess={closeAuthDialog}
                onSwitchToRegister={() => setAuthTab('register')}
              />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm 
                onSuccess={closeAuthDialog}
                onSwitchToLogin={() => setAuthTab('login')}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      
      {/* Chatbot Dialog */}
      {showChatbot && (
        <div className="fixed bottom-20 right-6 w-80 h-96 shadow-xl z-50">
          <Chatbot />
        </div>
      )}
    </div>
  );
};

export default Index;
