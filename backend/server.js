const express = require('express');

const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./db');
const User = require('./models/User');
const Thread = require('./models/Thread');
const Post = require('./models/Post');
const userRoutes = require('./routes/userRoutes');
const threadRoutes = require('./routes/threadRoutes');

// Initialize Express app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Test database connection
sequelize
  .authenticate()
  .then(() => console.log('Database connected...'))
  .catch((err) => console.error('Error connecting to the database:', err));

// Define relationships with explicit foreign key names to avoid conflicts
User.hasMany(Thread, { foreignKey: { name: 'userId', allowNull: false } });
Thread.belongsTo(User, { foreignKey: { name: 'userId', allowNull: false } });

Thread.hasMany(Post, { foreignKey: { name: 'threadId', allowNull: false, constraintName: 'fk_thread_post' } });
Post.belongsTo(Thread, { foreignKey: { name: 'threadId', allowNull: false, constraintName: 'fk_post_thread' } });

User.hasMany(Post, { foreignKey: { name: 'userId', allowNull: false, constraintName: 'fk_user_post' } });
Post.belongsTo(User, { foreignKey: { name: 'userId', allowNull: false, constraintName: 'fk_post_user' } });

// Sync database
sequelize.sync({ force: true })
  .then(() => console.log('Database synchronized'))
  .catch((err) => console.error('Error synchronizing database:', err));

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/threads', threadRoutes);

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Export the sequelize instance
module.exports = { sequelize };