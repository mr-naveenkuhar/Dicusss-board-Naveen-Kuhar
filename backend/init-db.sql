-- Create demo database
CREATE DATABASE IF NOT EXISTS demo_db;
USE demo_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  displayName VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  profileImage VARCHAR(255),
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id VARCHAR(36) PRIMARY KEY,
  content TEXT NOT NULL,
  author_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  likes INT NOT NULL DEFAULT 0,
  comments INT NOT NULL DEFAULT 0,
  parent_id VARCHAR(36),
  FOREIGN KEY (author_id) REFERENCES users(id),
  FOREIGN KEY (parent_id) REFERENCES posts(id)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id VARCHAR(36) PRIMARY KEY,
  content TEXT NOT NULL,
  author_id VARCHAR(36) NOT NULL,
  post_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id),
  FOREIGN KEY (post_id) REFERENCES posts(id)
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT
);

-- Insert sample users
-- Use INSERT IGNORE to avoid duplicate key errors for the users table
INSERT IGNORE INTO users (id, username, displayName, email, role, password) VALUES
('usr_1', 'demouser', 'Demo User', 'demo@example.com', 'user', 'password1'),
('usr_2', 'admin', 'Admin User', 'admin@example.com', 'admin', 'adminpassword'),
('usr_3', 'janesmith', 'Jane Smith', 'jane@example.com', 'user', 'password3'),
('usr_4', 'techguru', 'Tech Guru', 'tech@example.com', 'user', 'password4'),
('usr_5', 'marketing', 'Marketing Team', 'marketing@example.com', 'marketing', 'password5');

-- Insert sample posts
-- Use INSERT IGNORE to avoid duplicate key errors for the posts table
INSERT IGNORE INTO posts (id, content, author_id, likes, comments) VALUES
('post_1', 'Welcome to our new platform!', 'usr_2', 15, 3),
('post_2', 'I really like the new React features.', 'usr_3', 42, 7),
('post_3', 'Has anyone tried the new JavaScript framework?', 'usr_4', 8, 2),
('post_4', 'Working with Tailwind CSS has been amazing.', 'usr_1', 23, 5),
('post_5', 'SQL queries are fun when you know how to use them!', 'usr_2', 31, 9);

-- Insert sample comments
-- Use INSERT IGNORE to avoid duplicate key errors for the comments table
INSERT IGNORE INTO comments (id, content, author_id, post_id) VALUES
('cmt_1', 'Great to be here!', 'usr_1', 'post_1'),
('cmt_2', 'The platform looks amazing.', 'usr_3', 'post_1'),
('cmt_3', 'I agree, React hooks are game-changing.', 'usr_4', 'post_2'),
('cmt_4', 'Have you tried the Context API?', 'usr_2', 'post_2'),
('cmt_5', 'Yes, I\'ve been using it for a month now.', 'usr_1', 'post_3');

-- Insert sample categories
-- Use INSERT IGNORE to avoid duplicate key errors for the categories table
INSERT IGNORE INTO categories (id, name, description) VALUES
('cat_1', 'Technology', 'All tech-related discussions'),
('cat_2', 'Programming', 'Coding and software development topics'),
('cat_3', 'Design', 'UI/UX and graphic design discussions'),
('cat_4', 'Career', 'Career advice and job opportunities');
