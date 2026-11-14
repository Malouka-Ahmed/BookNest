const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

module.exports = function authMiddleware(req, res, next) {
  const authorization = req.get('authorization') || '';
  const match = /^Bearer ([^\s]+)$/.exec(authorization);

  if (!match) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const payload = jwt.verify(match[1], process.env.JWT_SECRET);
    if (
      typeof payload !== 'object' ||
      typeof payload.id !== 'string' ||
      !mongoose.Types.ObjectId.isValid(payload.id)
    ) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    req.userId = payload.id;
    return next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    return next(error);
  }
};
