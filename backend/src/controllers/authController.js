import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const adminCreds = { username: 'UrbanVibe@urban', password: '12345678' };

const genToken = (user) =>
  jwt.sign({ id: user._id, email: user.email, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });
    const user = await User.create({ name, email, password, isAdmin: false });
    const token = genToken(user);
    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }, token });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === adminCreds.username && password === adminCreds.password) {
      const payload = { id: 'admin', email, isAdmin: true };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
      return res.json({ user: { id: 'admin', name: 'Admin', email, isAdmin: true }, token });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await user.matchPassword(password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    const token = genToken(user);
    res.json({ user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }, token });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getMe = async (req, res) => {
  try {
    if (req.user.id === 'admin') {
      return res.json({ id: 'admin', name: 'Admin', email: adminCreds.username, isAdmin: true });
    }
    const user = await User.findById(req.user.id).select('name email isAdmin');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const updateMe = async (req, res) => {
  try {
    if (req.user.id === 'admin') {
      return res.status(400).json({ message: 'Admin profile cannot be modified' });
    }
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { name, password } = req.body;
    if (name) user.name = name;
    if (password) user.password = password; // will be hashed by pre-save
    await user.save();
    res.json({ id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
