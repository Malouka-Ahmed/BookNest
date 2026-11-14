const User = require('../models/User');
const UserBook = require('../models/UserBook');

// GET /api/users/me/summary
exports.getSummary = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const [reading, completed, wantToRead] = await Promise.all([
      UserBook.countDocuments({ user: req.userId, status: 'reading' }),
      UserBook.countDocuments({ user: req.userId, status: 'completed' }),
      UserBook.countDocuments({ user: req.userId, status: 'want-to-read' }),
    ]);

    res.json({
      name: user.name,
      email: user.email,
      bio: user.bio,
      memberSince: user.createdAt,
      counts: { reading, completed, wantToRead },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PUT /api/users/me
exports.updateMe = async (req, res) => {
  try {
    const { name, bio } = req.body;

    if (name !== undefined && (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 80)) {
      return res.status(400).json({ message: 'Name must be between 2 and 80 characters' });
    }
    if (bio !== undefined && (typeof bio !== 'string' || bio.length > 500)) {
      return res.status(400).json({ message: 'Bio must be 500 characters or fewer' });
    }
    if (name === undefined && bio === undefined) {
      return res.status(400).json({ message: 'At least one profile field is required' });
    }

    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (bio !== undefined) updates.bio = bio;

    const user = await User.findByIdAndUpdate(req.userId, updates, {
      new: true,
    }).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.json({ name: user.name, email: user.email, bio: user.bio });
  } catch (error) {
    console.error('Updating profile failed:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};