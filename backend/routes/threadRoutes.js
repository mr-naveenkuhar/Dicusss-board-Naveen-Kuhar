const express = require('express');
const Thread = require('../models/Thread');
const Post = require('../models/Post');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new thread
router.post('/', verifyToken, async (req, res) => {
  console.log('Create thread endpoint hit with body:', req.body, 'and user:', req.user);
  const { title, content } = req.body;
  try {
    const thread = await Thread.create({
      title,
      content,
      userId: req.user.id,
    });
    res.status(201).json({ message: 'Thread created successfully', thread });
  } catch (error) {
    res.status(500).json({ error: 'Error creating thread' });
  }
});

// Get all threads
router.get('/', async (req, res) => {
  try {
    const threads = await Thread.findAll({ include: [{ model: Post }] });
    res.json(threads);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching threads' });
  }
});

// Delete a thread
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const thread = await Thread.findByPk(id);
    if (!thread) return res.status(404).json({ error: 'Thread not found' });

    if (thread.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to delete this thread' });
    }

    await thread.destroy();
    res.json({ message: 'Thread deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting thread' });
  }
});

module.exports = router;
