import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null;
    if (!token) return res.status(401).json({ message: 'Not authorized, token missing' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user?.isAdmin) return next();
  return res.status(403).json({ message: 'Admin only' });
};
