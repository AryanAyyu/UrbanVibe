import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import http from 'http';
import https from 'https';

dotenv.config();

const PORT = process.env.PORT || 3000;

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);

    const server = app.listen(PORT, () => {
      console.log(`UrbanVibe API running on port ${PORT}`);
    });

    // Tune timeouts to play well with proxies/platforms
    server.keepAliveTimeout = 65000;
    server.headersTimeout = 66000;

    // Optional self-ping to prevent host idle sleep
    const keepAliveUrl = process.env.KEEPALIVE_URL;
    if (keepAliveUrl && process.env.NODE_ENV === 'production') {
      const ping = () => {
        const lib = keepAliveUrl.startsWith('https') ? https : http;
        const req = lib.get(keepAliveUrl, (res) => {
          res.resume();
        });
        req.on('error', () => {});
      };
      let keepAliveInterval = Number(process.env.KEEPALIVE_INTERVAL_MS || 20000);
      if (!Number.isFinite(keepAliveInterval) || keepAliveInterval < 5000) keepAliveInterval = 20000;
      setInterval(ping, keepAliveInterval);
      // Initial ping after start
      setTimeout(ping, 5000);
    }

  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
};

start();

export default app;
