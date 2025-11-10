import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);

    app.listen(PORT, () => {
      console.log(`UrbanVibe API running on port ${PORT}`);
    });

  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
};

start();

export default app;
