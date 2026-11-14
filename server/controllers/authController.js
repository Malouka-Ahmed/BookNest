const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signToken = (id) =>
  jwt.sign({ id: String(id) }, process.env.JWT_SECRET, { expiresIn: '7d' });

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  bio: user.bio,
  createdAt: user.createdAt,
});

exports.register = async (req, res) => {
  const { name, email, password } = req.body ?? {};
  const normalizedName = typeof name === 'string' ? name.trim() : '';
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

  if (!normalizedName || !normalizedEmail || typeof password !== 'string') {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }
  if (normalizedName.length < 2 || normalizedName.length > 80) {
    return res.status(400).json({ message: 'Name must be between 2 and 80 characters' });
  }
  if (normalizedEmail.length > 254 || !EMAIL_PATTERN.test(normalizedEmail)) {
    return res.status(400).json({ message: 'Enter a valid email address' });
  }
  if (password.length < 6 || Buffer.byteLength(password, 'utf8') > 72) {
    return res.status(400).json({ message: 'Password must be 6-72 bytes long' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
    });

    return res.status(201).json({
      token: signToken(user._id),
      user: publicUser(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    console.error('Registration failed:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body ?? {};
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

  if (!normalizedEmail || typeof password !== 'string') {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return res.json({
      token: signToken(user._id),
      user: publicUser(user),
    });
  } catch (error) {
    console.error('Login failed:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ user: publicUser(user) });
  } catch (error) {
    console.error('Loading authenticated user failed:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
