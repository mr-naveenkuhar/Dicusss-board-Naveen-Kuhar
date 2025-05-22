import { User } from "../contexts/AuthContext";

// Define the Post type
export type Post = {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
  likes: number;
  comments: number;
  isLiked: boolean;
  parentId?: string | null;
};

// Define the DB row structure for posts (use snake_case for DB columns)
type DBPostRow = {
  id: string;
  content: string;
  author_id: string;
  created_at: string;
  likes?: number;
  comments?: number;
  parent_id?: string | null;
};

// Helper to fetch user info by id (you may want to optimize this)
export const fetchUserById = async (userId: string): Promise<User | null> => {
  const query = `SELECT * FROM users WHERE id = ? LIMIT 1`;
  const response = await fetch("http://localhost:5000/api/execute-query", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, values: [userId] }),
  });
  const data = await response.json();
  if (data.success && data.results && data.results.length > 0) {
    const user = data.results[0];
    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      profileImage: "/placeholder.svg",
      email: user.email,
    };
  }
  return null;
};

// Fetch all posts from SQL
export const fetchPosts = async (): Promise<Post[]> => {
  const query = `SELECT * FROM posts ORDER BY created_at DESC`;
  const response = await fetch("http://localhost:5000/api/execute-query", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message || "Failed to fetch posts");

  return await Promise.all(
    data.results.map(async (row: DBPostRow) => {
      const author = await fetchUserById(row.author_id);
      return {
        id: row.id,
        content: row.content,
        author: author || {
          id: row.author_id,
          username: "unknown",
          displayName: "Unknown",
          profileImage: "/placeholder.svg",
          email: "",
        },
        createdAt: row.created_at ? new Date(row.created_at) : new Date(),
        likes: row.likes || 0,
        comments: row.comments || 0,
        isLiked: false,
        parentId: row.parent_id || null,
      };
    })
  );
};

// Fetch a single post by id
export const fetchPostById = async (id: string): Promise<Post | null> => {
  const query = `SELECT * FROM posts WHERE id = ? LIMIT 1`;
  const response = await fetch("http://localhost:5000/api/execute-query", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, values: [id] }),
  });
  const data = await response.json();
  if (!data.success || !data.results.length) return null;
  const row = data.results[0];
  const author = await fetchUserById(row.author_id);
  return {
    id: row.id,
    content: row.content,
    author: author || {
      id: row.author_id,
      username: "unknown",
      displayName: "Unknown",
      profileImage: "/placeholder.svg",
      email: "",
    },
    createdAt: row.created_at ? new Date(row.created_at) : new Date(),
    likes: row.likes || 0,
    comments: row.comments || 0,
    isLiked: false,
    parentId: row.parent_id || null,
  };
};

// Fetch comments for a post
export const fetchCommentsByPostId = async (postId: string): Promise<Post[]> => {
  const query = `SELECT * FROM posts WHERE parent_id = ? ORDER BY created_at DESC`;
  const response = await fetch("http://localhost:5000/api/execute-query", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, values: [postId] }),
  });
  const data = await response.json();
  if (!data.success) return [];
  const posts: Post[] = await Promise.all(
    data.results.map(async (row: DBPostRow) => {
      const author = await fetchUserById(row.author_id);
      return {
        id: row.id,
        content: row.content,
        author: author || {
          id: row.author_id,
          username: "unknown",
          displayName: "Unknown",
          profileImage: "/placeholder.svg",
          email: "",
        },
        createdAt: row.created_at ? new Date(row.created_at) : new Date(),
        likes: row.likes || 0,
        comments: row.comments || 0,
        isLiked: false,
        parentId: row.parent_id || null,
      };
    })
  );
  return posts;
};

// Create a new post in SQL
export const createPost = async (
  content: string,
  currentUser: User,
  parentId?: string
): Promise<Post> => {
  const id = `post_${Date.now()}`;

  // Validate that the user exists in the database
  const checkUserQuery = `SELECT id FROM users WHERE id = ? LIMIT 1`;
  const userResponse = await fetch("http://localhost:5000/api/execute-query", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: checkUserQuery, values: [currentUser.id] }),
  });
  const userData = await userResponse.json();
  if (!userData.success || userData.results.length === 0) {
    throw new Error("User does not exist in the database. Please register the user first.");
  }

  // Insert the post into the database
  const query = `
    INSERT INTO posts (id, content, author_id, parent_id)
    VALUES (?, ?, ?, ?)
  `;
  const values = [id, content, currentUser.id, parentId || null];
  const response = await fetch("http://localhost:5000/api/execute-query", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, values }),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message || "Failed to create post");

  return {
    id,
    content,
    author: currentUser,
    createdAt: new Date(),
    likes: 0,
    comments: 0,
    isLiked: false,
    parentId: parentId || null,
  };
};

// Like/unlike a post
export const likePost = async (postId: string, isLiked: boolean): Promise<void> => {
  const query = `UPDATE posts SET likes = likes ${isLiked ? '+ 1' : '- 1'} WHERE id = ?`;
  const response = await fetch("http://localhost:5000/api/execute-query", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, values: [postId] }),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message || "Failed to update like");
};

// Delete a post
export const deletePost = async (postId: string): Promise<void> => {
  const query = `DELETE FROM posts WHERE id = ?`;
  const response = await fetch("http://localhost:5000/api/execute-query", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, values: [postId] }),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message || "Failed to delete post");
};