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

    if (name !== undefined && name.trim() === '') {
      return res.status(400).json({ message: 'Name cannot be empty' });
    }

    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (bio !== undefined) updates.bio = bio;

    const user = await User.findByIdAndUpdate(req.userId, updates, {
      new: true,
    }).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ name: user.name, email: user.email, bio: user.bio });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};