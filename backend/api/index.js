import dotenv from 'dotenv';
import app from '../src/app.js';
import connectDB from '../src/config/db.js';

// Initialize env and database once per cold start
let isConnected = false;

export default async function handler(req, res) {
  try {
    if (!isConnected) {
      dotenv.config();
      await connectDB(process.env.MONGO_URL);
      isConnected = true;
    }
    // Ensure Express routes (e.g., '/products') work when invoked via '/api/*'
    if (req.url && req.url.startsWith('/api')) {
      req.url = req.url.replace(/^\/api/, '') || '/';
    }
    return app(req, res);
  } catch (err) {
    console.error('Vercel handler error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}
