import mongoose from "mongoose";
import { logger } from "./logger.config";
export async function connectDatabase() {
  try {
    // MongoDB connection
    const mongoUri =
      process.env.MONGO_URI || "mongodb://localhost:27017/divakar-app";
    mongoose
      .connect(mongoUri)
      .then(() => console.log("MongoDB connected"))
      .catch((err) => console.error("MongoDB connection error:", err));
    logger.info(`🛢️ [database]: Mongo database is connected ...`);
  } catch (error) {
    logger.info(`⚡️ [database] : Error connecting to the database ...`);
    logger.info("Mongo DB connection error :", error);
  }
}
